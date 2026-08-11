import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { DEMO_PERSONAS } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [activePersonaKey, setActivePersonaKey] = useState('fullstack');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if Supabase session exists
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setIsGuest(false);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsGuest(false);
        } else if (!isGuest) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Load saved guest persona on startup
      const savedPersona = localStorage.getItem('skillforge_active_persona') || 'fullstack';
      const persona = DEMO_PERSONAS[savedPersona] || DEMO_PERSONAS.fullstack;
      
      const demoUser = {
        id: `demo-${savedPersona}`,
        email: persona.contact_email,
        user_metadata: {
          full_name: persona.candidate_name,
          target_role: persona.target_role
        },
        isGuest: true
      };

      setUser(demoUser);
      setIsGuest(true);
      setActivePersonaKey(savedPersona);
      setLoading(false);
    }
  }, []);

  // 1-Click Guest Demo Login (Crucial for Judge Evaluations)
  const loginAsDemo = (personaKey = 'fullstack') => {
    const validKey = DEMO_PERSONAS[personaKey] ? personaKey : 'fullstack';
    const persona = DEMO_PERSONAS[validKey];
    
    const demoUser = {
      id: `demo-${validKey}`,
      email: persona.contact_email,
      user_metadata: {
        full_name: persona.candidate_name,
        target_role: persona.target_role
      },
      isGuest: true
    };

    setUser(demoUser);
    setIsGuest(true);
    setActivePersonaKey(validKey);
    localStorage.setItem('skillforge_active_persona', validKey);
    localStorage.setItem('skillforge_active_user', JSON.stringify(demoUser));
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase && !isGuest) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('skillforge_active_user');
    localStorage.removeItem('skillforge_active_persona');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      activePersonaKey,
      loginAsDemo,
      logout,
      loading,
      isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
