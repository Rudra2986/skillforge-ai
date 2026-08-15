import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ResumeUploader from './components/ResumeUploader';
import ProfileReviewModal from './components/ProfileReviewModal';
import ReadinessScoreCard from './components/ReadinessScoreCard';
import RoadmapTimeline from './components/RoadmapTimeline';
import SkillGapVisualizer from './components/SkillGapVisualizer';
import InterviewQuestionHub from './components/InterviewQuestionHub';
import CertificationRecommendations from './components/CertificationRecommendations';
import RoadmapSynthesizerModal from './components/RoadmapSynthesizerModal';
import { aiAPI } from './services/api';
import { useAuth } from './context/AuthContext';
import { useCareer } from './context/CareerContext';
import { 
  FileText, 
  Target, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  Briefcase, 
  Check, 
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSynthesizingRoadmap, setIsSynthesizingRoadmap] = useState(false);
  const [synthesizingProfile, setSynthesizingProfile] = useState(null);
  const [pendingExtractedData, setPendingExtractedData] = useState(null);
  const [heroPersona, setHeroPersona] = useState('fullstack'); // 'fullstack' | 'datascience'
  const [activeDashboardTab, setActiveDashboardTab] = useState('roadmap'); // 'roadmap' | 'scanner'
  const [scanNotification, setScanNotification] = useState(null);
  const [inlineSkillInput, setInlineSkillInput] = useState('');
  
  const { user, isGuest, activePersonaKey, loginAsDemo } = useAuth();

  // Auto-dismiss top notification banner after 4 seconds
  React.useEffect(() => {
    if (scanNotification) {
      const timer = setTimeout(() => {
        setScanNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [scanNotification]);
  const { 
    careerData, 
    hasGeneratedRoadmap, 
    updateVerifiedProfile, 
    toggleMilestone,
    calculateReadinessScore,
    addSkill,
    removeSkill,
    addOrToggleProject
  } = useCareer();

  const heroReadinessScore = calculateReadinessScore
    ? calculateReadinessScore(
        careerData?.current_skills || [], 
        careerData?.roadmap || [], 
        careerData?.projects || [],
        careerData?.target_role
      )
    : (careerData?.readiness_score || 40);

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
  const handleGenerateRoadmap = async (verifiedProfile) => {
    setIsReviewModalOpen(false);
    setSynthesizingProfile(verifiedProfile);
    setIsSynthesizingRoadmap(true);

    const startTime = Date.now();

    // If authenticated, invoke Groq AI Skill Gap Analysis & Roadmap Generation
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setScanNotification('🧠 Groq AI is analyzing your skill gaps and generating your customized career roadmap...');
        const aiIntelligence = await aiAPI.analyzeGap(
          verifiedProfile,
          verifiedProfile.target_role || 'Full-Stack AI Engineer',
          verifiedProfile.timeline_weeks || 12
        );

        // Ensure user sees the synthesis animation for at least 1.8s for premium experience
        const elapsed = Date.now() - startTime;
        if (elapsed < 1800) {
          await new Promise(r => setTimeout(r, 1800 - elapsed));
        }

        if (aiIntelligence && aiIntelligence.roadmap) {
          updateVerifiedProfile({
            ...verifiedProfile,
            ...aiIntelligence
          });
          setIsSynthesizingRoadmap(false);
          setActiveDashboardTab('roadmap');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setScanNotification(
            `🎉 Groq AI generated ${aiIntelligence.roadmap.length} milestones & blueprints for ${verifiedProfile.candidate_name || 'Candidate'} targeting ${verifiedProfile.target_role}!`
          );
          return;
        }
      } catch (err) {
        console.warn("Groq AI gap analysis fallback to offline engine:", err);
      }
    }

    // Default Sandbox / Fallback Mode with graceful animation timing
    const elapsed = Date.now() - startTime;
    if (elapsed < 1800) {
      await new Promise(r => setTimeout(r, 1800 - elapsed));
    }

    if (!user) {
      const isDS = (verifiedProfile.candidate_name && verifiedProfile.candidate_name.toLowerCase().includes('priya')) || 
                   (verifiedProfile.target_role && verifiedProfile.target_role.toLowerCase().includes('data'));
      loginAsDemo(isDS ? 'datascience' : 'fullstack');
    }
    updateVerifiedProfile(verifiedProfile);
    setIsSynthesizingRoadmap(false);
    setActiveDashboardTab('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScanNotification(
      `🎉 Career Roadmap generated for ${verifiedProfile.candidate_name || 'Candidate'}! (${verifiedProfile.current_skills?.length || 0} verified skills targeting ${verifiedProfile.target_role})`
    );
  };

  return (
    <div className="min-h-screen bg-canvas text-neutral-200 flex flex-col">
      {/* 1. Header Navigation */}
      <Navbar 
        onOpenAuthModal={() => setIsAuthModalOpen(true)} 
        activeTab={activeDashboardTab}
        onSelectTab={(tab) => {
          setActiveDashboardTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* CASE A: USER IS SIGNED OUT OR ON LANDING DASHBOARD VIEW ('home')          */}
        {/* ========================================================================= */}
        {!user || activeDashboardTab === 'home' ? (
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
                  {user ? (
                    <button
                      type="button"
                      onClick={() => setActiveDashboardTab('roadmap')}
                      className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg interactive-transition shadow-lg shadow-accent/25 flex items-center space-x-2 group cursor-pointer"
                    >
                      <span>Go to Your Active Roadmap</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 interactive-transition" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg interactive-transition shadow-lg shadow-accent/25 flex items-center space-x-2 group cursor-pointer"
                    >
                      <span>Launch Your Roadmap</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 interactive-transition" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemo(heroPersona);
                      setActiveDashboardTab('scanner');
                    }}
                    className="px-5 py-3 bg-canvas-surface hover:bg-canvas-elevated border border-border hover:border-accent/40 text-neutral-200 text-sm font-medium rounded-lg interactive-transition flex items-center space-x-2 cursor-pointer"
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
                      onClick={() => {
                        loginAsDemo(heroPersona);
                        setActiveDashboardTab('roadmap');
                      }}
                      className="w-full mt-2 py-2 px-3 rounded bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent-text hover:text-white text-xs font-sans font-medium flex items-center justify-center space-x-1.5 interactive-transition cursor-pointer"
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

              <ResumeUploader 
                onScanComplete={handleScanComplete} 
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            </section>

          </div>
        ) : (
          /* ========================================================================= */
          /* CASE B: USER IS SIGNED IN -> ACTIVE CAREER ROADMAP & INGESTION DASHBOARD   */
          /* ========================================================================= */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Notification Banner for Completed Operations */}
            {scanNotification && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-3 text-xs text-emerald-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{scanNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScanNotification(null)}
                  className="text-emerald-400 hover:text-emerald-200 text-xs font-mono px-2 py-0.5 rounded hover:bg-emerald-900/50"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Candidate Header Summary & Goal Benchmark */}
            <section className="bg-canvas-subtle border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-left">
              <div className="space-y-2">
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
                        Verified Candidate
                      </>
                    )}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {hasGeneratedRoadmap ? 'Active Learning Path' : 'Step 1 of 2: Ingestion'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-100">
                  {isGuest
                    ? (activePersonaKey === 'datascience' ? 'Priya Sharma' : 'Alex Morgan')
                    : (careerData?.candidate_name || user?.name || user?.user_metadata?.full_name || 'Candidate')
                  }
                </h1>
                <p className="text-sm text-neutral-400">
                  {isGuest ? (
                    `${activePersonaKey === 'datascience' ? 'B.Tech Information Technology (Demo), 2020–2024' : 'B.Tech Computer Science & Engineering (Demo), 2018–2022'} • `
                  ) : (
                    hasGeneratedRoadmap && careerData?.education
                      ? `${careerData.education} • `
                      : `${user?.user_metadata?.target_role ? `Target: ${user.user_metadata.target_role}` : 'Target: Full-Stack AI Engineer'} • `
                  )}
                  {hasGeneratedRoadmap ? (
                    <>Targeting <span className="text-neutral-200 font-semibold">{careerData?.target_role || user?.user_metadata?.target_role}</span></>
                  ) : (
                    <span className="text-accent-text font-medium">Upload your PDF resume below to build your personalized roadmap</span>
                  )}
                </p>
              </div>

              {/* Header Actions & Quick Score Preview */}
              <div className="flex flex-wrap items-center gap-3">
                {hasGeneratedRoadmap ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveDashboardTab('scanner')}
                      className="px-4 py-2 rounded-lg bg-canvas-surface hover:bg-canvas-elevated border border-border text-xs font-semibold text-neutral-200 interactive-transition flex items-center space-x-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent-text" />
                      <span>Scan New Resume</span>
                    </button>

                    <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-canvas-surface border border-border">
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-mono text-neutral-400 uppercase">Readiness</div>
                        <div className="text-base font-bold text-neutral-100">
                          {heroReadinessScore}%
                        </div>
                      </div>
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-border"
                            strokeWidth="3.2"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-accent transition-all duration-500 ease-out"
                            strokeDasharray={`${heroReadinessScore}, 100`}
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-canvas-surface border border-border text-xs text-neutral-400 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-accent-text" />
                    <span>Upload Resume to Begin</span>
                  </div>
                )}
              </div>
            </section>

            {/* Dashboard Sub-Navigation Tabs (Only shown when roadmap is unlocked) */}
            {hasGeneratedRoadmap && (
              <div className="flex items-center space-x-2 border-b border-border pb-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('roadmap')}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg interactive-transition border-b-2 flex items-center space-x-2 cursor-pointer shrink-0 ${
                    activeDashboardTab === 'roadmap'
                      ? 'border-accent text-accent-text bg-canvas-subtle/80'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Learning Roadmap &amp; Skill Gaps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('projects')}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg interactive-transition border-b-2 flex items-center space-x-2 cursor-pointer shrink-0 ${
                    activeDashboardTab === 'projects'
                      ? 'border-accent text-accent-text bg-canvas-subtle/80'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>Capstone Projects &amp; Certifications</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('interview')}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg interactive-transition border-b-2 flex items-center space-x-2 cursor-pointer shrink-0 ${
                    activeDashboardTab === 'interview'
                      ? 'border-accent text-accent-text bg-canvas-subtle/80'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-accent-text" />
                  <span>AI Mock Interview Simulator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('scanner')}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg interactive-transition border-b-2 flex items-center space-x-2 cursor-pointer shrink-0 ${
                    activeDashboardTab === 'scanner'
                      ? 'border-accent text-accent-text bg-canvas-subtle/80'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume Ingestion</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT A: SCANNER / RESUME UPLOADER */}
            {!hasGeneratedRoadmap || activeDashboardTab === 'scanner' ? (
              <ResumeUploader 
                onScanComplete={handleScanComplete} 
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            ) : activeDashboardTab === 'projects' ? (
              /* TAB CONTENT C: DEDICATED CAPSTONE PROJECTS & CERTIFICATIONS PAGE */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <ReadinessScoreCard
                    score={careerData?.readiness_score || 55}
                    roadmap={careerData?.roadmap || []}
                    skills={careerData?.current_skills || []}
                    projects={careerData?.projects || []}
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"}
                  />
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {/* Recommended Capstone Projects (Placement Proof) */}
                  <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-4 shadow-sm text-left">
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
                        {careerData?.projects?.length || 0} / {careerData?.recommended_projects?.length || 2} Verified
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
                    targetRole={careerData?.target_role || "Data Scientist / ML Engineer"}
                  />
                </div>
              </div>
            ) : activeDashboardTab === 'interview' ? (
              /* TAB CONTENT D: DEDICATED AI MOCK INTERVIEW SIMULATOR PAGE */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <ReadinessScoreCard
                    score={careerData?.readiness_score || 55}
                    roadmap={careerData?.roadmap || []}
                    skills={careerData?.current_skills || []}
                    projects={careerData?.projects || []}
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"}
                  />
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <InterviewQuestionHub 
                    questions={careerData?.mock_interview_questions || []}
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"}
                  />
                </div>
              </div>
            ) : (
              /* TAB CONTENT B: TWO-COLUMN LEARNING ROADMAP & SKILL GAPS GRID */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Readiness Engine Card */}
                <div className="lg:col-span-1 space-y-6">
                  <ReadinessScoreCard
                    score={careerData?.readiness_score || 55}
                    roadmap={careerData?.roadmap || []}
                    skills={careerData?.current_skills || []}
                    projects={careerData?.projects || []}
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"}
                  />
                </div>

                {/* Right Column: Active Learning Phases & Milestones */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* P4 Interactive Learning Roadmap Timeline */}
                  <RoadmapTimeline 
                    roadmap={careerData?.roadmap || []} 
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"} 
                  />

                  {/* P4 Target Benchmark & Skill Gap Visualizer */}
                  <SkillGapVisualizer
                    verifiedSkills={careerData?.current_skills || []}
                    targetRole={careerData?.target_role || "Full-Stack AI Engineer"}
                    roadmap={careerData?.roadmap || []}
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
        onSelectTab={setActiveDashboardTab}
      />

      {/* 4. Human-in-the-Loop Profile Review Modal (Step 4) */}
      <ProfileReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        initialData={pendingExtractedData}
        onGenerateRoadmap={handleGenerateRoadmap}
      />

      {/* 5. AI Roadmap Synthesis Animated Loading Screen */}
      <RoadmapSynthesizerModal
        isOpen={isSynthesizingRoadmap}
        candidateName={synthesizingProfile?.candidate_name || pendingExtractedData?.candidate_name}
        targetRole={synthesizingProfile?.target_role || pendingExtractedData?.target_role || "Full-Stack AI Engineer"}
        timelineWeeks={synthesizingProfile?.timeline_weeks || 12}
        skillCount={synthesizingProfile?.current_skills?.length || pendingExtractedData?.current_skills?.length || 0}
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
