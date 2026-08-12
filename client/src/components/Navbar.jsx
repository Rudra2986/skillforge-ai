import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCareer } from '../context/CareerContext';
import SkillForgeLogo from './SkillForgeLogo';
import { Compass, User, LogIn, LogOut, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Navbar({ onOpenAuthModal }) {
  const { user, isGuest, activePersonaKey, loginAsDemo, logout, isBackendLive } = useAuth();
  const { careerData, hasGeneratedRoadmap } = useCareer();

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas-subtle/90 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity & Active Goal */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            type="button"
            onClick={logout}
            className="flex items-center space-x-3 text-left group hover:opacity-95 interactive-transition cursor-pointer border-0 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 active:outline-none select-none bg-transparent p-0 shadow-none"
            title="Return to Landing Page"
          >
            <SkillForgeLogo className="w-8 h-8 group-hover:scale-105 interactive-transition" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-100 tracking-tight flex items-center gap-1.5 group-hover:text-white">
                SkillForge AI
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-accent/15 text-accent-text border border-accent/25">v1.0</span>
              </span>
              <span className="text-[11px] font-mono text-neutral-400 group-hover:text-neutral-300">Career &amp; Learning Navigator</span>
            </div>
          </button>

          {/* Active Target Role Badge (Only shown when signed in & roadmap is generated) */}
          {user && hasGeneratedRoadmap && careerData?.target_role && (
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded bg-canvas-surface border border-border text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-400">Target Role:</span>
              <span className="font-medium text-neutral-200">{careerData.target_role}</span>
            </div>
          )}
        </div>

        {/* Right: Judge Mode Switcher & User Auth State */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Demo Switcher for Evaluation / Exploring */}
          <div className="hidden md:flex items-center space-x-1.5 bg-canvas-surface border border-border rounded p-1 text-xs">
            <span className="text-neutral-400 px-1.5 font-mono text-[10px] uppercase tracking-wider flex items-center">
              <Zap className="w-2.5 h-2.5 mr-1 text-amber-400" />
              Explore:
            </span>
            <button
              type="button"
              onClick={() => loginAsDemo('fullstack')}
              className={`px-2.5 py-1 rounded font-medium interactive-transition text-xs ${
                activePersonaKey === 'fullstack' && isGuest
                  ? 'bg-accent text-white'
                  : 'text-neutral-300 hover:text-white hover:bg-canvas-elevated'
              }`}
            >
              Alex (Full-Stack)
            </button>
            <button
              type="button"
              onClick={() => loginAsDemo('datascience')}
              className={`px-2.5 py-1 rounded font-medium interactive-transition text-xs ${
                activePersonaKey === 'datascience' && isGuest
                  ? 'bg-accent text-white'
                  : 'text-neutral-300 hover:text-white hover:bg-canvas-elevated'
              }`}
            >
              Priya (Data Science)
            </button>
          </div>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-2.5 pl-2 border-l border-border-subtle">
              <button
                type="button"
                onClick={onOpenAuthModal}
                title="Click to view account / sign in"
                className="flex items-center space-x-2 bg-canvas-surface hover:bg-canvas-elevated border border-border hover:border-border-strong px-2.5 py-1 rounded text-xs interactive-transition text-left"
              >
                <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] font-bold text-accent-text">
                  {(user.name || user.email || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-neutral-200 max-w-[120px] sm:max-w-[160px] truncate">
                  {user.user_metadata?.full_name || user.name || user.email}
                </span>
                {isGuest ? (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60 uppercase">
                    Guest
                  </span>
                ) : (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 uppercase flex items-center">
                    <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                    Auth
                  </span>
                )}
              </button>

              {/* Exit / Logout Button */}
              <button
                type="button"
                onClick={logout}
                title={isGuest ? "Exit Guest Demo" : "Sign Out"}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-canvas-surface rounded border border-transparent hover:border-border interactive-transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium bg-accent hover:bg-accent-hover text-white rounded-md interactive-transition shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
