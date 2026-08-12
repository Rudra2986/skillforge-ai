import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Clock, 
  Layers,
  Code2,
  ShieldCheck
} from 'lucide-react';

const AVAILABLE_ROLES = [
  { id: 'Full-Stack AI Engineer', label: 'Full-Stack AI Engineer', desc: 'React, FastAPI, Vector DBs, RAG' },
  { id: 'Data Scientist / ML Engineer', label: 'Data Scientist / ML Engineer', desc: 'Python, PyTorch, MLOps, Model Serving' },
  { id: 'Cloud DevOps & Platform Engineer', label: 'Cloud DevOps & Platform Engineer', desc: 'Docker, Kubernetes, CI/CD, AWS' }
];

export default function ProfileReviewModal({ isOpen, onClose, initialData, onGenerateRoadmap }) {
  const [candidateName, setCandidateName] = useState('');
  const [education, setEducation] = useState('');
  const [targetRole, setTargetRole] = useState('Full-Stack AI Engineer');
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [timelineWeeks, setTimelineWeeks] = useState(12);
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level / Intern');

  // Populate form fields when initialData changes or modal opens
  useEffect(() => {
    if (initialData) {
      setCandidateName(initialData.candidate_name || 'Alex Rivera');
      setEducation(initialData.education || 'B.Tech Computer Science, 3rd Year');
      setTargetRole(initialData.target_role || 'Full-Stack AI Engineer');
      setSkills(Array.isArray(initialData.current_skills) ? [...initialData.current_skills] : ['React', 'Python', 'Git']);
      setTimelineWeeks(initialData.timeline_weeks || 12);
      setExperienceLevel(initialData.experience_level || 'Entry-Level / Intern');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verifiedProfile = {
      candidate_name: candidateName,
      education,
      target_role: targetRole,
      current_skills: skills,
      timeline_weeks: timelineWeeks,
      experience_level: experienceLevel
    };

    if (onGenerateRoadmap) {
      onGenerateRoadmap(verifiedProfile);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-canvas-subtle border border-border rounded-2xl shadow-modal overflow-hidden text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>

        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-start justify-between bg-canvas-surface/60">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-[11px] font-mono text-accent-text">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Step 2 of 2: Human-in-the-Loop Review</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">
              Verify Extracted Profile &amp; Career Target
            </h2>
            <p className="text-xs text-neutral-400">
              Confirm your extracted credentials or customize your target role before generating your AI roadmap.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-canvas-elevated interactive-transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Candidate Name & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-accent-text" />
                <span>Candidate Name</span>
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-canvas-surface border border-border focus:border-accent rounded-lg text-xs text-neutral-100 outline-none interactive-transition"
                placeholder="e.g. Alex Rivera"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-accent-text" />
                <span>Education / Background</span>
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
                className="w-full px-3 py-2 bg-canvas-surface border border-border focus:border-accent rounded-lg text-xs text-neutral-100 outline-none interactive-transition"
                placeholder="e.g. B.Tech Computer Science, 3rd Year"
              />
            </div>
          </div>

          {/* Row 2: Target Career Goal */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Career Role &amp; Benchmark</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {AVAILABLE_ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setTargetRole(role.id)}
                  className={`p-3 rounded-xl text-left border interactive-transition flex flex-col justify-between ${
                    targetRole === role.id
                      ? 'bg-accent/15 border-accent text-white shadow-sm ring-1 ring-accent'
                      : 'bg-canvas-surface hover:bg-canvas-elevated border-border text-neutral-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold leading-tight">{role.label}</div>
                    <div className="text-[10px] text-neutral-400 mt-1">{role.desc}</div>
                  </div>
                  {targetRole === role.id && (
                    <div className="mt-2 text-[10px] font-mono text-accent-text flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active Target</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Interactive Verified Skill Tags */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Skills ({skills.length}):</span>
              </label>
              <span className="text-[11px] text-neutral-500">Click ✕ to remove or type to add</span>
            </div>

            {/* Skill Chips Container */}
            <div className="p-3 bg-canvas-surface border border-border rounded-xl flex flex-wrap gap-2 min-h-[50px] items-center">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-canvas-elevated border border-border text-xs font-medium text-neutral-200 group hover:border-rose-500/50 interactive-transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 text-neutral-400 hover:text-rose-400 rounded-full interactive-transition"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {skills.length === 0 && (
                <span className="text-xs text-neutral-500 italic">No skills added yet. Type below to add.</span>
              )}
            </div>

            {/* Add Skill Input Form */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-canvas-surface border border-border focus:border-accent rounded-lg text-xs text-neutral-100 outline-none interactive-transition"
                placeholder="Type a skill and press Enter (e.g. Docker, GraphQL, PyTorch)..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-canvas-elevated hover:bg-canvas-surface border border-border hover:border-accent/60 text-xs font-semibold text-neutral-200 rounded-lg interactive-transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 text-accent-text" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Row 4: Timeline & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-accent-text" />
                <span>Target Timeline</span>
              </label>
              <select
                value={timelineWeeks}
                onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-canvas-surface border border-border focus:border-accent rounded-lg text-xs text-neutral-200 outline-none interactive-transition"
              >
                <option value={8}>8 Weeks (Intensive Placement Track)</option>
                <option value={12}>12 Weeks (Standard Semester Pace)</option>
                <option value={16}>16 Weeks (Comprehensive Mastery)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-text" />
                <span>Current Experience Level</span>
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-surface border border-border focus:border-accent rounded-lg text-xs text-neutral-200 outline-none interactive-transition"
              >
                <option value="Entry-Level / Intern">Entry-Level / College Intern</option>
                <option value="Fresher / 0-1 Year">Fresher Graduate (0 - 1 Year)</option>
                <option value="Junior Engineer">Junior Developer (1 - 2 Years)</option>
              </select>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200 interactive-transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl interactive-transition shadow-lg shadow-accent/25 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate My AI Career Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
