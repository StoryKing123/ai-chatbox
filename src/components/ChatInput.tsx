import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  return (
    <div>
      <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none transition-all focus-within:ring-2 focus-within:ring-black/5 dark:focus-within:ring-white/10 focus-within:border-black dark:focus-within:border-gray-500">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          disabled={isLoading}
          className="w-full max-h-[120px] bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-none focus:ring-0 resize-none py-4 pl-6 pr-20 outline-none text-sm md:text-base leading-relaxed overflow-y-auto"
          rows={1}
        />
        <div className="absolute right-3 bottom-2.5 md:bottom-2 flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 transition-colors disabled:cursor-not-allowed shadow-md"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
      <p className="text-center mt-4 text-[10px] text-gray-400 tracking-wide uppercase font-medium">
        Lumina AI • Press Enter to send
      </p>
    </div>
  );
}
