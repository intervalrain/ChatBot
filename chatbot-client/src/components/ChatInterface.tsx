import { sendMessage } from "../api";
import React, { useState, useRef, useEffect, ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  token: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ token }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [topK, setTopK] = useState<number>(50);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && token) {
      const userMessage: Message = { role: "user", content: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setError(null);

      try {
        const responseMessage = await sendMessage(
          {
            userPrompt: input,
            topK,
          },
          token
        );
        const assistantMessage: Message = {
          role: "assistant",
          content: responseMessage,
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Failed to send message:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }

      setInput("");
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 5 * 24);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.key === "Enter" && e.ctrlKey) ||
      (e.key === "Enter" && !e.shiftKey)
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  const components: ComponentProps<typeof ReactMarkdown>["components"] = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <pre className="bg-gray-800 text-white p-2 rounded">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-4/5 p-3 ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={components}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                Top-K:
              </label>
              <input
                type="number"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-16 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                min="1"
                max="50"
              />
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-tl-lg rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 resize-none"
              placeholder="Type your message... (Ctrl+Enter or Enter to send)"
              rows={1}
              ref={textareaRef}
              style={{ maxHeight: "150px", minHeight: "38px" }}
            />
          </div>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 self-end"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
