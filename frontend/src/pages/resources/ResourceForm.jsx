import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import ImagePreview from '../../components/ImagePreview';

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

    const [selectedFiles, setSelectedFiles] = useState([]);
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

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        const maxFiles = 4;

        // Validate: max 4 files, max 5MB each
        const validFiles = [];

        for (let file of files) {
            // Check file size
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB size limit`);
                continue;
            }

            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error(`${file.name} is not a valid image format (jpg, png, webp supported)`);
                continue;
            }

            validFiles.push(file);
        }

        // Check total count
        if (validFiles.length + selectedFiles.length > maxFiles) {
            toast.warn(`Maximum 4 images allowed. Selected ${validFiles.length + selectedFiles.length}`);
            validFiles.splice(maxFiles - selectedFiles.length);
        }

        // Create preview URLs
        const newFiles = validFiles.map(file => ({
            file,
            name: file.name,
            preview: URL.createObjectURL(file)
        }));

        setSelectedFiles([...selectedFiles, ...newFiles]);

        // Clear input
        e.target.value = '';
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...selectedFiles];
        URL.revokeObjectURL(newFiles[index].preview); // Clean up preview URL
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const buildSubmitData = (imageFieldName = 'images') => {
        const submitData = new FormData();

        submitData.append('name', formData.name);
        submitData.append('type', formData.type);
        submitData.append('location', formData.location);
        submitData.append('status', formData.status);

        if (formData.capacity) {
            submitData.append('capacity', formData.capacity);
        }
        if (formData.availabilityStart) {
            submitData.append('availabilityStart', formData.availabilityStart);
        }
        if (formData.availabilityEnd) {
            submitData.append('availabilityEnd', formData.availabilityEnd);
        }

        selectedFiles.forEach((fileObj) => {
            submitData.append(imageFieldName, fileObj.file, fileObj.name);
        });

        return submitData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const imageFieldCandidates = ['images', 'imageFiles', 'files'];
            const requestWithPayload = async (payload) => {
                if (isEdit) {
                    await api.put(`/resources/${id}`, payload);
                    return;
                }
                await api.post('/resources', payload);
            };

            let saved = false;
            let lastError = null;
            const hasImages = selectedFiles.length > 0;

            for (let i = 0; i < imageFieldCandidates.length; i += 1) {
                const imageFieldName = hasImages ? imageFieldCandidates[i] : 'images';

                try {
                    const payload = buildSubmitData(imageFieldName);
                    await requestWithPayload(payload);
                    saved = true;
                    break;
                } catch (error) {
                    lastError = error;

                    const status = error?.response?.status;
                    const canRetry = hasImages && status === 500 && i < imageFieldCandidates.length - 1;

                    if (!canRetry) {
                        throw error;
                    }
                }
            }

            if (!saved && lastError) {
                throw lastError;
            }

            toast.success(isEdit ? "Resource updated successfully" : "Resource created successfully");

            // Clean up preview URLs
            selectedFiles.forEach(fileObj => URL.revokeObjectURL(fileObj.preview));

            navigate('/resources');
        } catch (error) {
            const resMessage = error.response?.data?.error || error.message || "Failed to save resource";
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

                    {/* Image Upload Section */}
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                        <label className="block text-slate-700 font-semibold mb-3 text-sm">Add Resource Images <span className="text-slate-500 font-normal">(Optional - max 4 images)</span></label>

                        {/* File Input */}
                        <div className="mb-4">
                            <label className="inline-block cursor-pointer">
                                <div className="px-6 py-4 bg-white border-2 border-dashed border-blue-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-slate-700 font-medium">Click to upload or drag images here</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">JPG, PNG, WebP up to 5MB each</p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Image Preview */}
                        <ImagePreview selectedFiles={selectedFiles} onRemove={handleRemoveFile} maxImages={4} />
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
