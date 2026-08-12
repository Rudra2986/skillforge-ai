import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2, MessageSquareCode } from 'lucide-react';

export default function InterviewQuestionHub({ questions = [], targetRole = "Full-Stack AI Engineer" }) {
  const [expandedId, setExpandedId] = useState(questions[0]?.id || null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-5 shadow-sm text-left font-sans">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3.5">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100 flex items-center space-x-2">
            <MessageSquareCode className="w-4 h-4 text-accent-text" />
            <span>Targeted Placement Interview Questions</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Technical &amp; system design questions curated specifically for {targetRole} placements.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-canvas-surface border border-border text-neutral-300">
          {questions.length} Curated Questions
        </span>
      </div>

      <div className="space-y-3">
        {questions.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className={`rounded-xl border interactive-transition overflow-hidden ${
                isExpanded 
                  ? 'bg-canvas-surface border-accent/40 shadow-xs' 
                  : 'bg-canvas-surface/60 border-border hover:border-border-strong'
              }`}
            >
              {/* Question Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleExpand(q.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-canvas border border-border-subtle text-accent-text font-semibold">
                      {q.topic}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">High Frequency</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-neutral-100 leading-snug">
                    {q.question}
                  </h3>
                </div>

                <div className="p-1 rounded-lg bg-canvas border border-border text-neutral-400 shrink-0 mt-0.5">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded AI Answer Blueprint */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-border-subtle bg-canvas/40 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-semibold">AI Interview Answer Blueprint:</span>
                  </div>

                  <ul className="space-y-1.5 pl-1">
                    {q.ideal_answer_points?.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-neutral-300 flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
