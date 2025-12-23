import { 
  FaBriefcase, FaFileAlt, FaBuilding, FaPlus, 
  FaUserPlus, FaCheckCircle, FaFilePdf, FaFileExcel 
} from 'react-icons/fa';
import './ReportsAnalytics.css';
import { useEffect, useState } from 'react';
import { getJobs } from '../api/jobs';
import { getCompanies } from '../api/companies';
import { getUsers } from '../api/users';
import { getApplications } from '../api/applications';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getJobs().catch(() => []),
      getApplications().catch(() => []),
      getCompanies().catch(() => []),
      getUsers().catch(() => [])
    ])
      .then(([jobs, apps, companies, users]) => {
        setJobsCount((jobs || []).length);
        setApplicationsCount((apps || []).length);
        setCompaniesCount((companies || []).length);
        setUsersCount((users || []).length);

        // Generate activities from real data
        const acts = [];
        if (jobs && jobs.length > 0) {
          const recentJob = jobs[0];
          acts.push({
            icon: FaPlus,
            iconColor: '#22c55e',
            text: `New job posted: "${recentJob.JobsName || 'Untitled'}"`,
            time: 'Recently added'
          });
        }
        if (companies && companies.length > 0) {
          const recentCompany = companies[0];
          acts.push({
            icon: FaUserPlus,
            iconColor: '#4f46e5',
            text: `New company registered: "${recentCompany.CompanyName || 'Untitled'}"`,
            time: 'Recently added'
          });
        }
        if (apps && apps.length > 0) {
          acts.push({
            icon: FaCheckCircle,
            iconColor: '#a855f7',
            text: `${apps.length} application(s) in the system`,
            time: 'Updated'
          });
        }
        if (users && users.length > 0) {
          const recentUser = users[0];
          acts.push({
            icon: FaUserPlus,
            iconColor: '#f59e0b',
            text: `New user registered: "${recentUser.FullName || 'User'}"`,
            time: 'Recently added'
          });
        }
        setActivities(acts.length > 0 ? acts : [
          {
            icon: FaFileAlt,
            iconColor: '#9ca3af',
            text: 'No recent activity',
            time: 'N/A'
          }
        ]);
      })
      .catch((err) => {
        console.error('Failed to load analytics data', err);
        setError('Error loading analytics');
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    {
      title: 'Jobs Posted',
      value: jobsCount.toLocaleString(),
      change: '↑ Updated from backend',
      changeType: 'positive',
      icon: FaBriefcase,
      iconColor: '#4f46e5'
    },
    {
      title: 'Applications Received',
      value: applicationsCount.toLocaleString(),
      change: '↑ Updated from backend',
      changeType: 'positive',
      icon: FaFileAlt,
      iconColor: '#22c55e'
    },
    {
      title: 'Active Companies',
      value: companiesCount.toLocaleString(),
      change: `Total: ${companiesCount}`,
      changeType: 'positive',
      icon: FaBuilding,
      iconColor: '#a855f7'
    }
  ];

  if (loading) return <div className="reports-page">Loading analytics...</div>;
  if (error) return <div className="reports-page">Error: {error}</div>;

  return (
    <div className="reports-page">
      {/* Page Header */}
      <div className="page-header-section mb-4">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Track key metrics...</p>
      </div>

      {/* Metrics Cards */}
      <div className="row mb-4">
        {metrics.map((metric, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-3">
            <div className="metric-card">
              <div 
                className="metric-icon"
                style={{ backgroundColor: metric.iconColor + '20', color: metric.iconColor }}
              >
                <metric.icon />
              </div>
              <div className="metric-content">
                <p className="metric-title">{metric.title}</p>
                <h3 className="metric-value">{metric.value}</h3>
                <p className={`metric-change ${metric.changeType}`}>
                  {metric.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      {/* Recent Activity */}
      <div className="activity-section">
        <h3 className="section-title mb-3">Recent Activity</h3>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div 
                className="activity-icon"
                style={{ backgroundColor: activity.iconColor + '20', color: activity.iconColor }}
              >
                <activity.icon />
              </div>
              <div className="activity-content">
                <p className="activity-text">{activity.text}</p>
              </div>
              <span className="activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;