"use client";
import { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPhi3Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm Phi-3, an AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content,
          conversation_history: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Chat failed');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || data.message || 'No response from model',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-fg-muted/50 mb-1">AI · NLP</p>
        <h1 className="text-2xl font-heading font-semibold">Chat Phi-3</h1>
      </div>

      <div className="">
        <div className="space-y-8">
          <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto p-4 border border-white/10 bg-white/30 dark:bg-slate-900/40 rounded-2xl">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-100/60 dark:bg-blue-900/30 ml-12'
                    : 'bg-indigo-50/60 dark:bg-indigo-900/30 mr-12'
                } rounded-xl shadow-sm`}
              >
                <div className="font-semibold text-sm text-indigo-600 dark:text-indigo-300 mb-1">
                  {msg.role === 'user' ? 'You' : 'Phi-3'}
                </div>
                <div className="text-fg">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="text-center text-fg-muted">
                <div className="inline-block animate-pulse">Thinking...</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-white/20 bg-white/60 dark:bg-slate-900/40 text-fg focus:outline-none focus:border-indigo-400 rounded-xl shadow-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
