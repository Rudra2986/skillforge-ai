import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Target, 
  CheckCircle2, 
  Loader2, 
  Layers, 
  Briefcase, 
  ShieldCheck,
  Zap,
  TrendingUp,
  BrainCircuit,
  FileCheck2
} from 'lucide-react';

const SYNTHESIS_STAGES = [
  {
    id: 1,
    title: 'Normalizing Candidate Credentials & Skills',
    desc: 'Structuring verified proficiencies, education, and portfolio projects...',
    icon: FileCheck2,
    threshold: 18
  },
  {
    id: 2,
    title: 'Target-Role Industry Benchmarking',
    desc: 'Cross-referencing competencies against production hiring standards...',
    icon: Target,
    threshold: 40
  },
  {
    id: 3,
    title: 'Isolating Competency Gap Matrix',
    desc: 'Categorizing critical, high, and medium priority skill deficiencies...',
    icon: Cpu,
    threshold: 65
  },
  {
    id: 4,
    title: 'Synthesizing 3-Phase Adaptive Milestones',
    desc: 'Curating weekly actionable milestones & high-yield documentation links...',
    icon: Layers,
    threshold: 85
  },
  {
    id: 5,
    title: 'Architecting Capstone Proofs & Readiness Score',
    desc: 'Building production blueprints and calibrating placement readiness index...',
    icon: Sparkles,
    threshold: 100
  }
];

export default function RoadmapSynthesizerModal({ 
  isOpen, 
  candidateName, 
  targetRole, 
  timelineWeeks, 
  skillCount, 
  onComplete 
}) {
  const [progress, setProgress] = useState(10);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(10);
      setCurrentStageIdx(0);
      return;
    }

    // Smooth progressive ticker
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return 98; // Hold near completion until parent finishes
        }
        // Accelerate smoothly through early stages, steady at late stages
        const increment = prev < 50 ? Math.random() * 8 + 4 : Math.random() * 5 + 2;
        const nextVal = Math.min(98, Math.round(prev + increment));
        return nextVal;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Update active stage based on progress threshold
  useEffect(() => {
    if (!isOpen) return;
    const stageIndex = SYNTHESIS_STAGES.findIndex(s => progress <= s.threshold);
    if (stageIndex !== -1) {
      setCurrentStageIdx(stageIndex);
    } else {
      setCurrentStageIdx(SYNTHESIS_STAGES.length - 1);
    }
  }, [progress, isOpen]);

  if (!isOpen) return null;

  const activeStage = SYNTHESIS_STAGES[currentStageIdx] || SYNTHESIS_STAGES[0];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Outer Glow Backdrop */}
      <div className="absolute inset-0 bg-radial from-accent/15 via-transparent to-transparent pointer-events-none"></div>

      {/* Main Glassmorphic Modal Card */}
      <div 
        className="relative w-full max-w-xl bg-canvas-subtle border border-accent/40 rounded-2xl shadow-2xl shadow-accent/20 overflow-hidden text-left animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Glowing Top Laser Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-emerald-400 to-indigo-500 animate-pulse"></div>

        {/* Header Section */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Top Pulsing AI Orb & Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-xs font-mono text-accent-text">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-semibold">Google Gemini Flash AI Engine Active</span>
            </div>
            
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-accent-text">
                {progress}%
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight flex items-center space-x-2.5">
              <span>Generating AI Career Roadmap</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Synthesizing an adaptive placement curriculum tailored to your verified credentials.
            </p>
          </div>

          {/* Candidate & Target Role Summary Pill */}
          <div className="p-3.5 rounded-xl bg-canvas border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-text font-bold">
                {candidateName ? candidateName.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <div className="font-semibold text-neutral-200">{candidateName || 'Candidate Profile'}</div>
                <div className="text-[11px] text-neutral-400 flex items-center space-x-1.5">
                  <Target className="w-3 h-3 text-accent-text" />
                  <span className="text-accent-text font-medium">{targetRole || 'Full-Stack AI Engineer'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-canvas-surface border border-border-subtle text-[11px] font-mono text-neutral-300">
                {timelineWeeks || 12} Wks
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-[11px] font-mono text-emerald-300">
                {skillCount || 0} Verified Skills
              </span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-2.5 bg-canvas rounded-full overflow-hidden border border-border-subtle p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-accent via-indigo-500 to-emerald-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer animation */}
                <div className="absolute inset-0 bg-white/25 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Live Step Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-border-subtle">
            {SYNTHESIS_STAGES.map((stage, idx) => {
              const isCompleted = progress > stage.threshold;
              const isCurrent = idx === currentStageIdx;
              const IconComponent = stage.icon;

              return (
                <div 
                  key={stage.id}
                  className={`p-2.5 rounded-xl border transition-all duration-200 flex items-start space-x-3 text-xs ${
                    isCurrent
                      ? 'bg-accent/15 border-accent/50 shadow-sm'
                      : isCompleted
                      ? 'bg-canvas-surface/40 border-border-subtle opacity-75'
                      : 'bg-transparent border-transparent opacity-40'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-accent-text animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-neutral-600 flex items-center justify-center text-[10px] text-neutral-500">
                        {stage.id}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className={`font-semibold ${isCurrent ? 'text-neutral-100 font-bold' : isCompleted ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      {stage.title}
                    </div>
                    {isCurrent && (
                      <div className="text-[11px] text-neutral-300 animate-in fade-in">
                        {stage.desc}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Live Status Note */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-border-subtle">
            <div className="flex items-center space-x-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-accent-text" />
              <span>Synthesizing placement milestones...</span>
            </div>
            <div className="font-mono text-neutral-400">
              Estimated: ~2-4s
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
