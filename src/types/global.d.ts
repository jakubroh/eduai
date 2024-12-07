interface Window {
  MathJax: {
    typesetPromise: (elements: (HTMLElement | null)[]) => Promise<void>;
    typesetClear?: (elements: (HTMLElement | null)[]) => void;
  };
} 

interface APIError {
  message: string;
  code?: string;
  details?: unknown;
} 