import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '../services/mockData';
import { useAuth } from './AuthContext';
import { progressAPI } from '../services/api';

const CareerContext = createContext(null);

export function CareerProvider({ children }) {
  const { activePersonaKey } = useAuth();

  // Multi-factor benchmark readiness score formula
  const calculateReadinessScore = (skills = [], roadmap = [], projects = []) => {
    // Technical Skills: Up to 40% (Target: 8 skills)
    const skillsCount = skills.length || 0;
    const skillsScore = Math.min(40, Math.round((skillsCount / 8) * 40));

    // Roadmap Milestone Execution: Up to 40%
    const completedCount = roadmap.filter(m => m.completed).length;
    const totalMilestones = roadmap.length || 3;
    const milestoneScore = Math.round((completedCount / totalMilestones) * 40);

    // Portfolio Proof Projects: Up to 20% (Target: 3 projects)
    const projectsCount = projects.length || 0;
    const projectScore = Math.min(20, Math.round((projectsCount / 3) * 20));

    const total = skillsScore + milestoneScore + projectScore;
    return Math.min(100, Math.max(50, total));
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

  // Initialize from active demo persona
  const [careerData, setCareerData] = useState(() => {
    const savedPersona = localStorage.getItem('skillforge_active_persona') || 'fullstack';
    return getPersonaData(savedPersona);
  });

  // Track if roadmap has been explicitly generated in this active session
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(false);

  // Keep state synced with active persona switch
  useEffect(() => {
    if (activePersonaKey && DEMO_PERSONAS[activePersonaKey]) {
      const data = getPersonaData(activePersonaKey);
      setCareerData(data);
      localStorage.setItem(`skillforge_career_${activePersonaKey}`, JSON.stringify(data));
      setHasGeneratedRoadmap(false);
    }
  }, [activePersonaKey]);

  // Persist to local storage per persona
  const saveCareerData = (newData) => {
    setCareerData(newData);
    const key = activePersonaKey || 'fullstack';
    localStorage.setItem(`skillforge_career_${key}`, JSON.stringify(newData));
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

    saveCareerData(updatedData);

    try {
      await progressAPI.updateProgress(milestoneId, targetCompleted);
    } catch (e) {}
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
    const key = activePersonaKey || 'fullstack';
    const newSkills = verifiedFields.current_skills || careerData.current_skills || [];
    const newScore = calculateReadinessScore(
      newSkills,
      careerData.roadmap || [],
      careerData.projects || []
    );

    const updatedData = {
      ...careerData,
      ...verifiedFields,
      readiness_score: newScore,
      summary_assessment: `Profile verified with ${newSkills.length} skills targeting ${verifiedFields.target_role || careerData.target_role}.`
    };

    saveCareerData(updatedData);
    setHasGeneratedRoadmap(true);
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
