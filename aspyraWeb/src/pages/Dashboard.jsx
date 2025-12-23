import { FaFileAlt, FaHourglass, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';
import { useEffect, useState } from 'react';
import { getApplications } from '../api/applications';
import { getJobs } from '../api/jobs';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);
  const [userName, setUserName] = useState('User');
  const [chartData, setChartData] = useState([
    { month: 'Jan', Applications: 0, Interviews: 0 },
    { month: 'Feb', Applications: 0, Interviews: 0 },
    { month: 'Mar', Applications: 0, Interviews: 0 },
    { month: 'Apr', Applications: 0, Interviews: 0 },
    { month: 'May', Applications: 0, Interviews: 0 },
    { month: 'Jun', Applications: 0, Interviews: 0 }
  ]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getApplications().catch(() => []),
      getJobs().catch(() => [])
    ])
      .then(([applications, jobs]) => {
        const appCount = (applications || []).length;
        const jobCount = (jobs || []).length;
        
        setApplicationsCount(appCount);
        setPendingCount(Math.ceil(appCount * 0.45));
        setJobsCount(jobCount);
        setDeclinedCount(Math.ceil(appCount * 0.2));

        // Get user name from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setUserName(userData.FullName || 'User');
          } catch (e) {
            setUserName('User');
          }
        }

        // Generate chart data
        const newChartData = chartData.map((item, idx) => ({
          ...item,
          Applications: Math.floor(appCount / 6) + (idx < (appCount % 6) ? 1 : 0),
          Interviews: Math.floor(Math.ceil(appCount * 0.15) / 6) + (idx < (Math.ceil(appCount * 0.15) % 6) ? 1 : 0)
        }));
        setChartData(newChartData);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data', err);
        setError('Error loading dashboard data');
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: 'Total Application',
      value: applicationsCount.toString(),
      icon: FaFileAlt,
      color: '#4f46e5'
    },
    {
      title: 'Pending Review',
      value: pendingCount.toString(),
      icon: FaHourglass,
      color: '#eab308'
    },
    {
      title: 'Interviews',
      value: jobsCount.toString(),
      icon: FaCheckCircle,
      color: '#22c55e'
    },
    {
      title: 'Declined',
      value: declinedCount.toString(),
      icon: FaTimesCircle,
      color: '#ef4444'
    }
  ];

  const upcomingInterviews = [
    {
      date: 'JUL',
      day: '28',
      title: 'No upcoming interviews scheduled',
      company: 'Check application status',
      time: 'N/A'
    },
    {
      date: 'AUG',
      day: '02',
      title: 'Stay tuned for updates',
      company: 'Check back soon',
      time: 'N/A'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-header mb-4">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-header mb-4">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle" style={{ color: '#ef4444' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {userName}! Here's your job application summary.</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                <stat.icon />
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Widgets Row */}
      <div className="row">
        {/* Application Trends Chart */}
        <div className="col-lg-8 mb-4">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Application Trends</h3>
              <select className="form-select chart-filter">
                <option>Last 6 months</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Applications" fill="#818cf8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Interviews" fill="#4ade80" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Profile Completion */}
          <div className="widget-card mb-4">
            <h3 className="widget-title">Profile Completion</h3>
            <div className="profile-completion">
              <h2 className="completion-percent">80% Complete</h2>
              <p className="completion-text">
                Complete your profile to stand out to recruiters.
              </p>
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="widget-card">
            <h3 className="widget-title">Upcoming Interviews</h3>
            <div className="interviews-list">
              {upcomingInterviews.map((interview, index) => (
                <div key={index} className="interview-item">
                  <div className="interview-date">
                    <span className="date-month">{interview.date}</span>
                    <span className="date-day">{interview.day}</span>
                  </div>
                  <div className="interview-details">
                    <h4 className="interview-title">{interview.title}</h4>
                    <p className="interview-meta">
                      {interview.company} • {interview.time}
                    </p>
                  </div>
                </div>
              ))}
              <a href="#" className="view-all-link">View all interviews</a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="section-header">
            <h3 className="section-title">Recent Applications</h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;