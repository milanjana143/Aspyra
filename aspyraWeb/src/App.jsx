import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import JobManagement from './pages/JobManagement';
import JobList from './pages/JobList';
import UserManagement from './pages/UserManagement';
import CompanyProfiles from './pages/CompanyProfiles';
import ReportsAnalytics from './pages/ReportsAnalytics';
import Traking from './pages/Traking';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <SidebarProvider>
      <Routes>
        {/* Public Routes (No Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (With Layout) */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/job-management" element={<JobManagement />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/traking" element={<Traking />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/company-profiles" element={<CompanyProfiles />} />
              <Route path="/reports" element={<ReportsAnalytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </SidebarProvider>
  );
}

export default App;