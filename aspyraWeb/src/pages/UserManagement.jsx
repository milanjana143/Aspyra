import { FaEye, FaEdit, FaBan, FaTimes, FaUserPlus, FaFilter, FaSort } from 'react-icons/fa';
import './UserManagement.css';
import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import { isAdmin, canEditUser, getCurrentUser } from '../utils/authUtils';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    FullName: '',
    Email: '',
    PhoneNo: '',
    Address: '',
    Pincode: '',
    role: 'jobseeker',
    Password: ''
  });
  const [message, setMessage] = useState(null);

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      id: user.id,
      FullName: user.name,
      Email: user.email,
      PhoneNo: user.phone,
      Address: user.location,
      Pincode: '',
      role: user.role || 'jobseeker'
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const missing = [];
    if (!editForm.FullName) missing.push('Full Name');
    if (!editForm.Email) missing.push('Email');
    if (!editForm.PhoneNo) missing.push('Phone No');
    if (!editForm.Address) missing.push('Address');
    if (missing.length) {
      setMessage('Please provide: ' + missing.join(', '));
      return;
    }
    try {
      const payload = { 
        FullName: editForm.FullName,
        Email: editForm.Email,
        PhoneNo: Number(editForm.PhoneNo),
        Address: editForm.Address,
        Pincode: editForm.Pincode ? Number(editForm.Pincode) : undefined,
        role: editForm.role || 'jobseeker'
      };
      await updateUser(editForm.id, payload);
      setMessage('User updated successfully');
      cancelEdit();
      loadUsers();
    } catch (err) {
      console.error('Update user failed', err);
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
      setMessage(serverMsg || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      setMessage('User deleted successfully');
      loadUsers();
    } catch (err) {
      console.error('Delete user failed', err);
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
      setMessage(serverMsg || 'Failed to delete user');
    }
  };

  const loadUsers = () => {
    setLoading(true);
    getUsers()
      .then((data) => {
        const mapped = (data || []).map((u) => ({
          id: u._id || u.id,
          name: u.FullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          location: u.Address || '',
          email: u.Email || '',
          phone: u.PhoneNo ? String(u.PhoneNo) : u.phone || '',
          role: u.role || u.Role || 'jobseeker',
          status: 'Active',
          statusColor: 'success',
          avatar: (u.FullName && u.FullName.split(' ').map(n=>n[0]).slice(0,2).join('')) || 'U'
        }));
        setUsers(mapped);
      })
      .catch((err) => {
        console.error('Failed to load users', err);
        setError(err?.message || 'Error loading users');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const openCreate = () => { setMessage(null); setShowCreate(true); };
  const closeCreate = () => { setShowCreate(false); setForm({ FullName: '', Email: '', PhoneNo: '', Address: '', Pincode: '', role: 'jobseeker', Password: '' }); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    // Basic validation
    const missing = [];
    if (!form.FullName) missing.push('Full Name');
    if (!form.Email) missing.push('Email');
    if (!form.PhoneNo) missing.push('Phone No');
    if (!form.Address) missing.push('Address');
    if (!form.Pincode) missing.push('Pincode');
    if (!form.Password) missing.push('Password');
    if (missing.length) {
      setMessage('Please provide: ' + missing.join(', '));
      setSubmitting(false);
      return;
    }
    try {
      const payload = { ...form, PhoneNo: Number(form.PhoneNo), Pincode: Number(form.Pincode), role: form.role };
      await createUser(payload);
      setMessage('User created successfully');
      closeCreate();
      loadUsers();
    } catch (err) {
      console.error('Create user failed', err);
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
      setMessage(serverMsg || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const getActionButtons = (user, status) => {
    const canEdit = canEditUser(user.id);
    if (status === 'Active' || status === 'Suspicious') {
      return (
        <>
          <button className="btn-icon btn-primary" title="View Profile">
            <FaEye />
          </button>
          {canEdit && (
            <button className="btn-icon btn-warning" title="Edit" onClick={() => startEdit(user)}>
              <FaEdit />
            </button>
          )}
          {isAdmin() && (
            <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDelete(user.id)}>
              <FaBan />
            </button>
          )}
        </>
      );
    }
    return null;
  };

  if (loading) return <div className="user-management-page">Loading users...</div>;
  if (error) return <div className="user-management-page">Error: {error}</div>;

  return (
    <div className="user-management-page">
      {/* Page Header */}
      <div className="page-header-section">
        <h1 className="page-title">User Management</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Add User
        </button>
      </div>

      {message && <div className="alert alert-info mt-2">{message}</div>}

      {showCreate && (
        <div className="create-user-form card p-3 mb-4">
          <form onSubmit={handleCreate}>
            <div className="mb-2">
              <label className="form-label">Full Name</label>
              <input name="FullName" value={form.FullName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input name="Email" value={form.Email} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Phone No</label>
              <input name="PhoneNo" value={form.PhoneNo} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Address</label>
              <input name="Address" value={form.Address} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Pincode</label>
              <input name="Pincode" value={form.Pincode} onChange={handleChange} className="form-control" required />
            </div>
            {isAdmin() && (
              <div className="mb-2">
                <label className="form-label">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="form-control">
                  <option value="jobseeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <div className="mb-2">
              <label className="form-label">Password</label>
              <input name="Password" type="password" value={form.Password} onChange={handleChange} className="form-control" required />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
              <button className="btn btn-secondary" type="button" onClick={closeCreate}>Cancel</button>
            </div>
          </form>
        </div>
      )}

     

      {/* Users Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="table user-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                editingId === user.id ? (
                  <tr key={user.id} className="edit-row">
                    <td colSpan="6">
                      <form onSubmit={handleEditSubmit} className="edit-inline-form p-3">
                        <div className="row g-2">
                          <div className="col-md-2">
                            <label className="form-label">Full Name</label>
                            <input name="FullName" value={editForm.FullName} onChange={handleEditChange} className="form-control form-control-sm" required />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Email</label>
                            <input name="Email" value={editForm.Email} onChange={handleEditChange} className="form-control form-control-sm" required />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Phone</label>
                            <input name="PhoneNo" value={editForm.PhoneNo} onChange={handleEditChange} className="form-control form-control-sm" required />
                          </div>
                          {isAdmin() && (
                            <div className="col-md-2">
                              <label className="form-label">Role</label>
                              <select name="role" value={editForm.role || 'jobseeker'} onChange={handleEditChange} className="form-control form-control-sm">
                                <option value="jobseeker">Job Seeker</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          )}
                          <div className="col-md-3">
                            <label className="form-label">Address</label>
                            <input name="Address" value={editForm.Address} onChange={handleEditChange} className="form-control form-control-sm" required />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Pincode</label>
                            <input name="Pincode" value={editForm.Pincode} onChange={handleEditChange} className="form-control form-control-sm" />
                          </div>
                        </div>
                        <div className="mt-3 d-flex gap-2">
                          <button type="submit" className="btn btn-sm btn-success">Save</button>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.avatar}
                      </div>
                      <div>
                        <h6 className="user-name">{user.name}</h6>
                        <p className="user-location">{user.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td><span className="badge bg-info">{user.role}</span></td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`badge status-badge status-${user.statusColor}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {getActionButtons(user, user.status)}
                    </div>
                  </td>
                </tr>
                )
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <p className="pagination-info">Showing 1-{Math.min(5, users.length)} of {users.length} users</p>
          <nav>
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#">‹</a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">1</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">2</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">3</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">›</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;