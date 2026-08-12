import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCareer } from '../context/CareerContext';
import { 
  Compass, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Target, 
  Layers, 
  Menu, 
  X, 
  TrendingUp, 
  Award, 
  Code2, 
  MessageSquareCode,
  Settings,
  Bell
} from 'lucide-react';

export default function Sidebar({ onOpenAuthModal, activeView = 'dashboard', setActiveView }) {
  const { user, isGuest, activePersonaKey, loginAsDemo, logout } = useAuth();
  const { careerData } = useCareer();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const coreNavItems = [
    { id: 'dashboard', label: 'Dashboard & Roadmap', icon: Layers },
    { id: 'scanner', label: 'Resume AI Scanner', icon: FileText, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' },
    { id: 'skills', label: 'Skill Gap Matrix', icon: Target, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' },
  ];

  const upcomingNavItems = [
    { id: 'readiness', label: 'Readiness Gauge', icon: TrendingUp, badge: 'Step 4', badgeColor: 'bg-white/15 text-[#E5D2E8] border border-white/20' },
    { id: 'interview', label: 'Mock Interview Hub', icon: MessageSquareCode, badge: 'Soon', badgeColor: 'bg-amber-300/20 text-amber-200 border border-amber-300/30' },
    { id: 'projects', label: 'Project Blueprints', icon: Code2, badge: 'Soon', badgeColor: 'bg-amber-300/20 text-amber-200 border border-amber-300/30' },
    { id: 'certifications', label: 'Certifications', icon: Award, badge: 'Soon', badgeColor: 'bg-amber-300/20 text-amber-200 border border-amber-300/30' },
  ];

  const handleNavClick = (viewId) => {
    if (setActiveView) setActiveView(viewId);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full p-4 overflow-hidden bg-[#4D2C4E] text-[#D5BED7] select-none">
      
      {/* 1. TOP BRAND HEADER */}
      <div className="shrink-0 space-y-4 pb-3 border-b border-white/10">
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className="w-full flex items-center space-x-3 px-1 pt-1 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:bg-white/25 interactive-transition">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
              <span>SkillForge</span>
            </span>
            <span className="text-[11px] font-sans text-[#D5BED7] truncate">
              Career & Skill Navigator
            </span>
          </div>
        </button>

        {/* Active Target Goal Pill (When signed in or demo previewing) */}
        {user && careerData?.target_role && (
          <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#D5BED7] flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse"></span>
              <span>Active Target Goal</span>
            </div>
            <div className="text-xs font-semibold text-white truncate">
              {careerData.target_role}
            </div>
            <div className="text-[10px] font-mono text-[#E5D2E8] flex items-center justify-between pt-0.5">
              <span>Readiness:</span>
              <span className="font-bold text-white bg-white/20 px-1.5 py-0.2 rounded">{careerData.readiness_score || 64}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. MIDDLE SCROLLABLE: Navigation & Sample Hub */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-3 -mr-1">
        
        {/* Core Navigation Items */}
        <nav className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#D5BED7]/70 px-2 pb-1">
            Navigation
          </div>
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs interactive-transition relative overflow-hidden ${
                  isActive
                    ? 'bg-[#633A64] text-white shadow-sm font-semibold before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#0D9488]'
                    : 'text-[#D5BED7] hover:text-white hover:bg-[#5A335C]'
                }`}
              >
                <div className="flex items-center space-x-2.5 pl-0.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D5BED7]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Modules in Pipeline (Teammates) */}
        <nav className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#D5BED7]/70 px-2 pb-1 pt-1 flex items-center justify-between">
            <span>Modules in Pipeline</span>
          </div>
          {upcomingNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium interactive-transition relative overflow-hidden ${
                  isActive
                    ? 'bg-[#633A64] text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#0D9488]'
                    : 'text-[#D5BED7]/80 hover:text-white hover:bg-[#5A335C]'
                }`}
              >
                <div className="flex items-center space-x-2.5 pl-0.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#D5BED7]'}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* 1-Click Sample Switcher (Explore Hub) */}
        <div className="p-3 rounded-lg bg-black/20 border border-white/10 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#D5BED7] flex items-center justify-between">
            <span className="flex items-center font-semibold">
              <Zap className="w-3 h-3 mr-1 text-amber-300" />
              Explore Samples
            </span>
            <span className="text-[9px] text-[#D5BED7]/80">1-Click</span>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                loginAsDemo('fullstack');
                handleNavClick('dashboard');
              }}
              className={`w-full px-2.5 py-1.5 rounded text-left text-xs interactive-transition flex items-center justify-between ${
                activePersonaKey === 'fullstack' && isGuest
                  ? 'bg-white/25 text-white font-semibold border border-white/30'
                  : 'hover:bg-white/10 text-[#D5BED7]'
              }`}
            >
              <div className="truncate">Alex (Full-Stack)</div>
              <span className="font-mono text-[10px] text-white bg-white/20 px-1 rounded font-bold">64%</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemo('datascience');
                handleNavClick('dashboard');
              }}
              className={`w-full px-2.5 py-1.5 rounded text-left text-xs interactive-transition flex items-center justify-between ${
                activePersonaKey === 'datascience' && isGuest
                  ? 'bg-white/25 text-white font-semibold border border-white/30'
                  : 'hover:bg-white/10 text-[#D5BED7]'
              }`}
            >
              <div className="truncate">Priya (AI/ML)</div>
              <span className="font-mono text-[10px] text-emerald-200 bg-emerald-900/40 px-1 rounded font-bold">72%</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM PINNED: User Session & Logout (Matching Reference Images exactly) */}
      <div className="shrink-0 pt-3 border-t border-white/15 space-y-1.5">
        
        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-xs text-[#D5BED7] hover:text-white hover:bg-white/10 interactive-transition"
        >
          <Settings className="w-4 h-4 text-[#D5BED7]" />
          <span>Account Settings</span>
        </button>

        {/* Logout Button */}
        {user ? (
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-xs text-[#D5BED7] hover:text-rose-200 hover:bg-white/10 interactive-transition"
          >
            <LogOut className="w-4 h-4 text-[#D5BED7]" />
            <span>Sign Out</span>
          </button>
        ) : null}

        {/* User Card */}
        {user ? (
          <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-black/25 border border-white/15 mt-2">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/35 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {(user.name || user.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">
                {user.user_metadata?.full_name || user.name || user.email}
              </span>
              <span className="text-[10px] font-mono text-[#D5BED7] truncate">
                {isGuest ? 'Guest Preview' : (user.user_metadata?.target_role || 'Verified Student')}
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-full py-2.5 px-3 bg-white hover:bg-white/90 text-[#4D2C4E] text-xs font-bold rounded-lg interactive-transition shadow-sm flex items-center justify-center space-x-2 mt-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Create Account</span>
          </button>
        )}

      </div>

    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#4D2C4E] border-r border-[#3C203E] flex-col min-h-screen shrink-0 sticky top-0 h-screen z-30 shadow-md">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Top Navigation Bar with Toggle */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-[#4D2C4E] border-b border-[#3C203E] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-white">SkillForge AI</span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-[#D5BED7] hover:text-white rounded-lg bg-white/10 border border-white/20"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {/* 3. Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        >
          <div 
            className="w-72 bg-[#4D2C4E] border-r border-[#3C203E] h-full max-w-[85vw] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
