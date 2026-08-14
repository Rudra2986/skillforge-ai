import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Sparkles, 
  CheckCheck, 
  Target,
  ArrowRight,
  ListTodo,
  GraduationCap,
  Milestone
} from 'lucide-react';

export default function RoadmapTimeline({ roadmap = [], targetRole = "Full-Stack AI Engineer" }) {
  const { toggleMilestone, careerData } = useCareer();
  const [expandedMilestones, setExpandedMilestones] = useState({ [roadmap[0]?.id || 'm1']: true });
  const [updatingId, setUpdatingId] = useState(null);

  const toggleAccordion = (id) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggle = async (milestoneId) => {
    setUpdatingId(milestoneId);
    try {
      await toggleMilestone(milestoneId);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-canvas-subtle border border-border text-center space-y-3">
        <Milestone className="w-8 h-8 text-neutral-500 mx-auto" />
        <h3 className="text-sm font-semibold text-neutral-300">No Milestones Generated Yet</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Upload your resume or select a target role to generate your custom step-by-step career milestones.
        </p>
      </div>
    );
  }

  const completedCount = roadmap.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / roadmap.length) * 100);

  return (
    <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-6 shadow-sm text-left font-sans">
      
      {/* Header & Milestone Progress Bar */}
      <div className="space-y-3 border-b border-border-subtle pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-neutral-100 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-accent-text" />
              <span>Personalized Learning Roadmap &amp; Milestones</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Targeting: <span className="text-neutral-200 font-semibold">{targetRole}</span> • Step-by-step verified path to 100% placement readiness.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-canvas-surface border border-border text-neutral-300">
              {completedCount} / {roadmap.length} Completed
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-canvas-surface rounded-full h-2 overflow-hidden border border-border-subtle">
          <div 
            className={`h-full rounded-full interactive-transition ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-accent'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {roadmap.map((milestone, idx) => {
          const isCompleted = Boolean(milestone.completed);
          const isExpanded = Boolean(expandedMilestones[milestone.id]);
          const isBusy = updatingId === milestone.id;

          const actionItems = (milestone.action_items && milestone.action_items.length > 0)
            ? milestone.action_items
            : (milestone.topics && milestone.topics.length > 0)
              ? milestone.topics
              : [
                  `Master core principles & theoretical foundations for ${milestone.title}`,
                  `Build real-world implementation projects using industry tools`,
                  `Conduct placement mock drills & optimize benchmark throughput`
                ];

          const resourceItems = (milestone.curated_resources && milestone.curated_resources.length > 0)
            ? milestone.curated_resources
            : (milestone.resources && milestone.resources.length > 0)
              ? milestone.resources
              : [
                  `Official ${targetRole.split('/')[0].trim()} Documentation & API Reference`,
                  `Production Architecture Blueprint & GitHub Repository`
                ];

          const durationText = milestone.duration || (milestone.estimated_hours ? `${milestone.estimated_hours} hrs` : `Phase ${idx + 1} • ~3 Weeks`);

          return (
            <div key={milestone.id || idx} className="relative group">
              
              {/* Timeline Connector Dot / Checkbox Icon */}
              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleToggle(milestone.id)}
                className={`absolute -left-6 sm:-left-8 top-3.5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center interactive-transition cursor-pointer z-10 shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-500 text-canvas hover:bg-emerald-400 ring-4 ring-canvas'
                    : 'bg-canvas-surface text-neutral-400 hover:text-neutral-200 border border-border hover:border-accent ring-4 ring-canvas'
                }`}
                title={isCompleted ? "Mark milestone incomplete" : "Mark milestone complete"}
              >
                {isCompleted ? (
                  <CheckCheck className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="text-[10px] font-mono font-bold text-neutral-400">{idx + 1}</span>
                )}
              </button>

              {/* Milestone Card */}
              <div 
                className={`rounded-xl border interactive-transition overflow-hidden ${
                  isCompleted 
                    ? 'bg-canvas-surface/40 border-emerald-900/40 opacity-90' 
                    : isExpanded
                      ? 'bg-canvas-surface border-accent/40 shadow-sm'
                      : 'bg-canvas-surface/80 border-border hover:border-border-strong shadow-xs'
                }`}
              >
                {/* Milestone Summary Header */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent-text">
                        Phase {milestone.phase || idx + 1}
                      </span>

                      {durationText && (
                        <span className="text-[10px] font-mono text-neutral-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{durationText}</span>
                        </span>
                      )}

                      {milestone.skill && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-canvas border border-border-subtle text-neutral-300">
                          🎯 {milestone.skill}
                        </span>
                      )}

                      {isCompleted && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                          ✓ Verified Complete
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm sm:text-base font-semibold leading-snug ${
                      isCompleted ? 'text-neutral-300 line-through decoration-neutral-500' : 'text-neutral-100'
                    }`}>
                      {milestone.title}
                    </h3>

                    {milestone.description && (
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    )}
                  </div>

                  {/* Actions: Complete Button & Accordion Toggle */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggle(milestone.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold interactive-transition cursor-pointer border flex items-center space-x-1.5 ${
                        isCompleted
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
                          : 'bg-canvas hover:bg-canvas-elevated text-neutral-200 border-border hover:border-accent/40'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="hidden sm:inline">Mark Done</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAccordion(milestone.id)}
                      className="p-1.5 rounded-lg bg-canvas hover:bg-canvas-elevated border border-border text-neutral-400 hover:text-neutral-200 cursor-pointer"
                      title={isExpanded ? "Collapse details" : "Expand action items & resources"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Detailed Action Items & Resources Accordion */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-border-subtle bg-canvas/30 space-y-4 animate-in fade-in duration-200">
                    
                    {/* Action Items to Complete */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <ListTodo className="w-3.5 h-3.5 text-accent-text" />
                        <span>Actionable Tasks &amp; Learning Milestones:</span>
                      </span>

                      <div className="space-y-2">
                        {actionItems.map((item, aIdx) => (
                          <div 
                            key={aIdx} 
                            className="p-2.5 rounded-lg bg-canvas-surface border border-border-subtle flex items-start space-x-2.5 text-xs text-neutral-200 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></span>
                            <span className="flex-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Curated Resources */}
                    {resourceItems.length > 0 && (
                      <div className="space-y-2 pt-1 border-t border-border-subtle">
                        <span className="text-[11px] font-mono font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Curated Study Resources &amp; Documentation:</span>
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {resourceItems.map((res, rIdx) => {
                            const isDirectUrl = typeof res === 'string' && (res.startsWith('http://') || res.startsWith('https://'));
                            const linkUrl = isDirectUrl 
                              ? res 
                              : `https://www.google.com/search?q=${encodeURIComponent(res + ' official documentation tutorial')}`;

                            return (
                              <a 
                                key={rIdx}
                                href={linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-lg bg-canvas hover:bg-canvas-elevated border border-border-subtle hover:border-accent/50 flex items-center space-x-2 text-xs text-accent-text hover:text-accent-hover interactive-transition group shadow-xs cursor-pointer"
                                title={`Open resource: ${res}`}
                              >
                                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-400 group-hover:text-emerald-300 interactive-transition" />
                                <span className="truncate font-medium group-hover:underline">{res}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
