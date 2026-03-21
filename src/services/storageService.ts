import CryptoJS from 'crypto-js';
import { Student, ModuleProgress, AppSettings, StudentProgress } from '../types';

const KEYS = {
  STUDENT: 'inti_student',
  PROGRESS: 'inti_progress',
  SETTINGS: 'inti_settings',
  ADMIN_AUTH: 'inti_admin_auth',
  AI_CONTENT: 'inti_ai_content',
  FEEDBACK: 'inti_feedback',
  STUDENTS_LIST: 'inti_students_list'
};

const ADMIN_HASH = '240be518fabd2724ddb6f0403f3d5580e41db5e0291d30c08a7f9f13d7d968d8'; // SHA256("admin123")

export const storageService = {
  // Student
  getStudent: (): Student | null => {
    const data = localStorage.getItem(KEYS.STUDENT);
    return data ? JSON.parse(data) : null;
  },
  saveStudent: (student: Student) => {
    localStorage.setItem(KEYS.STUDENT, JSON.stringify(student));
  },
  clearStudent: () => {
    localStorage.removeItem(KEYS.STUDENT);
    localStorage.removeItem(KEYS.PROGRESS);
  },

  // Progress
  getProgress: (): StudentProgress => {
    const data = localStorage.getItem(KEYS.PROGRESS);
    if (!data) {
      const initial: StudentProgress = {
        completedModules: [],
        exercisesDone: 0,
        errorsCount: 0,
        totalTimeMinutes: 0,
        lastActivity: new Date().toISOString()
      };
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveProgress: (progress: StudentProgress) => {
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
  },

  // Settings
  getSettings: (): AppSettings | null => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },
  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Admin Auth
  verifyAdmin: (password: string): boolean => {
    const hash = CryptoJS.SHA256(password).toString();
    if (hash === ADMIN_HASH) {
      localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  },
  isAdminAuthenticated: (): boolean => {
    return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
  },
  logoutAdmin: () => {
    localStorage.removeItem(KEYS.ADMIN_AUTH);
  },

  // Generic
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  save: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
