import CryptoJS from 'crypto-js';

/**
 * Genera un hash SHA-256 de una cadena de texto.
 * Utilizado para comparar la contraseña ingresada con VITE_ADMIN_HASH.
 */
export const generateHash = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

export const storage = {
  get: (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};
