import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Target, Layers, FileSearch, ExternalLink, ArrowRight, Bot } from 'lucide-react';

export default function AnalysisDashboard({ analysisData }) {
  if (!analysisData || !analysisData.match) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <FileSearch className="w-16 h-16 text-slate-600 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Analysis Data Available</h3>
        <p className="text-slate-400 text-sm">Please upload a resume PDF and job description to view the dashboard.</p>
      </div>
    );
  }

  const { match } = analysisData;
  const breakdown = match.score_breakdown || {};

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8">
      {/* Overview Banner */}
      <div className="glass-panel glass-panel-glow p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-[#00f59b]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[#00f59b] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Match Report
          </div>
          <h2 className="text-3xl font-extrabold text-white">{match.candidate_name}</h2>
          <p className="text-sm text-slate-400">
            Evaluated against target position: <span className="text-white font-semibold">{match.job_title}</span>
          </p>
        </div>

        {/* Overall Match Circle with Neon Glowing Ring */}
        <div className="flex items-center gap-6 bg-[#040811]/80 p-6 rounded-2xl border border-white/10 shadow-inner">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00f59b]"
                strokeDasharray={`${match.overall_match_score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white">{match.overall_match_score}%</span>
              <span className="text-[10px] text-[#00f59b] uppercase font-semibold">Match</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400">Deterministic Score</span>
            <p className="text-lg font-bold text-[#00f59b]">
              {match.overall_match_score >= 85 ? 'Strong Fit 🚀' : match.overall_match_score >= 70 ? 'Moderate Fit 🎯' : 'Needs Optimization ⚠️'}
            </p>
            <p className="text-xs text-slate-400">Weighted evaluation across 5 metrics</p>
          </div>
        </div>
      </div>

      {/* CTA Banner to MockWithSiva */}
      <div className="glass-panel p-6 bg-gradient-to-r from-[#091814] via-[#0b201b] to-[#091814] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[#00f59b] flex-shrink-0 shadow-[0_0_20px_rgba(0,245,155,0.3)]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Bridge Candidate Gaps with Live AI Mock Interview</h4>
            <p className="text-xs text-slate-300">
              Practice real-time technical questions & answer recording with instant feedback on <strong>MockWithSiva</strong>.
            </p>
          </div>
        </div>

        <a
          href="https://mockwithsiva.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon-primary !py-2.5 !px-6 !text-xs whitespace-nowrap"
        >
          <span>Take Mock Interview Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Measurable Component Score Breakdown Grid */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00f59b]" />
          Measurable Score Components (Weighted Engine)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-[#050811]/90 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs text-slate-400 font-semibold">Technical Skills (40%)</span>
            <div className="text-2xl font-bold text-[#00f59b]">{breakdown.technical_skills || 0}%</div>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-emerald-400" style={{ width: `${breakdown.technical_skills || 0}%` }}></div></div>
          </div>

          <div className="bg-[#050811]/90 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs text-slate-400 font-semibold">Experience (20%)</span>
            <div className="text-2xl font-bold text-[#38bdf8]">{breakdown.experience || 0}%</div>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-cyan-400" style={{ width: `${breakdown.experience || 0}%` }}></div></div>
          </div>

          <div className="bg-[#050811]/90 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs text-slate-400 font-semibold">Projects (20%)</span>
            <div className="text-2xl font-bold text-[#c084fc]">{breakdown.projects || 0}%</div>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-purple-400" style={{ width: `${breakdown.projects || 0}%` }}></div></div>
          </div>

          <div className="bg-[#050811]/90 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs text-slate-400 font-semibold">Education (10%)</span>
            <div className="text-2xl font-bold text-[#00f59b]">{breakdown.education || 0}%</div>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-emerald-400" style={{ width: `${breakdown.education || 0}%` }}></div></div>
          </div>

          <div className="bg-[#050811]/90 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs text-slate-400 font-semibold">Certs & Soft Skills (10%)</span>
            <div className="text-2xl font-bold text-[#fbbf24]">{breakdown.other_requirements || 0}%</div>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-amber-400" style={{ width: `${breakdown.other_requirements || 0}%` }}></div></div>
          </div>
        </div>
      </div>

      {/* Skill Breakdown Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2 text-[#00f59b]">
            <CheckCircle2 className="w-5 h-5" />
            Matched Skills ({match.keyword_matched_skills.length + match.semantic_matched_skills.length})
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Approach A — Exact Keyword Match:</span>
              <div className="flex flex-wrap gap-2">
                {match.keyword_matched_skills.map((skill, i) => (
                  <span key={i} className="badge badge-matched">{skill}</span>
                ))}
              </div>
            </div>

            {match.semantic_matched_skills.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">Approach B — Vector Semantic Similarity Match:</span>
                <div className="flex flex-wrap gap-2">
                  {match.semantic_matched_skills.map((skill, i) => (
                    <span key={i} className="badge badge-semantic">⚡ {skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            Missing Skills ({match.missing_skills.length})
          </h3>

          <div className="flex flex-wrap gap-2">
            {match.missing_skills.map((skill, i) => (
              <span key={i} className="badge badge-missing">{skill}</span>
            ))}
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-white/5">
            Tip: Practice and answer interview questions regarding these topics on <a href="https://mockwithsiva.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#00f59b] underline font-semibold">mockwithsiva.vercel.app</a>.
          </p>
        </div>
      </div>

      {/* Strengths & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-3">
          <h4 className="font-bold text-slate-200 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00f59b]" /> Resume Strengths
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {match.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 bg-[#050811]/60 p-2.5 rounded-xl border border-white/5">
                <span className="text-[#00f59b] font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <h4 className="font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#38bdf8]" /> ATS Suggestions & Recommendations
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {match.ats_suggestions.map((sug, i) => (
              <li key={i} className="flex items-start gap-2 bg-[#050811]/60 p-2.5 rounded-xl border border-white/5">
                <span className="text-[#38bdf8] font-bold">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
