import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const TechAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi there. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-brand-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 ${isOpen ? 'hidden' : 'flex'} items-center gap-2 group`}
      >
        <Bot className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-medium text-sm pl-0 group-hover:pl-2">
           Ask Assistant
        </span>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] h-[540px] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-100 absolute top-0 w-full z-10">
            <div className="flex items-center gap-3">
              <div className="bg-brand-black p-1.5 rounded-full">
                 <Sparkles className="text-white w-3 h-3" />
              </div>
              <div>
                <h3 className="text-brand-black font-semibold text-sm">MSIS Assistant</h3>
                <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide">Powered by Zeno Corp</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-gray-100 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-4 bg-white scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3.5 rounded-2xl text-[15px] leading-snug shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#0071e3] text-white rounded-tr-sm' 
                      : 'bg-[#f5f5f7] text-brand-black rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#f5f5f7] p-4 rounded-2xl rounded-tl-sm flex gap-1.5 w-16 items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-center bg-[#f5f5f7] rounded-full px-4 py-1.5 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message..."
                className="flex-1 bg-transparent border-none focus:outline-none text-brand-black text-[15px] placeholder-gray-400 h-9"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`bg-[#0071e3] text-white p-1.5 rounded-full transition-all duration-200 ${!input.trim() ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[9px] text-gray-300 mt-2 text-center">AI generated responses. Please verify details.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TechAssistant;