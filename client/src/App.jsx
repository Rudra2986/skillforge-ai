import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ResumeUploader from './components/ResumeUploader';
import ProfileReviewModal from './components/ProfileReviewModal';
import ReadinessScoreCard from './components/ReadinessScoreCard';
import InterviewQuestionHub from './components/InterviewQuestionHub';
import CertificationRecommendations from './components/CertificationRecommendations';
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
  BookOpen, 
  UploadCloud, 
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [pendingExtractedData, setPendingExtractedData] = useState(null);
  const [heroPersona, setHeroPersona] = useState('fullstack'); // 'fullstack' | 'datascience'
  const [activeDashboardTab, setActiveDashboardTab] = useState('roadmap'); // 'roadmap' | 'scanner'
  const [scanNotification, setScanNotification] = useState(null);
  const [inlineSkillInput, setInlineSkillInput] = useState('');
  
  const { user, isGuest, activePersonaKey, loginAsDemo } = useAuth();
  const { 
    careerData, 
    hasGeneratedRoadmap, 
    updateVerifiedProfile, 
    toggleMilestone,
    addSkill,
    removeSkill,
    addOrToggleProject
  } = useCareer();

  const handleInlineAddSkill = (e) => {
    e.preventDefault();
    if (inlineSkillInput.trim()) {
      addSkill(inlineSkillInput.trim());
      setInlineSkillInput('');
    }
  };

  // Called when Resume scan finishes in Step 3
  const handleScanComplete = (extractedData) => {
    if (extractedData) {
      setPendingExtractedData(extractedData);
      setIsReviewModalOpen(true);
    }
  };

  // Called when student confirms profile in Step 4 Review Modal
  const handleGenerateRoadmap = (verifiedProfile) => {
    if (!user) {
      const isDS = (verifiedProfile.candidate_name && verifiedProfile.candidate_name.toLowerCase().includes('priya')) || 
                   (verifiedProfile.target_role && verifiedProfile.target_role.toLowerCase().includes('data'));
      loginAsDemo(isDS ? 'datascience' : 'fullstack');
    }
    updateVerifiedProfile(verifiedProfile);
    setActiveDashboardTab('roadmap');
    setIsReviewModalOpen(false);
    setScanNotification(
      `🎉 Career Roadmap generated for ${verifiedProfile.candidate_name || 'Candidate'}! (${verifiedProfile.current_skills?.length || 0} verified skills targeting ${verifiedProfile.target_role})`
    );
  };

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
                        Live Skill Gap &amp; Benchmark Preview
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
                                <span className="text-neutral-200">Vector Databases &amp; RAG</span>
                                <span className="text-[9px] uppercase px-1 rounded bg-rose-950 text-rose-400 border border-rose-800">Critical</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between p-1.5 rounded bg-canvas border border-border-subtle text-[11px]">
                                <span className="text-neutral-200">MLOps &amp; Docker Deployment</span>
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

            {/* Live Interactive Resume Upload Dropzone (Step 3 Preview) */}
            <section className="pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-100 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-accent-text" />
                    <span>Try the Live AI Resume Scanner</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Upload your own PDF resume or click a sample resume below to test extraction in real-time.
                  </p>
                </div>
              </div>

              <ResumeUploader onScanComplete={handleScanComplete} />
            </section>

          </div>
        ) : (
          /* ========================================================================= */
          /* CASE B: USER IS SIGNED IN / EXPLORING -> RENDER ACTIVE DASHBOARD          */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Scan Success Banner */}
            {scanNotification && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200 shadow-md animate-in fade-in">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{scanNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScanNotification(null)}
                  className="text-emerald-400 hover:text-white px-2 py-0.5 rounded text-[11px] font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Top Hero Summary Bar */}
            <section className="bg-canvas-subtle border border-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
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
                    {hasGeneratedRoadmap ? 'Roadmap Generated' : 'Step 1: Ingestion'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-100">
                  {!isGuest && user
                    ? (hasGeneratedRoadmap && careerData?.candidate_name ? careerData.candidate_name : (user.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'))
                    : (careerData?.candidate_name || (activePersonaKey === 'datascience' ? 'Priya Sharma' : 'Alex Rivera'))
                  }
                </h1>
                <p className="text-sm text-neutral-400">
                  {!isGuest && user ? (
                    hasGeneratedRoadmap && careerData?.education
                      ? `${careerData.education} • `
                      : `${user.user_metadata?.target_role ? `Target: ${user.user_metadata.target_role}` : 'Target: Full-Stack AI Engineer'} • `
                  ) : (
                    `${careerData?.education || 'B.Tech Computer Science'} • `
                  )}
                  {hasGeneratedRoadmap ? (
                    <>Targeting <span className="text-neutral-200 font-semibold">{careerData?.target_role || user?.user_metadata?.target_role}</span></>
                  ) : (
                    <span className="text-accent-text font-medium">Upload your PDF resume below to build your personalized roadmap</span>
                  )}
                </p>
              </div>

              {/* Action Area: CTA Button & Premium Mini Readiness Gauge */}
              <div className="flex items-center space-x-3 self-stretch sm:self-auto justify-between sm:justify-end">
                {hasGeneratedRoadmap ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveDashboardTab(activeDashboardTab === 'scanner' ? 'roadmap' : 'scanner')}
                      className={`px-4 py-2.5 rounded-lg text-xs font-semibold interactive-transition border flex items-center space-x-2 cursor-pointer ${
                        activeDashboardTab === 'scanner'
                          ? 'bg-accent text-white border-accent shadow-sm'
                          : 'bg-canvas-surface hover:bg-canvas-elevated text-neutral-200 border-border hover:border-accent/40'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-accent-text" />
                      <span>{activeDashboardTab === 'scanner' ? 'View Roadmap' : 'Scan New Resume'}</span>
                    </button>

                    {/* Premium Mini Readiness Gauge */}
                    <div className="flex items-center space-x-3.5 px-3.5 py-2 rounded-xl bg-canvas-surface border border-border shadow-sm">
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-end gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                          Readiness
                        </span>
                        <div className="text-lg font-bold font-mono text-neutral-100 leading-tight">
                          {careerData?.readiness_score || 64}%
                        </div>
                      </div>

                      {/* Mini Progress Ring with Center Icon */}
                      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                          <path
                            className="text-canvas-elevated"
                            strokeWidth="3.2"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-accent transition-all duration-500 ease-out"
                            strokeDasharray={`${careerData?.readiness_score || 64}, 100`}
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TrendingUp className="w-3.5 h-3.5 text-accent-text" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-canvas-surface border border-border text-xs text-neutral-400 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-accent-text" />
                    <span>Awaiting Resume Ingestion</span>
                  </div>
                )}
              </div>
            </section>

            {/* Dashboard Sub-Navigation Tabs (Only shown when roadmap is unlocked) */}
            {hasGeneratedRoadmap && (
              <div className="flex items-center space-x-2 border-b border-border pb-1">
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('scanner')}
                  className={`px-4 py-2 text-xs font-semibold rounded-t-lg interactive-transition border-b-2 flex items-center space-x-2 ${
                    activeDashboardTab === 'scanner'
                      ? 'border-accent text-accent-text bg-canvas-subtle/80'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume AI Ingestion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('roadmap')}
                  className={`px-4 py-2 text-xs font-semibold rounded-t-lg interactive-transition border-b-2 flex items-center space-x-2 ${
                    activeDashboardTab === 'roadmap'
                      ? 'border-accent text-accent-text bg-canvas-subtle/80'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Career Roadmap &amp; Skill Gaps</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: EITHER SCANNER (BEFORE ROADMAP OR ON SCANNER TAB) OR ROADMAP */}
            {!hasGeneratedRoadmap || activeDashboardTab === 'scanner' ? (
              <ResumeUploader onScanComplete={handleScanComplete} />
            ) : (
              /* TAB CONTENT B: TWO-COLUMN SKILL & ROADMAP GRID */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Readiness Engine & Skills Delta Matrix */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Placement Readiness Engine Card */}
                  <ReadinessScoreCard
                    score={careerData?.readiness_score || 55}
                    roadmap={careerData?.roadmap || []}
                    skills={careerData?.current_skills || []}
                    projects={careerData?.projects || []}
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"}
                  />

                  {/* Current Verified Skills */}
                  <div className="bg-canvas-subtle border border-border rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-neutral-200 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Verified Competencies</span>
                      </h2>
                      <span className="text-xs font-mono text-neutral-400">
                        {careerData?.current_skills?.length || 0} / 8 Target
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {careerData?.current_skills?.map((skill, idx) => (
                        <span
                          key={idx}
                          className="group inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-canvas-surface border border-border rounded-lg text-neutral-300 hover:border-emerald-500/50 interactive-transition"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="p-0.5 text-neutral-500 hover:text-rose-400 rounded-full interactive-transition"
                            title={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Inline Add Skill Form */}
                    <form onSubmit={handleInlineAddSkill} className="flex items-center space-x-2 pt-2 border-t border-border-subtle">
                      <input
                        type="text"
                        value={inlineSkillInput}
                        onChange={(e) => setInlineSkillInput(e.target.value)}
                        placeholder="Type skill & press Enter (e.g. Docker, MLOps)..."
                        className="flex-1 px-3 py-1.5 bg-canvas-surface border border-border focus:border-accent rounded-lg text-xs text-neutral-100 outline-none interactive-transition"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-canvas-elevated hover:bg-canvas-surface border border-border hover:border-accent text-xs font-semibold text-neutral-200 rounded-lg interactive-transition flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-accent-text" />
                        <span>Add</span>
                      </button>
                    </form>
                  </div>

                  {/* Identified Skill Gaps (High-Signal) */}
                  <div className="bg-canvas-subtle border border-border rounded-xl p-5 space-y-4 shadow-sm">
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
                  
                  <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-6 shadow-sm">
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
                          className={`p-4 rounded-xl border interactive-transition ${
                            milestone.completed
                              ? 'bg-canvas-surface/40 border-border-subtle opacity-75'
                              : 'bg-canvas-surface border-border hover:border-border-strong shadow-xs'
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

                  {/* Recommended Capstone Projects (Placement Proof) */}
                  <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                      <div>
                        <h2 className="text-sm font-semibold text-neutral-100 flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-amber-400" />
                          <span>Recommended Capstone Projects (Placement Proof)</span>
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Build and verify production projects to maximize your Portfolio Proof pillar.
                        </p>
                      </div>
                      <span className="text-xs font-mono text-neutral-400">
                        {careerData?.projects?.length || 0} / 3 Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {careerData?.recommended_projects?.map((proj) => {
                        const isVerified = careerData?.projects?.some(
                          (p) => p.title?.toLowerCase() === proj.title?.toLowerCase()
                        );
                        return (
                          <div
                            key={proj.id}
                            className={`p-4 rounded-xl border interactive-transition flex flex-col justify-between space-y-3 ${
                              isVerified
                                ? 'bg-emerald-950/20 border-emerald-800/60 shadow-xs'
                                : 'bg-canvas-surface border-border hover:border-border-strong'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-neutral-100">{proj.title}</span>
                                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-canvas border border-border-subtle text-neutral-400">
                                  {proj.difficulty}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-400 leading-relaxed">
                                {proj.architecture_overview || 'Production pipeline designed for real-world placement benchmarks.'}
                              </p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {proj.skills_gained?.map((sk, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-canvas border border-border text-neutral-300"
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => addOrToggleProject(proj)}
                              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold interactive-transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                                isVerified
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                                  : 'bg-canvas hover:bg-canvas-elevated text-neutral-200 border border-border hover:border-accent'
                              }`}
                            >
                              {isVerified ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Verified &amp; Linked to Profile</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Mark Built &amp; Verify Project</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommended Industry Certifications */}
                  <CertificationRecommendations 
                    certifications={careerData?.recommended_certifications || []} 
                  />

                  {/* Targeted Placement Interview Prep Hub */}
                  <InterviewQuestionHub 
                    questions={careerData?.mock_interview_questions || []}
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"}
                  />

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* 3. Authentication & Guest Preview Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* 4. Human-in-the-Loop Profile Review Modal (Step 4) */}
      <ProfileReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        initialData={pendingExtractedData}
        onGenerateRoadmap={handleGenerateRoadmap}
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
