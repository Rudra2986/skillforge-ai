import React from 'react';
import { Award, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CertificationRecommendations({ certifications = [] }) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-4 shadow-sm text-left font-sans">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Recommended Industry Certifications</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            High-ROI certifications aligned with benchmark hiring requirements.
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {certifications.length} High-Impact Certs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-4 rounded-xl bg-canvas-surface border border-border hover:border-border-strong interactive-transition flex flex-col justify-between space-y-2.5"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-canvas border border-border-subtle text-amber-400 font-semibold">
                  {cert.issuer}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                  {cert.impact}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-100">
                {cert.title}
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Focus Areas: <span className="text-neutral-300 font-medium">{cert.focus}</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[11px] font-mono text-neutral-400">
              <span>Level: <strong className="text-neutral-200">{cert.level}</strong></span>
              <span className="text-accent-text flex items-center gap-1 font-sans font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Placement Aligned
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
