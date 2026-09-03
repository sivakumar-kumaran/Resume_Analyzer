import React, { useState, useRef } from 'react';
import { 
  Home, 
  Info, 
  FileText, 
  LayoutDashboard, 
  MessageSquareCode, 
  Sun, 
  Moon, 
  Maximize, 
  Minimize, 
  LogIn, 
  LogOut, 
  User, 
  Camera, 
  Upload 
} from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  analysisData, 
  user, 
  onOpenAuthModal, 
  onLogout,
  onUpdateProfilePic 
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const fileInputRef = useRef(null);

  // Dynamic user name and profile picture priority
  const currentUserName = user?.name || analysisData?.match?.candidate_name || 'dummyuser';
  const candidateInitial = currentUserName.charAt(0).toUpperCase();
  const profilePic = user?.profilePic || null;

  const toggleTheme = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    if (nextMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      if (onUpdateProfilePic) {
        onUpdateProfilePic(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { id: 'analyze', label: 'Analyzer', icon: <FileText className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'rag', label: 'RAG', icon: <MessageSquareCode className="w-4 h-4" /> },
  ];

  return (
    <header className="solid-navbar w-full sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 md:gap-6">
        
        {/* Left: Brand Logo & Website Name */}
        <div 
          className="cursor-pointer flex items-center gap-2.5 select-none flex-shrink-0" 
          onClick={() => setActiveTab('home')}
        >
          <Logo size="sm" showBadge={false} />
        </div>

        {/* Center: Navigation Pages with Explicit Green Underline & Green Text on Active */}
        <nav className="flex items-center gap-1 sm:gap-2 h-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'nav-item-active !text-[#00f59b] !bg-emerald-500/10 border-b-2 !border-b-[#00f59b] shadow-[0_4px_15px_rgba(0,245,155,0.35)]'
                    : '!bg-transparent !text-slate-400 hover:!text-slate-100 hover:!bg-white/5 border-b-2 border-b-transparent'
                }`}
              >
                <span className={isActive ? '!text-[#00f59b]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className={isActive ? '!text-[#00f59b]' : 'text-slate-300'}>
                  {item.label}
                </span>

                {/* Pulsating green dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f59b] shadow-[0_0_8px_#00f59b] animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Toggle, Fullscreen, User Profile Chip */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Theme Toggle Button */}
          <button 
            type="button"
            onClick={toggleTheme}
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className="p-2 rounded-xl !bg-transparent text-amber-400 hover:!bg-white/10 transition-colors cursor-pointer"
          >
            {isLightMode ? <Moon className="w-4 h-4 text-cyan-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Fullscreen Expand Icon */}
          <button 
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
            className="p-2 rounded-xl !bg-transparent text-slate-400 hover:!text-white hover:!bg-white/10 transition-colors cursor-pointer hidden sm:flex"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* User Profile Box Button (Logo Box + Username) */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-[#080f1e] border border-white/15 hover:border-[#00f59b]/60 hover:shadow-[0_0_15px_rgba(0,245,155,0.25)] transition-all cursor-pointer select-none shadow-md group"
            >
              {/* User First Letter Logo Box Matching Website Logo Box */}
              <div className="relative w-8 h-8 rounded-lg bg-[#0c1a16] border border-[#00f59b]/40 flex items-center justify-center text-[#00f59b] font-black text-sm shadow-[0_0_10px_rgba(0,245,155,0.3)] flex-shrink-0 font-outfit">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt={currentUserName} 
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <span>{candidateInitial}</span>
                )}
              </div>

              {/* Username text after the first letter logo */}
              <span className="text-xs sm:text-sm font-bold text-white max-w-[90px] sm:max-w-[130px] truncate group-hover:text-[#00f59b] transition-colors">
                {currentUserName}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 glass-panel p-3 space-y-2 shadow-2xl border border-white/15 bg-[#090f1e] z-50 rounded-2xl animate-fadeIn">
                <div className="px-3 py-2 border-b border-white/10 flex items-center gap-3">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt={currentUserName} 
                      className="w-10 h-10 rounded-full object-cover border border-emerald-400 shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 text-[#050811] font-black text-sm flex items-center justify-center shadow-md flex-shrink-0">
                      {candidateInitial}
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{currentUserName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Guest Candidate'}</p>
                  </div>
                </div>

                {/* Upload Profile Pic Option */}
                <div className="px-2 pt-1">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProfilePicUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#00f59b] hover:!bg-emerald-500/10 rounded-xl transition-all text-left !bg-transparent border border-emerald-500/30"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Profile Photo</span>
                  </button>
                </div>

                {/* Dashboard Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('dashboard');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:!bg-white/5 rounded-xl transition-all text-left !bg-transparent"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  View Dashboard Profile
                </button>

                {/* Auth Controls (Sign In or Log Out) */}
                <div className="pt-2 border-t border-white/10">
                  {!user ? (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuthModal();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#00f59b] hover:!bg-emerald-500/10 rounded-xl transition-all text-left !bg-transparent"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In / Sign Up
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:!bg-rose-500/15 rounded-xl transition-all text-left !bg-transparent border border-rose-500/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
