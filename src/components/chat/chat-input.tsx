"use client";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { MathInput } from "./math-input";
import { cn } from "@/lib/utils";
import { ContentType } from "@/types/chat";
import * as monacoEditor from "monaco-editor";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  type: ContentType;
}

export function ChatInput({ onSendMessage, loading, type }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message);
      setMessage("");
      setCharCount(0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && type === "text") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleEditorMount(editor: monacoEditor.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  function handleEditorSubmit() {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      if (content.trim() && !loading) {
        onSendMessage(content);
        editorRef.current.setValue("");
        setCharCount(0);
      }
    }
  }

  function handleLanguageChange(language: string) {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoEditor.editor.setModelLanguage(model, language);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      {type === "text" && (
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Napište zprávu..."
          className="w-full p-3 pr-24 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          disabled={loading}
        />
      )}

      {type === "code" && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <Editor
            height="200px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={message}
            onChange={(value) => setMessage(value || "")}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
            }}
          />
        </div>
      )}

      {type === "math" && (
        <MathInput
          value={message}
          onChange={setMessage}
          disabled={loading}
          onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        />
      )}

      <div className="absolute right-3 bottom-3 flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{charCount}</span>
          {type === "code" && (
            <select
              className="text-sm border rounded px-2 py-1"
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
            </select>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !message.trim()}
          onClick={type === "code" ? handleEditorSubmit : undefined}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium text-white",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            loading || !message.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {loading ? "Odesílám..." : "Odeslat"}
        </button>
      </div>
    </form>
  );
} 