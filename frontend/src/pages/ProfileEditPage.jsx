import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { getUser, saveUser } from '../utils/auth';
import { toast } from 'react-toastify';
import { Camera } from 'lucide-react';

const ProfileEditPage = () => {
    const user = getUser();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        api.get('/users/me', {
            headers: { Authorization: `Bearer ${user?.token}` }
        }).then(res => {
            setFormData({
                username: res.data.username,
                email: res.data.email,
                phoneNumber: res.data.phoneNumber || ''
            });
            if (res.data.profilePicturePath) {
                setPreview(`http://localhost:8081/images/profiles/${res.data.profilePicturePath}`);
            }
        });
    }, [user?.token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();


        data.append('user', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
        if (selectedFile) data.append('profileImage', selectedFile);

        try {
            const response = await api.put('/users/me', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user?.token}`
                }
            });


            saveUser({ ...response.data });
            toast.success("Profile updated successfully!");
            navigate('/profile');
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl border-2 border-green-400 p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer">
                            <img
                                src={preview || 'https://via.placeholder.com/150'}
                                className="w-24 h-24 rounded-full object-cover border-4 border-green-100 group-hover:opacity-75 transition-opacity"
                                alt="Preview"
                            />
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                <Camera className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                        <p className="text-xs text-green-600 mt-2 font-medium">Click photo to change</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-green-800 ml-1">Username</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-3 rounded-2xl bg-green-50 border border-green-200 focus:ring-2 focus:ring-green-400 outline-none"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-green-800 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-3 rounded-2xl bg-green-50 border border-green-200 focus:ring-2 focus:ring-green-400 outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-green-800 ml-1">Phone Number</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-3 rounded-2xl bg-green-50 border border-green-200 focus:ring-2 focus:ring-green-400 outline-none"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 px-4 py-3 rounded-2xl border-2 border-green-400 text-green-800 font-bold hover:bg-green-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditPage;