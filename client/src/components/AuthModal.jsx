import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillForgeLogo from './SkillForgeLogo';
import { 
  Compass, 
  X, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Server, 
  Zap,
  PenLine,
  ListFilter
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { 
    loginUser, 
    registerUser, 
    loginAsDemo, 
    isAuthLoading, 
    authError, 
    clearAuthError,
    isBackendLive 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  
  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('Full-Stack AI Engineer');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);

  // Success Feedback
  const [successMessage, setSuccessMessage] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clear errors when modal toggles or tab changes
  useEffect(() => {
    if (isOpen) {
      if (typeof clearAuthError === 'function') clearAuthError();
      setSuccessMessage(null);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (typeof clearAuthError === 'function') clearAuthError();
    setSuccessMessage(null);
    onClose();
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) return;

    const result = await loginUser(signInEmail, signInPassword);
    if (result.success) {
      setSuccessMessage('Successfully authenticated!');
      setTimeout(() => {
        handleClose();
      }, 500);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) return;

    const finalRole = (isCustomRole ? customRole.trim() : signUpRole) || 'Full-Stack AI Engineer';
    const result = await registerUser(signUpName, signUpEmail, signUpPassword, finalRole);
    if (result.success) {
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        handleClose();
      }, 500);
    }
  };

  const handleDemoClick = (personaKey) => {
    loginAsDemo(personaKey);
    setSuccessMessage(`Logged in as ${personaKey === 'fullstack' ? 'Alex (Full-Stack)' : 'Priya (Data Science)'}!`);
    setTimeout(() => {
      handleClose();
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className="relative w-full max-w-md bg-canvas-subtle border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Glow Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400"></div>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-border-subtle flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <SkillForgeLogo className="w-7 h-7" withGlow={false} />
              <span className="text-base font-semibold text-neutral-100 tracking-tight">
                SkillForge AI
              </span>
              
              {/* Backend Status Pill */}
              <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                isBackendLive 
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/60' 
                  : 'bg-blue-950/40 text-blue-300 border-blue-800/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isBackendLive ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></span>
                <span>{isBackendLive ? 'FastAPI Live' : 'Demo Sandbox'}</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Sign in to track your personalized learning roadmap and verified skills.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-200 p-1.5 rounded-lg hover:bg-canvas-surface interactive-transition"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Instant Guest Preview Card */}
          <div className="p-3.5 rounded-lg bg-canvas-surface border border-accent/30 bg-gradient-to-b from-accent-subtle/30 to-transparent space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-neutral-100">
                  Instant Guest Preview
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                Instant Access
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-tight">
              Explore SkillForge instantly with curated student resumes and roadmaps:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('fullstack')}
                className="p-2 rounded bg-canvas border border-border hover:border-accent hover:bg-canvas-elevated text-left interactive-transition group"
              >
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white flex items-center justify-between">
                  <span>Alex Rivera</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-accent-text interactive-transition" />
                </div>
                <div className="text-[10px] text-neutral-400 truncate">Full-Stack Engineer</div>
                <div className="text-[10px] font-mono text-accent-text mt-0.5">64% Readiness</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('datascience')}
                className="p-2 rounded bg-canvas border border-border hover:border-accent hover:bg-canvas-elevated text-left interactive-transition group"
              >
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white flex items-center justify-between">
                  <span>Priya Sharma</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-accent-text interactive-transition" />
                </div>
                <div className="text-[10px] text-neutral-400 truncate">AI & Data Science</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-0.5">72% Readiness</div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border-subtle"></div>
            <span className="bg-canvas-subtle px-3 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              Or Authenticate with Email
            </span>
          </div>

          {/* Sign In / Sign Up Tabs */}
          <div className="flex rounded-lg bg-canvas-surface p-1 border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md interactive-transition ${
                activeTab === 'signin'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md interactive-transition ${
                activeTab === 'signup'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Success Message Banner */}
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center space-x-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {authError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start space-x-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{authError}</span>
              </div>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@skillforge.ai"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-canvas-surface border border-border text-neutral-100 placeholder-neutral-500 focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-canvas-surface border border-border text-neutral-100 placeholder-neutral-500 focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full mt-2 py-2 px-4 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-xs font-semibold rounded-lg interactive-transition flex items-center justify-center space-x-2 shadow-sm"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-canvas-surface border border-border text-neutral-100 placeholder-neutral-500 focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Target Career Goal</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomRole(!isCustomRole);
                      if (!isCustomRole) setSignUpRole('__custom__');
                      else setSignUpRole('Full-Stack AI Engineer');
                    }}
                    className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-canvas-surface hover:bg-canvas-elevated border border-border hover:border-accent/40 text-[11px] font-medium text-neutral-300 hover:text-white interactive-transition"
                  >
                    {isCustomRole ? (
                      <>
                        <ListFilter className="w-3 h-3 text-accent-text" />
                        <span>Select Preset</span>
                      </>
                    ) : (
                      <>
                        <PenLine className="w-3 h-3 text-accent-text" />
                        <span>Type Custom Goal</span>
                      </>
                    )}
                  </button>
                </div>

                {!isCustomRole ? (
                  <select
                    value={signUpRole}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomRole(true);
                        setSignUpRole('__custom__');
                      } else {
                        setIsCustomRole(false);
                        setSignUpRole(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-canvas-surface border border-border text-neutral-100 focus:border-accent"
                  >
                    <optgroup label="Software Engineering & AI">
                      <option value="Full-Stack AI Engineer">Full-Stack AI Engineer</option>
                      <option value="Frontend & UI/UX Engineer">Frontend & UI/UX Engineer</option>
                      <option value="Backend & Distributed Systems">Backend & Distributed Systems</option>
                      <option value="Mobile & Cross-Platform Engineer">Mobile & Cross-Platform Engineer</option>
                    </optgroup>

                    <optgroup label="Data Science & Machine Learning">
                      <option value="AI & Data Science Specialist">AI & Data Science Specialist</option>
                      <option value="Machine Learning / MLOps Engineer">Machine Learning / MLOps Engineer</option>
                      <option value="NLP & Generative AI Engineer">NLP & Generative AI Engineer</option>
                      <option value="Data Analyst & Business Intelligence">Data Analyst & Business Intelligence</option>
                    </optgroup>

                    <optgroup label="Cloud, Systems & Security">
                      <option value="Cloud DevOps & Platform Engineer">Cloud DevOps & Platform Engineer</option>
                      <option value="Cybersecurity & Security Analyst">Cybersecurity & Security Analyst</option>
                      <option value="Embedded Systems & IoT Engineer">Embedded Systems & IoT Engineer</option>
                      <option value="Blockchain & Web3 Developer">Blockchain & Web3 Developer</option>
                    </optgroup>

                    <optgroup label="Custom / Specialized Track">
                      <option value="__custom__">Custom / Type Your Own Goal...</option>
                    </optgroup>
                  </select>
                ) : (
                  <div className="space-y-1 animate-in fade-in duration-150">
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g., Quantum Computing Researcher, Game Developer..."
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-canvas-surface border border-accent text-neutral-100 placeholder-neutral-500 focus:ring-1 focus:ring-accent"
                    />
                    <p className="text-[10px] text-neutral-400 font-mono">
                      SkillForge AI will tailor skill assessments specifically for this career goal.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-canvas-surface border border-border text-neutral-100 placeholder-neutral-500 focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-canvas-surface border border-border text-neutral-100 placeholder-neutral-500 focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full mt-2 py-2 px-4 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-xs font-semibold rounded-lg interactive-transition flex items-center justify-center space-x-2 shadow-sm"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-canvas-surface border-t border-border-subtle flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3 h-3 text-neutral-500" />
            <span>Secure & private career data</span>
          </div>
          <div className="text-neutral-500">SkillForge AI</div>
        </div>

      </div>
    </div>
  );
}
