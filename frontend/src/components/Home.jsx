import React from 'react';
import { 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Bot, 
  Database, 
  Layers, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  UserCheck
} from 'lucide-react';

export default function Home({ setActiveTab, onOpenAuthModal, user }) {
  return (
    <div className="page-wrapper space-y-20">
      {/* Hero Section (No Central Logo, Extra Large Headline with Shadows) */}
      <div className="text-center space-y-8 max-w-5xl mx-auto pt-6">
        {/* Top Pill Badge with Theme Colors */}
        <div className="flex justify-center">
          <div className="hero-pill-badge">
            <Sparkles className="w-4 h-4 text-[#00f59b]" />
            <span>AI-Driven <span className="span-highlight-green">ATS Parsing</span> & <span className="span-highlight-cyan">Mock Interview</span> Intelligence</span>
          </div>
        </div>

        {/* Hero Main Headline (Enlarged to 6xl/7xl with Glowing Shadows) */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black font-outfit tracking-tight text-white leading-[1.08] drop-shadow-md">
            Scale Career Readiness with <br />
            <span className="gradient-text drop-shadow-[0_0_35px_rgba(0,245,155,0.45)]">
              Production-Grade Precision
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-normal pt-2">
            Audit resumes against target job specifications with <span className="span-highlight-green font-bold">PyMuPDF parsing</span>, <span className="span-highlight-cyan font-bold">FAISS semantic embeddings</span>, and seamlessly practice in the <span className="span-highlight-purple font-bold">MockWithSiva</span> virtual interviewer platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
          <button
            onClick={() => setActiveTab('analyze')}
            className="btn-neon-primary !py-4 !px-10 text-base font-bold shadow-[0_0_35px_rgba(0,245,155,0.55)]"
          >
            <span>Analyze Resume Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="https://mockwithsiva.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-secondary !py-4 !px-10 text-base"
          >
            <span>Launch Mock Interview</span>
            <ExternalLink className="w-5 h-5 text-[#00f59b]" />
          </a>
        </div>
      </div>

      {/* 3 Core Value Pillars with Vibrant Colors & Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Pillar 1 */}
        <div className="glass-panel p-8 space-y-5 relative overflow-hidden flex flex-col justify-between border-t-4 border-t-[#00f59b] shadow-2xl">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#00f59b] shadow-[0_0_20px_rgba(0,245,155,0.25)]">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white font-outfit">
              <span className="span-highlight-green">Weighted ATS</span> Matching
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Deterministic 5-pillar scoring model evaluating <span className="text-white font-semibold">Technical Skills (40%)</span>, <span className="text-white font-semibold">Experience (20%)</span>, <span className="text-white font-semibold">Projects (20%)</span>, <span className="text-white font-semibold">Education (10%)</span>, and <span className="text-white font-semibold">Certs (10%)</span>.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('analyze')}
            className="text-xs font-bold text-[#00f59b] hover:underline flex items-center gap-1.5 pt-2 !bg-transparent"
          >
            Open Resume Analyzer <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel p-8 space-y-5 relative overflow-hidden flex flex-col justify-between border-t-4 border-t-[#38bdf8] shadow-2xl">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.25)]">
              <Database className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white font-outfit">
              <span className="span-highlight-cyan">Vector RAG</span> Intelligence
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Chunks your PDF resume and target job spec into dense <span className="text-white font-semibold">vector embeddings</span> with <span className="text-white font-semibold">FAISS cosine similarity</span> to ground candidate fitness questions.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('rag')}
            className="text-xs font-bold text-[#38bdf8] hover:underline flex items-center gap-1.5 pt-2 !bg-transparent"
          >
            Ask RAG Assistant <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel p-8 space-y-5 relative overflow-hidden flex flex-col justify-between border-t-4 border-t-[#c084fc] shadow-2xl">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-[#c084fc] shadow-[0_0_20px_rgba(192,132,252,0.25)]">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white font-outfit">
              <span className="span-highlight-purple">Virtual Mock</span> Interview
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Replicate high-stakes technical interviews with <span className="text-white font-semibold">real-time answer recording</span>, <span className="text-white font-semibold">NLP dynamic question adaptation</span>, and AI evaluation on MockWithSiva.
            </p>
          </div>
          <a
            href="https://mockwithsiva.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#c084fc] hover:underline flex items-center gap-1.5 pt-2 !bg-transparent"
          >
            Launch on MockWithSiva <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* User Account / Workflow Bridge Card with Rich Shadows */}
      <div className="glass-panel glass-panel-glow p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-[#00f59b] shadow-2xl">
        <div className="space-y-2.5 max-w-xl">
          <span className="text-xs font-bold text-[#00f59b] uppercase tracking-wider">
            Comprehensive Career Platform
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">
            How this platform transforms your <span className="gradient-text">interview journey</span>
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            From parsing raw resumes to identifying missing keywords, exploring candidate profile dashboards, and taking full AI-evaluated mock simulations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setActiveTab('about')}
            className="btn-neon-secondary !py-3.5 !px-6 text-xs whitespace-nowrap"
          >
            Read Workflow Guide
          </button>
          {!user && (
            <button
              onClick={onOpenAuthModal}
              className="btn-neon-primary !py-3.5 !px-6 text-xs whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
