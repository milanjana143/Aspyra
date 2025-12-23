import { 
  FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaBriefcase, FaGraduationCap, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';
import './Profile.css';
import { useState, useEffect } from 'react';
import { getCurrentUser, isRecruiter, getUserRole } from '../utils/authUtils';
import { getUsers, updateUser } from '../api/users';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    pincode: '',
    bio: '',
    title: '',
    company: ''
  });

  const [editForm, setEditForm] = useState({
    FullName: '',
    Email: '',
    PhoneNo: '',
    Address: '',
    Pincode: ''
  });

  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  // Load user data on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    const userRole = getUserRole();
    
    // Format role display (capitalize first letter, replace hyphens/underscores)
    const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1).replace(/[-_]/g, ' ');
    
    if (currentUser) {
      setUserInfo({
        name: currentUser.FullName || '',
        email: currentUser.Email || '',
        phone: currentUser.PhoneNo || '',
        location: currentUser.Address || '',
        address: currentUser.Address || '',
        pincode: currentUser.Pincode || '',
        bio: currentUser.bio || '',
        title: roleDisplay || 'User',
        company: currentUser.company || ''
      });

      setEditForm({
        FullName: currentUser.FullName || '',
        Email: currentUser.Email || '',
        PhoneNo: currentUser.PhoneNo || '',
        Address: currentUser.Address || '',
        Pincode: currentUser.Pincode || ''
      });

      // Load mock skills/experience/education (can be extended with real data)
      setSkills(currentUser.skills || [
        'JavaScript', 'React', 'Node.js', 'Problem Solving',
        'Communication', 'Team Collaboration', 'Git', 'Agile'
      ]);

      setExperience(currentUser.experience || [
        {
          title: 'Current Role',
          company: 'Your Company',
          period: 'Present',
          description: 'Your current position and responsibilities'
        }
      ]);

      setEducation(currentUser.education || [
        {
          degree: 'Relevant Qualification',
          school: 'Your School/University',
          year: 'Year'
        }
      ]);
    }
    setLoading(false);
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    const currentUser = getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      setMessage('Error: User not found');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        FullName: editForm.FullName,
        Email: editForm.Email,
        PhoneNo: editForm.PhoneNo,
        Address: editForm.Address,
        Pincode: editForm.Pincode ? Number(editForm.Pincode) : undefined
      };

      await updateUser(currentUser.id, payload);
      
      // Update localStorage with new user data
      const updatedUser = { ...currentUser, ...payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUserInfo({
        name: editForm.FullName,
        email: editForm.Email,
        phone: editForm.PhoneNo,
        location: editForm.Address,
        address: editForm.Address,
        pincode: editForm.Pincode,
        bio: userInfo.bio,
        title: userInfo.title,
        company: userInfo.company
      });

      setMessage('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
      const serverMsg = err?.response?.data?.error || err?.message || 'Failed to update profile';
      setMessage(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {/* Page Header with Edit Button */}
      <div className="profile-header-section">
        <h1 className="page-title">User Profile</h1>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <FaEdit className="me-2" />
            Edit Profile
          </button>
        ) : (
          <div className="btn-group gap-2">
            <button className="btn btn-success" onClick={handleSaveProfile} disabled={saving}>
              <FaSave className="me-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>
              <FaTimes className="me-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mt-2`}>
          {message}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column - User Info Card */}
        <div className="col-lg-4">
          {isEditing ? (
            <div className="profile-card">
              <h3 className="card-section-title">Edit Information</h3>
              <div className="edit-form">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="FullName"
                    value={editForm.FullName}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="Email"
                    value={editForm.Email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="PhoneNo"
                    value={editForm.PhoneNo}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="Address"
                    value={editForm.Address}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="Pincode"
                    value={editForm.Pincode}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-card">
                <div className="profile-avatar-section">
                  <FaUserCircle className="profile-avatar-large" />
                  <h2 className="profile-name">{userInfo.name}</h2>
                  <p className="profile-title">{userInfo.title}</p>
                </div>

                <div className="profile-details">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span>{userInfo.phone}</span>
                  </div>
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{userInfo.location}</span>
                  </div>
                  {userInfo.company && (
                    <div className="detail-item">
                      <FaBriefcase className="detail-icon" />
                      <span>{userInfo.company}</span>
                    </div>
                  )}
                </div>
              </div>

             
            </>
          )}
        </div>

       
      </div>
    </div>
  );
};

export default Profile;