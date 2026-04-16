import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { getUser } from '../utils/auth';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, Award } from 'lucide-react';

const AccountPage = () => {
    const [profile, setProfile] = useState(null);
    const user = getUser();

    useEffect(() => {
        api.get('/users/me', {
            headers: { Authorization: `Bearer ${user?.token}` }
        }).then(res => setProfile(res.data))
            .catch(err => console.error("Error fetching profile", err));
    }, [user?.token]);

    if (!profile) return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    const imageUrl = profile.profilePicturePath
        ? `http://localhost:8081/images/profiles/${profile.profilePicturePath}`
        : 'https://via.placeholder.com/150?text=Profile';

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
                        {profile.role}
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

                    <Link
                        to="/profile/edit"
                        className="mt-8 w-full bg-green-600 text-white text-center py-3 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-md"
                    >
                        Edit Profile Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
