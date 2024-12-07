import React from 'react';
import { ContentType } from '@/lib/claude-tools';

interface ChatToolsProps {
  currentType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

export const ChatTools: React.FC<ChatToolsProps> = ({ currentType, onTypeChange }) => {
  return (
    <div className="flex gap-2">
      <button
        className={`p-2 rounded ${currentType === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onTypeChange('text')}
      >
        <span className="sr-only">Text</span>
        <TextIcon className="w-5 h-5" />
      </button>
      <button
        className={`p-2 rounded ${currentType === 'code' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onTypeChange('code')}
      >
        <span className="sr-only">Code</span>
        <CodeIcon className="w-5 h-5" />
      </button>
      <button
        className={`p-2 rounded ${currentType === 'math' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onTypeChange('math')}
      >
        <span className="sr-only">Math</span>
        <MathIcon className="w-5 h-5" />
      </button>
      <button
        className={`p-2 rounded ${currentType === 'translate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onTypeChange('translate')}
      >
        <span className="sr-only">Translate</span>
        <TranslateIcon className="w-5 h-5" />
      </button>
      <button
        className={`p-2 rounded ${currentType === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onTypeChange('summary')}
      >
        <span className="sr-only">Summary</span>
        <SummaryIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

// Ikony
const TextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
  </svg>
);

const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8 3L2 9l6 6 1.4-1.4L4.8 9l4.6-4.6L8 3zm8 0l-1.4 1.4L19.2 9l-4.6 4.6L16 15l6-6-6-6z" />
  </svg>
);

const MathIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z" />
  </svg>
);

const TranslateIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
  </svg>
);

const SummaryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
  </svg>
);

export type { ContentType }; 