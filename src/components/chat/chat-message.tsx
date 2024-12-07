"use client";

import { useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { StaticMathField } from "react-mathquill";
import { cn } from "@/lib/utils";
import { Message, ContentType } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";

interface ChatMessageProps {
  message: Message;
  isUser: boolean;
  type: ContentType;
}

export function ChatMessage({ message, isUser, type }: ChatMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inicializace MathJax pro matematické vzorce
    if (type === "math" && window.MathJax) {
      const container = containerRef.current;
      const mathJax = window.MathJax;

      if (container) {
        mathJax.typesetPromise([container]);

        return () => {
          if (mathJax.typesetClear) {
            mathJax.typesetClear([container]);
          }
        };
      }
    }
  }, [message.content, type]);

  function renderContent() {
    switch (type) {
      case "code":
        // Detekce jazyka z prvního řádku (```javascript)
        const languageMatch = message.content.match(/^```(\w+)/);
        const language = languageMatch ? languageMatch[1] : "javascript";
        const code = message.content.replace(/^```\w+\n/, "").replace(/```$/, "");

        return (
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: "0.375rem",
            }}
          >
            {code}
          </SyntaxHighlighter>
        );

      case "math":
        return (
          <div className="math-display">
            <StaticMathField>{message.content}</StaticMathField>
          </div>
        );

      default:
        return (
          <div className="whitespace-pre-wrap">
            {message.content.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        );
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900",
          type === "code" && "p-0"
        )}
      >
        {renderContent()}
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-blue-200" : "text-gray-500"
        )}>
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
            locale: cs,
          })}
        </div>
      </div>
    </div>
  );
} 