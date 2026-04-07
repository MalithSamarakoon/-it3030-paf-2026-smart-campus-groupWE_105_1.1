import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

const ResourceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        type: 'ROOM',
        capacity: '',
        location: '',
        status: 'ACTIVE',
        availabilityStart: '',
        availabilityEnd: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Authenticate as Admin
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const isAdmin = storedUser?.roles?.includes('ROLE_ADMIN');
        
        if (!isAdmin) {
            toast.error("Unauthorized Access");
            navigate('/resources');
            return;
        }

        if (isEdit) {
            const fetchResource = async () => {
                try {
                    const response = await api.get(`/resources/${id}`);
                    const data = response.data;
                    setFormData({
                        name: data.name,
                        type: data.type,
                        capacity: data.capacity || '',
                        location: data.location,
                        status: data.status,
                        availabilityStart: data.availabilityStart ? data.availabilityStart.substring(0, 5) : '',
                        availabilityEnd: data.availabilityEnd ? data.availabilityEnd.substring(0, 5) : '',
                    });
                } catch (error) {
                    toast.error("Failed to fetch resource");
                    navigate('/resources');
                }
            };
            fetchResource();
        }
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            capacity: formData.capacity === '' ? null : parseInt(formData.capacity, 10),
            availabilityStart: formData.availabilityStart ? `${formData.availabilityStart}:00` : null,
            availabilityEnd: formData.availabilityEnd ? `${formData.availabilityEnd}:00` : null,
        };

        try {
            if (isEdit) {
                await api.put(`/resources/${id}`, payload);
                toast.success("Resource updated successfully");
            } else {
                await api.post(`/resources`, payload);
                toast.success("Resource created successfully");
            }
            navigate('/resources');
        } catch (error) {
            const resMessage = error.response?.data?.error || "Failed to save resource";
            toast.error(resMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
                <div className="bg-emerald-600 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Resource' : 'Add New Resource'}</h1>
                    <p className="text-emerald-100 text-sm mt-1">Fill in the details below to complete the catalogue entry.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">Resource Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800"
                            placeholder="e.g. Main Auditorium" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-700 font-semibold mb-2 text-sm">Type *</label>
                            <select name="type" value={formData.type} onChange={handleChange} required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800 bg-white">
                                <option value="ROOM">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-2 text-sm">Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800"
                                placeholder="e.g. 150" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">Location *</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800"
                            placeholder="e.g. Ground Floor, Building A" />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">Status *</label>
                        <select name="status" value={formData.status} onChange={handleChange} required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800 bg-white">
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div>
                            <label className="block text-slate-700 font-semibold mb-2 text-sm">Available From</label>
                            <input type="time" name="availabilityStart" value={formData.availabilityStart} onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800 bg-white" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-2 text-sm">Available Until</label>
                            <input type="time" name="availabilityEnd" value={formData.availabilityEnd} onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-800 bg-white" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-100 mt-8">
                        <button type="button" onClick={() => navigate('/resources')}
                            className="flex-1 py-3.5 px-4 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-white shadow-md transition-transform active:scale-[0.98] ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                            {loading ? 'Saving...' : 'Save Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceForm;
