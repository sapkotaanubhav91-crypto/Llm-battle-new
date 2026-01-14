import React from 'react';
import { Message } from '../types';
import { GrokLogo, ChatGPTIcon, ClaudeIcon, DeepSeekIcon, GeminiIcon, SparklesIcon, ImageIcon } from './Icons';
import { ModelType } from '../types';

interface ChatMessageProps {
  message: Message;
  model: ModelType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, model }) => {
  const isModel = message.role === 'model';
  
  // Use the model stored in the message if available, otherwise fallback to the current context model
  const effectiveModel = message.model || model;

  const getModelIcon = (modelType: ModelType) => {
    // Basic heuristics to determine icon if modelType is not a standard key
    if (typeof modelType !== 'string') return <SparklesIcon className="h-5 w-5" />;

    const lower = modelType.toLowerCase();
    
    if (lower === 'auto') return <SparklesIcon className="h-5 w-5" />;
    if (lower.includes('grok')) return <GrokLogo className="h-5 w-5" />;
    if (lower.includes('openai') || lower.includes('gpt')) return <ChatGPTIcon className="h-5 w-5" />;
    if (lower.includes('claude')) return <ClaudeIcon className="h-5 w-5" />;
    if (lower.includes('deepseek')) return <DeepSeekIcon className="h-5 w-5" />;
    if (lower.includes('gemini')) return <GeminiIcon className="h-5 w-5" />;
    if (lower === 'flux' || lower === 'turbo' || lower.includes('image')) return <ImageIcon className="h-5 w-5" />;
    
    // Default fallback
    return <GrokLogo className="h-5 w-5" />;
  };

  return (
    <div className={`flex w-full max-w-3xl mx-auto mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      
      {isModel && (
        <div className="flex-shrink-0 mr-4 mt-1">
          <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center text-black dark:text-white">
             {effectiveModel === 'grok' ? (
                <div className="h-8 w-8 rounded-full bg-grok-text-light dark:bg-white flex items-center justify-center text-white dark:text-black">
                  <GrokLogo className="h-5 w-5" />
                </div>
             ) : (
                <div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                   {getModelIcon(effectiveModel)}
                </div>
             )}
          </div>
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] ${isModel ? 'items-start' : 'items-end'}`}>
        {!isModel && (
          <div className="text-xs text-gray-400 mb-1 mr-2 uppercase tracking-wide font-semibold">
            You
          </div>
        )}
        
        <div 
          className={`relative px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
            ${isModel 
              ? 'bg-transparent text-grok-text-light dark:text-grok-text-dark p-0 shadow-none' 
              : 'bg-grok-input-light dark:bg-grok-input-dark text-grok-text-light dark:text-grok-text-dark ring-1 ring-grok-ring-light dark:ring-grok-ring-dark'
            }`}
        >
          {isModel ? (
             <div className="markdown-content whitespace-pre-wrap">
               {message.content}
             </div>
          ) : (
            message.content
          )}
          
          {/* Optional: Show which model was used in Auto mode if it's different from the active model prop */}
          {isModel && message.model && model === 'auto' && (
             <div className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1 opacity-70">
                Generated with {message.model.split(/[-_]/)[0]}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};