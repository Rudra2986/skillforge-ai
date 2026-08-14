import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  X, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ShieldAlert,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function SkillGapVisualizer({ 
  verifiedSkills = [], 
  targetRole = "Full-Stack AI Engineer",
  roadmap = []
}) {
  const { addSkill, removeSkill, careerData } = useCareer();
  const [newSkillInput, setNewSkillInput] = useState('');

  // Extract missing skills from roadmap milestones
  const missingSkills = roadmap
    .filter(m => m.skill && !verifiedSkills.some(s => s.toLowerCase() === m.skill.toLowerCase()))
    .map(m => ({
      name: m.skill,
      priority: m.category?.toLowerCase().includes('foundation') ? 'High' : 'Medium',
      hours: m.estimated_hours || 10
    }));

  const totalRequired = verifiedSkills.length + missingSkills.length;
  const matchPercentage = totalRequired > 0 
    ? Math.round((verifiedSkills.length / totalRequired) * 100) 
    : 65;

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim()) {
      addSkill(newSkillInput.trim());
      setNewSkillInput('');
    }
  };

  return (
    <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-6 shadow-sm text-left">
      
      {/* Header & Alignment Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-accent-text" />
            <h2 className="text-base font-semibold text-neutral-100">
              Target Role Benchmark &amp; Competency Gap
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Comparing your verified resume portfolio against industry expectations for <span className="text-neutral-200 font-semibold">{targetRole}</span>.
          </p>
        </div>

        {/* Alignment Score Badge */}
        <div className="flex items-center space-x-3 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-canvas-surface border border-border shadow-xs">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">Skill Alignment</span>
            <div className="text-base font-bold font-mono text-emerald-400">
              {matchPercentage}% Match
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Comparison: Verified vs Missing Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Column: Verified Technical Proficiencies */}
        <div className="p-4 sm:p-5 rounded-xl bg-canvas-surface border border-border space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-neutral-100 uppercase tracking-wider font-mono">
                Verified Proficiencies ({verifiedSkills.length})
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              ✓ Verified
            </span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[80px] content-start">
            {verifiedSkills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-emerald-900/40 text-xs text-neutral-200 group"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-neutral-500 hover:text-rose-400 p-0.5 rounded opacity-0 group-hover:opacity-100 interactive-transition ml-0.5"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Quick Add Custom Skill Form */}
          <form onSubmit={handleAddSkill} className="pt-2 border-t border-border-subtle flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add another verified skill (e.g. Redis)..."
              className="flex-1 bg-canvas border border-border rounded-lg px-3 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!newSkillInput.trim()}
              className="px-3 py-1.5 bg-canvas-elevated hover:bg-accent text-neutral-200 hover:text-white text-xs font-semibold rounded-lg border border-border hover:border-accent interactive-transition disabled:opacity-40 cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Right Column: High-Impact Skill Gaps */}
        <div className="p-4 sm:p-5 rounded-xl bg-canvas-surface border border-border space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-neutral-100 uppercase tracking-wider font-mono">
                Identified Skill Deficiencies ({missingSkills.length})
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              Needs Focus
            </span>
          </div>

          <div className="space-y-2.5 min-h-[80px]">
            {missingSkills.length > 0 ? (
              missingSkills.map((gap, gIdx) => (
                <div 
                  key={gIdx}
                  className="p-2.5 rounded-lg bg-canvas border border-border-subtle flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-100">{gap.name}</span>
                      <div className="text-[10px] font-mono text-neutral-400">~{gap.hours}h recommended path</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                      gap.priority === 'High'
                        ? 'bg-rose-950/70 border border-rose-800 text-rose-300'
                        : 'bg-amber-950/70 border border-amber-800 text-amber-300'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400 font-mono py-4">
                🎉 No critical gaps found! Your skills match this role benchmark.
              </div>
            )}
          </div>

          <p className="text-[11px] text-neutral-400 pt-1">
            💡 Check off milestones in the timeline above as you master each competency to raise your Placement Readiness Score.
          </p>
        </div>

      </div>

    </div>
  );
}
