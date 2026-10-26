import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Loader2, Compass } from 'lucide-react';
import api from '../services/api';

export const AIAssistantModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your HotelPro AI Concierge. I can help you search hotels across India, check amenities, pet policies, and verify live availability. How can I assist your trip today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Pet friendly hotel in Goa with pool',
    'Best luxury heritage palace in Jaipur',
    'Sea view rooms in Mumbai under ₹8000',
    'Hotels in Bengaluru near IT parks',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: textToSend });
      const reply = res.data?.data?.reply || 'I am sorry, I could not process that request.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I had trouble connecting to the catalog. Please try asking again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full sm:max-w-xl h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center space-x-1.5">
                <span>HotelPro AI Concierge</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                  Live Grounded RAG
                </span>
              </h3>
              <p className="text-[11px] text-white/80">Real-time room search & policy answers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-brand-600 text-white shadow-sm'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-sm rounded-tl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs pl-9">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span>Checking HotelPro catalog & room availability...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold px-2 flex items-center space-x-1 shrink-0">
            <Compass className="w-3.5 h-3.5 text-brand-500" />
            <span>Try:</span>
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 border border-slate-200/60 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask anything about our hotels, pools, pet rules..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition shadow-md shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
