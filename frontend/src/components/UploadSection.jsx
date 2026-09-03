import React, { useState } from 'react';
import { UploadCloud, FileCheck, Briefcase, ArrowRight, Loader2, Sparkles, ExternalLink, ShieldCheck, Zap, FileText, Lock } from 'lucide-react';
import { uploadResume, evaluateMatch, generateInterviewQuestions } from '../services/api';

export default function UploadSection({ onAnalysisComplete, setActiveTab, user, onOpenAuthModal }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedResumeInfo, setUploadedResumeInfo] = useState(null);
  const [jdFileName, setJdFileName] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.pdf')) {
      setError('Please select a valid PDF resume (.pdf)');
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleJdFileChange = async (e) => {
    const droppedFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!droppedFile) return;

    setJdFileName(droppedFile.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setJobDescription(event.target.result);
    };
    reader.readAsText(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!file) {
      setError('Please upload a PDF resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please upload or paste a target job description.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Upload Resume PDF & Extract text
      const resumeRes = await uploadResume(file);
      setUploadedResumeInfo(resumeRes);

      // 2. Perform Match Evaluation
      const matchRes = await evaluateMatch(resumeRes.extracted_text, jobDescription);

      // 3. Generate Interview Prep / Context
      const interviewRes = await generateInterviewQuestions(
        resumeRes.extracted_text,
        jobDescription,
        matchRes.missing_skills
      );

      // 4. Pass results to parent App state
      onAnalysisComplete({
        resume: resumeRes,
        jobDescription,
        match: matchRes,
        interview: interviewRes,
      });

      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Analysis failed. Please ensure FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper space-y-12">
      {/* Top Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto pt-2">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-outfit text-white tracking-tight leading-tight drop-shadow-md">
          <span className="gradient-text drop-shadow-[0_0_30px_rgba(0,245,155,0.4)]">Resume</span> & <span className="gradient-text-mint drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]">Job Spec Analyzer</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Upload your <span className="span-highlight-green">resume PDF</span> and enter the <span className="span-highlight-cyan">target job description</span> to compute <span className="text-white font-bold">instant ATS match scoring</span>, <span className="span-highlight-purple">semantic skill gap identification</span>, and <span className="span-highlight-green">personalized candidate metrics</span>.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-lg">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Upload Inputs Grid (Symmetrical Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Resume PDF Upload Card */}
        <div className="glass-panel p-8 space-y-6 flex flex-col justify-between shadow-2xl border-t-2 border-t-[#00f59b]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00f59b]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xl text-white font-outfit">1. Resume PDF Upload</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mb-2">
              Upload candidate PDF resume (up to 5MB) for deterministic NLP parsing.
            </p>

            <label className="border-2 border-dashed border-white/15 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#00f59b]/70 hover:bg-slate-900/40 transition-all group bg-[#060a14]/60 shadow-inner min-h-[160px]">
              <UploadCloud className="w-12 h-12 text-slate-600 group-hover:text-[#00f59b] group-hover:scale-110 transition-all mb-3" />
              <span className="text-sm sm:text-base font-semibold text-slate-200 text-center">
                {file ? file.name : 'Click to select PDF or drag & drop'}
              </span>
              <span className="text-xs text-slate-500 mt-1.5">PDF format (up to 5MB)</span>
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {uploadedResumeInfo && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between text-xs md:text-sm text-[#00f59b] shadow-md">
              <span className="flex items-center gap-2 font-bold">
                <FileCheck className="w-5 h-5" /> Extracted {uploadedResumeInfo.text_length} characters
              </span>
              <span className="code-font font-bold">{uploadedResumeInfo.page_count} Page(s)</span>
            </div>
          )}
        </div>

        {/* 2. Target Job Description Card (Drag & Drop or Direct Paste) */}
        <div className="glass-panel p-8 space-y-6 flex flex-col justify-between shadow-2xl border-t-2 border-t-[#38bdf8]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#38bdf8]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-white font-outfit">2. Target Job Description</h3>
              </div>

              {jdFileName && (
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  {jdFileName}
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-400 mb-2">
              Drag & drop a JD file or paste target position requirements below.
            </p>

            {/* Drag & Drop Box for JD */}
            <label 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleJdFileChange}
              className="border-2 border-dashed border-white/15 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400/70 hover:bg-slate-900/40 transition-all group bg-[#060a14]/60 shadow-inner"
            >
              <FileText className="w-8 h-8 text-slate-600 group-hover:text-cyan-400 group-hover:scale-110 transition-all mb-2" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200 text-center">
                {jdFileName ? `Loaded: ${jdFileName}` : 'Drag & drop JD file (.txt, .pdf, .doc) or click to browse'}
              </span>
              <input type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleJdFileChange} />
            </label>

            {/* Direct Paste Area */}
            <div className="space-y-1.5">
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Or paste target Job Description requirements text directly here..."
                className="w-full bg-[#060a14] border border-white/15 rounded-2xl p-4 text-xs md:text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-400 transition-all resize-none shadow-inner leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-neon-primary !py-4 !px-12 text-base font-bold shadow-[0_0_35px_rgba(0,245,155,0.55)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Resume & Computing Match...</span>
            </>
          ) : (
            <>
              <span>{user ? 'Run Intelligence Analysis' : 'Sign In to Run Analysis'}</span>
              {user ? <ArrowRight className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
