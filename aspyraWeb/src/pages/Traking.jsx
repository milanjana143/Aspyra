import { useEffect, useState } from 'react';
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getApplications, updateApplication } from '../api/applications';
import { getJobs } from '../api/jobs';
import { isRecruiter, isAdmin, getCurrentUser } from '../utils/authUtils';
import './Traking.css';

const Traking = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getApplications(), getJobs()])
      .then(([appsData, jobsData]) => {
        const apps = Array.isArray(appsData) ? appsData : [];
        const pending = apps.filter(a => ((a.Status || a.status) || '').toLowerCase() === 'pending').length;
        const approved = apps.filter(a => ((a.Status || a.status) || '').toLowerCase() === 'approved').length;
        const rejected = apps.filter(a => ((a.Status || a.status) || '').toLowerCase() === 'rejected').length;
        setCounts({ pending, approved, rejected });
        setApplications(apps);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      })
      .catch((err) => {
        console.error('Failed to load applications for Traking page', err);
        setError('Failed to load tracking data');
      })
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    Promise.all([getApplications(), getJobs()])
      .then(([appsData, jobsData]) => {
        const apps = Array.isArray(appsData) ? appsData : [];
        const pending = apps.filter(a => ((a.Status || a.status) || '').toLowerCase() === 'pending').length;
        const approved = apps.filter(a => ((a.Status || a.status) || '').toLowerCase() === 'approved').length;
        const rejected = apps.filter(a => ((a.Status || a.status) || '').toLowerCase() === 'rejected').length;
        setCounts({ pending, approved, rejected });
        setApplications(apps);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      })
      .catch((err) => {
        console.error('Failed to refresh tracking data', err);
        setError('Failed to load tracking data');
      })
      .finally(() => setLoading(false));
  };

  const canManageApplication = (app) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    // Admins can manage all applications
    if (isAdmin()) return true;
    // Recruiters can manage only their own job applications
    if (!isRecruiter()) return false;
    // try to find job by title and check createdBy
    const job = jobs.find(j => (j.JobsName || j.title) === app.JobTitle);
    if (!job) return false;
    const jobOwner = job.createdBy ? String(job.createdBy) : '';
    return jobOwner === currentUser.id;
  };

  const changeStatus = async (appId, newStatus) => {
    try {
      setActionLoading(appId);
      await updateApplication(appId, { Status: newStatus });
      await refresh();
    } catch (err) {
      console.error('Failed to update application status', err);
      setError('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="traking-page">
      <div className="page-header-section mb-4">
        <h1 className="page-title">Traking</h1>
        <p className="page-subtitle">Overview of application statuses</p>
      </div>

      <div className="traking-content">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
          <div className="status-cards">
            <div className="status-card status-pending">
              <div className="status-icon"><FaHourglassHalf /></div>
              <div className="status-body">
                <div className="status-label">Pending</div>
                <div className="status-value">{counts.pending}</div>
              </div>
            </div>

            <div className="status-card status-approved">
              <div className="status-icon"><FaCheckCircle /></div>
              <div className="status-body">
                <div className="status-label">Approved</div>
                <div className="status-value">{counts.approved}</div>
              </div>
            </div>

            <div className="status-card status-rejected">
              <div className="status-icon"><FaTimesCircle /></div>
              <div className="status-body">
                <div className="status-label">Rejected</div>
                <div className="status-value">{counts.rejected}</div>
              </div>
            </div>
          </div>
          {/* Applications list with actions for recruiters */}
          <div className="applications-list mt-4">
            <h3>Applications</h3>
            {applications.length === 0 ? <p>No applications yet.</p> : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Job</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.CandidateName}</td>
                        <td>{app.JobTitle}</td>
                        <td>{app.AppliedDate}</td>
                        <td>{(app.Status || app.status) || 'pending'}</td>
                        <td>
                          {canManageApplication(app) ? (
                            <div className="btn-group">
                              <button className="btn btn-sm btn-success" disabled={actionLoading===app.id} onClick={() => changeStatus(app.id, 'Approved')}>Approve</button>
                              <button className="btn btn-sm btn-danger" disabled={actionLoading===app.id} onClick={() => changeStatus(app.id, 'Rejected')}>Reject</button>
                            </div>
                          ) : (
                            <span className="text-muted">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Traking;
