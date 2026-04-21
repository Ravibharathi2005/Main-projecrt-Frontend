/**
 * Smart Role Assignment Utility
 * Maps job positions to system roles using flexible keyword matching.
 */

const ROLE_MAPPING = {
  SUPER_ADMIN: ["CEO", "FOUNDER", "PRESIDENT", "CHAIRMAN"],
  ADMIN: ["CTO", "IT HEAD", "IT MANAGER", "SECURITY HEAD", "CHIEF"],
  HR: ["HR MANAGER", "HR EXECUTIVE", "HUMAN RESOURCES", "RECRUITER"],
  MANAGER: ["TEAM LEAD", "PROJECT MANAGER", "MANAGER", "SUPERVISOR", "LEAD"],
  SECURITY_ANALYST: ["SECURITY OFFICER", "SOC ANALYST", "SECURITY ANALYST", "ANALYST"],
  EMPLOYEE: ["DEVELOPER", "ENGINEER", "TESTER", "DESIGNER", "CONSULTANT"]
};

/**
 * Derives a system role from a position string
 * @param {string} position 
 * @returns {string} One of the supported system roles
 */
export const deriveRoleFromPosition = (position) => {
  if (!position) return "EMPLOYEE";
  
  const pos = position.toUpperCase();
  
  for (const [role, keywords] of Object.entries(ROLE_MAPPING)) {
    if (keywords.some(keyword => pos.includes(keyword))) {
      return role;
    }
  }
  
  return "EMPLOYEE";
};

export const ALL_ROLES = Object.keys(ROLE_MAPPING);
