import React, { useState, useEffect } from 'react';
import { getActivities, getActivityStats } from '../../services/activity.service';

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    employeeId: '',
    riskLevel: '',
    search: '',
    limit: 100
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [activitiesData, statsData] = await Promise.all([
        getActivities(filters),
        getActivityStats()
      ]);
      setActivities(activitiesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'badge-danger';
      case 'MEDIUM': return 'badge-warning';
      case 'LOW': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-logs">
      <div className="row mb-4">
        <div className="col-md-12">
          <h3>Activity Monitoring</h3>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Activities</h5>
              <h3 className="text-primary">{stats.totalActivities || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Active Users</h5>
              <h3 className="text-success">{stats.activeUsers || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">High Risk Users</h5>
              <h3 className="text-danger">{stats.highRiskUsers || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Alerts</h5>
              <h3 className="text-warning">{stats.recentAlerts || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Filters</h5>
              <div className="row">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Employee ID"
                    value={filters.employeeId}
                    onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={filters.riskLevel}
                    onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                  >
                    <option value="">All Risk Levels</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search activities..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => setFilters({ employeeId: '', riskLevel: '', search: '', limit: 100 })}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Activity Logs</h5>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Employee</th>
                      <th>Action</th>
                      <th>Page</th>
                      <th>Browser</th>
                      <th>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">No activities found</td>
                      </tr>
                    ) : (
                      activities.map((activity, index) => (
                        <tr key={index}>
                          <td>{activity.formattedTime}</td>
                          <td>{activity.name}</td>
                          <td>{activity.action}</td>
                          <td>{activity.page}</td>
                          <td>{activity.browser}</td>
                          <td>
                            <span className={`badge ${getRiskBadgeClass(activity.riskLevel)}`}>
                              {activity.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;