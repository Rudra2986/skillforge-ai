import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, checkBackendHealth } from '../services/api';
import { DEMO_PERSONAS } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Synchronous initialization from localStorage
  const [activePersonaKey, setActivePersonaKey] = useState(() => {
    return localStorage.getItem('skillforge_active_persona') || 'fullstack';
  });

  const [isGuest, setIsGuest] = useState(() => {
    const hasToken = !!localStorage.getItem('token');
    return !hasToken;
  });

  // Default to landing page (null) for fresh visitors unless an active session was explicitly initiated
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserJson = localStorage.getItem('skillforge_active_user');
    if (savedToken && savedUserJson) {
      try {
        return JSON.parse(savedUserJson);
      } catch (e) {}
    }

    // Only restore guest session if explicitly activated by the user previously
    const isGuestActive = localStorage.getItem('skillforge_guest_active') === 'true';
    const savedPersona = localStorage.getItem('skillforge_active_persona');
    if (isGuestActive && savedPersona && DEMO_PERSONAS[savedPersona]) {
      const persona = DEMO_PERSONAS[savedPersona];
      return {
        id: `demo-${savedPersona}`,
        email: persona.contact_email,
        name: persona.candidate_name,
        user_metadata: {
          full_name: persona.candidate_name,
          target_role: persona.target_role
        },
        isGuest: true
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isBackendLive, setIsBackendLive] = useState(false);

  // Background check for backend connectivity and JWT validity
  useEffect(() => {
    async function verifyBackendAndSession() {
      const backendHealthy = await checkBackendHealth();
      setIsBackendLive(backendHealthy);

      const storedToken = localStorage.getItem('token');
      if (storedToken && backendHealthy) {
        try {
          const userData = await authAPI.getMe(storedToken);
          if (userData && userData.email) {
            const authenticatedUser = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              user_metadata: {
                full_name: userData.name,
                target_role: userData.target_role || 'Full-Stack Developer'
              },
              isGuest: false
            };
            setUser(authenticatedUser);
            setIsGuest(false);
            localStorage.setItem('skillforge_active_user', JSON.stringify(authenticatedUser));
          }
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('skillforge_active_user');
        }
      }
    }

    verifyBackendAndSession();
  }, []);

  /**
   * Log in user with email & password via FastAPI backend
   */
  const loginUser = async (email, password) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.login({ email, password });
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.removeItem('skillforge_guest_active');
        const userData = await authAPI.getMe(data.access_token);
        const authenticatedUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          user_metadata: {
            full_name: userData.name,
            target_role: userData.target_role || 'Full-Stack Developer'
          },
          isGuest: false
        };
        setUser(authenticatedUser);
        setIsGuest(false);
        localStorage.setItem('skillforge_active_user', JSON.stringify(authenticatedUser));
        return { success: true };
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
      return { success: false, error: err.message };
    } finally {
      setIsAuthLoading(false);
    }
  };

  /**
   * Register a new student account
   */
  const registerUser = async (name, email, password, targetRole) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.register({
        name,
        email,
        password
      });

      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.removeItem('skillforge_guest_active');
        const authenticatedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          user_metadata: {
            full_name: data.user.name,
            target_role: targetRole || 'Full-Stack AI Engineer'
          },
          isGuest: false
        };
        setUser(authenticatedUser);
        setIsGuest(false);
        localStorage.setItem('skillforge_active_user', JSON.stringify(authenticatedUser));
        return { success: true };
      }

      // Fallback: log in if token not in response
      return await loginUser(email, password);
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      return { success: false, error: err.message };
    } finally {
      setIsAuthLoading(false);
    }
  };

  /**
   * 1-Click Sandbox Persona Switcher (Alex / Priya)
   */
  const loginAsDemo = (personaKey = 'fullstack') => {
    const validKey = DEMO_PERSONAS[personaKey] ? personaKey : 'fullstack';
    const persona = DEMO_PERSONAS[validKey];

    const demoUser = {
      id: `demo-${validKey}`,
      email: persona.contact_email,
      name: persona.candidate_name,
      user_metadata: {
        full_name: persona.candidate_name,
        target_role: persona.target_role
      },
      isGuest: true
    };

    localStorage.removeItem('token');
    localStorage.removeItem('skillforge_active_user');
    localStorage.setItem('skillforge_guest_active', 'true');
    localStorage.setItem('skillforge_active_persona', validKey);

    setUser(demoUser);
    setIsGuest(true);
    setActivePersonaKey(validKey);
  };

  /**
   * Sign out and clear stored session
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('skillforge_active_user');
    localStorage.removeItem('skillforge_guest_active');
    localStorage.removeItem('skillforge_active_persona');
    localStorage.removeItem('skillforge_has_generated_roadmap');
    localStorage.removeItem('skillforge_user_career_data');
    setUser(null);
    setIsGuest(false);
    setActivePersonaKey('fullstack');
  };

  /**
   * Clear any active authentication error
   */
  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      activePersonaKey,
      loading,
      isAuthLoading,
      authError,
      isBackendLive,
      loginUser,
      registerUser,
      loginAsDemo,
      logout,
      setAuthError,
      clearAuthError
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
