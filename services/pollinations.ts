import { Message, PollinationsModel } from "../types";

// API Key provided by the user
const POLLINATIONS_API_KEY = "sk_VldphnyC4F2pz6QxczmfMYtvdWcqrPgo";

export const DEFAULT_MODELS: PollinationsModel[] = [
  { id: 'auto', object: 'model', created: 0, type: 'text', name: 'Auto' },
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

  // Fetch Text Models
  try {
    const res = await fetch('https://gen.pollinations.ai/v1/models', {
       headers: { 'Authorization': `Bearer ${POLLINATIONS_API_KEY}` },
       signal: AbortSignal.timeout(5000) // Timeout after 5s to prevent hanging
    });
    if (res.ok) {
      const json = await res.json();
      textModels = (json.data || [])
        .filter((m: any) => m && typeof m.id === 'string') // Ensure valid structure
        .map((m: any) => ({ ...m, type: 'text' }));
    }
  } catch (e) { 
    console.warn("Using default text models due to fetch error:", e);
  }

  // Fetch Image Models
  try {
    const res = await fetch('https://gen.pollinations.ai/image/models', {
        signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const json = await res.json();
      // API typically returns array of strings for image models
      if (Array.isArray(json)) {
        imageModels = json
          .filter((id: any) => typeof id === 'string') // Ensure strings
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
    console.warn("Using default image models due to fetch error:", e);
  }

  // If fetching failed completely or returned empty lists, return defaults
  if (textModels.length === 0 && imageModels.length === 0) {
      return DEFAULT_MODELS;
  }

  // Combine fetched models. 
  // We prioritize fetched text models, but if the API returns a very short list (e.g. just 'grok'), 
  // we might want to ensure our defaults are still available if they aren't in the list.
  // For now, let's just return what we found, plus defaults for any missing core IDs if the list is suspicious.
  
  const allModels = [...textModels, ...imageModels];
  
  // Ensure we have at least the critical ones if the API returns a partial list
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

  // If Image Model, generate image URL and yield markdown
  if (modelType === 'image') {
    const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user')?.content || '';
    if (!lastUserMessage) return;

    // Use a random seed to ensure uniqueness if retried
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(lastUserMessage);
    const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&nologo=true&seed=${seed}`;
    
    // Simulate thinking/generating delay slightly
    yield "Generating image...";
    await new Promise(r => setTimeout(r, 1000));
    
    // Return markdown image
    yield `![${lastUserMessage}](${imageUrl})`;
    return;
  }

  // Text Model Processing (OpenAI Compatible)
  const apiMessages = messages.map(m => ({ 
    role: m.role === 'model' ? 'assistant' : m.role, 
    content: m.content 
  }));

  if (systemInstruction) {
    apiMessages.unshift({ role: 'system', content: systemInstruction });
  }

  try {
      const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: model,
          stream: true
        })
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
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
            } catch (e) {
              // Ignore parse errors from partial chunks
            }
          }
        }
      }
  } catch (error: any) {
      console.error("Stream error:", error);
      yield `\n[Error: ${error.message || "Connection failed"}. Please try again.]`;
  }
};