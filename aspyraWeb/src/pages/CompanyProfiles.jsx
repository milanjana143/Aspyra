import { FaStar, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import './CompanyProfiles.css';
import { useEffect, useState } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../api/companies';

const CompanyProfiles = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCompanies = () => {
    setLoading(true);
    getCompanies()
      .then((data) => {
        const mapped = (data || []).map((c) => ({
          id: c._id || c.id,
          name: c.CompanyName || c.name,
          registrationNo: c.RegistrationNo || '',
          industry: c.CompanyType || '',
          nature: c.CompanyNature || '',
          location: c.CompanyAddress || '',
          contactNo: c.ContactNo || '',
          email: c.Email || '',
          logo: c.CompanyName ? c.CompanyName.charAt(0) : '',
          logoColor: '#4285f4',
          description: `Type: ${c.CompanyNature || ''}`,
          tags: [],
          rating: 4.5,
          openPositions: []
        }));
        setCompanies(mapped);
      })
      .catch((err) => {
        console.error('Failed to load companies', err);
        setError(err?.message || 'Error loading companies');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCompanies(); }, []);

  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    CompanyName: '',
    RegistrationNo: '',
    CompanyType: '',
    CompanyNature: '',
    CompanyAddress: '',
    ContactNo: '',
    Email: ''
  });
  const [message, setMessage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    CompanyName: '',
    RegistrationNo: '',
    CompanyType: '',
    CompanyNature: '',
    CompanyAddress: '',
    ContactNo: '',
    Email: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const openCreate = () => { setMessage(null); setShowCreate(true); };
  const closeCreate = () => { setShowCreate(false); setForm({ CompanyName: '', RegistrationNo: '', CompanyType: '', CompanyNature: '', CompanyAddress: '', ContactNo: '', Email: '' }); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const missing = [];
    if (!form.CompanyName) missing.push('Company Name');
    if (!form.RegistrationNo) missing.push('Registration No');
    if (!form.CompanyType) missing.push('Company Type');
    if (!form.CompanyNature) missing.push('Company Nature');
    if (!form.CompanyAddress) missing.push('Company Address');
    if (!form.ContactNo) missing.push('Contact No');
    if (!form.Email) missing.push('Email');
    if (missing.length) {
      setMessage('Please provide: ' + missing.join(', '));
      setSubmitting(false);
      return;
    }
    try {
      const payload = { ...form, ContactNo: Number(form.ContactNo) };
      await createCompany(payload);
      setMessage('Company created successfully');
      closeCreate();
      loadCompanies();
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
      setMessage(serverMsg || 'Failed to create company');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (company) => {
    setEditId(company.id);
    setEditForm({
      CompanyName: company.name || '',
      RegistrationNo: company.registrationNo || '',
      CompanyType: company.industry || '',
      CompanyNature: company.nature || '',
      CompanyAddress: company.location || '',
      ContactNo: company.contactNo || '',
      Email: company.email || ''
    });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({
      CompanyName: '',
      RegistrationNo: '',
      CompanyType: '',
      CompanyNature: '',
      CompanyAddress: '',
      ContactNo: '',
      Email: ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setMessage(null);
    const missing = [];
    if (!editForm.CompanyName) missing.push('Company Name');
    if (!editForm.RegistrationNo) missing.push('Registration No');
    if (!editForm.CompanyType) missing.push('Company Type');
    if (!editForm.CompanyNature) missing.push('Company Nature');
    if (!editForm.CompanyAddress) missing.push('Company Address');
    if (!editForm.ContactNo) missing.push('Contact No');
    if (!editForm.Email) missing.push('Email');
    if (missing.length) {
      setMessage('Please provide: ' + missing.join(', '));
      setEditSubmitting(false);
      return;
    }
    try {
      const payload = { ...editForm, ContactNo: Number(editForm.ContactNo) };
      await updateCompany(editId, payload);
      setMessage('Company updated successfully');
      cancelEdit();
      loadCompanies();
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
      setMessage(serverMsg || 'Failed to update company');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    setMessage(null);
    try {
      await deleteCompany(id);
      setMessage('Company deleted successfully');
      loadCompanies();
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
      setMessage(serverMsg || 'Failed to delete company');
    }
  };

  if (loading) return <div className="company-profiles-page">Loading companies...</div>;
  if (error) return <div className="company-profiles-page">Error: {error}</div>;

  return (
    <div className="company-profiles-page">
      {/* Page Header */}
      <div className="page-header-section">
        <h1 className="page-title">Company Profiles</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Add Company
        </button>
      </div>

      {message && <div className="alert alert-info mt-2">{message}</div>}

      {showCreate && (
        <div className="create-company-form card p-3 mb-4">
          <form onSubmit={handleCreate}>
            <div className="mb-2">
              <label className="form-label">Company Name</label>
              <input name="CompanyName" value={form.CompanyName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Registration No</label>
              <input name="RegistrationNo" value={form.RegistrationNo} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Company Type</label>
              <input name="CompanyType" value={form.CompanyType} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Company Nature</label>
              <input name="CompanyNature" value={form.CompanyNature} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Company Address</label>
              <input name="CompanyAddress" value={form.CompanyAddress} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Contact No</label>
              <input name="ContactNo" value={form.ContactNo} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input name="Email" value={form.Email} onChange={handleChange} className="form-control" required />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
              <button className="btn btn-secondary" type="button" onClick={closeCreate}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Companies Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="table company-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Registration No</th>
                <th>Type</th>
                <th>Nature</th>
                <th>Address</th>
                <th>Contact No</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                editId === company.id ? (
                  <tr key={company.id}>
                    <td colSpan={8}>
                      <form onSubmit={handleEditSubmit} className="edit-company-form">
                        <div className="row g-2">
                          <div className="col-md-2">
                            <input name="CompanyName" value={editForm.CompanyName} onChange={handleEditChange} className="form-control" placeholder="Company Name" required />
                          </div>
                          <div className="col-md-2">
                            <input name="RegistrationNo" value={editForm.RegistrationNo} onChange={handleEditChange} className="form-control" placeholder="Reg No" required />
                          </div>
                          <div className="col-md-1">
                            <input name="CompanyType" value={editForm.CompanyType} onChange={handleEditChange} className="form-control" placeholder="Type" required />
                          </div>
                          <div className="col-md-1">
                            <input name="CompanyNature" value={editForm.CompanyNature} onChange={handleEditChange} className="form-control" placeholder="Nature" required />
                          </div>
                          <div className="col-md-2">
                            <input name="CompanyAddress" value={editForm.CompanyAddress} onChange={handleEditChange} className="form-control" placeholder="Address" required />
                          </div>
                          <div className="col-md-1">
                            <input name="ContactNo" value={editForm.ContactNo} onChange={handleEditChange} className="form-control" placeholder="Contact" required />
                          </div>
                          <div className="col-md-2">
                            <input name="Email" value={editForm.Email} onChange={handleEditChange} className="form-control" placeholder="Email" required />
                          </div>
                          <div className="col-md-1 d-flex gap-2">
                            <button className="btn btn-success btn-sm" type="submit" disabled={editSubmitting}>{editSubmitting ? 'Saving...' : 'Save'}</button>
                            <button className="btn btn-secondary btn-sm" type="button" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={company.id}>
                    <td>{company.name}</td>
                    <td>{company.registrationNo}</td>
                    <td>{company.industry}</td>
                    <td>{company.nature}</td>
                    <td>{company.location}</td>
                    <td>{company.contactNo}</td>
                    <td>{company.email}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-primary" title="Edit" onClick={() => startEdit(company)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDelete(company.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfiles;