import React, { useRef, useEffect } from 'react';
import { ComposerProps } from '../types';
import { MicIcon, ArrowUpIcon, SquareIcon } from './Icons';

export const Composer: React.FC<ComposerProps> = ({ 
  input, 
  setInput, 
  onSend, 
  onStop, 
  isLoading,
  isEmptyState,
  model
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const hasText = input.trim().length > 0;
  const isEmpty = !hasText;
  const isRunning = isLoading;

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasText && !isLoading) {
        onSend();
      }
    }
  };

  const getPlaceholder = () => {
    if (isLoading) return "Thinking...";
    return model === 'grok' ? "Ask me anything, I dare you." : "Message ChatGPT";
  };

  return (
    <div 
      className="group/composer mx-auto mb-3 w-full max-w-3xl"
      data-empty={isEmpty}
      data-running={isRunning}
    >
      <div className="relative flex items-end rounded-4xl bg-[#f8f8f8] ring-1 ring-[#e5e5e5] ring-inset dark:bg-[#212121] dark:ring-[#2a2a2a] p-2 transition-all duration-200">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={isLoading}
          rows={1}
          className="w-full bg-transparent text-[#0d0d0d] outline-none dark:text-white px-4 py-3 resize-none max-h-[200px] overflow-y-auto leading-6 placeholder-gray-400 dark:placeholder-gray-500"
        />
        
        {/* Animated button with three states */}
        <div className="relative h-9 w-9 flex-shrink-0 rounded-full bg-[#0d0d0d] dark:bg-white mb-1.5 mr-1">
            <button 
              onClick={() => alert("Voice mode not implemented in this demo.")}
              className="absolute inset-0 flex items-center justify-center text-white dark:text-black transition-all duration-300 transform scale-100 opacity-100 group-data-[empty=false]/composer:scale-0 group-data-[empty=false]/composer:opacity-0 group-data-[running=true]/composer:scale-0 group-data-[running=true]/composer:opacity-0"
            >
              <MicIcon className="w-5 h-5" />
            </button>
          
            <button 
              onClick={onSend}
              className="absolute inset-0 flex items-center justify-center text-white dark:text-black transition-all duration-300 transform scale-0 opacity-0 group-data-[empty=false]/composer:scale-100 group-data-[empty=false]/composer:opacity-100 group-data-[running=true]/composer:scale-0 group-data-[running=true]/composer:opacity-0"
            >
              <ArrowUpIcon className="w-5 h-5" />
            </button>

            <button 
              onClick={onStop}
              className="absolute inset-0 flex items-center justify-center text-white dark:text-black transition-all duration-300 transform scale-0 opacity-0 group-data-[running=true]/composer:scale-100 group-data-[running=true]/composer:opacity-100"
            >
              <SquareIcon className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};
