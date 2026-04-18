import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get('http://localhost:8081/api/admin/users/students', {
                headers: { Authorization: `Bearer ${storedUser?.token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users.');
        }
    };

    const confirmDelete = (userId) => {
        setUserToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await axios.delete(`http://localhost:8081/api/admin/users/students/${userToDelete}`, {
                headers: { Authorization: `Bearer ${storedUser?.token}` }
            });
            toast.success('User removed successfully.');
            setUsers(users.filter(u => u.id !== userToDelete));
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to remove user.');
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-emerald-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-emerald-800 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phoneNumber || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => confirmDelete(u.id)}
                                        className="text-red-600 hover:text-red-900 flex items-center justify-end gap-1 ml-auto transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="text-center py-8 text-slate-500">No users found.</div>
                )}
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={handleDelete} 
            />
        </div>
    );
};

export default UserManagementPage;

