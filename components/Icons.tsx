import React from 'react';

export const GrokLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-label="Grok Logo"
  >
    <path d="M20 20 L80 20 L80 35 L35 35 L35 80 L20 80 Z" />
    <rect x="45" y="45" width="35" height="35" />
  </svg>
);

export const ChatGPTIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-label="ChatGPT Logo"
  >
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729ZM12.7299 1.1027a4.4975 4.4975 0 0 1 2.0854.3003 4.4927 4.4927 0 0 1 2.4542 3.999l-2.0298.5363-2.51-.7674-1.6366 1.7674-1.5298-.5363.5363-1.8953a4.478 4.478 0 0 1 2.6303-3.404ZM5.2396 6.0906a4.4927 4.4927 0 0 1 3.2307-2.2882 4.4927 4.4927 0 0 1 3.7918 1.6826l-1.6124 1.3414-2.5052-.7674-.9693 2.2155-1.5585.4243-.496-1.9288a4.478 4.478 0 0 1 .119-2.6794Zm-2.5198 7.377a4.4927 4.4927 0 0 1 0-3.9575 4.4927 4.4927 0 0 1 3.2307-2.2882l1.0903 1.7825-.9693 2.2155 1.0253 2.1883-1.0253.9616-1.9231-.2253a4.478 4.478 0 0 1-1.4286-2.677Zm3.0258 5.4312a4.4927 4.4927 0 0 1-1.1451-3.7944 4.4927 4.4927 0 0 1 3.2307-2.2882l1.6124 1.3414.9693 2.2155-1.5872 1.7674-1.5872.4243-1.9904-.5363a4.478 4.478 0 0 1 .4975-2.1297Zm10.0384-2.836a4.4927 4.4927 0 0 1-3.2307 2.2882 4.4927 4.4927 0 0 1-3.7918-1.6826l1.6124-1.3414 2.5052.7674.9693-2.2155 1.5585-.4243.496 1.9288a4.478 4.478 0 0 1-.1189 2.6794Zm2.5198-7.377a4.4927 4.4927 0 0 1 0 3.9575 4.4927 4.4927 0 0 1-3.2307 2.2882l-1.0903-1.7825.9693-2.2155-1.0253-2.1883 1.0253-.9616 1.9231.2253a4.478 4.478 0 0 1 1.4286 2.677Z" />
  </svg>
);

export const ClaudeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-label="Claude Logo"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);

export const DeepSeekIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-label="DeepSeek Logo"
  >
    <path d="M12 2L2 19h20L12 2zm0 4.2L17.5 17H6.5L12 6.2z" />
  </svg>
);

export const GeminiIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-label="Gemini Logo"
  >
    <path d="M11.9,2c0,0-1,8.3-9.9,10c8.9,1.7,9.9,10,9.9,10s1-8.3,9.9-10C12.9,10.3,11.9,2,11.9,2z M12,7.3c0.8,2.7,2.9,4.8,5.7,5.6 c-2.8,0.8-4.9,2.9-5.7,5.6C11.2,15.8,9.1,13.7,6.3,12.9C9.1,12.1,11.2,10,12,7.3z" />
  </svg>
);

export const CpuIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3" />
    <path d="M15 1v3" />
    <path d="M9 20v3" />
    <path d="M15 20v3" />
    <path d="M20 9h3" />
    <path d="M20 14h3" />
    <path d="M1 9h3" />
    <path d="M1 14h3" />
  </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

export const ImageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const MicIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

export const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
);

export const SquareIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export const SunIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);