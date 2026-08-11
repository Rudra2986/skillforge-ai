import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '../services/mockData';
import { useAuth } from './AuthContext';

const CareerContext = createContext(null);

export function CareerProvider({ children }) {
  const { activePersonaKey } = useAuth();

  // Initialize from active demo persona or localStorage
  const [careerData, setCareerData] = useState(() => {
    const savedPersona = localStorage.getItem('skillforge_active_persona') || 'fullstack';
    const persona = DEMO_PERSONAS[savedPersona] || DEMO_PERSONAS.fullstack;
    const savedData = localStorage.getItem(`skillforge_career_${savedPersona}`);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        // fallback
      }
    }
    return persona;
  });

  // Keep state synced with active persona switch
  useEffect(() => {
    if (activePersonaKey && DEMO_PERSONAS[activePersonaKey]) {
      const savedData = localStorage.getItem(`skillforge_career_${activePersonaKey}`);
      if (savedData) {
        try {
          setCareerData(JSON.parse(savedData));
          return;
        } catch (e) {}
      }
      const persona = DEMO_PERSONAS[activePersonaKey];
      setCareerData(persona);
      localStorage.setItem(`skillforge_career_${activePersonaKey}`, JSON.stringify(persona));
    }
  }, [activePersonaKey]);

  // Persist to local storage per persona
  const saveCareerData = (newData) => {
    setCareerData(newData);
    const key = activePersonaKey || 'fullstack';
    localStorage.setItem(`skillforge_career_${key}`, JSON.stringify(newData));
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

  // Human-in-the-Loop Profile Update (Called after Step 2 verification)
  const updateVerifiedProfile = (verifiedFields) => {
    const updatedData = {
      ...careerData,
      ...verifiedFields,
      summary_assessment: `Profile updated with ${verifiedFields.current_skills?.length || 0} verified skills targeting ${verifiedFields.target_role}.`
    };
    saveCareerData(updatedData);
  };

  return (
    <CareerContext.Provider value={{
      careerData,
      saveCareerData,
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
