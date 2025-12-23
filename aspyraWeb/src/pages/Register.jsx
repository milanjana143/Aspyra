import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowUp, FaPhone } from 'react-icons/fa';
import './Register.css';
import { register } from '../api/auth';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'jobseeker',
    terms: false
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.terms) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    // Call backend register
    (async () => {
      try {
        const payload = {
          FullName: formData.fullName,
          Email: formData.email,
          Password: formData.password,
          PhoneNo: formData.phone
        };
        // map frontend userType to backend role
        // 'employer' in UI should register as 'recruiter' role
        if (formData.userType === 'employer') {
          payload.role = 'recruiter';
        } else {
          payload.role = 'jobseeker';
        }
        const res = await register(payload);
        if (res?.token) {
          // registration returns token + user
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user || {}));
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Register error', err);
        const msg = err?.response?.data?.error || err?.message || 'Registration failed';
        alert(msg);
      }
    })();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Illustration/Branding */}
        <div className="register-illustration-section">
          <div className="illustration-content">
            <h2 className="illustration-title">Start Your Journey Today</h2>
            <p className="illustration-text">
              Create your account and unlock access to thousands of job opportunities from top companies.
            </p>
            <div className="illustration-features">
              <div className="feature-item">
                <div className="feature-icon">1</div>
                <div>
                  <h4>Create Account</h4>
                  <p>Quick and easy registration</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">2</div>
                <div>
                  <h4>Build Profile</h4>
                  <p>Showcase your skills and experience</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">3</div>
                <div>
                  <h4>Apply to Jobs</h4>
                  <p>Find your dream career</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-form-section">
          <div className="register-form-wrapper">
            {/* Logo */}
            <div className="register-logo">
              <h1 className="logo-text">
                Aspyra <FaArrowUp className="logo-icon" />
              </h1>
            </div>

            {/* Header */}
            <div className="register-header">
              <h2 className="register-title">Create Account</h2>
              <p className="register-subtitle">Join thousands of job seekers and employers</p>
            </div>

            {/* User Type Selection */}
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'jobseeker' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, userType: 'jobseeker' }))}
              >
                Job Seeker
              </button>
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'employer' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, userType: 'employer' }))}
              >
                Recruiter
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="register-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="form-check terms-check">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="form-check-input"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="terms" className="form-check-label">
                  I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>

              {/* Register Button */}
              <button type="submit" className="btn btn-register">
                Create Account
              </button>

              {/* Login Link */}
              <div className="login-link">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;