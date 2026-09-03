import React, { useState } from 'react';
import { MessageSquareCode, Send, Sparkles, Database, Loader2, Bot, FileText } from 'lucide-react';
import { queryRAG } from '../services/api';
import FormattedResponse from './FormattedResponse';

export default function RAGAssistant({ analysisData }) {
  const [query, setQuery] = useState('Why am I missing skills for this job?');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!query.trim()) return;

    if (!analysisData || !analysisData.resume || !analysisData.jobDescription) {
      setError('Please upload a resume and job description first in the Analyzer to initialize the RAG vector index.');
      return;
    }

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);
    setError(null);

    try {
      const res = await queryRAG(
        userMessage.text,
        analysisData.resume.extracted_text,
        analysisData.jobDescription
      );

      const botMessage = {
        sender: 'bot',
        text: res.answer,
        chunks: res.retrieved_chunks || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError('RAG query failed. Please verify FastAPI server is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-3 pt-2">
        <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-white tracking-tight">
          Retrieval-Augmented Generation <span className="gradient-text">Assistant</span>
        </h2>
        <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
          Ask questions about your match, skill gaps, or experience. Queries chunk context, perform cosine similarity search, and ground answers deterministically.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs md:text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Chat Messages Panel */}
      <div className="glass-panel p-6 md:p-8 min-h-[460px] max-h-[620px] overflow-y-auto space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xs md:text-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#00f59b] mx-auto mb-2 shadow-md">
                <Bot className="w-7 h-7" />
              </div>
              <p className="text-slate-300 font-medium">No messages yet. Ask an intelligent query like:</p>
              <p className="code-font text-[#00f59b] cursor-pointer hover:underline inline-block bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30" onClick={() => setQuery("Why am I missing skills for this job?")}>
                "Why am I missing skills for this job?"
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-2xl p-5 rounded-3xl text-xs md:text-sm space-y-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#00f59b] to-[#00d084] text-[#050811] font-bold rounded-br-none shadow-[0_0_20px_rgba(0,245,155,0.3)]'
                      : 'bg-[#050912]/95 text-slate-200 border border-white/10 rounded-bl-none shadow-2xl backdrop-blur-md'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <div className="leading-relaxed font-semibold">
                      {msg.text}
                    </div>
                  ) : (
                    <FormattedResponse text={msg.text} />
                  )}

                  {/* Render RAG Citations */}
                  {msg.chunks && msg.chunks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-[11px] text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#38bdf8] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Retrieved Grounding Context (Top-{msg.chunks.length}):
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Semantic Cosine Match</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {msg.chunks.map((chunk, cIdx) => (
                          <div key={cIdx} className="bg-[#02050c]/90 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-slate-300 leading-relaxed shadow-inner">
                            <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/5 text-[9px]">
                              <span className={`font-bold uppercase tracking-wider ${chunk.source.includes('Resume') ? 'text-[#00f59b]' : 'text-cyan-400'}`}>
                                {chunk.source}
                              </span>
                              <span className="text-slate-400 font-bold">Similarity: {(chunk.score * 100).toFixed(1)}%</span>
                            </div>
                            <span className="text-slate-400 font-sans italic">"{chunk.text.slice(0, 160)}..."</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-slate-900/50 p-3.5 rounded-2xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-[#00f59b]" /> Vector similarity search & RAG generation in progress...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about your match or skill gap..."
            className="flex-1 bg-[#050912] border border-white/10 rounded-2xl px-5 py-3.5 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-[#00f59b] shadow-inner"
          />
          <button onClick={handleSend} disabled={loading} className="btn-neon-primary !py-3.5 !px-7 !text-xs font-bold">
            <Send className="w-4 h-4" /> 
            <span>Ask RAG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
