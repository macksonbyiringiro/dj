
import React from 'react';

export const MicrophoneIcon = ({ className = "w-6 h-6", isListening }: { className?: string, isListening?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${className} ${isListening ? 'text-red-500' : ''}`}>
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 11a7 7 0 0 1-14 0H3a8 8 0 0 0 7 7.93V21h2v-2.07A8 8 0 0 0 21 11h-2Z" />
  </svg>
);

export const SoundOnIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z" />
  </svg>
);

export const SoundOffIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63ZM12 4L7 9H3v6h4l5 5v-6.58l-5.75-5.75L12 4ZM4.27 3L3 4.27l6.02 6.02L3 15v- санкция 2h4l5 5v.28l1.45 1.45L12 22.01 19 15.01 12 8 4.27 3ZM19.73 12c0 .22-.02.43-.05.63l1.72 1.72c.43-.91.7-1.92.7-3.02C22 7.18 19.82 4.2 17 3.23v2.06c1.89.86 3.29 2.76 3.73 4.71Z"/>
    </svg>
);

export const SendIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2 .01 7Z" />
  </svg>
);

export const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </svg>
);

export const AssistantIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2ZM9.47 14.39a.75.75 0 0 1-1.45-.4l-.97-3.37-3.37-.98a.75.75 0 0 1 .4-1.45l9.25-2.72a.75.75 0 0 1 .98.98L11.61 14a.75.75 0 0 1-.69.5c-.13 0-.27-.04-.39-.11Z" />
    </svg>
);

export const SpinnerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} animate-spin`}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
