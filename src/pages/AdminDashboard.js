import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { FiUsers, FiUserCheck, FiUserX, FiMail, FiCalendar, FiShield, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [modal, setModal] = useState({
    isOpen: false,
    type: '',
    user: null,
    action: '',
  });

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers(page, 10);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const openModal = (user, action) => {
    setModal({
      isOpen: true,
      type: action === 'deactivate' ? 'danger' : 'success',
      user,
      action,
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', user: null, action: '' });
  };

  const handleAction = async () => {
    const { user, action } = modal;
    setActionLoading(user.id);
    closeModal();

    try {
      if (action === 'activate') {
        await adminAPI.activateUser(user.id);
        toast.success(`${user.fullName} has been activated`);
      } else if (action === 'deactivate') {
        await adminAPI.deactivateUser(user.id);
        toast.success(`${user.fullName} has been deactivated`);
      }
      fetchUsers(pagination.currentPage);
    } catch (error) {
      const message = error.response?.data?.message || `Failed to ${action} user`;
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getModalContent = () => {
    const { action, user } = modal;
    if (action === 'activate') {
      return {
        title: 'Activate User',
        message: `Are you sure you want to activate ${user?.fullName}'s account? They will be able to log in again.`,
        confirmText: 'Activate',
      };
    } else if (action === 'deactivate') {
      return {
        title: 'Deactivate User',
        message: `Are you sure you want to deactivate ${user?.fullName}'s account? They will no longer be able to log in.`,
        confirmText: 'Deactivate',
      };
    }
    return {};
  };

  return (
    <div className="admin-page">
      <Navbar />
      
      <main className="admin-main">
        <div className="admin-container fade-in">
          <div className="admin-header">
            <div className="header-title">
              <FiUsers className="header-icon" />
              <div>
                <h1>User Management</h1>
                <p>{pagination.totalUsers} total users</p>
              </div>
            </div>
            <button className="refresh-btn" onClick={() => fetchUsers(pagination.currentPage)} disabled={loading}>
              <FiRefreshCw className={loading ? 'spinning' : ''} />
              Refresh
            </button>
          </div>

          <div className="users-table-container">
            {loading ? (
              <div className="table-loading">
                <LoadingSpinner size="large" />
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="table-empty">
                <FiUsers />
                <p>No users found</p>
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="user-cell">
                            <div className="user-avatar">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                              <span className="user-name">{user.fullName}</span>
                              <span className="user-email">
                                <FiMail /> {user.email}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`role-badge role-${user.role}`}>
                              <FiShield />
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge status-${user.status}`}>
                              {user.status === 'active' ? <FiUserCheck /> : <FiUserX />}
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <span className="date-cell">
                              <FiCalendar />
                              {formatDate(user.createdAt)}
                            </span>
                          </td>
                          <td>
                            <span className="date-cell">
                              {formatDate(user.lastLogin)}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {actionLoading === user.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                <>
                                  {user.status === 'inactive' ? (
                                    <button
                                      className="action-btn activate-btn"
                                      onClick={() => openModal(user, 'activate')}
                                      title="Activate user"
                                    >
                                      <FiUserCheck />
                                      Activate
                                    </button>
                                  ) : (
                                    <button
                                      className="action-btn deactivate-btn"
                                      onClick={() => openModal(user, 'deactivate')}
                                      title="Deactivate user"
                                    >
                                      <FiUserX />
                                      Deactivate
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={handleAction}
        type={modal.type}
        {...getModalContent()}
      />
    </div>
  );
};

export default AdminDashboard;
