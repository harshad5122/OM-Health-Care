

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';
import registerIllustration from '../../assets/auth/login-illustration.png';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    gender: '',
    country: 'India',
    state: '',
    city: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    navigate('/');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration-section">
        <button onClick={() => navigate('/')} className="go-back-button">
          <svg className="go-back-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Go Back
        </button>
        <div className="illustration-content">
          <img src={registerIllustration} alt="Register Illustration" className="auth-illustration" />
          <h3 className="illustration-title">Join Our Community</h3>
          <p className="illustration-subtitle">Become a part of OM Health Care</p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Please fill in your details to get started</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div> </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div> </div>
            </div>

        

            <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <div className="phone-input">
                      <select id="country-code" className="country-code">
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        {/* Add more country codes as needed */}
                      </select>
                      <input
                        type="tel"
                        id="mobile"
                        placeholder="Enter your mobile number"
                       value={formData.mobile}
                  onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password (Optional)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div> </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={!formData.password}
                />
              </div>
              <div> </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-row three-col">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="Your state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div> </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
               <div> </div>
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="auth-button">
              Register Account
            </button>
          </form>

          <div className="auth-footer">
            <p className="signup-prompt">
              Already have an account?{' '}
              <Link to="/auth/login" className="auth-link">
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;