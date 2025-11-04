import { useState, useEffect, useCallback } from 'react';
import { adminsAPI } from '../services/api.jsx';
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  XCircle,
} from 'lucide-react';
import { formatDate, getRoleColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'blog_manager',
    isActive: true,
  });
  const [passwordError, setPasswordError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const roles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'blog_manager', label: 'Blog Manager' },
    { value: 'story_moderator', label: 'Story Moderator' },
  ];

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await adminsAPI.getAll({
        page: currentPage,
        limit: 10,
      });
      setAdmins(response.data.data.admins);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreate = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };
      
      await adminsAPI.create(payload);
      toast.success('Admin created successfully! Login credentials have been sent to their email.');
      setShowModal(false);
      resetForm();
      fetchAdmins();
    } catch (error) {
      console.error('Failed to create admin:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path] = err.msg;
        });
        setFormErrors(backendErrors);
        toast.error('Please fix the validation errors');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to create admin';
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await adminsAPI.update(editingAdmin._id, formData);
      toast.success('Admin updated successfully');
      setShowModal(false);
      setEditingAdmin(null);
      resetForm();
      fetchAdmins();
    } catch (error) {
      console.error('Failed to update admin:', error);
      toast.error('Failed to update admin');
    }
  };

  const handleDelete = async (adminId, name) => {
    if (window.confirm(`Are you sure you want to delete admin "${name}"?`)) {
      try {
        await adminsAPI.delete(adminId);
        toast.success('Admin deleted successfully');
        fetchAdmins();
      } catch (error) {
        console.error('Failed to delete admin:', error);
        toast.error('Failed to delete admin');
      }
    }
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    try {
      await adminsAPI.update(adminId, { isActive: !currentStatus });
      toast.success(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchAdmins();
    } catch (error) {
      console.error('Failed to update admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  const openCreateModal = () => {
    setEditingAdmin(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
    resetForm();
    setPasswordError('');
    setFormErrors({});
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'blog_manager',
      isActive: true,
    });
    setPasswordError('');
    setFormErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Validate password in real-time
    if (field === 'password' && !editingAdmin) {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    if (!password || password.length === 0) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 8) {
      setPasswordError(`Password must be at least 8 characters (currently ${password.length})`);
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!editingAdmin) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage admin accounts and permissions
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {admins.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <li key={admin._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start sm:items-center flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {admin.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                            {admin.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                                admin.role
                              )}`}
                            >
                              {admin.role.replace('_', ' ')}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                admin.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-1 sm:gap-0">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="truncate">{admin.email}</span>
                          </div>
                          <span className="hidden sm:inline mx-2">•</span>
                          <span className="text-xs sm:text-sm">Created {formatDate(admin.createdAt)}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {admin.permissions.canManageBlogs && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Blogs
                            </span>
                          )}
                          {admin.permissions.canManageStories && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Stories
                            </span>
                          )}
                          {admin.permissions.canManageAdmins && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Admins
                            </span>
                          )}
                          {admin.permissions.canViewAnalytics && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Analytics
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end sm:justify-start space-x-3 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                        className={`p-2 rounded-md ${
                          admin.isActive
                            ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                        title={admin.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {admin.isActive ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => openEditModal(admin)}
                        className="p-2 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                        title="Edit admin"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(admin._id, admin.name)}
                        className="p-2 rounded-md text-red-600 hover:text-red-900 hover:bg-red-50"
                        title="Delete admin"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <User className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No admins</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new admin account.
            </p>
            <div className="mt-6">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Admin name"
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="admin@example.com"
                      required
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                  
                  {!editingAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          passwordError || formErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter password (min. 8 characters)"
                        required
                        minLength={8}
                      />
                      {(passwordError || formErrors.password) && (
                        <p className="mt-1 text-xs text-red-600">
                          {passwordError || formErrors.password}
                        </p>
                      )}
                      {!passwordError && !formErrors.password && formData.password.length > 0 && formData.password.length >= 8 && (
                        <p className="mt-1 text-xs text-green-600">
                          ✓ Password meets requirements
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long. The admin will receive their login credentials via email.
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active account
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={editingAdmin ? handleUpdate : handleCreate}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
                <button
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
