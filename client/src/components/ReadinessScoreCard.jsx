import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Layers, 
  Briefcase, 
  Code2, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Target,
  Building2,
  Flame,
  Check
} from 'lucide-react';

export default function ReadinessScoreCard({ 
  score = 64, 
  roadmap = [], 
  skills = [], 
  projects = [],
  targetRole = "Full-Stack AI Engineer"
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  // Derived sub-metrics calculation
  const completedMilestones = roadmap.filter(m => m.completed).length;
  const totalMilestones = roadmap.length || 3;
  const milestoneProgressPercent = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  const skillsCount = skills.length || 0;
  const missingFromRoadmap = roadmap.filter(
    m => m.skill && !skills.some(s => s.toLowerCase() === m.skill.toLowerCase())
  ).length;
  const skillsTarget = Math.max(skillsCount, skillsCount + missingFromRoadmap, 1);
  const skillsProgressPercent = skillsTarget > 0 
    ? Math.min(100, Math.round((skillsCount / skillsTarget) * 100)) 
    : 100;

  const projectsCount = projects.length || 0;
  const projectsTarget = 2;
  const projectsProgressPercent = projectsTarget > 0 
    ? Math.min(100, Math.round((projectsCount / projectsTarget) * 100)) 
    : 0;

  // Weighted score contributions (Sum of all 3 parts = 100%: 40% Skills + 40% Roadmap + 20% Projects)
  const skillsContrib = (skillsProgressPercent / 100) * 40;
  const milestoneContrib = (milestoneProgressPercent / 100) * 40;
  const projectsContrib = (projectsProgressPercent / 100) * 20;

  // Total placement readiness score is the EXACT sum of all 3 parts (40% Skills + 40% Roadmap + 20% Projects)
  const totalSumScore = Math.min(100, Math.max(0, Math.round(skillsContrib + milestoneContrib + projectsContrib)));
  const targetReadinessScore = totalSumScore;

  // Smooth number counter animating to targetReadinessScore
  useEffect(() => {
    let start = animatedScore;
    const end = targetReadinessScore;
    if (start === end) return;

    const duration = 400;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const stepIncrement = (end - start) / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      start += stepIncrement;
      if (currentStep >= totalSteps) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetReadinessScore]);

  // Determine Tier Status
  const getTierInfo = (val) => {
    if (val >= 80) {
      return {
        label: 'Tier-1 Ready',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
        description: 'Meets top-tier industry placement standards.'
      };
    }
    if (val >= 55) {
      return {
        label: 'Core Competency',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
        description: 'Strong foundation; complete pending phases to reach Tier-1 readiness.'
      };
    }
    return {
      label: 'Foundation Stage',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
      description: 'Initial ingestion state; build core backend and system fundamentals.'
    };
  };

  const tier = getTierInfo(animatedScore);

  // Next high-impact recommendation
  const pendingMilestones = roadmap.filter(m => !m.completed);
  const nextMilestone = pendingMilestones.length > 0 ? pendingMilestones[0] : null;

  return (
    <div className="rounded-xl bg-canvas-subtle border border-border p-5 space-y-5 shadow-sm text-left font-sans">
      
      {/* Header with Title & Tier Badge */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3.5">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-accent-text" />
          <h2 className="text-sm font-semibold text-neutral-100">
            Placement Readiness Index
          </h2>
        </div>

        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border flex items-center space-x-1.5 ${tier.bg} ${tier.color} ${tier.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`}></span>
          <span>{tier.label}</span>
        </span>
      </div>

      {/* Main Score Hero Bar */}
      <div className="p-4 rounded-lg bg-canvas-surface border border-border-subtle space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-bold font-mono tracking-tight text-neutral-100 flex items-baseline gap-1">
              {animatedScore}%
              <span className="text-xs font-mono font-normal text-neutral-400">/ 100%</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {tier.description}
            </p>
          </div>
          
          <div className="text-right font-mono text-[11px] text-neutral-400 space-y-0.5">
            <div><span className="text-neutral-200 font-semibold">{completedMilestones}/{totalMilestones}</span> phases</div>
            <div><span className="text-neutral-200 font-semibold">{skillsCount}</span> skills</div>
          </div>
        </div>

        {/* Proportional Multi-Segment Spectrum Bar */}
        <div className="space-y-2 pt-1">
          {/* Main Filled Spectrum Track */}
          <div className="w-full h-3 bg-canvas rounded-full overflow-hidden flex border border-border p-0.5 shadow-inner">
            {skillsContrib > 0 && (
              <div 
                className="h-full bg-blue-500 rounded-l-full transition-all duration-500"
                style={{ width: `${skillsContrib}%` }}
                title={`Technical Skills: ${skillsProgressPercent}% (${Math.round(skillsContrib)}/40%)`}
              />
            )}
            {milestoneContrib > 0 && (
              <div 
                className={`h-full bg-indigo-500 transition-all duration-500 ${skillsContrib === 0 ? 'rounded-l-full' : ''} ${projectsContrib === 0 ? 'rounded-r-full' : ''}`}
                style={{ width: `${milestoneContrib}%` }}
                title={`Roadmap Execution: ${milestoneProgressPercent}% (${Math.round(milestoneContrib)}/40%)`}
              />
            )}
            {projectsContrib > 0 && (
              <div 
                className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
                style={{ width: `${projectsContrib}%` }}
                title={`Portfolio Proof: ${projectsProgressPercent}% (${Math.round(projectsContrib)}/20%)`}
              />
            )}
          </div>

          {/* Legend & Breakdown */}
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-0.5">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Skills ({Math.round(skillsContrib)}/40%)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Roadmap ({Math.round(milestoneContrib)}/40%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Projects ({Math.round(projectsContrib)}/20%)
            </span>
          </div>
        </div>
      </div>

      {/* 3-Pillar Breakdown Rows */}
      <div className="space-y-2.5">
        {/* Row 1: Skills */}
        <div className="p-3 rounded-lg bg-canvas-surface/80 border border-border-subtle hover:border-border interactive-transition space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-neutral-200 font-medium">Core Skills Match</div>
                <div className="text-[11px] text-neutral-400">{skillsCount} of {skillsTarget} competencies verified</div>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-blue-400 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/40">
              {skillsProgressPercent}%
            </span>
          </div>
          {/* Mini Progress Fill Bar */}
          <div className="w-full h-1.5 bg-canvas rounded-full overflow-hidden border border-border-subtle/50">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${skillsProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Row 2: Roadmap Execution */}
        <div className="p-3 rounded-lg bg-canvas-surface/80 border border-border-subtle hover:border-border interactive-transition space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-neutral-200 font-medium">Roadmap Execution</div>
                <div className="text-[11px] text-neutral-400">{completedMilestones} of {totalMilestones} phases completed</div>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-800/40">
              {milestoneProgressPercent}%
            </span>
          </div>
          {/* Mini Progress Fill Bar */}
          <div className="w-full h-1.5 bg-canvas rounded-full overflow-hidden border border-border-subtle/50">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${milestoneProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Row 3: Portfolio Projects */}
        <div className="p-3 rounded-lg bg-canvas-surface/80 border border-border-subtle hover:border-border interactive-transition space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-neutral-200 font-medium">Portfolio Proof</div>
                <div className="text-[11px] text-neutral-400">{projectsCount} of {projectsTarget} capstones verified</div>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
              {projectsProgressPercent}%
            </span>
          </div>
          {/* Mini Progress Fill Bar */}
          <div className="w-full h-1.5 bg-canvas rounded-full overflow-hidden border border-border-subtle/50">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${projectsProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Hiring Company Readiness Benchmark (Unique Value-Add) */}
      <div className="p-3 rounded-lg bg-canvas-surface/40 border border-border-subtle space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-neutral-300" />
            <span>Hiring Tier Benchmark:</span>
          </span>
          <span className="text-accent-text font-semibold">
            {animatedScore >= 80 ? 'FAANG / Tier-1 Ready' : animatedScore >= 60 ? 'Scaleup Ready' : 'Startup Foundation'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center pt-0.5">
          <div className={`py-1 px-1.5 rounded border ${animatedScore >= 50 ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 font-semibold' : 'bg-canvas border-border text-neutral-500'}`}>
            Early Startups
          </div>
          <div className={`py-1 px-1.5 rounded border ${animatedScore >= 65 ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 font-semibold' : 'bg-canvas border-border text-neutral-500'}`}>
            Growth Scaleups
          </div>
          <div className={`py-1 px-1.5 rounded border ${animatedScore >= 80 ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 font-semibold' : 'bg-canvas border-border text-neutral-500'}`}>
            Tier-1 AI Labs
          </div>
        </div>
      </div>

      {/* Non-Overlapping Next High-Impact Action Lift Banner */}
      {nextMilestone && (
        <div className="p-3 rounded-lg bg-canvas border border-border text-xs space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-text" />
              <span>Recommended Next Action</span>
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.2 rounded shrink-0">
              +10% Lift
            </span>
          </div>

          <div className="text-xs text-neutral-200 font-medium leading-snug">
            Phase {nextMilestone.phase}: {nextMilestone.title}
          </div>
        </div>
      )}

    </div>
  );
}
