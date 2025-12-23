import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowUp } from 'react-icons/fa';
import './Login.css';
import { login } from '../api/auth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call backend login
    (async () => {
      try {
        const payload = { Email: formData.email, Password: formData.password };
        const res = await login(payload);
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user || {}));
          navigate('/');
        } else {
          alert('Login failed');
        }
      } catch (err) {
        console.error('Login error', err);
        const msg = err?.response?.data?.error || err?.message || 'Login failed';
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
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            {/* Logo */}
            <div className="login-logo">
              <h1 className="logo-text">
                Aspyra <FaArrowUp className="logo-icon" />
              </h1>
            </div>

            {/* Welcome Text */}
            <div className="login-header">
              <h2 className="login-title">Welcome Back!</h2>
              <p className="login-subtitle">Please login to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
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

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
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

              {/* Remember Me */}
              <div className="form-options">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="form-check-input"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <label htmlFor="remember" className="form-check-label">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn btn-login">
                Login
              </button>

              {/* Sign Up Link */}
              <div className="signup-link">
                Don't have an account? <Link to="/register">Sign up</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Illustration/Branding */}
        <div className="login-illustration-section">
          <div className="illustration-content">
            <h2 className="illustration-title">Find Your Dream Job</h2>
            <p className="illustration-text">
              Join thousands of professionals who found their perfect career match on Aspyra.
            </p>
            <div className="illustration-features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>10,000+ Job Listings</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>500+ Companies</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Easy Application Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;