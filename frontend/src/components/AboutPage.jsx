import React from 'react';
import { 
  FileSearch, 
  BrainCircuit, 
  Layers, 
  Database, 
  Bot, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function AboutPage({ setActiveTab }) {
  const steps = [
    {
      number: '01',
      title: 'PyMuPDF Resume Parsing & Ingestion',
      icon: <FileSearch className="w-6 h-6 text-[#00f59b]" />,
      desc: 'Extracts clean structural text line-by-line from PDF resumes without layout distortions or character drops.',
      badge: 'Data Layer',
      badgeClass: 'text-[#00f59b] bg-emerald-500/10 border-emerald-500/30',
      color: 'border-emerald-500/30 bg-emerald-500/10'
    },
    {
      number: '02',
      title: 'Dual-Strategy Skill & Experience Extraction',
      icon: <BrainCircuit className="w-6 h-6 text-[#38bdf8]" />,
      desc: 'Combines Approach A (Exact Canonical Keyword Matching) with Approach B (Dense Vector Semantic Similarity) to avoid false negatives.',
      badge: 'NLP Engine',
      badgeClass: 'text-[#38bdf8] bg-cyan-500/10 border-cyan-500/30',
      color: 'border-cyan-500/30 bg-cyan-500/10'
    },
    {
      number: '03',
      title: 'Deterministic 5-Pillar Score Calculation',
      icon: <Layers className="w-6 h-6 text-[#c084fc]" />,
      desc: 'Calculates overall match percentage using strict enterprise weights: Technical Skills (40%), Experience (20%), Projects (20%), Education (10%), Certs (10%).',
      badge: 'Scoring Engine',
      badgeClass: 'text-[#c084fc] bg-purple-500/10 border-purple-500/30',
      color: 'border-purple-500/30 bg-purple-500/10'
    },
    {
      number: '04',
      title: 'Vector FAISS RAG Assistant Grounding',
      icon: <Database className="w-6 h-6 text-[#fbbf24]" />,
      desc: 'Indexes both resume and job spec chunks into a vector space with cosine similarity retrieval, preventing hallucinations when answering candidate questions.',
      badge: 'RAG Pipeline',
      badgeClass: 'text-[#fbbf24] bg-amber-500/10 border-amber-500/30',
      color: 'border-amber-500/30 bg-amber-500/10'
    },
    {
      number: '05',
      title: 'Bridge to Live Mock Interview Simulation',
      icon: <Bot className="w-6 h-6 text-[#00f59b]" />,
      desc: 'Instead of passive question lists, candidates are bridged directly into MockWithSiva to practice real-time conversational questions with AI auto-evaluation.',
      badge: 'Interactive Mock',
      badgeClass: 'text-[#00f59b] bg-emerald-500/10 border-emerald-500/30',
      color: 'border-emerald-500/30 bg-emerald-500/10'
    }
  ];

  return (
    <div className="page-wrapper space-y-16">
      {/* Header with Styled Colors on ResumeAI & MockWithSiva */}
      <div className="text-center space-y-4 max-w-4xl mx-auto pt-2">
        <div className="flex justify-center">
          <div className="hero-pill-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Workflow & Systems Architecture</span>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-outfit tracking-tight text-white leading-tight drop-shadow-md">
          How <span className="gradient-text drop-shadow-[0_0_25px_rgba(0,245,155,0.45)]">ResumeAI</span> & <span className="gradient-text-mint drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]">MockWithSiva</span> Work
        </h2>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          A high-performance pipeline bridging <span className="span-highlight-green">deterministic ATS resume auditing</span> with <span className="span-highlight-cyan">dynamic AI-powered mock interviews</span>.
        </p>
      </div>

      {/* 5-Step Workflow Cards Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
          {steps.map((s, idx) => (
            <div key={idx} className="glass-panel p-8 space-y-5 flex flex-col justify-between relative overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
                <span className="font-mono font-black text-3xl text-slate-700">{s.number}</span>
              </div>

              <div className="space-y-3">
                {/* Subheading with colorful theme span */}
                <div>
                  <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border uppercase inline-block shadow-sm ${s.badgeClass}`}>
                    <span className="font-black">●</span> {s.badge}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-white font-outfit">{s.title}</h4>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}

          {/* 6th Action Card */}
          <div className="glass-panel p-8 space-y-5 flex flex-col justify-between border-emerald-500/40 bg-gradient-to-br from-[#091a15] to-[#040810] shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[#00f59b] shadow-[0_0_20px_rgba(0,245,155,0.3)]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-[#00f59b] border border-emerald-500/40 uppercase inline-block shadow-sm">
                  <span className="font-black">●</span> Ready to Test?
                </span>
              </div>
              <h4 className="font-bold text-lg text-white font-outfit">Start Your Analysis</h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Upload your resume PDF and paste your target job spec to see your <span className="span-highlight-green font-bold">deterministic score</span> in seconds.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('analyze')}
              className="btn-neon-primary !py-3.5 !px-4 !text-xs w-full justify-center shadow-lg"
            >
              <span>Go to Resume Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggest User to Take Mock Interview Section */}
      <div className="glass-panel glass-panel-glow p-8 md:p-14 space-y-10 bg-gradient-to-b from-[#091814] via-[#0b241e] to-[#050811] border border-emerald-500/40 rounded-3xl shadow-2xl">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[#00f59b] shadow-[0_0_30px_rgba(0,245,155,0.4)]">
            <Bot className="w-8 h-8" />
          </div>

          <h3 className="text-2xl md:text-4xl font-black text-white font-outfit leading-tight">
            Why We Strongly Suggest Taking a <span className="gradient-text">Live Mock Interview</span>
          </h3>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Reading static questions only builds passive memory. In real interviews, hiring leads evaluate your <span className="span-highlight-green">thought articulation</span>, <span className="span-highlight-cyan">vocal speed</span>, <span className="span-highlight-purple">cadence</span>, and ability to handle <span className="text-white font-semibold">adaptive follow-up questions</span>.
          </p>
        </div>

        {/* Benefits Grid with High-Contrast Divs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#050912]/80 p-6 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <CheckCircle2 className="w-6 h-6 text-[#00f59b]" />
            <h4 className="text-base font-bold text-white">Real-Time Audio/Video Recording</h4>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Practice answering aloud in front of a live recorder just like a real remote technical interview.
            </p>
          </div>

          <div className="bg-[#050912]/80 p-6 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <CheckCircle2 className="w-6 h-6 text-[#00f59b]" />
            <h4 className="text-base font-bold text-white">AI-Powered Auto Evaluation</h4>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Receive structured instant metrics on technical correctness, clarity, and architectural depth.
            </p>
          </div>

          <div className="bg-[#050912]/80 p-6 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <CheckCircle2 className="w-6 h-6 text-[#00f59b]" />
            <h4 className="text-base font-bold text-white">Adaptive NLP Dynamic Questioning</h4>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              The interviewer dynamically pivots and asks deeper drill-down questions based on your answers.
            </p>
          </div>
        </div>

        {/* Big Launch Action */}
        <div className="text-center pt-2">
          <a
            href="https://mockwithsiva.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-primary !py-4 !px-12 text-base font-bold shadow-[0_0_35px_rgba(0,245,155,0.6)]"
          >
            <span>Launch Live Mock Interview on MockWithSiva</span>
            <ExternalLink className="w-5 h-5" />
          </a>
          <p className="text-xs text-slate-400 mt-3">
            Direct access to the full-stack MERN & AI virtual interviewer platform.
          </p>
        </div>
      </div>
    </div>
  );
}
