import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Shield,
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  FileText,
  UserPlus,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, totalRegularUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [addLoading, setAddLoading] = useState(false);

  // Status/Alert State
  const [notification, setNotification] = useState({ type: '', message: '' });

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ search, role: roleFilter });
      setUsers(res.data.data || []);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Toggle user role
  const handleToggleRole = async (targetUser) => {
    if (targetUser.email === 'admin12@gmail.com') {
      notify('error', 'Primary Admin (admin12@gmail.com) cannot be demoted');
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = `Are you sure you want to change ${targetUser.email}'s role to ${newRole.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await adminApi.updateUserRole(targetUser._id || targetUser.id, newRole);
      notify('success', `Updated ${targetUser.email} to ${newRole}`);
      fetchUsers();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to update role');
    }
  };

  // Delete user
  const handleDeleteUser = async (targetUser) => {
    if (targetUser.email === 'admin12@gmail.com') {
      notify('error', 'Primary Admin account cannot be deleted');
      return;
    }

    if ((targetUser._id || targetUser.id) === currentUser?.id) {
      notify('error', 'You cannot delete your own logged-in account');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${targetUser.name}" (${targetUser.email})?`)) {
      return;
    }

    try {
      await adminApi.deleteUser(targetUser._id || targetUser.id);
      notify('success', `User ${targetUser.email} deleted successfully`);
      fetchUsers();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      await adminApi.createUser(newUserData);
      notify('success', `User ${newUserData.email} created successfully`);
      setShowAddModal(false);
      setNewUserData({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Notifications */}
      {notification.message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            notification.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-gold/10 border-gold/30 text-gold-light'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
          </div>
          <button onClick={() => setNotification({ type: '', message: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-white">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage all registered users, control access permissions, and assign admin roles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto py-2.5 px-5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold-sm flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-card border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-white">{stats.totalUsers}</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Registered</div>
          </div>
        </div>

        <div className="bg-dark-card border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-gold">{stats.totalAdmins}</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Administrators</div>
          </div>
        </div>

        <div className="bg-dark-card border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-white">{stats.totalRegularUsers}</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Regular Clients</div>
          </div>
        </div>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="bg-dark-card border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {['all', 'admin', 'user'].map((filter) => (
            <button
              key={filter}
              onClick={() => setRoleFilter(filter)}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                roleFilter === filter
                  ? 'bg-gold text-black shadow-gold-sm'
                  : 'bg-black/60 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {filter === 'all' ? 'All Roles' : filter === 'admin' ? 'Admins' : 'Users'}
            </button>
          ))}

          <button
            onClick={fetchUsers}
            title="Refresh user list"
            className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-gold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Loading users..." />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-gold" />
            <p className="text-sm">No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[11px] font-bold uppercase tracking-widest text-gold">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Inquiries</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {users.map((u) => {
                  const isPrimaryAdmin = u.email === 'admin12@gmail.com';
                  const isSelf = (u._id || u.id) === currentUser?.id;

                  return (
                    <tr
                      key={u._id || u.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold/30 to-gold/10 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs uppercase flex-shrink-0">
                            {u.name ? u.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center space-x-2">
                              <span>{u.name}</span>
                              {isPrimaryAdmin && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium">
                                  Primary Admin
                                </span>
                              )}
                              {isSelf && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-gray-400 text-[11px] flex items-center space-x-1 mt-0.5">
                              <Mail className="w-3 h-3 text-gold/70" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-light border border-gold/40 font-bold text-[10px] uppercase tracking-wider">
                            <Shield className="w-3 h-3" />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 font-medium text-[10px] uppercase tracking-wider">
                            <UserCheck className="w-3 h-3 text-gray-400" />
                            <span>Client / User</span>
                          </span>
                        )}
                      </td>

                      {/* Inquiries Count */}
                      <td className="py-4 px-6">
                        <span className="text-gray-300 font-mono font-medium">
                          {u.inquiryCount || 0} briefs
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-6 text-gray-400 text-[11px]">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleRole(u)}
                            disabled={isPrimaryAdmin}
                            title={
                              isPrimaryAdmin
                                ? 'Primary admin role is locked'
                                : u.role === 'admin'
                                ? 'Demote to regular user'
                                : 'Promote to Admin'
                            }
                            className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                              isPrimaryAdmin
                                ? 'opacity-40 cursor-not-allowed border-white/10 text-gray-500'
                                : u.role === 'admin'
                                ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                                : 'border-gold/30 text-gold hover:bg-gold/10'
                            }`}
                          >
                            {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={isPrimaryAdmin || isSelf}
                            title={
                              isPrimaryAdmin
                                ? 'Cannot delete primary admin'
                                : isSelf
                                ? 'Cannot delete own active account'
                                : 'Delete user'
                            }
                            className={`p-1.5 rounded-lg border transition-all ${
                              isPrimaryAdmin || isSelf
                                ? 'opacity-30 cursor-not-allowed border-white/10 text-gray-600'
                                : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-gold/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Add New User</h3>
                  <p className="text-[11px] text-gray-400">Create a user or administrator account</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  autoComplete="new-password"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
                  Assign Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewUserData({ ...newUserData, role: 'user' })}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                      newUserData.role === 'user'
                        ? 'bg-gold text-black border-gold shadow-gold-sm'
                        : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Regular User</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewUserData({ ...newUserData, role: 'admin' })}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                      newUserData.role === 'admin'
                        ? 'bg-gold text-black border-gold shadow-gold-sm'
                        : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold-sm disabled:opacity-50"
                >
                  {addLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

