import API from "./api";

export const logActivity = async (employeeId, action, device) => {
  if (!employeeId || !action) {
    console.warn("Skipping logActivity due to missing context", { employeeId, action });
    return;
  }

  const payload = {
    employeeId,
    action,
    device: device || navigator.userAgent || "unknown",
  };

  try {
    await API.post("/api/activity", payload);
  } catch (err) {
    console.error("Activity error", err);
  }
};

// Enhanced activity fetching for monitoring dashboard
export const getActivities = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = `/api/activity${queryString ? `?${queryString}` : ''}`;

    const response = await API.get(url);
    return processActivities(response.data);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const getUserActivities = async (employeeId, limit = 50) => {
  try {
    const response = await API.get(`/api/activity/${employeeId}?limit=${limit}`);
    return processActivities(response.data);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return [];
  }
};

export const getActivityStats = async () => {
  try {
    const response = await API.get('/api/activity/stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    // Return fallback stats
    return {
      totalActivities: 0,
      activeUsers: 0,
      highRiskUsers: 0,
      recentAlerts: 0
    };
  }
};

// Process raw activity data to add computed fields
const processActivities = (activities) => {
  return activities.map(activity => {
    // Extract browser info from device string
    const browser = extractBrowser(activity.device);

    // Calculate risk level based on activity patterns
    const riskLevel = calculateRiskLevel(activity);

    // Extract page/action details
    const page = extractPage(activity.action);

    return {
      ...activity,
      browser,
      riskLevel,
      page,
      // Add employee name (would come from employee lookup in real app)
      name: `Employee ${activity.employeeId}`,
      // Format timestamp
      formattedTime: new Date(activity.time).toLocaleString()
    };
  });
};

const extractBrowser = (deviceString) => {
  const ua = deviceString.toLowerCase();
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  return 'Unknown';
};

const calculateRiskLevel = (activity) => {
  const action = activity.action.toLowerCase();

  // High risk patterns
  if (action.includes('unauthorized') ||
      action.includes('failed login') ||
      action.includes('suspicious') ||
      action.includes('restricted access')) {
    return 'HIGH';
  }

  // Medium risk patterns
  if (action.includes('multiple') ||
      action.includes('unusual') ||
      action.includes('admin access')) {
    return 'MEDIUM';
  }

  // Low risk (default)
  return 'LOW';
};

const extractPage = (action) => {
  // Extract page information from action string
  const pageMatches = action.match(/page[:\s]+([^\s,]+)/i);
  if (pageMatches) return pageMatches[1];

  // Common page mappings
  const actionLower = action.toLowerCase();
  if (actionLower.includes('dashboard')) return 'Dashboard';
  if (actionLower.includes('profile')) return 'Profile';
  if (actionLower.includes('login')) return 'Login';
  if (actionLower.includes('settings')) return 'Settings';

  return 'Unknown';
};