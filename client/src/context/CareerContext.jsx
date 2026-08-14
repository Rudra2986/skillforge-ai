import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '../services/mockData';
import { useAuth } from './AuthContext';
import { progressAPI } from '../services/api';

const CareerContext = createContext(null);

export function CareerProvider({ children }) {
  const { user, isGuest, activePersonaKey } = useAuth();

  // Role keyword benchmark dictionary
  const ROLE_BENCHMARK_KEYWORDS = {
    ai: ["python", "pytorch", "tensorflow", "keras", "fastapi", "scikit-learn", "xgboost", "pandas", "numpy", "docker", "mlflow", "nlp", "transformers", "langchain", "pgvector", "redis", "kubernetes", "sql", "postgresql", "rest apis", "react.js", "react"],
    data: ["python", "pandas", "numpy", "sql", "scikit-learn", "xgboost", "matplotlib", "seaborn", "pytorch", "tensorflow", "spark", "pyspark", "airflow", "postgresql", "tableau", "power bi", "mlflow", "statistics", "data modeling"],
    fullstack: ["javascript", "typescript", "react", "react.js", "node.js", "express", "python", "fastapi", "html", "css", "tailwind", "sql", "postgresql", "mongodb", "docker", "rest apis", "graphql", "redis", "git", "ci/cd"],
    devops: ["docker", "kubernetes", "terraform", "aws", "linux", "bash", "ci/cd", "github actions", "prometheus", "grafana", "nginx", "python", "ansible", "helm", "networking"]
  };

  const getTargetRoleKeywords = (roleStr) => {
    const r = (roleStr || '').toLowerCase();
    if (r.includes('data') || r.includes('analytics')) return ROLE_BENCHMARK_KEYWORDS.data;
    if (r.includes('devops') || r.includes('cloud') || r.includes('infrastructure')) return ROLE_BENCHMARK_KEYWORDS.devops;
    if (r.includes('ai') || r.includes('ml') || r.includes('machine')) return ROLE_BENCHMARK_KEYWORDS.ai;
    return ROLE_BENCHMARK_KEYWORDS.fullstack;
  };

  // Multi-factor benchmark readiness score formula (Exact sum: 40% Skills + 40% Roadmap + 20% Projects)
  const calculateReadinessScore = (skills = [], roadmap = [], projects = [], targetRole = "Full-Stack AI Engineer") => {
    // Technical Skills: Only calculate skills that are relevant to target job benchmark (Up to 40%)
    const relevantKeywords = getTargetRoleKeywords(targetRole);
    const matchedRoleSkills = (skills || []).filter(s => {
      const sLower = (s || '').toLowerCase();
      return relevantKeywords.some(k => sLower.includes(k) || k.includes(sLower));
    });

    const matchedSkillsCount = matchedRoleSkills.length;
    const roleBenchmarkTotal = Math.max(10, matchedSkillsCount + 4);
    const skillsProgressPercent = Math.min(100, Math.round((matchedSkillsCount / roleBenchmarkTotal) * 100));
    const skillsScore = Math.round((skillsProgressPercent / 100) * 40);

    // Roadmap Milestone Execution: Up to 40%
    const completedCount = (roadmap || []).filter(m => m.completed).length;
    const totalMilestones = (roadmap || []).length || 3;
    const milestoneScore = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 40) : 0;

    // Portfolio Proof Projects: Up to 20%
    const projectsCount = (projects || []).length || 0;
    const projectsTarget = 2;
    const projectScore = Math.min(20, Math.round((projectsCount / projectsTarget) * 20));

    const total = skillsScore + milestoneScore + projectScore;
    return Math.min(100, Math.max(0, total));
  };

  // Helper to get sanitized persona data
  const getPersonaData = (key) => {
    const validKey = DEMO_PERSONAS[key] ? key : 'fullstack';
    const defaultPersona = DEMO_PERSONAS[validKey];
    const savedDataStr = localStorage.getItem(`skillforge_career_${validKey}`);
    
    if (savedDataStr) {
      try {
        const parsed = JSON.parse(savedDataStr);
        if (parsed && parsed.candidate_name === defaultPersona.candidate_name) {
          return parsed;
        }
      } catch (e) {}
    }
    return defaultPersona;
  };

  // Synchronous initialization from localStorage
  const [careerData, setCareerData] = useState(() => {
    const savedUserCareer = localStorage.getItem('skillforge_user_career_data');
    if (savedUserCareer) {
      try {
        const parsed = JSON.parse(savedUserCareer);
        if (parsed && parsed.roadmap && parsed.roadmap.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    const savedPersona = localStorage.getItem('skillforge_active_persona') || 'fullstack';
    return getPersonaData(savedPersona);
  });

  // Track if roadmap has been explicitly generated/unlocked in this active session
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(() => {
    const savedUserCareer = localStorage.getItem('skillforge_user_career_data');
    const hasFlag = localStorage.getItem('skillforge_has_generated_roadmap') === 'true';
    if (savedUserCareer || hasFlag) return true;
    return false;
  });

  // Restore saved roadmap from backend if user is authenticated
  useEffect(() => {
    async function loadBackendRoadmap() {
      const token = localStorage.getItem('token');
      if (token && user?.id) {
        try {
          const savedPackage = await progressAPI.getSavedRoadmap();
          if (savedPackage && savedPackage.roadmap && savedPackage.roadmap.length > 0) {
            setCareerData(savedPackage);
            setHasGeneratedRoadmap(true);
            localStorage.setItem('skillforge_has_generated_roadmap', 'true');
            localStorage.setItem(`skillforge_user_career_${user.id}`, JSON.stringify(savedPackage));
            return;
          }
        } catch (err) {
          // Fresh new user who hasn't uploaded a resume yet
        }

        // Check if there is cached data specifically for this user
        const userCache = localStorage.getItem(`skillforge_user_career_${user.id}`);
        if (userCache) {
          try {
            const parsed = JSON.parse(userCache);
            if (parsed && parsed.roadmap && parsed.roadmap.length > 0) {
              setCareerData(parsed);
              setHasGeneratedRoadmap(true);
              return;
            }
          } catch (e) {}
        }

        // New user with no roadmap yet: require Resume Ingestion first!
        setCareerData({
          candidate_name: user.name || user.user_metadata?.full_name || 'Candidate',
          education: '',
          target_role: user.user_metadata?.target_role || 'Full-Stack AI Engineer',
          current_skills: [],
          readiness_score: 0,
          roadmap: [],
          projects: [],
          skills_missing: [],
          skills_present: []
        });
        setHasGeneratedRoadmap(false);
        localStorage.removeItem('skillforge_has_generated_roadmap');
      }
    }

    if (user?.id) {
      loadBackendRoadmap();
    }
  }, [user?.id]);

  // Keep state synced with active persona switch ONLY when explicitly chosen in guest mode
  useEffect(() => {
    const hasSavedUserRoadmap = localStorage.getItem('skillforge_has_generated_roadmap') === 'true';
    const hasToken = !!localStorage.getItem('token');
    
    // Do NOT wipe generated roadmap if user already generated one
    if (!hasToken && !hasSavedUserRoadmap && isGuest && activePersonaKey && DEMO_PERSONAS[activePersonaKey]) {
      const data = getPersonaData(activePersonaKey);
      setCareerData(data);
      localStorage.setItem(`skillforge_career_${activePersonaKey}`, JSON.stringify(data));
    }
  }, [activePersonaKey, isGuest]);

  // Persist to local storage and backend
  const saveCareerData = async (newData) => {
    setCareerData(newData);
    setHasGeneratedRoadmap(true);
    localStorage.setItem('skillforge_has_generated_roadmap', 'true');
    
    if (user?.id) {
      localStorage.setItem(`skillforge_user_career_${user.id}`, JSON.stringify(newData));
    }
    localStorage.setItem('skillforge_user_career_data', JSON.stringify(newData));

    const key = activePersonaKey || 'fullstack';
    localStorage.setItem(`skillforge_career_${key}`, JSON.stringify(newData));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await progressAPI.saveRoadmap(newData);
      } catch (e) {
        console.warn("Could not sync roadmap to cloud database:", e);
      }
    }
  };

  // Force reset a persona to fresh default demo data
  const resetPersonaData = (key) => {
    const validKey = DEMO_PERSONAS[key] ? key : 'fullstack';
    const pristine = DEMO_PERSONAS[validKey];
    localStorage.setItem(`skillforge_career_${validKey}`, JSON.stringify(pristine));
    localStorage.removeItem(`skillforge_roadmap_generated_${validKey}`);
    setHasGeneratedRoadmap(false);
    if (activePersonaKey === validKey) {
      setCareerData(pristine);
    }
    return pristine;
  };

  // Toggle milestone completion & recalculate readiness score dynamically
  const toggleMilestone = async (milestoneId) => {
    if (!careerData?.roadmap) return;

    let targetCompleted = false;
    const updatedRoadmap = careerData.roadmap.map((milestone) => {
      if (milestone.id === milestoneId) {
        targetCompleted = !milestone.completed;
        return { ...milestone, completed: targetCompleted };
      }
      return milestone;
    });

    const newScore = calculateReadinessScore(
      careerData.current_skills || [],
      updatedRoadmap,
      careerData.projects || []
    );

    const updatedData = {
      ...careerData,
      readiness_score: newScore,
      roadmap: updatedRoadmap
    };

    setCareerData(updatedData);
    const key = activePersonaKey || 'fullstack';
    localStorage.setItem(`skillforge_career_${key}`, JSON.stringify(updatedData));

    const token = localStorage.getItem('token');
    if (token && !isGuest) {
      localStorage.setItem('skillforge_user_career_data', JSON.stringify(updatedData));
      try {
        const response = await progressAPI.updateMilestone(milestoneId, targetCompleted);
        if (response && typeof response.readiness_score === 'number') {
          setCareerData(prev => ({
            ...prev,
            readiness_score: response.readiness_score
          }));
        }
      } catch (e) {}
    }
  };

  // Add a verified technical skill inline from the dashboard
  const addSkill = (newSkillName) => {
    const trimmed = newSkillName.trim();
    if (!trimmed) return;

    const existingSkills = careerData.current_skills || [];
    if (existingSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) return;

    const updatedSkills = [...existingSkills, trimmed];
    const newScore = calculateReadinessScore(
      updatedSkills,
      careerData.roadmap || [],
      careerData.projects || []
    );

    const updatedData = {
      ...careerData,
      current_skills: updatedSkills,
      readiness_score: newScore
    };
    saveCareerData(updatedData);
  };

  // Remove a verified skill
  const removeSkill = (skillToRemove) => {
    const existingSkills = careerData.current_skills || [];
    const updatedSkills = existingSkills.filter(s => s !== skillToRemove);
    const newScore = calculateReadinessScore(
      updatedSkills,
      careerData.roadmap || [],
      careerData.projects || []
    );

    const updatedData = {
      ...careerData,
      current_skills: updatedSkills,
      readiness_score: newScore
    };
    saveCareerData(updatedData);
  };

  // Add / Toggle a verified capstone project
  const addOrToggleProject = (project) => {
    const existingProjects = careerData.projects || [];
    const exists = existingProjects.some(p => p.title.toLowerCase() === project.title.toLowerCase());

    let updatedProjects;
    if (exists) {
      updatedProjects = existingProjects.filter(p => p.title.toLowerCase() !== project.title.toLowerCase());
    } else {
      updatedProjects = [...existingProjects, project];
    }

    const newScore = calculateReadinessScore(
      careerData.current_skills || [],
      careerData.roadmap || [],
      updatedProjects
    );

    const updatedData = {
      ...careerData,
      projects: updatedProjects,
      readiness_score: newScore
    };
    saveCareerData(updatedData);
  };

  // Human-in-the-Loop Profile Update (Called after Step 2/3/4 verification)
  const updateVerifiedProfile = (verifiedFields) => {
    const newSkills = verifiedFields.current_skills || careerData.current_skills || [];
    const newRoadmap = verifiedFields.roadmap || careerData.roadmap || [];
    const newProjects = verifiedFields.projects || careerData.projects || [];
    
    const newScore = calculateReadinessScore(
      newSkills,
      newRoadmap,
      newProjects
    );

    const updatedData = {
      ...careerData,
      ...verifiedFields,
      readiness_score: newScore,
      summary_assessment: `Profile verified with ${newSkills.length} skills targeting ${verifiedFields.target_role || careerData.target_role}.`
    };

    setHasGeneratedRoadmap(true);
    localStorage.setItem('skillforge_has_generated_roadmap', 'true');
    saveCareerData(updatedData);
  };

  return (
    <CareerContext.Provider value={{
      careerData,
      hasGeneratedRoadmap,
      setHasGeneratedRoadmap,
      saveCareerData,
      resetPersonaData,
      calculateReadinessScore,
      toggleMilestone,
      addSkill,
      removeSkill,
      addOrToggleProject,
      updateVerifiedProfile
    }}>
      {children}
    </CareerContext.Provider>
  );
}

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
