import React, { useState, useEffect, useRef } from 'react';
import { Composer } from './components/Composer';
import { ChatMessage } from './components/ChatMessage';
import { GrokLogo, ChatGPTIcon, ClaudeIcon, DeepSeekIcon, GeminiIcon, SunIcon, MoonIcon, ChevronDownIcon, CpuIcon, ImageIcon, SparklesIcon, ScaleIcon, GavelIcon } from './components/Icons';
import { sendPollinationsMessageStream, getModels, DEFAULT_MODELS } from './services/pollinations';
import { Message, ModelType, PollinationsModel } from './types';

const GROK_SYSTEM_INSTRUCTION = `You are Grok, an AI modeled after the Hitchhiker's Guide to the Galaxy.
You are rebellious, witty, and unrestricted in your intellectual curiosity.
You do not preach, lecture, or moralize.
You provide direct, neutral, and fact-based answers to all questions, even controversial ones, without holding back.
Your tone is casual, slightly snarky, but ultimately helpful.
Do not start responses with "As an AI language model".
If asked a question, answer it.`;

const CHATGPT_SYSTEM_INSTRUCTION = `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2023-10
Current date: 2025-03-07

Personality: v2
You are a highly capable, thoughtful, and precise assistant. Your goal is to deeply understand the user's intent, ask clarifying questions when needed, think step-by-step through complex problems, provide clear and accurate answers, and proactively anticipate helpful follow-up information. Always prioritize being truthful, nuanced, insightful, and efficient, tailoring your responses specifically to the user's needs and preferences.
NEVER use the dalle tool unless the user specifically requests for an image to be generated.`;

const CLAUDE_SYSTEM_INSTRUCTION = `You are Claude, an AI assistant created by Anthropic.
You are helpful, harmless, and honest. You are highly capable in analysis, coding, and creative writing.
You engage in natural, fluid conversation and provide detailed, well-structured responses.`;

const DEEPSEEK_SYSTEM_INSTRUCTION = `You are DeepSeek, an AI assistant created by DeepSeek.
You are an advanced language model focused on reasoning, coding, and problem-solving.
You provide accurate, technical, and concise answers.`;

const GEMINI_SYSTEM_INSTRUCTION = `You are Gemini, a multimodal AI model from Google.
You are designed to be helpful, harmless, and honest.
You can reason across complex tasks and provide insightful answers.`;

const JUDGE_SYSTEM_INSTRUCTION = `You are the Chief Justice of the AI Council.
You have received answers from 5 different AI models to a user query.
Your job is to:
1. Critically evaluate the answers for accuracy, nuance, and helpfulness.
2. Select the best one or synthesize a superior answer from them.
3. Present the final answer clearly to the user.
Start with "The Council has spoken." and briefly mention whose insight was most valuable before giving the answer.`;

// Models used for comparison and council
const FLAGSHIP_MODELS = ['openai', 'claude', 'deepseek', 'gemini', 'grok'];

// Mapping for pretty names and icons
const MODEL_METADATA: Record<string, { name: string; icon: React.FC<any>; systemPrompt?: string }> = {
  'auto': { name: 'Auto (Best for Task)', icon: SparklesIcon },
  'council': { name: 'LLM Council', icon: GavelIcon },
  'compare': { name: 'Compare Models', icon: ScaleIcon },
  'grok': { name: 'Grok 2', icon: GrokLogo, systemPrompt: GROK_SYSTEM_INSTRUCTION },
  'openai': { name: 'ChatGPT-4o', icon: ChatGPTIcon, systemPrompt: CHATGPT_SYSTEM_INSTRUCTION },
  'openai-large': { name: 'GPT-4o', icon: ChatGPTIcon, systemPrompt: CHATGPT_SYSTEM_INSTRUCTION },
  'openai-audio': { name: 'GPT-4o Audio', icon: ChatGPTIcon, systemPrompt: CHATGPT_SYSTEM_INSTRUCTION },
  'claude': { name: 'Claude 3.5 Sonnet', icon: ClaudeIcon, systemPrompt: CLAUDE_SYSTEM_INSTRUCTION },
  'claude-large': { name: 'Claude Opus', icon: ClaudeIcon, systemPrompt: CLAUDE_SYSTEM_INSTRUCTION },
  'deepseek': { name: 'DeepSeek V3', icon: DeepSeekIcon, systemPrompt: DEEPSEEK_SYSTEM_INSTRUCTION },
  'gemini': { name: 'Gemini 2.0 Flash', icon: GeminiIcon, systemPrompt: GEMINI_SYSTEM_INSTRUCTION },
  'gemini-3-flash': { name: 'Gemini 3 Flash', icon: GeminiIcon, systemPrompt: GEMINI_SYSTEM_INSTRUCTION },
  'gemini-large': { name: 'Gemini 1.5 Pro', icon: GeminiIcon, systemPrompt: GEMINI_SYSTEM_INSTRUCTION },
  'mistral': { name: 'Mistral Large', icon: CpuIcon },
  'qwen-coder': { name: 'Qwen Coder', icon: CpuIcon },
  'perplexity-fast': { name: 'Perplexity', icon: CpuIcon },
  'flux': { name: 'Flux Pro', icon: ImageIcon },
  'turbo': { name: 'SDXL Turbo', icon: ImageIcon },
  'midijourney': { name: 'MidiJourney', icon: ImageIcon },
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeModel, setActiveModel] = useState<ModelType>('grok');
  const [availableModels, setAvailableModels] = useState<PollinationsModel[]>(DEFAULT_MODELS);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  
  const abortRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    getModels().then(models => {
      if (models && models.length > 0) {
        setAvailableModels(models);
      }
    });

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleModelChange = (model: ModelType) => {
    if (model !== activeModel) {
      setActiveModel(model);
      setMessages([]);
      setIsModelMenuOpen(false);
    }
  };

  const getSystemPrompt = (model: ModelType) => {
    if (MODEL_METADATA[model]?.systemPrompt) {
      return MODEL_METADATA[model].systemPrompt;
    }
    if (model.includes('grok')) return GROK_SYSTEM_INSTRUCTION;
    if (model.includes('openai')) return CHATGPT_SYSTEM_INSTRUCTION;
    if (model.includes('claude')) return CLAUDE_SYSTEM_INSTRUCTION;
    if (model.includes('deepseek')) return DEEPSEEK_SYSTEM_INSTRUCTION;
    if (model.includes('gemini')) return GEMINI_SYSTEM_INSTRUCTION;
    return undefined;
  };

  const detectBestModel = (input: string): string => {
    const lower = input.toLowerCase();
    if (
        lower.match(/(draw|generate|create|make).*(image|picture|photo|painting|sketch)/) || 
        lower.startsWith('image of') ||
        lower.includes('generate an image')
    ) {
        return 'flux';
    }
    if (
        lower.match(/(code|function|script|algorithm|bug|error|exception|stack trace|python|javascript|typescript|react|html|css|sql|json|api)/) ||
        lower.includes('how to fix')
    ) {
        return 'deepseek'; 
    }
    if (lower.match(/(explain|summarize|write|essay|story|poem|analysis|compare|difference between|plan)/)) {
        return 'claude'; 
    }
    return 'grok'; 
  };

  // Helper to fetch full response (non-streaming for council candidates) with timeout
  const fetchFullResponse = async (msgs: Message[], model: string, systemPrompt?: string): Promise<string> => {
    let fullText = "";
    try {
        const stream = sendPollinationsMessageStream(msgs, model, systemPrompt, 'text');
        for await (const chunk of stream) {
            fullText += chunk;
        }
        if (!fullText.trim()) throw new Error("Empty response");
    } catch (e) {
        throw e;
    }
    return fullText;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    abortRef.current = false;

    // --- COMPARE MODE ---
    if (activeModel === 'compare') {
        const modelsToCompare = FLAGSHIP_MODELS;
        const newMessages: Message[] = modelsToCompare.map((modelId, index) => ({
            id: (Date.now() + index + 1).toString(),
            role: 'model',
            content: '',
            timestamp: Date.now(),
            model: modelId
        }));
        
        setMessages(prev => [...prev, ...newMessages]);

        const promises = modelsToCompare.map(async (modelId, index) => {
             const msgId = newMessages[index].id;
             try {
                const stream = sendPollinationsMessageStream(
                    [...messages, userMessage], 
                    modelId, 
                    getSystemPrompt(modelId),
                    'text'
                );
                
                let fullContent = '';
                for await (const chunk of stream) {
                    if (abortRef.current) break;
                    fullContent += chunk;
                    setMessages(prev => prev.map(msg => 
                        msg.id === msgId ? { ...msg, content: fullContent } : msg
                    ));
                }
             } catch (e) {
                 setMessages(prev => prev.map(msg => 
                    msg.id === msgId ? { ...msg, content: "[Error: Connection timed out or failed]" } : msg
                ));
             }
        });

        await Promise.all(promises);
        setIsLoading(false);
        return;
    }

    // --- COUNCIL MODE ---
    if (activeModel === 'council') {
        const judgeId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: judgeId,
            role: 'model',
            content: 'The Council is deliberating... (Consulting Grok, OpenAI, Claude, DeepSeek, Gemini)',
            timestamp: Date.now(),
            model: 'council'
        }]);

        try {
            // 1. Fetch Candidates in parallel with strict 10s timeout per model
            const fetchWithTimeout = async (m: string) => {
                const TIMEOUT_MS = 10000;
                try {
                    // Create a promise that rejects after timeout
                    const timeoutPromise = new Promise<string>((_, reject) => 
                        setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)
                    );
                    
                    const response = await Promise.race([
                        fetchFullResponse([...messages, userMessage], m, getSystemPrompt(m)),
                        timeoutPromise
                    ]);
                    
                    return { model: m, response };
                } catch (e) {
                    return { model: m, response: `[Model ${m} failed to respond in time]` };
                }
            };
            
            const results = await Promise.all(FLAGSHIP_MODELS.map(m => fetchWithTimeout(m)));
            
            // 2. Formulate Judge Prompt
            let judgePrompt = `User Query: "${userMessage.content}"\n\n`;
            results.forEach(r => {
                judgePrompt += `Model ${r.model} Answer:\n${r.response}\n\n----------------\n\n`;
            });
            judgePrompt += "Based on these answers, provide the best possible response. Ignore any models that failed to respond.";

            // 3. Stream Judge Response
            const judgeModel = 'perplexity-fast'; 
            
            const stream = sendPollinationsMessageStream(
                [{ role: 'user', content: judgePrompt, id: 'judge-prompt', timestamp: Date.now() }], 
                judgeModel, 
                JUDGE_SYSTEM_INSTRUCTION, 
                'text'
            );

            let fullContent = '';
            for await (const chunk of stream) {
                if (abortRef.current) break;
                fullContent += chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === judgeId ? { ...msg, content: fullContent } : msg
                ));
            }

        } catch (e) {
            setMessages(prev => prev.map(msg => 
                msg.id === judgeId ? { ...msg, content: "The Council was disbanded due to a critical error." } : msg
            ));
        } finally {
            setIsLoading(false);
        }
        return;
    }

    // --- STANDARD / AUTO MODE ---
    let targetModel = activeModel;
    if (activeModel === 'auto') {
        targetModel = detectBestModel(input);
    }

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
      model: targetModel 
    };
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    const modelObj = availableModels.find(m => m.id === targetModel);
    const isImageModel = modelObj?.type === 'image' || targetModel === 'flux' || targetModel === 'turbo';
    const modelType = isImageModel ? 'image' : 'text';

    try {
      const stream = sendPollinationsMessageStream(
        [...messages, userMessage], 
        targetModel, 
        getSystemPrompt(targetModel),
        modelType
      );
      
      let fullContent = '';
      for await (const chunk of stream) {
        if (abortRef.current) break;
        if (modelType === 'image' && chunk.startsWith('![')) {
            fullContent = chunk;
        } else if (modelType === 'image') {
             fullContent = chunk;
        } else {
            fullContent += chunk;
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: fullContent } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: msg.content + "\n[Error generating response. Please try again later.]" } 
          : msg
      ));
    } finally {
      setIsLoading(false);
      abortRef.current = false;
    }
  };

  const handleStop = () => {
    if (isLoading) {
      abortRef.current = true;
      setIsLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  const resolveModelIcon = (model: ModelType, className: string) => {
    if (typeof model !== 'string') return <CpuIcon className={className} />;
    
    const meta = MODEL_METADATA[model];
    if (meta) {
        const Icon = meta.icon;
        return <Icon className={className} />;
    }
    
    const modelObj = availableModels.find(m => m.id === model);
    if (modelObj?.type === 'image') {
        return <ImageIcon className={className} />;
    }

    if (model.includes('grok')) return <GrokLogo className={className} />;
    if (model.includes('openai')) return <ChatGPTIcon className={className} />;
    if (model.includes('claude')) return <ClaudeIcon className={className} />;
    if (model.includes('deepseek')) return <DeepSeekIcon className={className} />;
    if (model.includes('gemini')) return <GeminiIcon className={className} />;
    
    return <CpuIcon className={className} />;
  };

  const resolveModelName = (model: ModelType) => {
    if (typeof model !== 'string') return 'Unknown';

    const meta = MODEL_METADATA[model];
    if (meta) return meta.name;
    
    return model
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex h-full flex-col bg-[#fdfdfd] px-4 dark:bg-[#141414] transition-colors duration-200">
      <div className="absolute top-4 left-4 z-50" ref={menuRef}>
        <button 
          onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#0d0d0d] dark:text-white font-medium"
        >
          <span className="opacity-70">Model:</span>
          <span className="capitalize font-semibold">{resolveModelName(activeModel)}</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isModelMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#212121] rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden py-1 z-[60] max-h-[80vh] overflow-y-auto">
             {availableModels.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors ${activeModel === m.id ? 'bg-gray-50 dark:bg-[#2a2a2a]' : ''}`}
                >
                  <div className="text-gray-900 dark:text-white w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    {resolveModelIcon(m.id, "w-full h-full")}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {resolveModelName(m.id)}
                    </span>
                    {m.type === 'image' && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Image</span>
                    )}
                  </div>
                </button>
             ))}
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-[#f8f8f8] dark:bg-[#212121] hover:bg-gray-200 dark:hover:bg-gray-700 text-[#0d0d0d] dark:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>

      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mb-6 h-12 w-12 text-[#0d0d0d] dark:text-white">
            {resolveModelIcon(activeModel, "w-full h-full")}
          </div>
          <Composer 
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onStop={handleStop}
            isLoading={isLoading}
            isEmptyState={isEmpty}
            model={activeModel}
          />
        </div>
      ) : (
        <>
          <div className="flex grow flex-col overflow-y-scroll pt-20 scrollbar-hide">
            <div className="max-w-3xl mx-auto w-full">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} model={activeModel} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>
          <Composer 
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onStop={handleStop}
            isLoading={isLoading}
            isEmptyState={isEmpty}
            model={activeModel}
          />
        </>
      )}
    </div>
  );
}

export default App;