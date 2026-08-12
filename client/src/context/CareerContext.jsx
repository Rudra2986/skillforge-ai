import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '../services/mockData';
import { useAuth } from './AuthContext';

const CareerContext = createContext(null);

export function CareerProvider({ children }) {
  const { activePersonaKey } = useAuth();

  // Helper to get sanitized persona data
  const getPersonaData = (key) => {
    const validKey = DEMO_PERSONAS[key] ? key : 'fullstack';
    const defaultPersona = DEMO_PERSONAS[validKey];
    const savedDataStr = localStorage.getItem(`skillforge_career_${validKey}`);
    
    if (savedDataStr) {
      try {
        const parsed = JSON.parse(savedDataStr);
        // Ensure name matches the expected persona to prevent cross-contamination
        if (parsed && parsed.candidate_name === defaultPersona.candidate_name) {
          return parsed;
        }
      } catch (e) {
        // ignore and fallback
      }
    }
    return defaultPersona;
  };

  // Initialize from active demo persona
  const [careerData, setCareerData] = useState(() => {
    const savedPersona = localStorage.getItem('skillforge_active_persona') || 'fullstack';
    return getPersonaData(savedPersona);
  });

  // Track if roadmap has been explicitly generated in this active session (starts false by default)
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(false);

  // Keep state synced with active persona switch
  useEffect(() => {
    if (activePersonaKey && DEMO_PERSONAS[activePersonaKey]) {
      const data = getPersonaData(activePersonaKey);
      setCareerData(data);
      localStorage.setItem(`skillforge_career_${activePersonaKey}`, JSON.stringify(data));
      // Reset generated state when explicitly switching persona so user undergoes the fresh scan flow
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
  const toggleMilestone = (milestoneId) => {
    if (!careerData?.roadmap) return;

    const updatedRoadmap = careerData.roadmap.map((milestone) => {
      if (milestone.id === milestoneId) {
        return { ...milestone, completed: !milestone.completed };
      }
      return milestone;
    });

    // Score Calculation Formula: Base score + (completed milestones / total milestones * 30)
    const completedCount = updatedRoadmap.filter((m) => m.completed).length;
    const totalCount = updatedRoadmap.length || 1;
    const milestoneBonus = Math.round((completedCount / totalCount) * 30);
    const baseScore = 55;
    const newScore = Math.min(100, baseScore + milestoneBonus);

    const updatedData = {
      ...careerData,
      readiness_score: newScore,
      roadmap: updatedRoadmap
    };

    saveCareerData(updatedData);
  };

  // Human-in-the-Loop Profile Update (Called after Step 2/3 verification)
  const updateVerifiedProfile = (verifiedFields) => {
    const key = activePersonaKey || 'fullstack';
    const updatedData = {
      ...careerData,
      ...verifiedFields,
      summary_assessment: `Profile verified with ${verifiedFields.current_skills?.length || 0} skills targeting ${verifiedFields.target_role || careerData.target_role}.`
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
