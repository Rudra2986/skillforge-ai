import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCareer } from '../context/CareerContext';
import { Compass, User, LogIn, LogOut, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onOpenAuthModal }) {
  const { user, isGuest, activePersonaKey, loginAsDemo, logout } = useAuth();
  const { careerData } = useCareer();

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas-subtle border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity & Active Goal */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-canvas-surface border border-border flex items-center justify-center text-accent-text">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-100 tracking-tight">SkillForge AI</span>
              <span className="text-[11px] font-mono text-neutral-400">Career & Learning Navigator</span>
            </div>
          </div>

          {/* Active Target Role Badge */}
          {careerData?.target_role && (
            <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded bg-canvas-surface border border-border text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-400">Target Role:</span>
              <span className="font-medium text-neutral-200">{careerData.target_role}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Persona Switcher (Judge Mode) & Auth Status */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Demo Switcher for Judges */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-canvas-surface border border-border rounded p-1 text-xs">
            <span className="text-neutral-400 px-1.5 font-mono text-[10px] uppercase tracking-wider">Demo Persona:</span>
            <button
              onClick={() => loginAsDemo('fullstack')}
              className={`px-2.5 py-1 rounded font-medium interactive-transition ${
                activePersonaKey === 'fullstack'
                  ? 'bg-accent text-white'
                  : 'text-neutral-300 hover:text-white hover:bg-canvas-elevated'
              }`}
            >
              Alex (Full-Stack)
            </button>
            <button
              onClick={() => loginAsDemo('datascience')}
              className={`px-2.5 py-1 rounded font-medium interactive-transition ${
                activePersonaKey === 'datascience'
                  ? 'bg-accent text-white'
                  : 'text-neutral-300 hover:text-white hover:bg-canvas-elevated'
              }`}
            >
              Priya (Data Science)
            </button>
          </div>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="flex items-center space-x-2.5 pl-2 border-l border-border-subtle">
              <div className="flex items-center space-x-2 bg-canvas-surface border border-border px-2.5 py-1 rounded text-xs">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-medium text-neutral-200">
                  {user.user_metadata?.full_name || user.email || 'Authenticated Student'}
                </span>
                {isGuest && (
                  <span className="font-mono text-[9px] px-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase">
                    Guest
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-canvas-surface rounded border border-transparent hover:border-border interactive-transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent-hover text-white rounded interactive-transition shadow-sm"
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
