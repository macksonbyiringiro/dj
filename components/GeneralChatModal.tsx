import React, { useState, useEffect, useRef } from 'react';
import { Product, ChatMessage } from '../types';
import { startGeneralChatSession, sendMessage, ChatSession } from '../services/geminiService';
import { Icon } from './common/Icon';

interface GeneralChatModalProps {
  products: Product[];
  onClose: () => void;
}

const GeneralChatModal: React.FC<GeneralChatModalProps> = ({ products, onClose }) => {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
        setIsLoading(true);
        const session = startGeneralChatSession(products);
        setChatSession(session);
        
        // Send an initial message to the model to get a greeting
        const initialModelMessage = await sendMessage(session, "Hello, please introduce yourself as Mackson and greet me warmly, then ask how you can help me explore the marketplace today.");
        
        setMessages([
            { role: 'model', text: initialModelMessage || `Hello! I'm Mackson, your AI marketplace assistant. What can I help you find today?` }
        ]);
        setIsLoading(false);
    };

    initChat();
  }, [products]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chatSession || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const responseText = await sendMessage(chatSession, userInput);

    const modelMessage: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isUser ? 'bg-brand-primary text-white' : 'bg-gray-200 text-brand-dark'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 flex flex-col h-[80vh] transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Icon name="generate" className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                    <h2 className="font-bold text-brand-dark">Mackson</h2>
                    <p className="text-xs text-gray-500">AI Marketplace Assistant</p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close chat"
            >
                <Icon name="close" className="h-6 w-6" />
            </button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, index) => <MessageBubble key={index} message={msg} />)}
            {isLoading && messages.length > 0 && (
              <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-gray-200 text-brand-dark flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce ml-1" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce ml-1" style={{animationDelay: '0.2s'}}></div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <footer className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask Mackson about products..."
                    className="flex-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    disabled={isLoading}
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className="p-3 flex justify-center items-center rounded-full text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <Icon name="send" className="h-5 w-5" />
                </button>
            </form>
        </footer>
      </div>
    </div>
  );
};

export default GeneralChatModal;