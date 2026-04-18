import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createTicket } from '../../api/ticketApi';

const categories = [
    { value: 'ELECTRICAL', label: '⚡ Electrical' },
    { value: 'PLUMBING', label: '🔧 Plumbing' },
    { value: 'IT_EQUIPMENT', label: '💻 IT Equipment' },
    { value: 'FURNITURE', label: '🪑 Furniture' },
    { value: 'HVAC', label: '❄️ HVAC' },
    { value: 'SAFETY', label: '🛡️ Safety' },
    { value: 'OTHER', label: '📋 Other' },
];

const priorities = [
    { value: 'LOW', label: 'Low', color: 'text-green-600' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600' },
    { value: 'CRITICAL', label: 'Critical', color: 'text-red-600' },
];

const CreateTicketForm = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'OTHER',
        priority: 'MEDIUM',
        resourceLocation: '',
        preferredContact: '',
    });
    const [images, setImages] = useState([null, null, null]);
    const [previews, setPreviews] = useState([null, null, null]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const newImages = [...images];
            newImages[index] = reader.result;
            setImages(newImages);

            const newPreviews = [...previews];
            newPreviews[index] = reader.result;
            setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);

        const newPreviews = [...previews];
        newPreviews[index] = null;
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                imageData1: images[0] || null,
                imageData2: images[1] || null,
                imageData3: images[2] || null,
            };

            await createTicket(payload);
            toast.success('Ticket created successfully!');
            onCreated?.();
            onClose?.();
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to create ticket';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-8 py-5 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Report an Issue</h2>
                        <p className="text-sm text-slate-400 mt-0.5">Fill in the details below</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="Brief description of the issue"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all text-sm"
                        />
                    </div>

                    {/* Category & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all text-sm bg-white"
                            >
                                {categories.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority *</label>
                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all text-sm bg-white"
                            >
                                {priorities.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Resource Location */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resource / Location *</label>
                        <input
                            type="text"
                            name="resourceLocation"
                            value={form.resourceLocation}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Lab 3, Building A, Room 201"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe the issue in detail..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all text-sm resize-none"
                        />
                    </div>

                    {/* Preferred Contact */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Contact</label>
                        <input
                            type="text"
                            name="preferredContact"
                            value={form.preferredContact}
                            onChange={handleChange}
                            placeholder="Phone or email for follow-up"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all text-sm"
                        />
                    </div>

                    {/* Image Attachments */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Evidence Images <span className="text-slate-400 font-normal">(up to 3, max 5MB each)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="relative">
                                    {previews[index] ? (
                                        <div className="relative group">
                                            <img
                                                src={previews[index]}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-28 object-cover rounded-xl border-2 border-emerald-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer transition-all">
                                            <span className="text-2xl text-slate-300">📷</span>
                                            <span className="text-[10px] text-slate-400 mt-1">Add Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageChange(index, e)}
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98] ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Submitting...' : '🎫 Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketForm;
