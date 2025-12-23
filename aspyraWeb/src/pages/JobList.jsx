import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaBuilding, FaRupeeSign } from 'react-icons/fa';
import { getJobs } from '../api/jobs';
import { createApplication } from '../api/applications';
import { getCurrentUser, isJobSeeker } from '../utils/authUtils';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState('');

  useEffect(() => {
    setLoading(true);
    getJobs()
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Failed to load jobs', err);
        setError('Failed to load jobs');
      })
      .finally(() => setLoading(false));
  }, []);

  const openApply = (job) => {
    setApplyJob(job);
    setResume('');
  };

  const closeApply = () => setApplyJob(null);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyJob) return;
    setSubmitting(true);
    setError(null);
    try {
      const currentUser = getCurrentUser();
      const payload = {
        JobTitle: applyJob.JobsName || applyJob.title || '',
        CandidateName: currentUser?.FullName || '',
        Resume: resume || 'N/A',
        Status: 'Pending',
        AppliedDate: new Date().toISOString(),
        UpdatedDate: new Date().toISOString(),
        createdBy: currentUser?.id || null
      };
      await createApplication(payload);
      // optimistic UI: close modal and show confirmation
      closeApply();
      alert('Application submitted successfully');
    } catch (err) {
      console.error('Apply failed', err);
      setError('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="job-list-page">Loading jobs...</div>;
  if (error) return <div className="job-list-page">Error: {error}</div>;

  return (
    <div className="job-list-page container py-4">
      <h1 className="mb-3">Job Listings</h1>
      <div className="row">
        {jobs.map(job => (
          <div className="col-md-6 mb-3" key={job._id || job.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{job.JobsName || job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted"><FaBuilding /> {job.CompanyName || job.company || 'Company'}</h6>
                <p className="card-text">{job.JobDesc || job.description}</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <small className="text-muted"><FaMapMarkerAlt /> {job.Location}</small>
                    <div><small className="text-muted"><FaRupeeSign /> {job.Salary ? `₹${job.Salary}` : ''}</small></div>
                  </div>
                  <div>
                    {isJobSeeker() ? (
                      <button className="btn btn-primary" onClick={() => openApply(job)}>Apply</button>
                    ) : (
                      <span className="text-muted">{job.JobsType || job.type}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applyJob && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for {applyJob.JobsName || applyJob.title}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeApply}></button>
              </div>
              <form onSubmit={handleApply}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Your Name</label>
                    <input type="text" className="form-control" value={getCurrentUser()?.FullName || ''} readOnly />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Resume (paste link or text)</label>
                    <textarea className="form-control" value={resume} onChange={e => setResume(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeApply}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Applying...' : 'Apply'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
