import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

// ---- Status Badge ----
const StatusBadge = ({ status }) => {
    const styles = {
        PENDING:   'bg-yellow-100 text-yellow-700',
        APPROVED:  'bg-green-100 text-green-700',
        REJECTED:  'bg-red-100 text-red-700',
        CANCELLED: 'bg-slate-100 text-slate-500',
    };
    return (
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

// ---- Reject Modal ----
const RejectModal = ({ bookingId, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Reject Booking</h2>
                <p className="text-slate-500 text-sm mb-5">Provide a reason so the user understands why their booking was rejected.</p>
                <textarea
                    rows={4}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="e.g. Conflicting event scheduled in this space..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none text-slate-800 text-sm"
                />
                <div className="flex gap-3 mt-5">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 transition">
                        Cancel
                    </button>
                    <button
                        onClick={() => reason.trim() ? onConfirm(bookingId, reason.trim()) : toast.error('Reason is required')}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 font-bold text-white hover:bg-red-600 transition"
                    >
                        Reject Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

// ---- Main Component ----
const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [rejectTarget, setRejectTarget] = useState(null); // bookingId for modal

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = storedUser?.roles?.includes('ROLE_ADMIN');

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleApprove = async (id) => {
        try {
            const response = await api.patch(`/bookings/${id}/approve`);
            setBookings(prev => prev.map(b => b.id === id ? response.data : b));
            toast.success('Booking approved!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to approve booking');
        }
    };

    const handleRejectConfirm = async (id, reason) => {
        try {
            const response = await api.patch(`/bookings/${id}/reject`, { reason });
            setBookings(prev => prev.map(b => b.id === id ? response.data : b));
            toast.success('Booking rejected');
            setRejectTarget(null);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reject booking');
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const response = await api.patch(`/bookings/${id}/cancel`);
            setBookings(prev => prev.map(b => b.id === id ? response.data : b));
            toast.success('Booking cancelled');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to cancel booking');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this pending booking? This action cannot be undone.')) return;
        try {
            await api.delete(`/bookings/${id}`);
            setBookings(prev => prev.filter(b => b.id !== id));
            toast.success('Booking deleted');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete booking');
        }
    };

    const filteredBookings = statusFilter
        ? bookings.filter(booking => booking.status === statusFilter)
        : bookings;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        {isAdmin ? 'Bookings Dashboard' : 'My Bookings'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isAdmin ? 'Manage and review all booking requests.' : 'Track and manage your booking requests.'}
                    </p>
                </div>
                {!isAdmin && (
                    <Link
                        to="/bookings/new"
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md"
                    >
                        + New Booking
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-sm font-semibold text-slate-600">Filter by status:</span>
                {['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border transition ${
                            statusFilter === s
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'
                        }`}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <th className="p-4 font-bold text-xs uppercase">Resource</th>
                            {isAdmin && <th className="p-4 font-bold text-xs uppercase">User</th>}
                            <th className="p-4 font-bold text-xs uppercase">Date</th>
                            <th className="p-4 font-bold text-xs uppercase">Time</th>
                            <th className="p-4 font-bold text-xs uppercase">Purpose</th>
                            <th className="p-4 font-bold text-xs uppercase">Attendees</th>
                            <th className="p-4 font-bold text-xs uppercase">Status</th>
                            <th className="p-4 font-bold text-xs uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={isAdmin ? 8 : 7} className="p-10 text-center text-slate-400">
                                    Loading bookings...
                                </td>
                            </tr>
                        ) : filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 8 : 7} className="p-10 text-center text-slate-400">
                                    No bookings found.
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map(booking => (
                                <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-semibold text-slate-800 text-sm">{booking.resourceName}</p>
                                        <p className="text-xs text-slate-400">{booking.resourceLocation}</p>
                                    </td>
                                    {isAdmin && (
                                        <td className="p-4 text-sm text-slate-600 font-medium">{booking.username}</td>
                                    )}
                                    <td className="p-4 text-sm text-slate-700">{booking.date}</td>
                                    <td className="p-4 text-sm text-slate-700 whitespace-nowrap">
                                        {booking.startTime?.substring(0, 5)} – {booking.endTime?.substring(0, 5)}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 max-w-[200px]">
                                        <p className="truncate" title={booking.purpose}>{booking.purpose}</p>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 text-center">{booking.attendees || '—'}</td>
                                    <td className="p-4">
                                        <div>
                                            <StatusBadge status={booking.status} />
                                            {booking.status === 'REJECTED' && booking.rejectionReason && (
                                                <p className="text-xs text-red-500 mt-1 max-w-[160px] truncate" title={booking.rejectionReason}>
                                                    {booking.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                        {/* Admin actions */}
                                        {isAdmin && booking.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(booking.id)}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setRejectTarget(booking.id)}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {/* User actions */}
                                        {!isAdmin && booking.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/bookings/edit/${booking.id}`}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                        {!isAdmin && booking.status === 'APPROVED' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        {/* No action available */}
                                        {((!isAdmin && booking.status !== 'PENDING' && booking.status !== 'APPROVED') ||
                                          (isAdmin && booking.status !== 'PENDING')) && (
                                            <span className="text-xs text-slate-300">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reject Modal */}
            {rejectTarget && (
                <RejectModal
                    bookingId={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                    onConfirm={handleRejectConfirm}
                />
            )}
        </div>
    );
};

export default BookingList;
