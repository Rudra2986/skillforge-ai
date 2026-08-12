import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CareerProvider } from './context/CareerContext';

// Ensure dark obsidian theme is permanently active
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
try {
  localStorage.removeItem('skillforge_theme');
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CareerProvider>
        <App />
      </CareerProvider>
    </AuthProvider>
  </React.StrictMode>
);
