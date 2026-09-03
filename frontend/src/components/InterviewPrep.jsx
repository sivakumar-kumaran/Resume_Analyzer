import React from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Bot, 
  Mic, 
  CheckCircle2, 
  BrainCircuit, 
  Database, 
  Layers, 
  GitBranch, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

export default function InterviewPrep({ interviewData }) {
  const candidateName = interviewData?.match?.candidate_name || 'Candidate';
  const targetRole = interviewData?.match?.job_title || 'Target Technical Role';
  const missingSkills = interviewData?.match?.missing_skills || [];
  const matchedSkillsCount = (interviewData?.match?.keyword_matched_skills?.length || 0) + 
                             (interviewData?.match?.semantic_matched_skills?.length || 0);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      {/* Top Pill & Hero Headline (MailOrbit Reference Aesthetic) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="hero-pill-badge mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen AI Virtual Interview Simulator</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold font-outfit tracking-tight">
          Master Real-Time Interviews with <br />
          <span className="gradient-text">MockWithSiva Platform</span>
        </h2>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Level up from static question sheets to full AI-driven interactive simulations. Replicate real-world engineering interviews with instant feedback and adaptive questioning.
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://mockwithsiva.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-primary !py-3.5 !px-8 text-base shadow-[0_0_30px_rgba(0,245,155,0.5)]"
          >
            <span>Launch Live Mock Interview</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="https://mockwithsiva.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-secondary !py-3.5 !px-8 text-base"
          >
            <span>Visit mockwithsiva.vercel.app</span>
            <ExternalLink className="w-4 h-4 text-[#00f59b]" />
          </a>
        </div>
      </div>

      {/* Candidate Customized Prep Banner */}
      {interviewData && (
        <div className="glass-panel glass-panel-glow p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-[#00f59b]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[#00f59b] text-xs font-semibold">
              <Target className="w-3.5 h-3.5" /> Tailored For {candidateName}
            </div>
            <h3 className="text-xl font-bold text-white">Target Position: {targetRole}</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Based on your resume analysis, we recommend focusing on your identified skill gaps during your live practice session.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {missingSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-w-md md:justify-end">
                <span className="text-[11px] text-slate-400 font-semibold mr-1 self-center">Focus Skills:</span>
                {missingSkills.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="badge badge-missing !text-[11px] !py-0.5">
                    {skill}
                  </span>
                ))}
                {missingSkills.length > 5 && (
                  <span className="badge badge-missing !text-[11px] !py-0.5">
                    +{missingSkills.length - 5} more
                  </span>
                )}
              </div>
            )}
            <a
              href="https://mockwithsiva.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#00f59b] hover:underline flex items-center gap-1.5"
            >
              Start Live Interview with these focus areas <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Detailed Platform Architecture & Capabilities */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white font-outfit">Platform Architecture & Capabilities</h3>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive full-stack MERN & AI engineering behind MockWithSiva
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-[#00f59b]">
            mockwithsiva.vercel.app
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Virtual Interviewer */}
          <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00f59b] shadow-[0_0_15px_rgba(0,245,155,0.2)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Engineered Virtual Interviewer</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Replicates real-world interview scenarios through AI-driven conversations, enabling candidates to practice in high-pressure technical environments and receive instant evaluation feedback.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00f59b] flex-shrink-0" />
                <span>Simulated hiring manager & technical lead conversational prompts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00f59b] flex-shrink-0" />
                <span>Zero-latency conversational flow with dynamic persona adjustments</span>
              </li>
            </ul>
          </div>

          {/* Card 2: AI Auto-Evaluation & NLP */}
          <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#38bdf8] shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">AI Auto-Evaluation & NLP Engine</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Integrated an AI module that auto-evaluates answers in depth and is extended with Natural Language Processing (NLP) to adapt interview questions dynamically based on previous responses.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#38bdf8] flex-shrink-0" />
                <span>Dynamic difficulty scaling and intelligent drill-down questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#38bdf8] flex-shrink-0" />
                <span>Objective metric scoring across clarity, correctness, and architecture</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Real-Time Answer Recording */}
          <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Real-Time Answer Recording & Review</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Features real-time speech and video answer recording paired with synchronized performance analytics, speech clarity diagnostics, and structured review breakdowns.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c084fc] flex-shrink-0" />
                <span>Audio stream capture & automatic semantic speech-to-text review</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c084fc] flex-shrink-0" />
                <span>Instant playback and line-by-line constructive suggestions</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Full-Stack MERN Architecture */}
          <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Full-Stack MERN & REST Architecture</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Built with MongoDB, Express.js, React.js, and Node.js using robust REST APIs and Git/GitHub for version control, ensuring seamless high-concurrency simulation delivery.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                <span>MERN Stack (MongoDB, Express.js, React.js, Node.js)</span>
              </li>
              <li className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                <span>REST APIs & Git/GitHub version control with scalable cloud deployment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="glass-panel p-8 md:p-12 text-center space-y-6 bg-gradient-to-b from-[#091512] to-[#050811] border border-emerald-500/30 shadow-[0_0_50px_rgba(0,245,155,0.15)] rounded-3xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[#00f59b] shadow-[0_0_25px_rgba(0,245,155,0.35)]">
          <Bot className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">
            Ready to Experience the Virtual Interviewer?
          </h3>
          <p className="text-slate-300 text-sm">
            Launch MockWithSiva now to conduct a full interactive session with real-time answer recording and AI evaluation feedback.
          </p>
        </div>

        <div>
          <a
            href="https://mockwithsiva.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-primary !py-4 !px-10 text-base font-bold shadow-[0_0_35px_rgba(0,245,155,0.6)]"
          >
            <span>Launch Mock Interview on MockWithSiva</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
