"use client";

import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatHistoryProps {
  messages: Message[];
  isTyping: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg max-w-[100px]">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
}

export function ChatHistory({ messages, isTyping }: ChatHistoryProps) {
  if (messages.length === 0 && !isTyping) {
    return (
      <div className="text-center py-4 text-gray-500">
        Začněte konverzaci napsáním zprávy
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[70%] rounded-lg px-4 py-2",
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <div
              className={cn(
                "text-xs mt-1",
                message.role === "user" ? "text-blue-200" : "text-gray-500"
              )}
            >
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
                locale: cs,
              })}
            </div>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
} 