/**
 * SkillForge AI — Centralized API Client
 * Connects to Person 2's FastAPI Backend (Default: http://localhost:8000)
 * Includes resilient fallback handling for standalone demo mode.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Standard fetch wrapper with JSON parsing and error normalization
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Automatically attach JWT token if present in localStorage
  const token = localStorage.getItem('token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      if (typeof data === 'object' && data !== null) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          errorMessage = data.detail.map(d => d.msg || d.loc?.join('.') || JSON.stringify(d)).join(' | ');
        } else if (data.message) {
          errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        } else {
          errorMessage = JSON.stringify(data);
        }
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Network failure / Server offline
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('BACKEND_OFFLINE: FastAPI server is unreachable at ' + API_BASE_URL);
    }
    throw error;
  }
}

/**
 * Check if the FastAPI backend is running and healthy
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: 'HEAD',
      signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    return Boolean(response && (response.ok || response.status === 200 || response.status === 307 || response.status === 404));
  } catch (e) {
    return false;
  }
}

/**
 * Authentication Endpoints (Person 2 Backend Contract)
 */
export const authAPI = {
  /**
   * Register a new user
   * POST /api/auth/register -> { name, email, password }
   */
  async register({ name, email, password }) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  /**
   * Login user
   * POST /api/auth/login -> { email, password }
   */
  async login({ email, password }) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Get current authenticated user session
   * GET /api/auth/me
   */
  async getMe(token) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    return request('/api/auth/me', {
      method: 'GET',
      headers
    });
  }
};

/**
 * Resume Parsing Endpoints (Person 2 Backend Contract - Ready for Part 3)
 */
export const resumeAPI = {
  /**
   * Upload PDF resume for layout extraction
   * POST /api/resume/parse (multipart/form-data)
   */
  async parsePDF(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}/api/resume/parse`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to parse PDF resume');
    }

    return response.json();
  }
};

/**
 * Progress & Roadmap Persistence Endpoints (Person 2 Backend Contract - Ready for Part 4)
 */
export const progressAPI = {
  /**
   * Toggle milestone completion & recalculate readiness score
   * POST /api/progress/update
   */
  async updateMilestone(milestoneId, completed) {
    return request('/api/progress/update', {
      method: 'POST',
      body: JSON.stringify({
        milestone_id: milestoneId,
        completed: Boolean(completed)
      })
    });
  },

  /**
   * Save full career intelligence package to SQLite
   * POST /api/progress/save-roadmap
   */
  async saveRoadmap(intelligencePackage) {
    return request('/api/progress/save-roadmap', {
      method: 'POST',
      body: JSON.stringify(intelligencePackage)
    });
  },

  /**
   * Fetch saved roadmap for current user
   * GET /api/progress/me
   */
  async getSavedRoadmap() {
    return request('/api/progress/me', {
      method: 'GET'
    });
  }
};

/**
 * AI Intelligence Endpoints (Person 3 Backend Contract)
 */
export const aiAPI = {
  /**
   * Stage 1 — Normalize raw PDF text into StructuredResumeProfile via Gemini
   * POST /api/ai/normalize-resume
   */
  async normalizeResume(rawText) {
    return request('/api/ai/normalize-resume', {
      method: 'POST',
      body: JSON.stringify({ raw_text: rawText })
    });
  },

  /**
   * Stage 2 — Full skill gap analysis + roadmap generation
   * POST /api/ai/analyze-gap (requires JWT)
   */
  async analyzeGap(profile, targetRole, timelineWeeks = 12) {
    return request('/api/ai/analyze-gap', {
      method: 'POST',
      body: JSON.stringify({
        profile,
        target_role: targetRole,
        timeline_weeks: timelineWeeks
      })
    });
  },

  /**
   * Stage 3 — Evaluate mock interview answer
   * POST /api/ai/evaluate-answer
   */
  async evaluateAnswer(question, userAnswer, idealPoints) {
    return request('/api/ai/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify({
        question,
        user_answer: userAnswer,
        ideal_points: idealPoints
      })
    });
  }
};

export default {
  API_BASE_URL,
  checkBackendHealth,
  authAPI,
  resumeAPI,
  progressAPI,
  aiAPI
};

