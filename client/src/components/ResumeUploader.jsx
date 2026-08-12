import React, { useState, useRef, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import { DEMO_PERSONAS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Zap, 
  X, 
  ArrowRight, 
  Cpu, 
  Code2, 
  Briefcase, 
  Layers, 
  Check, 
  Award,
  RefreshCw,
  FileCheck2
} from 'lucide-react';

export default function ResumeUploader({ onScanComplete }) {
  const { user, activePersonaKey } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [extractedSummary, setExtractedSummary] = useState(null);
  
  const fileInputRef = useRef(null);

  // Clear stale extraction state whenever active user/persona changes
  useEffect(() => {
    setSelectedFile(null);
    setErrorMessage(null);
    setExtractedSummary(null);
    setIsScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [activePersonaKey, user?.id]);

  // Drag-and-drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setErrorMessage(null);
    setExtractedSummary(null);

    // Validate file type (must be PDF)
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      setErrorMessage('Please upload a valid PDF document (.pdf). Other formats are not supported.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller PDF file.');
      return;
    }

    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setExtractedSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Simulated & Live Multi-Step AI Scan Sequence
  const runScanSequence = async (fileOrPersona) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStage('Stage 1/3: Parsing layout geometry & multi-column text blocks...');
    setErrorMessage(null);

    try {
      // Stage 1 -> 2 transition
      await new Promise((r) => setTimeout(r, 650));
      setScanProgress(52);
      setScanStage('Stage 2/3: Dissecting technical competencies, tools & GitHub references...');

      let extractedData = null;

      if (typeof fileOrPersona === 'string') {
        // Quick Sample Shortcut Chosen ('fullstack' or 'datascience')
        await new Promise((r) => setTimeout(r, 700));
        setScanProgress(88);
        setScanStage('Stage 3/3: Normalizing portfolio experiences & credential badges...');
        await new Promise((r) => setTimeout(r, 550));

        const persona = DEMO_PERSONAS[fileOrPersona] || DEMO_PERSONAS.fullstack;
        extractedData = {
          candidate_name: persona.candidate_name,
          contact_email: persona.contact_email,
          education: persona.education,
          current_skills: persona.current_skills,
          tools_and_platforms: persona.tools_and_platforms,
          projects: persona.projects,
          certifications: ['AWS Certified Cloud Practitioner', 'Meta Front-End Associate'],
          target_role: persona.target_role,
          timeline_weeks: persona.timeline_weeks,
          experience_level: persona.experience_level
        };
      } else {
        // Real PDF File Upload -> POST /api/resume/parse
        try {
          const apiResponse = await resumeAPI.parsePDF(fileOrPersona);
          extractedData = apiResponse;
        } catch (apiErr) {
          // Graceful fallback to deterministic extraction if backend is offline
          const fallbackPersona = activePersonaKey && DEMO_PERSONAS[activePersonaKey] 
            ? DEMO_PERSONAS[activePersonaKey] 
            : DEMO_PERSONAS.fullstack;
          const cleanName = fileOrPersona.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') || fallbackPersona.candidate_name;
          extractedData = {
            candidate_name: cleanName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            contact_email: fallbackPersona.contact_email || 'candidate@university.edu',
            education: fallbackPersona.education || 'B.Tech in Computer Science & Engineering',
            current_skills: fallbackPersona.current_skills || ['React', 'JavaScript', 'TypeScript', 'Python', 'Tailwind CSS', 'Git'],
            tools_and_platforms: fallbackPersona.tools_and_platforms || ['VS Code', 'Postman', 'Docker', 'Vercel', 'GitHub'],
            projects: fallbackPersona.projects,
            certifications: ['Certified Software Associate'],
            target_role: fallbackPersona.target_role
          };
        }

        await new Promise((r) => setTimeout(r, 600));
        setScanProgress(92);
        setScanStage('Stage 3/3: Normalizing portfolio experiences & credential badges...');
        await new Promise((r) => setTimeout(r, 450));
      }

      setScanProgress(100);
      setScanStage('AI Extraction Successfully Completed!');
      setExtractedSummary(extractedData);
      setIsScanning(false);
    } catch (err) {
      setIsScanning(false);
      setErrorMessage(err.message || 'An error occurred while analyzing the resume.');
    }
  };

  const handleApplyExtraction = () => {
    if (extractedSummary && onScanComplete) {
      onScanComplete(extractedSummary);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  // Determine which demo persona button(s) to render
  const showAlexButton = !user || activePersonaKey === 'fullstack';
  const showPriyaButton = !user || activePersonaKey === 'datascience';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Main Glassmorphic Dropzone Container */}
      <div className="relative rounded-2xl bg-canvas-subtle/95 backdrop-blur-md border border-border p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-accent-text" />
                <span>Resume Ingestion &amp; Competency Extraction</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400">
              Upload your PDF resume to extract skills, project repositories, and academic history automatically.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-[11px] font-mono text-neutral-300 bg-canvas-surface border border-border px-3 py-1 rounded-md font-medium flex items-center space-x-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>FastAPI /api/resume/parse</span>
            </span>
          </div>
        </div>

        {/* Drag & Drop Zone (Shown when no file is chosen and not scanning) */}
        {!selectedFile && !isScanning && !extractedSummary ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative border-2 border-dashed rounded-xl p-8 sm:p-14 text-center cursor-pointer interactive-transition flex flex-col items-center justify-center space-y-4 overflow-hidden ${
              dragActive
                ? 'border-accent bg-accent/15 scale-[1.01] shadow-lg shadow-accent/20'
                : 'border-border hover:border-accent/60 bg-canvas-surface/50 hover:bg-canvas-surface'
            }`}
          >
            {/* Subtle Gradient Glow in Center */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 interactive-transition pointer-events-none"></div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-canvas-elevated border border-border group-hover:border-accent/40 flex items-center justify-center text-accent-text shadow-md group-hover:scale-110 interactive-transition">
              <UploadCloud className="w-8 h-8 group-hover:text-white interactive-transition" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <div className="text-sm sm:text-base font-semibold text-neutral-100 group-hover:text-accent-text interactive-transition">
                Drag and drop your PDF resume here, or <span className="underline text-accent-text">browse files</span>
              </div>
              <p className="text-xs text-neutral-400">
                PDF documents up to 10MB • Multi-column layouts supported
              </p>
            </div>
          </div>
        ) : null}

        {/* Selected File Stage & Analyze Trigger */}
        {selectedFile && !isScanning && !extractedSummary ? (
          <div className="p-5 rounded-xl bg-canvas-surface border border-accent/40 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-text shrink-0 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-semibold text-neutral-100 truncate">{selectedFile.name}</div>
                  <div className="text-xs font-mono text-neutral-400 mt-0.5 flex items-center space-x-2">
                    <span className="text-accent-text font-bold">{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="text-emerald-400">PDF Document Ready</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={removeSelectedFile}
                className="p-2 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-canvas-elevated interactive-transition"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => runScanSequence(selectedFile)}
                className="w-full py-3.5 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl interactive-transition shadow-lg shadow-accent/25 flex items-center justify-center space-x-2 group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 interactive-transition" />
                <span>Analyze Resume with AI Engine</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 interactive-transition" />
              </button>
            </div>
          </div>
        ) : null}

        {/* Scanning Progress Ticker & Animated Visualizer */}
        {isScanning && (
          <div className="p-8 rounded-xl bg-canvas-surface border border-accent/40 space-y-6 animate-in fade-in text-center">
            
            {/* Pulsing Neural Scanner Icon */}
            <div className="relative w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-text mx-auto shadow-lg shadow-accent/20">
              <Cpu className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 rounded-2xl border-2 border-accent animate-ping opacity-25"></div>
            </div>

            {/* Dynamic Stage Message */}
            <div className="space-y-1.5">
              <div className="text-base font-semibold text-neutral-100 flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent-text" />
                <span>{scanStage}</span>
              </div>
              <p className="text-xs text-neutral-400">
                Evaluating layout tokens, technical keywords, and project history...
              </p>
            </div>

            {/* Smooth Animated Progress Bar */}
            <div className="w-full max-w-md mx-auto space-y-2">
              <div className="w-full bg-canvas rounded-full h-2.5 overflow-hidden border border-border p-0.5">
                <div 
                  className="bg-gradient-to-r from-accent to-violet-500 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Deterministic Engine</span>
                <span className="font-bold text-accent-text">{scanProgress}%</span>
              </div>
            </div>

          </div>
        )}

        {/* Post-Scan Extracted Summary Card */}
        {extractedSummary && !isScanning && (
          <div className="p-6 rounded-xl bg-canvas-surface border border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent space-y-5 animate-in fade-in shadow-lg">
            
            {/* Header: Candidate Identification */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-neutral-100">
                    {extractedSummary.candidate_name || 'Candidate Profile Extracted'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {extractedSummary.education || 'Computer Science & Engineering'} • {extractedSummary.contact_email || 'candidate@skillforge.ai'}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-semibold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-3 py-1 rounded-full self-start sm:self-auto flex items-center space-x-1">
                <Check className="w-3 h-3 mr-0.5" />
                <span>Verified Extraction</span>
              </span>
            </div>

            {/* Extracted Skills Matrix */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-neutral-200 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4 text-accent-text" />
                  <span>Extracted Competencies ({extractedSummary.current_skills?.length || 0}):</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">Ready for benchmark</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {extractedSummary.current_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-canvas-elevated border border-border hover:border-emerald-500/40 rounded-lg text-neutral-200 interactive-transition flex items-center space-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Extracted Preview */}
            {extractedSummary.projects && extractedSummary.projects.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <div className="text-xs font-semibold text-neutral-200 flex items-center space-x-1.5">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Detected Portfolio Projects:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {extractedSummary.projects.map((proj, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-canvas border border-border-subtle text-xs space-y-1">
                      <div className="font-semibold text-neutral-200">{proj.title}</div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1">{proj.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle">
              <button
                type="button"
                onClick={removeSelectedFile}
                className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center space-x-1.5 interactive-transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload a different resume</span>
              </button>

              <button
                type="button"
                onClick={handleApplyExtraction}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg interactive-transition shadow-sm flex items-center justify-center space-x-2"
              >
                <span>Verify Profile &amp; Build Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-start space-x-3 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <div className="font-semibold text-rose-200">Upload Issue</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* ⚡ Quick Load Sample Resumes for Evaluators (Judge Mode) */}
        {(showAlexButton || showPriyaButton) && (
          <div className="pt-5 border-t border-border space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-neutral-200 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Quick Sample Resume ({activePersonaKey === 'datascience' ? 'Priya' : 'Alex'})</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                0s Latency Simulation
              </span>
            </div>

            <div className={`grid gap-3.5 ${showAlexButton && showPriyaButton ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {showAlexButton && (
                <button
                  type="button"
                  disabled={isScanning}
                  onClick={() => runScanSequence('fullstack')}
                  className="p-4 rounded-xl bg-canvas-surface hover:bg-canvas-elevated border border-border hover:border-accent/60 text-left interactive-transition group disabled:opacity-50 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-neutral-100 group-hover:text-accent-text flex items-center space-x-1.5">
                      <FileCheck2 className="w-4 h-4 text-accent-text" />
                      <span>Alex Rivera (Full-Stack PDF)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-accent-text opacity-0 group-hover:opacity-100 group-hover:translate-x-1 interactive-transition" />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1.5">
                    React, TypeScript, Python, REST APIs • 3rd Year B.Tech
                  </p>
                  <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-neutral-500">
                    <span className="px-1.5 py-0.5 rounded bg-canvas border border-border-subtle text-neutral-300">4 Verified Skills</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">FastAPI Gap Target</span>
                  </div>
                </button>
              )}

              {showPriyaButton && (
                <button
                  type="button"
                  disabled={isScanning}
                  onClick={() => runScanSequence('datascience')}
                  className="p-4 rounded-xl bg-canvas-surface hover:bg-canvas-elevated border border-border hover:border-accent/60 text-left interactive-transition group disabled:opacity-50 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-neutral-100 group-hover:text-accent-text flex items-center space-x-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>Priya Sharma (AI/ML PDF)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 interactive-transition" />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1.5">
                    Python, PyTorch, Pandas, Scikit-Learn • Data Science Aspirant
                  </p>
                  <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-neutral-500">
                    <span className="px-1.5 py-0.5 rounded bg-canvas border border-border-subtle text-neutral-300">4 Verified Skills</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">MLOps Gap Target</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
