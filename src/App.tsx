import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Trash2, Plus, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch response');
      }

      const data = await response.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.text,
        createdAt: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `**Error:** ${error.message || 'Something went wrong.'}`,
        createdAt: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    setMessages([]);
  };

  return (
    <div className="h-screen w-full flex bg-[#F9FAFB] dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-500">
      
      {/* Sidebar: Session Management */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col p-6 transition-colors duration-500 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center transition-colors">
            <div className="w-4 h-4 border-2 border-white dark:border-black rounded-full transition-colors"></div>
          </div>
          <span className="font-semibold text-lg tracking-tight">Lumina AI</span>
        </div>

        <button onClick={clearSession} className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-medium mb-8">
          <Plus size={16} />
          New Session
        </button>

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">Recent History</p>
          <div className="space-y-1">
            <div className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer transition-colors">Interface Design Principles</div>
            <div className="px-3 py-2.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Marketing Copy Ideas</div>
            <div className="px-3 py-2.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">API Documentation Review</div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-1.5 rounded-full transition-colors">
            <button 
              onClick={() => setIsDark(false)}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${!isDark ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Sun size={14} />
              Light
            </button>
            <button 
              onClick={() => setIsDark(true)}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Moon size={14} />
              Dark
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Box Area */}
      <main className="flex-1 flex flex-col relative h-full w-full max-w-full">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-500 z-10 shrink-0">
          <div>
            <h2 className="text-sm font-semibold">Current Session</h2>
            <p className="text-[11px] text-green-500 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Systems Active
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors border border-transparent md:hidden" 
              title="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={clearSession}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors border border-gray-100 dark:border-gray-800 rounded-lg hover:border-red-100 dark:hover:border-red-900/30" 
              title="Clear Session"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        {/* Message Feed */}
        <section className="flex-1 overflow-y-auto px-4 py-8 md:px-10 flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-black dark:bg-white rounded-2xl flex items-center justify-center transition-colors">
                  <div className="w-8 h-8 border-4 border-white dark:border-black rounded-full transition-colors"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Start a conversation below to begin exploring ideas.
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-4 mb-2"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex-shrink-0 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30">
                    <div className="w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="max-w-[85%] md:max-w-[75%] bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Processing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </>
          )}
        </section>

        {/* Input Area */}
        <div className="p-4 md:p-10 pt-2 shrink-0">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </main>

    </div>
  );
}
