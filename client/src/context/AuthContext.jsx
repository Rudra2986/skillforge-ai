import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, checkBackendHealth } from '../services/api';
import { DEMO_PERSONAS } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [activePersonaKey, setActivePersonaKey] = useState('fullstack');
  const [loading, setLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isBackendLive, setIsBackendLive] = useState(false);

  // Initialize session and check backend connectivity
  useEffect(() => {
    async function initializeAuth() {
      // 1. Check if FastAPI backend is reachable
      const backendHealthy = await checkBackendHealth();
      setIsBackendLive(backendHealthy);

      // 2. Check for stored JWT token from Person 2's backend
      const storedToken = localStorage.getItem('token');
      if (storedToken && backendHealthy) {
        try {
          const userData = await authAPI.getMe(storedToken);
          if (userData && userData.email) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              user_metadata: {
                full_name: userData.name,
                target_role: userData.target_role || 'Full-Stack Developer'
              },
              isGuest: false
            });
            setIsGuest(false);
            setLoading(false);
            return;
          }
        } catch (err) {
          // Token expired or invalid, clear it
          localStorage.removeItem('token');
        }
      }

      // 3. Check if an active guest persona was previously chosen
      const savedPersona = localStorage.getItem('skillforge_active_persona');
      if (savedPersona && DEMO_PERSONAS[savedPersona]) {
        const persona = DEMO_PERSONAS[savedPersona];
        const demoUser = {
          id: `demo-${savedPersona}`,
          email: persona.contact_email,
          name: persona.candidate_name,
          user_metadata: {
            full_name: persona.candidate_name,
            target_role: persona.target_role
          },
          isGuest: true
        };

        setUser(demoUser);
        setIsGuest(true);
        setActivePersonaKey(savedPersona);
      } else {
        setUser(null);
        setIsGuest(false);
      }

      setLoading(false);
    }

    initializeAuth();
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
        
        const authenticatedUser = {
          id: data.user?.id || 'auth-user',
          email: data.user?.email || email,
          name: data.user?.name || email.split('@')[0],
          user_metadata: {
            full_name: data.user?.name || email.split('@')[0],
            target_role: 'Full-Stack Developer'
          },
          isGuest: false
        };

        setUser(authenticatedUser);
        setIsGuest(false);
        setIsAuthLoading(false);
        return { success: true, user: authenticatedUser };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      let message = error.message;
      if (message.includes('BACKEND_OFFLINE')) {
        message = 'FastAPI server (Port 8000) is offline. You can use the "1-Click Guest Demo" mode below!';
      }
      setAuthError(message);
      setIsAuthLoading(false);
      return { success: false, error: message };
    }
  };

  /**
   * Register a new user via FastAPI backend
   */
  const registerUser = async (name, email, password, targetRole = 'Full-Stack Developer') => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const data = await authAPI.register({ name, email, password });
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);

        const newUser = {
          id: data.user?.id || 'new-user',
          email: data.user?.email || email,
          name: data.user?.name || name,
          user_metadata: {
            full_name: data.user?.name || name,
            target_role: targetRole
          },
          isGuest: false
        };

        setUser(newUser);
        setIsGuest(false);
        setIsAuthLoading(false);
        return { success: true, user: newUser };
      } else {
        throw new Error('Registration failed: no token received');
      }
    } catch (error) {
      let message = error.message;
      if (message.includes('BACKEND_OFFLINE')) {
        message = 'FastAPI server (Port 8000) is offline. You can use the "1-Click Guest Demo" mode below!';
      }
      setAuthError(message);
      setIsAuthLoading(false);
      return { success: false, error: message };
    }
  };

  /**
   * 1-Click Guest Demo Login (Judge Mode)
   * Instantly authenticates with a pre-configured persona with 0 friction
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

    setUser(demoUser);
    setIsGuest(true);
    setActivePersonaKey(validKey);
    setAuthError(null);
    
    // Cache demo selection for quick reload
    localStorage.removeItem('token'); // In guest mode, do not send outdated server token
    localStorage.setItem('skillforge_active_persona', validKey);
    localStorage.setItem('skillforge_active_user', JSON.stringify(demoUser));

    return { success: true, user: demoUser };
  };

  /**
   * Log out and reset session state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('skillforge_active_user');
    localStorage.removeItem('skillforge_active_persona');
    setUser(null);
    setIsGuest(false);
    setAuthError(null);
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      activePersonaKey,
      loginUser,
      registerUser,
      loginAsDemo,
      logout,
      loading,
      isAuthLoading,
      authError,
      clearAuthError,
      isBackendLive
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
