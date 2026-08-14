import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '../services/mockData';
import { useAuth } from './AuthContext';
import { progressAPI } from '../services/api';

const CareerContext = createContext(null);

export function CareerProvider({ children }) {
  const { user, isGuest, activePersonaKey } = useAuth();

  // Multi-factor benchmark readiness score formula (Exact sum: 40% Skills + 40% Roadmap + 20% Projects)
  const calculateReadinessScore = (skills = [], roadmap = [], projects = []) => {
    // Technical Skills: Up to 40%
    const skillsCount = skills.length || 0;
    const missingSkillsCount = roadmap.filter(
      m => m.skill && !skills.some(s => s.toLowerCase() === m.skill.toLowerCase())
    ).length;
    const targetSkillsCount = Math.max(skillsCount, skillsCount + missingSkillsCount, 1);
    const skillsScore = Math.min(40, Math.round((skillsCount / targetSkillsCount) * 40));

    // Roadmap Milestone Execution: Up to 40%
    const completedCount = roadmap.filter(m => m.completed).length;
    const totalMilestones = roadmap.length || 3;
    const milestoneScore = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 40) : 0;

    // Portfolio Proof Projects: Up to 20%
    const projectsCount = projects.length || 0;
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
    const token = localStorage.getItem('token');
    const savedUserCareer = localStorage.getItem('skillforge_user_career_data');
    if (token && savedUserCareer) {
      try {
        return JSON.parse(savedUserCareer);
      } catch (e) {}
    }
    const savedPersona = localStorage.getItem('skillforge_active_persona') || 'fullstack';
    return getPersonaData(savedPersona);
  });

  // Track if roadmap has been explicitly generated/unlocked in this active session
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUserCareer = localStorage.getItem('skillforge_user_career_data');
    const hasFlag = localStorage.getItem('skillforge_has_generated_roadmap') === 'true';
    if (token && savedUserCareer && hasFlag) return true;
    return false;
  });

  // Restore saved roadmap from SQLite backend if user is authenticated
  useEffect(() => {
    async function loadBackendRoadmap() {
      const token = localStorage.getItem('token');
      if (token && !isGuest) {
        try {
          const savedPackage = await progressAPI.getSavedRoadmap();
          if (savedPackage && savedPackage.roadmap && savedPackage.roadmap.length > 0) {
            setCareerData(savedPackage);
            setHasGeneratedRoadmap(true);
            localStorage.setItem('skillforge_has_generated_roadmap', 'true');
            localStorage.setItem('skillforge_user_career_data', JSON.stringify(savedPackage));
          }
        } catch (err) {
          // No saved roadmap in SQLite yet for this user
        }
      }
    }

    loadBackendRoadmap();
  }, [user?.id, isGuest]);

  // Keep state synced with active persona switch (for demo mode)
  useEffect(() => {
    if (isGuest && activePersonaKey && DEMO_PERSONAS[activePersonaKey]) {
      const data = getPersonaData(activePersonaKey);
      setCareerData(data);
      localStorage.setItem(`skillforge_career_${activePersonaKey}`, JSON.stringify(data));
      setHasGeneratedRoadmap(false);
    }
  }, [activePersonaKey, isGuest]);

  // Persist to local storage and SQLite backend
  const saveCareerData = async (newData) => {
    setCareerData(newData);
    const key = activePersonaKey || 'fullstack';
    localStorage.setItem(`skillforge_career_${key}`, JSON.stringify(newData));

    const token = localStorage.getItem('token');
    if (token && !isGuest) {
      localStorage.setItem('skillforge_user_career_data', JSON.stringify(newData));
      localStorage.setItem('skillforge_has_generated_roadmap', 'true');
      try {
        await progressAPI.saveRoadmap(newData);
      } catch (e) {}
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
      readiness_score: verifiedFields.readiness_score || newScore,
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
