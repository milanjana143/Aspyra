// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

// Get current user's role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'jobseeker';
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

// Check if user is recruiter
export const isRecruiter = () => {
  return getUserRole() === 'recruiter';
};

// Check if user is jobseeker
export const isJobSeeker = () => {
  return getUserRole() === 'jobseeker';
};

// Check if user can edit another user (admin can edit all, jobseeker can edit self)
export const canEditUser = (targetUserId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  if (isAdmin()) return true; // admins can edit anyone
  return currentUser.id === targetUserId; // others can only edit themselves
};

// Check if user can manage all data
export const canManageAllData = () => {
  return isAdmin() || isRecruiter();
};

// Check if user can view item (based on createdBy)
export const canViewItem = (itemCreatedBy) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  if (isAdmin()) return true; // admins see all
  if (isRecruiter()) return currentUser.id === itemCreatedBy; // recruiters see only their own
  if (isJobSeeker()) return currentUser.id === itemCreatedBy; // jobseekers see only their own
  return false;
};

// Check if user can edit item
export const canEditItem = (itemCreatedBy) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  if (isAdmin()) return true; // admins can edit all
  return currentUser.id === itemCreatedBy; // others can only edit their own
};
