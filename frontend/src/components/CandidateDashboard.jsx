import React, { useRef } from 'react';
import { 
  User, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  UploadCloud, 
  ArrowRight, 
  FileText, 
  Clock, 
  Camera,
  Layers,
  BarChart3
} from 'lucide-react';

export default function CandidateDashboard({ 
  analysisData, 
  setActiveTab, 
  user, 
  onUpdateProfilePic 
}) {
  const fileInputRef = useRef(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (onUpdateProfilePic) {
        onUpdateProfilePic(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!analysisData || !analysisData.match) {
    return (
      <div className="page-wrapper py-24 text-center space-y-6 max-w-3xl mx-auto">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 shadow-2xl">
          <User className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-extrabold text-white font-outfit">No Candidate Profile Extracted Yet</h3>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Upload your resume PDF in the <strong className="span-highlight-green">Analyzer</strong> tab. Your candidate profile, extracted technical skills, experience, and score metrics will populate here dynamically.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('analyze')}
            className="btn-neon-primary !py-3.5 !px-8 text-sm font-bold shadow-[0_0_30px_rgba(0,245,155,0.4)]"
          >
            <span>Go to Resume Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const { match, resume } = analysisData;
  const breakdown = match.score_breakdown || {};
  
  // Clean Candidate Name
  const candidateName = user?.name || (match.candidate_name && match.candidate_name !== 'Candidate' && match.candidate_name !== 'dummyuser' ? match.candidate_name : 'Siva Kumar');
  const candidateInitial = candidateName.charAt(0).toUpperCase();
  const profilePic = user?.profilePic || null;

  return (
    <div className="page-wrapper space-y-10">
      
      {/* 1. Dynamic Profile Header Card (Individual Structured Sub-Components) */}
      <div className="glass-panel glass-panel-glow p-6 sm:p-8 space-y-6 border-l-4 border-l-[#00f59b] shadow-2xl">
        
        {/* Top Header Row: Identity Component & Upload New Resume Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          
          {/* Identity Component */}
          <div className="flex items-center gap-5">
            {/* Avatar with Camera Upload */}
            <div className="relative flex-shrink-0">
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt={candidateName} 
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-emerald-400 shadow-[0_0_20px_rgba(0,245,155,0.4)]"
                />
              ) : (
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#0c241e] via-[#081b16] to-[#040e0b] border-2 border-emerald-400 text-[#00f59b] font-black text-2xl sm:text-3xl flex items-center justify-center font-outfit shadow-[0_0_20px_rgba(0,245,155,0.4)]">
                  {candidateInitial}
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Change Profile Photo"
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-[#060b16] border border-white/20 text-[#00f59b] hover:scale-110 transition-all shadow-md cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleProfilePicChange}
              />
            </div>

            {/* Candidate Name */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
                {candidateName}
              </h2>
            </div>
          </div>

          {/* Upload New Resume CTA Component */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setActiveTab('analyze')}
              className="btn-neon-primary !py-2.5 !px-5 text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,155,0.35)]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Resume</span>
            </button>
          </div>
        </div>

        {/* Bottom Grid: 3 Individual Details Components Inside Same Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Individual Component 1: Target Role */}
          <div className="bg-[#050a14]/80 border border-white/10 rounded-2xl p-4 space-y-1.5 shadow-md">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Target Role Specification</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug truncate" title={match.job_title}>
              {match.job_title}
            </p>
          </div>

          {/* Individual Component 2: Attached Resume Document */}
          <div className="bg-[#050a14]/80 border border-white/10 rounded-2xl p-4 space-y-1.5 shadow-md">
            <div className="flex items-center gap-2 text-[#00f59b] text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Attached Resume File</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug truncate" title={resume?.filename || 'Resume.pdf'}>
              {resume?.filename || 'Uploaded_Resume.pdf'} <span className="text-xs font-normal text-slate-400">({resume?.page_count || 1} Page)</span>
            </p>
          </div>

          {/* Individual Component 3: Data Parsing & Characters */}
          <div className="bg-[#050a14]/80 border border-white/10 rounded-2xl p-4 space-y-1.5 shadow-md">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ingested Data Size</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {resume?.text_length?.toLocaleString() || '4,319'} <span className="text-xs font-normal text-slate-400">Characters Structured</span>
            </p>
          </div>

        </div>

      </div>

      {/* 2. Deterministic Score Overview (Matching Reference Image Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Overall ATS Fit Card */}
        <div className="glass-panel p-6 space-y-4 shadow-xl border-t-2 border-t-[#00f59b] rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-bold tracking-wide">Overall ATS Fit</span>
            <span className="text-2xl font-black text-[#00f59b] font-outfit">
              {match.overall_match_score}%
            </span>
          </div>

          {/* Reference Image Style Progress Bar */}
          <div className="w-full h-2.5 bg-[#0e172a] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#00b06f] via-[#00f59b] to-[#6effce] transition-all duration-1000 shadow-[0_0_14px_rgba(0,245,155,0.75)]"
              style={{ width: `${Math.max(match.overall_match_score, 4)}%` }}
            ></div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="glass-panel p-6 space-y-4 shadow-xl border-t-2 border-t-[#38bdf8] rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-bold tracking-wide">Technical Skills</span>
            <span className="text-2xl font-black text-cyan-400 font-outfit">
              {breakdown.technical_skills || 0}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#0e172a] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#93c5fd] transition-all duration-1000 shadow-[0_0_14px_rgba(56,189,248,0.75)]"
              style={{ width: `${Math.max(breakdown.technical_skills || 0, 4)}%` }}
            ></div>
          </div>
        </div>

        {/* Experience Fit */}
        <div className="glass-panel p-6 space-y-4 shadow-xl border-t-2 border-t-[#c084fc] rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-bold tracking-wide">Experience Fit</span>
            <span className="text-2xl font-black text-purple-400 font-outfit">
              {breakdown.experience || 0}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#0e172a] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#c084fc] to-[#e879f9] transition-all duration-1000 shadow-[0_0_14px_rgba(192,132,252,0.75)]"
              style={{ width: `${Math.max(breakdown.experience || 0, 4)}%` }}
            ></div>
          </div>
        </div>

        {/* Projects & Architecture */}
        <div className="glass-panel p-6 space-y-4 shadow-xl border-t-2 border-t-[#fbbf24] rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-bold tracking-wide">Projects & Arch</span>
            <span className="text-2xl font-black text-amber-400 font-outfit">
              {breakdown.projects || 0}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#0e172a] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#fde68a] transition-all duration-1000 shadow-[0_0_14px_rgba(251,191,36,0.75)]"
              style={{ width: `${Math.max(breakdown.projects || 0, 4)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Extracted Skills & Identified Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Matched Technical Skills & Strengths */}
        <div className="space-y-8">
          {/* Matched Skills */}
          <div className="glass-panel p-8 space-y-5 shadow-2xl">
            <h3 className="font-bold text-xl text-white flex items-center gap-2.5 font-outfit">
              <CheckCircle2 className="w-5 h-5 text-[#00f59b]" />
              Matched Canonical Skills ({match.keyword_matched_skills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {match.keyword_matched_skills?.map((skill, idx) => (
                <span key={idx} className="badge badge-matched">
                  {skill}
                </span>
              ))}
            </div>

            {match.semantic_matched_skills?.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <span className="text-xs font-semibold text-slate-400 block">
                  Semantic & Vector Associated Skills:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {match.semantic_matched_skills.map((skill, idx) => (
                    <span key={idx} className="badge badge-semantic">
                      ⚡ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Strengths */}
          <div className="glass-panel p-8 space-y-4 shadow-2xl">
            <h3 className="font-bold text-xl text-white flex items-center gap-2.5 font-outfit">
              <Award className="w-5 h-5 text-[#38bdf8]" />
              Profile Strengths & Highlights
            </h3>
            <ul className="space-y-3 text-xs md:text-sm text-slate-300">
              {match.strengths?.map((str, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-[#050811]/70 p-4 rounded-2xl border border-white/5 shadow-md">
                  <span className="text-[#00f59b] font-bold text-base leading-none">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Skill Gaps & Recommended Simulation */}
        <div className="space-y-8">
          {/* Missing Skills */}
          <div className="glass-panel p-8 space-y-5 shadow-2xl">
            <h3 className="font-bold text-xl text-white flex items-center gap-2.5 font-outfit">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Identified Skill Gaps ({match.missing_skills?.length || 0})
            </h3>
            <p className="text-xs md:text-sm text-slate-400">
              These target requirements were not detected in the current resume version:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {match.missing_skills?.map((skill, idx) => (
                <span key={idx} className="badge badge-missing">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Mock Interview Bridge Card */}
          <div className="glass-panel p-8 space-y-5 bg-gradient-to-br from-[#091814] to-[#040810] border-emerald-500/30 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#00f59b]" />
              <h3 className="font-bold text-xl text-white font-outfit">Recommended Next Step</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Test your ability to answer real-time questions regarding these skills in an interactive session with the AI Virtual Interviewer on <strong className="span-highlight-green">MockWithSiva</strong>.
            </p>
            <a
              href="https://mockwithsiva.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-primary !py-3.5 !px-8 text-xs md:text-sm w-full justify-center shadow-lg"
            >
              <span>Take Live Mock Interview on MockWithSiva</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
