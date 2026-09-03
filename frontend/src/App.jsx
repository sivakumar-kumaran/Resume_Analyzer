import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import UploadSection from './components/UploadSection';
import CandidateDashboard from './components/CandidateDashboard';
import InterviewPrep from './components/InterviewPrep';
import RAGAssistant from './components/RAGAssistant';
import AuthModal from './components/AuthModal';
import AuthScreen from './components/AuthScreen';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [analysisData, setAnalysisData] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Load saved user session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('resumeai_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load saved user session', e);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setActiveTab('home'); // Go to home page upon authentication
  };

  const handleLogout = () => {
    localStorage.removeItem('resumeai_user');
    setUser(null);
  };

  const handleUpdateProfilePic = (base64Pic) => {
    const updated = {
      ...(user || { name: 'Candidate', email: 'user@resumeai.io' }),
      profilePic: base64Pic
    };
    setUser(updated);
    localStorage.setItem('resumeai_user', JSON.stringify(updated));
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    // Switch to Dashboard to dynamically show extracted profile & analysis
    setActiveTab('dashboard');
  };

  if (isLoadingAuth) {
    return <div className="min-h-screen bg-[#050811]"></div>;
  }

  // 1. If not authenticated, display Login/Signup Page first
  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // 2. Once authenticated, display full platform application
  return (
    <div className="app-shell">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        analysisData={analysisData}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onUpdateProfilePic={handleUpdateProfilePic}
      />

      <main className="app-main">
        {/* 1. Home (Landing Page) */}
        {activeTab === 'home' && (
          <Home 
            setActiveTab={setActiveTab} 
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            user={user}
          />
        )}

        {/* 2. About (Workflow & Platform Details) */}
        {activeTab === 'about' && (
          <AboutPage setActiveTab={setActiveTab} />
        )}

        {/* 3. Analyzer (Resume Upload & Job Spec Matching) */}
        {activeTab === 'analyze' && (
          <UploadSection
            onAnalysisComplete={handleAnalysisComplete}
            setActiveTab={setActiveTab}
            user={user}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* 4. Dashboard (Dynamic Extracted Profile & Metrics) */}
        {activeTab === 'dashboard' && (
          <CandidateDashboard
            analysisData={analysisData}
            setActiveTab={setActiveTab}
            user={user}
            onUpdateProfilePic={handleUpdateProfilePic}
            onLogout={handleLogout}
          />
        )}

        {/* 5. RAG (Vector Similarity Assistant) */}
        {activeTab === 'rag' && (
          <RAGAssistant analysisData={analysisData} />
        )}

        {/* 6. Mock Interview Hub (Direct link & details for MockWithSiva) */}
        {activeTab === 'interview' && (
          <InterviewPrep interviewData={analysisData} />
        )}
      </main>

      {/* Optional In-App Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
