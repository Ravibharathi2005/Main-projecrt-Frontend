import { STORAGE_KEYS, setSessionItem, removeSessionItem } from './storage';

/**
 * Initializes cross-tab session synchronization
 * @param {Function} logoutFn - The logout function to call if a signal is received
 */
export const initSessionSync = (logoutFn) => {
  const syncHandler = (event) => {
    if (event.key === STORAGE_KEYS.FORCE_LOGOUT) {
      logoutFn();
    }
  };

  window.addEventListener('storage', syncHandler);
  return () => window.removeEventListener('storage', syncHandler);
};

/**
 * Idle Auto-Logout Utility
 * Automatically logs out user after 15 minutes of inactivity
 */
let idleTimer;
export const startIdleTimer = (logoutFn, timeoutMs = 15 * 60 * 1000) => {
  const resetTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(logoutFn, timeoutMs);
  };

  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);
  window.addEventListener('click', resetTimer);
  
  resetTimer();
  
  return () => {
    clearTimeout(idleTimer);
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keydown', resetTimer);
    window.removeEventListener('click', resetTimer);
  };
};
