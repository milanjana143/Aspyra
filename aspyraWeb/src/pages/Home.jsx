import { Link } from 'react-router-dom';
import { 
  FaChartLine, FaBriefcase, FaBuilding, FaUsers, 
  FaFileAlt, FaChartBar, FaCog, FaUser 
} from 'react-icons/fa';
import './Home.css';
import { isAdmin, isRecruiter } from '../utils/authUtils';

const Home = () => {
  const allPages = [
    { path: '/dashboard', label: 'Dashboard', icon: FaChartLine, desc: 'View overview and statistics' },
    { path: '/jobs', label: 'Job Listings', icon: FaBriefcase, desc: 'Browse available job positions' },
    { path: '/job-management', label: 'Job Management', icon: FaBriefcase, desc: 'Create and manage jobs', requiresAdminOrRecruiter: true },
    { path: '/traking', label: 'Application & Tracking', icon: FaFileAlt, desc: 'Track application statuses' },
    { path: '/company-profiles', label: 'Company Profiles', icon: FaBuilding, desc: 'View company information', adminOnly: true },
    { path: '/user-management', label: 'User Management', icon: FaUsers, desc: 'Manage system users' },
    { path: '/reports', label: 'Reports & Analytics', icon: FaChartBar, desc: 'View detailed reports', adminOnly: true },
  ];

  const filteredPages = allPages.filter(page => {
    if (page.adminOnly) return isAdmin();
    if (page.requiresAdminOrRecruiter) return isAdmin() || isRecruiter();
    return true;
  });

  return (
    <div className="home-page">
      <div className="page-header-section mb-5">
        <h1 className="page-title">Welcome to Aspyra 👋</h1>
        <p className="page-subtitle">Quick access to all application features</p>
      </div>

      <div className="pages-grid">
        {filteredPages.map(page => (
          <Link key={page.path} to={page.path} className="page-card">
            <div className="card-icon">
              <page.icon />
            </div>
            <div className="card-content">
              <h3 className="card-title">{page.label}</h3>
              <p className="card-desc">{page.desc}</p>
            </div>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;