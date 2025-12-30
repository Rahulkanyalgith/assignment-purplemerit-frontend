import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUser, FiMail, FiLock, FiCalendar, FiClock, FiEdit2, FiSave, FiX, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [user]);

  const passwordRequirements = [
    { test: (p) => p.length >= 8, label: 'At least 8 characters' },
    { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
    { test: (p) => /[a-z]/.test(p), label: 'One lowercase letter' },
    { test: (p) => /\d/.test(p), label: 'One number' },
    { test: (p) => /[@$!%*?&]/.test(p), label: 'One special character' },
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully!');
      setEditMode(false);
      setErrors({});
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!passwordRequirements.every((req) => req.test(passwordData.newPassword))) {
      newErrors.newPassword = 'Password does not meet requirements';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setChangePasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      setErrors({ password: message });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
    });
    setEditMode(false);
    setErrors({});
  };

  const cancelPasswordChange = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setChangePasswordMode(false);
    setErrors({});
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <main className="profile-main">
        <div className="profile-container fade-in">
          <div className="profile-header">
            <div className="profile-avatar">
              <FiUser />
            </div>
            <div className="profile-title">
              <h1>{user?.fullName}</h1>
              <span className={`status-badge status-${user?.status}`}>
                {user?.status}
              </span>
              <span className={`role-badge role-${user?.role}`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>
                <FiUser />
                Profile Information
              </h2>
              {!editMode && (
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  <FiEdit2 />
                  Edit
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {errors.submit && (
                  <div className="form-error">{errors.submit}</div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={cancelEdit}>
                    <FiX />
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <LoadingSpinner size="small" color="white" /> : (
                      <>
                        <FiSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <FiUser className="info-icon" />
                  <div>
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user?.fullName}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiMail className="info-icon" />
                  <div>
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiCalendar className="info-icon" />
                  <div>
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{formatDate(user?.createdAt)}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiClock className="info-icon" />
                  <div>
                    <span className="info-label">Last Login</span>
                    <span className="info-value">{formatDate(user?.lastLogin)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>
                <FiLock />
                Security
              </h2>
              {!changePasswordMode && (
                <button className="edit-btn" onClick={() => setChangePasswordMode(true)}>
                  <FiEdit2 />
                  Change Password
                </button>
              )}
            </div>

            {changePasswordMode ? (
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, currentPassword: e.target.value });
                        if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                      }}
                      className={errors.currentPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                      }}
                      className={errors.newPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                  
                  <div className="password-requirements">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`requirement ${req.test(passwordData.newPassword) ? 'met' : ''}`}
                      >
                        {req.test(passwordData.newPassword) ? <FiCheck /> : <FiX />}
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                {errors.password && (
                  <div className="form-error">{errors.password}</div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={cancelPasswordChange}>
                    <FiX />
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <LoadingSpinner size="small" color="white" /> : (
                      <>
                        <FiSave />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="security-info">
                <p>Keep your account secure by using a strong password.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
