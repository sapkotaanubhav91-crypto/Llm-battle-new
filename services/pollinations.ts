import { Message, PollinationsModel } from "../types";

// API Key provided by the user
const POLLINATIONS_API_KEY = "sk_VldphnyC4F2pz6QxczmfMYtvdWcqrPgo";

export const DEFAULT_MODELS: PollinationsModel[] = [
  { id: 'auto', object: 'model', created: 0, type: 'text', name: 'Auto' },
  { id: 'council', object: 'model', created: 0, type: 'text', name: 'LLM Council' },
  { id: 'compare', object: 'model', created: 0, type: 'text', name: 'Compare Mode' },
  { id: 'grok', object: 'model', created: 0, type: 'text', name: 'Grok 2' },
  { id: 'openai', object: 'model', created: 0, type: 'text', name: 'ChatGPT-4o' },
  { id: 'claude', object: 'model', created: 0, type: 'text', name: 'Claude 3.5 Sonnet' },
  { id: 'deepseek', object: 'model', created: 0, type: 'text', name: 'DeepSeek V3' },
  { id: 'gemini', object: 'model', created: 0, type: 'text', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-3-flash', object: 'model', created: 0, type: 'text', name: 'Gemini 3 Flash' },
  { id: 'mistral', object: 'model', created: 0, type: 'text', name: 'Mistral Large' },
  { id: 'flux', object: 'model', created: 0, type: 'image', name: 'Flux Pro' },
  { id: 'turbo', object: 'model', created: 0, type: 'image', name: 'SDXL Turbo' }
];

export const getModels = async (): Promise<PollinationsModel[]> => {
  let textModels: PollinationsModel[] = [];
  let imageModels: PollinationsModel[] = [];

  // Helper for faster timeouts
  const fetchWithTimeout = (url: string) => 
    fetch(url, { 
       headers: { 'Authorization': `Bearer ${POLLINATIONS_API_KEY}` },
       signal: AbortSignal.timeout(3000) // 3s strict timeout for list fetching
    });

  // Fetch Text Models
  try {
    const res = await fetchWithTimeout('https://gen.pollinations.ai/v1/models');
    if (res.ok) {
      const json = await res.json();
      textModels = (json.data || [])
        .filter((m: any) => m && typeof m.id === 'string')
        .map((m: any) => ({ ...m, type: 'text' }));
    }
  } catch (e) { 
    console.warn("Using default text models due to fetch error/timeout:", e);
  }

  // Fetch Image Models
  try {
    const res = await fetch('https://gen.pollinations.ai/image/models', {
        signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) {
        imageModels = json
          .filter((id: any) => typeof id === 'string')
          .map((id: string) => ({
            id,
            object: 'model',
            created: Date.now(),
            type: 'image',
            name: id
        }));
      }
    }
  } catch (e) { 
    console.warn("Using default image models due to fetch error/timeout:", e);
  }

  if (textModels.length === 0 && imageModels.length === 0) {
      return DEFAULT_MODELS;
  }
  
  const allModels = [...textModels, ...imageModels];
  const allIds = new Set(allModels.map(m => m.id));
  const missingDefaults = DEFAULT_MODELS.filter(dm => !allIds.has(dm.id));
  
  return [...allModels, ...missingDefaults];
};

export const sendPollinationsMessageStream = async function* (
  messages: Message[], 
  model: string, 
  systemInstruction?: string,
  modelType: 'text' | 'image' = 'text'
) {

  // Image Generation
  if (modelType === 'image') {
    const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user')?.content || '';
    if (!lastUserMessage) return;

    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(lastUserMessage);
    const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&nologo=true&seed=${seed}`;
    
    yield "Generating image...";
    await new Promise(r => setTimeout(r, 1000));
    yield `![${lastUserMessage}](${imageUrl})`;
    return;
  }

  // Text Generation
  // Compatibility Fix: Many non-OpenAI models struggle with 'system' role. 
  // We merge system prompt into the first user message for better stability.
  const isStrictOpenAI = model.includes('gpt') || model.includes('openai');
  const apiMessages: any[] = [];

  // Add system prompt if it's a strict OpenAI model
  if (isStrictOpenAI && systemInstruction) {
    apiMessages.push({ role: 'system', content: systemInstruction });
  }

  // Add history
  messages.forEach(m => {
    apiMessages.push({ 
      role: m.role === 'model' ? 'assistant' : m.role, 
      content: m.content 
    });
  });

  // For other models, prepend system instruction to the first user message
  if (!isStrictOpenAI && systemInstruction) {
     const firstUserIndex = apiMessages.findIndex(m => m.role === 'user');
     if (firstUserIndex !== -1) {
        apiMessages[firstUserIndex].content = `[System Instruction: ${systemInstruction}]\n\n${apiMessages[firstUserIndex].content}`;
     } else {
        apiMessages.unshift({ role: 'user', content: systemInstruction });
     }
  }

  const makeRequest = async () => {
      const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: model,
          stream: true,
          presence_penalty: 0, // Reset penalties to avoid weird artifacting on some models
          frequency_penalty: 0
        })
      });

      if (!response.ok) {
          throw new Error(`API Error ${response.status}`);
      }
      if (!response.body) throw new Error("No response body");
      return response.body;
  };

  try {
      let body;
      try {
          body = await makeRequest();
      } catch (err) {
          // Simple retry once
          console.warn("First attempt failed, retrying...", err);
          await new Promise(r => setTimeout(r, 1000));
          body = await makeRequest();
      }

      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch (e) { }
          }
        }
      }
  } catch (error: any) {
      console.error("Stream error:", error);
      yield `\n[Error: ${error.message || "Connection failed"}. The model may be overloaded.]`;
  }
};