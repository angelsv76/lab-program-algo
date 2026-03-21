/**
 * Laboratorio de Programación INTI
 * © 2025 Angel Sanchez – Todos los derechos reservados
 *
 * Servicio de autenticación del panel de administración.
 * Usa la Web Crypto API nativa del navegador para hashing SHA-256.
 * Las credenciales se leen desde variables de entorno (VITE_ADMIN_USER / VITE_ADMIN_HASH).
 */

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'admin';
const ADMIN_HASH = import.meta.env.VITE_ADMIN_HASH || '';

export interface AdminSession {
  isAuthenticated: boolean;
  role: 'admin';
  username: string;
}

/**
 * Genera el hash SHA-256 de un texto usando la Web Crypto API nativa.
 * No requiere librerías externas.
 */
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const adminAuthService = {
  /**
   * Intenta iniciar sesión comparando las credenciales ingresadas
   * contra las variables de entorno usando hash SHA-256.
   */
  login: async (user: string, pass: string): Promise<boolean> => {
    const inputHash = await sha256(pass);

    if (user === ADMIN_USER && inputHash === ADMIN_HASH) {
      const session: AdminSession = {
        isAuthenticated: true,
        role: 'admin',
        username: user,
      };
      localStorage.setItem('inti_admin_session', JSON.stringify(session));
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem('inti_admin_session');
  },

  isAuthenticated: (): boolean => {
    const sessionStr = localStorage.getItem('inti_admin_session');
    if (!sessionStr) return false;
    try {
      const session = JSON.parse(sessionStr);
      return session.isAuthenticated === true && session.role === 'admin';
    } catch {
      return false;
    }
  },

  getSession: (): AdminSession | null => {
    const sessionStr = localStorage.getItem('inti_admin_session');
    return sessionStr ? JSON.parse(sessionStr) : null;
  },
};
