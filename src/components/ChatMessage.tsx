import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
        
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex-shrink-0 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30">
            <div className="w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
          </div>
        )}

        {/* Bubble */}
        <div className={`relative px-5 py-4 rounded-2xl shadow-sm text-sm md:text-base transition-colors
          ${isUser 
            ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none' 
            : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-tl-none'}
        `}>
          {isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          ) : (
            <div className="markdown-body">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
        </div>
        
      </div>
    </motion.div>
  );
}
