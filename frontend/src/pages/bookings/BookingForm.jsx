import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

const BookingForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingResources, setFetchingResources] = useState(true);
    const [fetchingBooking, setFetchingBooking] = useState(isEditMode);
    const [formData, setFormData] = useState({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: ''
    });

    // Derived: selected resource object for capacity hint
    const selectedResource = resources.find(r => r.id === parseInt(formData.resourceId));

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/resources');
                // Only show ACTIVE resources
                setResources(response.data.filter(r => r.status === 'ACTIVE'));
            } catch {
                toast.error('Failed to load resources');
            } finally {
                setFetchingResources(false);
            }
        };
        fetchResources();
    }, []);

    useEffect(() => {
        if (!isEditMode) {
            setFetchingBooking(false);
            return;
        }

        const fetchBooking = async () => {
            try {
                const response = await api.get(`/bookings/${id}`);
                const booking = response.data;
                setFormData({
                    resourceId: booking.resourceId?.toString() || '',
                    date: booking.date || '',
                    startTime: booking.startTime?.substring(0, 5) || '',
                    endTime: booking.endTime?.substring(0, 5) || '',
                    purpose: booking.purpose || '',
                    attendees: booking.attendees?.toString() || ''
                });
            } catch (error) {
                const msg = error.response?.data?.error || 'Failed to load booking details';
                toast.error(msg);
                navigate('/bookings');
            } finally {
                setFetchingBooking(false);
            }
        };

        fetchBooking();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.startTime >= formData.endTime) {
            toast.error('Start time must be before end time');
            return;
        }

        if (selectedResource?.capacity && parseInt(formData.attendees) > selectedResource.capacity) {
            toast.error(`Attendees exceed resource capacity of ${selectedResource.capacity}`);
            return;
        }

        const payload = {
            resourceId: parseInt(formData.resourceId),
            date: formData.date,
            startTime: `${formData.startTime}:00`,
            endTime: `${formData.endTime}:00`,
            purpose: formData.purpose,
            attendees: formData.attendees ? parseInt(formData.attendees) : null
        };

        setLoading(true);
        try {
            if (isEditMode) {
                await api.put(`/bookings/${id}`, payload);
                toast.success('Booking updated successfully!');
            } else {
                await api.post('/bookings', payload);
                toast.success('Booking request submitted successfully!');
            }
            navigate('/bookings');
        } catch (error) {
            const fallbackMessage = isEditMode ? 'Failed to update booking' : 'Failed to create booking';
            const msg = error.response?.data?.error || fallbackMessage;
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingResources || fetchingBooking) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 p-8 text-slate-500 text-center">
                    Loading booking form...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
                <div className="bg-emerald-600 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">
                        {isEditMode ? 'Edit Booking Request' : 'New Booking Request'}
                    </h1>
                    <p className="text-emerald-100 text-sm mt-1">
                        {isEditMode
                            ? 'Update your pending booking details before review.'
                            : 'Fill in the details to request a resource booking.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Resource Selection */}
                    <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">Resource *</label>
                        <select
                            name="resourceId"
                            value={formData.resourceId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                        >
                            <option value="">Select a resource...</option>
                            {resources.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.name} — {r.type === 'ROOM' ? 'Lecture Hall' : r.type}
                                    {r.capacity ? ` (Cap: ${r.capacity})` : ''} | {r.location}
                                </option>
                            ))}
                        </select>
                        {selectedResource?.capacity && (
                            <p className="text-xs text-emerald-600 mt-1 font-semibold">
                                Max capacity: {selectedResource.capacity} people
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                        />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div>
                            <label className="block text-slate-700 font-semibold mb-2 text-sm">Start Time *</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-2 text-sm">End Time *</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">
                            Number of Attendees {selectedResource?.capacity ? `(max ${selectedResource.capacity})` : ''}
                        </label>
                        <input
                            type="number"
                            name="attendees"
                            value={formData.attendees}
                            onChange={handleChange}
                            min="1"
                            max={selectedResource?.capacity || undefined}
                            placeholder="e.g. 30"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                        />
                    </div>

                    {/* Purpose */}
                    <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">Purpose *</label>
                        <textarea
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="e.g. CS3030 Group Project Meeting"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate('/bookings')}
                            className="flex-1 py-3.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-md transition-transform active:scale-[0.98] ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Booking' : 'Submit Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
