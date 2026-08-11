import React, { useState } from 'react';
import Navbar from './components/Navbar';
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
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { careerData, toggleMilestone } = useCareer();

  return (
    <div className="min-h-screen bg-canvas text-neutral-200 flex flex-col">
      {/* 1. Header Navigation */}
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Hero Summary Bar */}
        <section className="bg-canvas-subtle border border-border rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-accent-text bg-accent-subtle/50 px-2 py-0.5 rounded border border-accent/20">
                Active Student Profile
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Updated just now
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-100">
              {careerData?.candidate_name || "Alex Rivera"}
            </h1>
            <p className="text-sm text-neutral-400">
              {careerData?.education} • Targeting <span className="text-neutral-200 font-medium">{careerData?.target_role}</span>
            </p>
          </div>

          {/* Placement Readiness Badge */}
          <div className="flex items-center space-x-4 bg-canvas-surface border border-border p-3.5 rounded-lg">
            <div className="text-right">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Placement Readiness</div>
              <div className="text-2xl font-bold text-neutral-100">{careerData?.readiness_score || 64}%</div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center text-xs font-bold text-accent-text bg-accent-subtle/30">
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
                    className="px-2.5 py-1 text-xs font-medium bg-canvas-surface border border-border rounded text-neutral-300"
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
                    className="flex items-center justify-between p-2.5 rounded bg-canvas-surface border border-border-subtle text-xs"
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
                          onClick={() => toggleMilestone(milestone.id)}
                          className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center interactive-transition ${
                            milestone.completed
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-neutral-500 hover:border-neutral-300 bg-canvas'
                          }`}
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
                          <span className="w-1 h-1 rounded-full bg-neutral-500"></span>
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

      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-canvas-subtle py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-neutral-400">
          <div>SkillForge AI • Personal Career & Learning Mentor</div>
          <div className="font-mono text-[11px]">GDG Hackathon 2026</div>
        </div>
      </footer>
    </div>
  );
}
