/**
 * Professional Storage Utility
 * Standardizes access to localStorage and sessionStorage with error handling
 */

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  ROLE: 'role',
  EMPLOYEE_ID: 'employeeId',
  TRUST_SCORE: 'trustScore',
  RISK_LEVEL: 'riskLevel',
  ALERTS: 'alerts',
  MONITORING_SESSION: 'monitoringSession',
  FORCE_LOGOUT: 'forceLogout',
};

export const getSessionItem = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return defaultValue;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Storage Error [GET ${key}]:`, error);
    return defaultValue;
  }
};

export const setSessionItem = (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    sessionStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Storage Error [SET ${key}]:`, error);
  }
};

export const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Storage Error [REMOVE ${key}]:`, error);
  }
};

export const clearAllStorage = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Storage Error [CLEAR]:', error);
  }
};
