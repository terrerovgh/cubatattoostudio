import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { updateUserRole } from '../../../lib/supabase-helpers';
import { Shield, CheckCircle, AlertTriangle, UserPlus, Trash2, Edit, Mail, Key, X } from 'lucide-react';

type Profile = {
    id: string;
    email?: string;
    display_name: string | null;
    role: string;
    created_at?: string;
};

const UsersTable = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState<Profile | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || '';

            const response = await fetch('/api/users?action=list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(errorData.error?.message || 'Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data || []);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setSuccess(`User role updated to ${newRole}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Error updating role:', err);
            setError(err.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || '';

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    action: 'create',
                    email: formData.email,
                    password: formData.password,
                    displayName: formData.displayName,
                    role: formData.role
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(errorData.error?.message || 'Failed to create user');
            }

            setSuccess('User created successfully');
            setShowCreateModal(false);
            setFormData({ email: '', password: '', displayName: '', role: 'user' });
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Error creating user:', err);
            setError(err.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || '';

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    action: 'delete',
                    userId
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(errorData.error?.message || 'Failed to delete user');
            }

            setUsers(users.filter(u => u.id !== userId));
            setSuccess('User deleted successfully');
            setShowDeleteModal(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Error deleting user:', err);
            setError(err.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showEditModal) return;

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || '';

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    action: 'update',
                    userId: showEditModal.id,
                    displayName: formData.displayName,
                    role: formData.role
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(errorData.error?.message || 'Failed to update user');
            }

            setSuccess('User updated successfully');
            setShowEditModal(null);
            setFormData({ email: '', password: '', displayName: '', role: 'user' });
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Error updating user:', err);
            setError(err.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const openEditModal = (user: Profile) => {
        setShowEditModal(user);
        setFormData({
            email: user.email || '',
            password: '',
            displayName: user.display_name || '',
            role: user.role
        });
    };

    if (loading) return <div className="text-zinc-400">Loading users...</div>;

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-900/50 p-3 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 rounded-lg border border-green-800 bg-green-900/50 p-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{success}</span>
                </div>
            )}

            {/* Create User Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                    <UserPlus className="h-4 w-4" />
                    Create User
                </button>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900 text-xs uppercase text-zinc-200">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-zinc-900/50">
                                <td className="px-6 py-4 font-medium text-white">
                                    {user.display_name || 'Unnamed User'}
                                    <div className="text-xs text-zinc-500">{user.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.email || 'No email'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin'
                                        ? 'bg-purple-400/10 text-purple-400'
                                        : 'bg-zinc-400/10 text-zinc-400'
                                        }`}>
                                        {user.role === 'admin' ? <Shield className="h-3 w-3" /> : null}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="rounded bg-zinc-800 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                            title="Edit user"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(user.id)}
                                            className="rounded p-1 text-zinc-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                                            title="Delete user"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Create New User</h3>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setFormData({ email: '', password: '', displayName: '', role: 'user' });
                                }}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                                >
                                    Create User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setFormData({ email: '', password: '', displayName: '', role: 'user' });
                                    }}
                                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Edit User</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(null);
                                    setFormData({ email: '', password: '', displayName: '', role: 'user' });
                                }}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                                >
                                    Update User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(null);
                                        setFormData({ email: '', password: '', displayName: '', role: 'user' });
                                    }}
                                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-white">Delete User</h3>
                            <p className="mt-2 text-sm text-zinc-400">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDeleteUser(showDeleteModal)}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable;
