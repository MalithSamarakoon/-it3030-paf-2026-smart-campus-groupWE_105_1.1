import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { getUser, logout } from '../utils/auth';
import { Mail, Phone, Award, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";

const AccountPage = () => {
    const [profile, setProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = getUser();
    const navigate = useNavigate();

    useEffect(() => {

        api.get('/users/me', {
            headers: { Authorization: `Bearer ${user?.token}` }
        }).then(res => setProfile(res.data))
            .catch(err => console.error("Error fetching profile", err));
    }, [user?.token]);


    const handleDeleteAccount = async () => {
        try {

            await api.delete('/users/me', {
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            toast.success("Your account has been deleted.");

            logout();

            navigate('/');
        } catch (error) {
            console.error("Deletion failed", error);
            toast.error("Failed to delete account. Please try again.");
            setIsModalOpen(false);
        }
    };

    if (!profile) return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    const backendOrigin = new URL(api.defaults.baseURL).origin;

    const imageUrl = profile.profilePicturePath
        ? `${backendOrigin}/images/profiles/${profile.profilePicturePath}`
        : 'https://via.placeholder.com/150?text=Profile';

    const roleLabel = profile.role === 'ROLE_STAFF'
        ? 'TECHNICIAN'
        : String(profile.role || '').replace('ROLE_', '');

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-green-400 p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
                    My Profile
                </h2>

                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={imageUrl}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-md"
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full border-2 border-white">
                            <Award className="text-white w-4 h-4" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mt-4">{profile.username}</h1>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mt-1">
                        {roleLabel}
                    </span>

                    <div className="mt-8 w-full space-y-4">
                        <div className="flex items-center p-4 bg-green-50 rounded-2xl border border-green-100">
                            <Mail className="text-green-600 mr-4" />
                            <div>
                                <p className="text-xs text-green-600 uppercase font-bold">Email Address</p>
                                <p className="text-gray-700">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-green-50 rounded-2xl border border-green-100">
                            <Phone className="text-green-600 mr-4" />
                            <div>
                                <p className="text-xs text-green-600 uppercase font-bold">Phone Number</p>
                                <p className="text-gray-700">{profile.phoneNumber || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3 mt-8">
                        <Link
                            to="/profile/edit"
                            className="w-full bg-green-600 text-white text-center py-3 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-md"
                        >
                            Edit Profile Details
                        </Link>

                        {/* Button triggers the Custom Modal instead of window.confirm */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-white text-red-600 border-2 border-red-600 py-3 rounded-2xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Trash2 size={18} />
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>


            <DeleteConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
};

export default AccountPage;
