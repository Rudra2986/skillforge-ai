import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { useCareer } from './context/CareerContext';
import { 
  FileText, 
  Target, 
  Layers, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Compass,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  Code2,
  Check,
  Cpu,
  Terminal,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [heroPersona, setHeroPersona] = useState('fullstack'); // 'fullstack' | 'datascience'
  const { user, isGuest, activePersonaKey, loginAsDemo } = useAuth();
  const { careerData, toggleMilestone } = useCareer();

  return (
    <div className="min-h-screen bg-canvas text-neutral-200 flex flex-col">
      {/* 1. Header Navigation */}
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* CASE A: USER IS SIGNED OUT -> MISSION CONTROL SPLIT HERO & SHOWCASE       */}
        {/* ========================================================================= */}
        {!user ? (
          <div className="space-y-16 py-2 animate-in fade-in duration-300">
            
            {/* Split Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 sm:pt-6">
              
              {/* Left Column: Sharp, High-Signal Proposition */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-canvas-surface border border-border text-xs font-medium text-neutral-300 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-neutral-300">Personalized Career Intelligence</span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-accent-text font-semibold">Placement Readiness Engine</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-100 tracking-tight leading-[1.15]">
                  Engineered to turn your resume into an unfair career advantage.
                </h1>

                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
                  Traditional resume scanners give generic scores. SkillForge dissects your portfolio against real production job requirements, isolates your highest-impact skill deficiencies, and maps your path to 100% placement readiness.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg interactive-transition shadow-lg shadow-accent/25 flex items-center space-x-2 group"
                  >
                    <span>Launch Your Roadmap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 interactive-transition" />
                  </button>

                  <button
                    type="button"
                    onClick={() => loginAsDemo(heroPersona)}
                    className="px-5 py-3 bg-canvas-surface hover:bg-canvas-elevated border border-border hover:border-accent/40 text-neutral-200 text-sm font-medium rounded-lg interactive-transition flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Instant Live Sandbox ({heroPersona === 'fullstack' ? 'Alex' : 'Priya'})</span>
                  </button>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle max-w-lg">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-neutral-100 font-mono">+38%</div>
                    <div className="text-[11px] text-neutral-400">Avg Readiness Lift</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-neutral-100 font-mono">3 Phases</div>
                    <div className="text-[11px] text-neutral-400">Adaptive Milestones</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-neutral-100 font-mono">0s Latency</div>
                    <div className="text-[11px] text-neutral-400">Deterministic Engine</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Interactive Sandbox Terminal Preview */}
              <div className="lg:col-span-5">
                <div className="rounded-xl bg-canvas-subtle border border-border shadow-2xl overflow-hidden">
                  
                  {/* Terminal Header */}
                  <div className="px-4 py-2.5 bg-canvas-surface border-b border-border flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                      <span className="text-[11px] font-medium text-neutral-300 ml-2">
                        Live Skill Gap & Benchmark Preview
                      </span>
                    </div>

                    {/* Interactive Switcher inside Sandbox */}
                    <div className="flex items-center space-x-1 bg-canvas p-0.5 rounded border border-border text-[10px]">
                      <button
                        type="button"
                        onClick={() => setHeroPersona('fullstack')}
                        className={`px-2 py-0.5 rounded font-medium interactive-transition ${
                          heroPersona === 'fullstack' ? 'bg-accent text-white' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        Alex (Full-Stack)
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroPersona('datascience')}
                        className={`px-2 py-0.5 rounded font-medium interactive-transition ${
                          heroPersona === 'datascience' ? 'bg-accent text-white' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        Priya (AI/ML)
                      </button>
                    </div>
                  </div>

                  {/* Sandbox Body Content */}
                  <div className="p-5 space-y-4 text-xs font-mono">
                    
                    {/* Candidate & Role Header */}
                    <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                      <div>
                        <div className="text-[10px] uppercase text-neutral-500">Target Benchmark</div>
                        <div className="text-neutral-100 font-semibold text-xs mt-0.5">
                          {heroPersona === 'fullstack' ? 'Full-Stack AI Engineer' : 'AI & Data Science Specialist'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase text-neutral-500">Readiness Score</div>
                        <div className={`text-base font-bold ${heroPersona === 'fullstack' ? 'text-accent-text' : 'text-emerald-400'}`}>
                          {heroPersona === 'fullstack' ? '64%' : '72%'}
                        </div>
                      </div>
                    </div>

                    {/* Skills Verified vs Gaps */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mb-1.5 font-sans font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span>Verified Competencies:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {heroPersona === 'fullstack' ? (
                            <>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">React</span>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">TypeScript</span>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">Python</span>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">REST APIs</span>
                            </>
                          ) : (
                            <>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">Python</span>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">PyTorch</span>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">Pandas</span>
                              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border text-[11px] text-neutral-300">Scikit-Learn</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] text-amber-400 flex items-center space-x-1 mb-1.5 font-sans font-medium">
                          <Target className="w-3.5 h-3.5" />
                          <span>Identified Deficiencies to Solve:</span>
                        </div>
                        <div className="space-y-1">
                          {heroPersona === 'fullstack' ? (
                            <>
                              <div className="flex items-center justify-between p-1.5 rounded bg-canvas border border-border-subtle text-[11px]">
                                <span className="text-neutral-200">FastAPI Microservices</span>
                                <span className="text-[9px] uppercase px-1 rounded bg-rose-950 text-rose-400 border border-rose-800">Critical</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded bg-canvas border border-border-subtle text-[11px]">
                                <span className="text-neutral-200">Vector Databases & RAG</span>
                                <span className="text-[9px] uppercase px-1 rounded bg-rose-950 text-rose-400 border border-rose-800">Critical</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between p-1.5 rounded bg-canvas border border-border-subtle text-[11px]">
                                <span className="text-neutral-200">MLOps & Docker Deployment</span>
                                <span className="text-[9px] uppercase px-1 rounded bg-rose-950 text-rose-400 border border-rose-800">Critical</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded bg-canvas border border-border-subtle text-[11px]">
                                <span className="text-neutral-200">FastAPI Model Serving</span>
                                <span className="text-[9px] uppercase px-1 rounded bg-amber-950 text-amber-400 border border-amber-800">High</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Trigger to View Full Sandbox */}
                    <button
                      type="button"
                      onClick={() => loginAsDemo(heroPersona)}
                      className="w-full mt-2 py-2 px-3 rounded bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent-text hover:text-white text-xs font-sans font-medium flex items-center justify-center space-x-1.5 interactive-transition"
                    >
                      <span>Explore {heroPersona === 'fullstack' ? 'Alex' : 'Priya'}&apos;s full roadmap</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              </div>

            </section>

            {/* 3 Interactive Architecture Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              
              <div className="p-6 rounded-xl bg-canvas-subtle border border-border space-y-3 relative overflow-hidden group hover:border-border-strong interactive-transition">
                <div className="w-10 h-10 rounded-lg bg-canvas-surface border border-border flex items-center justify-center text-accent-text">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Layout-Aware PDF Ingestion
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Preserves multi-column layout structures to cleanly normalize technical tools, GitHub repositories, and verified coursework into structured data.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-canvas-subtle border border-border space-y-3 relative overflow-hidden group hover:border-border-strong interactive-transition">
                <div className="w-10 h-10 rounded-lg bg-canvas-surface border border-border flex items-center justify-center text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  High-Signal Deficiency Matrix
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Benchmarks your competencies against target industry roles. Automatically prioritizes gaps into critical, high, and medium milestones.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-canvas-subtle border border-border space-y-3 relative overflow-hidden group hover:border-border-strong interactive-transition">
                <div className="w-10 h-10 rounded-lg bg-canvas-surface border border-border flex items-center justify-center text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Adaptive Milestone Engine
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Generates week-by-week actionable roadmap phases with curated study resources. Dynamic math algorithm recalculates readiness as milestones complete.
                </p>
              </div>

            </section>

          </div>
        ) : (
          /* ========================================================================= */
          /* CASE B: USER IS SIGNED IN / EXPLORING -> RENDER ACTIVE DASHBOARD          */
          /* ========================================================================= */
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Top Hero Summary Bar */}
            <section className="bg-canvas-subtle border border-border rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent-text bg-accent-subtle/50 px-2 py-0.5 rounded border border-accent/20 flex items-center">
                    {isGuest ? (
                      <>
                        <Zap className="w-3 h-3 mr-1 text-amber-400" />
                        Active Profile ({activePersonaKey === 'fullstack' ? 'Alex' : 'Priya'})
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                        Authenticated Student
                      </>
                    )}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Updated just now
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-neutral-100">
                  {careerData?.candidate_name || user?.user_metadata?.full_name || "Alex Rivera"}
                </h1>
                <p className="text-sm text-neutral-400">
                  {careerData?.education} • Targeting <span className="text-neutral-200 font-medium">{careerData?.target_role}</span>
                </p>
              </div>

              {/* Placement Readiness Badge */}
              <div className="flex items-center space-x-4 bg-canvas-surface border border-border p-3.5 rounded-lg shadow-inner">
                <div className="text-right">
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Placement Readiness</div>
                  <div className="text-2xl font-bold text-neutral-100">{careerData?.readiness_score || 64}%</div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center text-xs font-bold text-accent-text bg-accent-subtle/30 shadow-sm">
                  {careerData?.readiness_score || 64}%
                </div>
              </div>
            </section>

            {/* Two-Column Grid: Skills & Current Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Skills Delta Matrix */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Current Verified Skills */}
                <div className="bg-canvas-subtle border border-border rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-neutral-200 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Verified Competencies</span>
                    </h2>
                    <span className="text-xs font-mono text-neutral-400">
                      {careerData?.current_skills?.length || 0} Skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {careerData?.current_skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-medium bg-canvas-surface border border-border rounded text-neutral-300 hover:border-accent/40 interactive-transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Identified Skill Gaps (High-Signal) */}
                <div className="bg-canvas-subtle border border-border rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-neutral-200 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-amber-500" />
                      <span>Identified Skill Deficiencies</span>
                    </h2>
                    <span className="text-xs font-mono text-amber-400">Action Required</span>
                  </div>
                  <ul className="space-y-2">
                    {careerData?.skills_missing?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded bg-canvas-surface border border-border-subtle text-xs hover:border-border interactive-transition"
                      >
                        <span className="text-neutral-200 font-medium">{item.skill}</span>
                        <span className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                          item.proficiency_or_importance === 'Critical'
                            ? 'bg-rose-950/40 text-rose-400 border-rose-800/50'
                            : 'bg-amber-950/40 text-amber-400 border-amber-800/50'
                        }`}>
                          {item.proficiency_or_importance}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Right Column: Active Learning Phases & Milestones */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-canvas-subtle border border-border rounded-lg p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <div>
                      <h2 className="text-base font-semibold text-neutral-100 flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-accent-text" />
                        <span>Adaptive Learning Roadmap</span>
                      </h2>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Milestones structured specifically to bridge your {careerData?.target_role} requirements.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-canvas-surface border border-border text-neutral-300">
                      {careerData?.roadmap?.filter(m => m.completed).length || 0} / {careerData?.roadmap?.length || 0} Completed
                    </span>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-4">
                    {careerData?.roadmap?.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`p-4 rounded-lg border interactive-transition ${
                          milestone.completed
                            ? 'bg-canvas-surface/40 border-border-subtle opacity-75'
                            : 'bg-canvas-surface border-border hover:border-border-strong'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start space-x-3">
                            <button
                              type="button"
                              onClick={() => toggleMilestone(milestone.id)}
                              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center interactive-transition ${
                                milestone.completed
                                  ? 'bg-emerald-600 border-emerald-500 text-white'
                                  : 'border-neutral-500 hover:border-neutral-300 bg-canvas'
                              }`}
                              title={milestone.completed ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {milestone.completed && <CheckCircle className="w-3.5 h-3.5" />}
                            </button>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono text-neutral-400">Phase {milestone.phase}</span>
                                <span className="text-xs text-neutral-500">•</span>
                                <span className="text-xs font-mono text-neutral-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {milestone.duration}
                                </span>
                              </div>
                              <h3 className={`text-sm font-semibold mt-1 ${
                                milestone.completed ? 'line-through text-neutral-400' : 'text-neutral-100'
                              }`}>
                                {milestone.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Action Items */}
                        <div className="mt-3 pl-8 space-y-1.5">
                          {milestone.action_items?.map((item, i) => (
                            <div key={i} className="text-xs text-neutral-300 flex items-center space-x-2">
                              <span className="w-1 h-1 rounded-full bg-neutral-500 shrink-0"></span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* 3. Authentication & Guest Preview Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-canvas-subtle py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-neutral-400">
          <div>SkillForge AI • Personal Career & Learning Mentor</div>
          <div className="text-neutral-500 text-[11px]">All Rights Reserved</div>
        </div>
      </footer>
    </div>
  );
}
