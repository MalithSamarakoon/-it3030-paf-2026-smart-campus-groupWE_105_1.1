import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTicketById, updateTicketStatus, assignTicket, getTechnicians } from '../api/ticketApi';
import StatusBadge from '../components/tickets/StatusBadge';
import CommentSection from '../components/tickets/CommentSection';

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showAssign, setShowAssign] = useState(false);
    const [assignUserId, setAssignUserId] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const [rejectionReason, setRejectionReason] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isStaff = user?.roles?.includes('ROLE_STAFF');
    const isAssignedTechnician = isStaff && ticket?.assignedToId === user?.id;

    const fetchTicket = async () => {
        setLoading(true);
        try {
            const res = await getTicketById(id);
            setTicket(res.data);
        } catch (err) {
            toast.error('Failed to load ticket');
            navigate('/maintenance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        const fetchTechnicianOptions = async () => {
            if (!isAdmin) return;
            try {
                const res = await getTechnicians();
                setTechnicians(res.data || []);
            } catch (err) {
                toast.error('Failed to load technicians');
            }
        };

        fetchTechnicianOptions();
    }, [isAdmin]);

    const handleStatusChange = async (newStatus, extras = {}) => {
        setActionLoading(true);
        try {
            await updateTicketStatus(id, { status: newStatus, ...extras });
            toast.success(`Ticket ${newStatus.toLowerCase().replace('_', ' ')}`);
            setShowRejectModal(false);
            setShowResolveModal(false);
            fetchTicket();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!assignUserId) return;
        setActionLoading(true);
        try {
            await assignTicket(id, { assignedToUserId: parseInt(assignUserId) });
            toast.success('Technician assigned!');
            setShowAssign(false);
            setAssignUserId('');
            fetchTicket();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to assign');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const images = ticket ? [ticket.imageData1, ticket.imageData2, ticket.imageData3].filter(Boolean) : [];

    // Available status actions based on current status and role
    const getStatusActions = () => {
        if (!ticket) return [];
        const actions = [];

        if (ticket.status === 'OPEN') {
            if (isAdmin || isAssignedTechnician) {
                actions.push({ status: 'IN_PROGRESS', label: '▶ Start Working', color: 'bg-amber-500 hover:bg-amber-600' });
            }
            if (isAdmin) {
                actions.push({ status: 'REJECTED', label: '❌ Reject', color: 'bg-red-500 hover:bg-red-600', modal: true });
            }
        }

        if (ticket.status === 'IN_PROGRESS') {
            if (isAdmin || isAssignedTechnician) {
                actions.push({ status: 'RESOLVED', label: '✅ Mark Resolved', color: 'bg-emerald-500 hover:bg-emerald-600', modal: true });
            }
            if (isAdmin) {
                actions.push({ status: 'REJECTED', label: '❌ Reject', color: 'bg-red-500 hover:bg-red-600', modal: true });
            }
        }

        if (ticket.status === 'RESOLVED') {
            if (isAdmin) {
                actions.push({ status: 'CLOSED', label: '🔒 Close Ticket', color: 'bg-slate-500 hover:bg-slate-600' });
                actions.push({ status: 'IN_PROGRESS', label: '🔄 Reopen', color: 'bg-amber-500 hover:bg-amber-600' });
            }
        }

        return actions;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/maintenance')}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                        ← Back to Tickets
                    </button>
                    <span className="text-sm font-mono text-slate-400">#{ticket.id}</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ticket Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <StatusBadge type="status" value={ticket.status} />
                                <StatusBadge type="priority" value={ticket.priority} />
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-600 border-slate-200">
                                    {ticket.category?.replace('_', ' ')}
                                </span>
                            </div>

                            <h1 className="text-2xl font-extrabold text-slate-800 mb-3">{ticket.title}</h1>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                                <span className="flex items-center gap-1">
                                    📍 {ticket.resourceLocation}
                                </span>
                                <span>•</span>
                                <span>{formatDate(ticket.createdAt)}</span>
                            </div>

                            <div className="prose prose-sm max-w-none">
                                <div className="bg-slate-50 rounded-xl p-5">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Description</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                                </div>
                            </div>

                            {/* Resolution Notes */}
                            {ticket.resolutionNotes && (
                                <div className="mt-4 bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                                    <h4 className="text-xs font-bold uppercase text-emerald-600 tracking-wider mb-2">✅ Resolution Notes</h4>
                                    <p className="text-sm text-emerald-800 leading-relaxed">{ticket.resolutionNotes}</p>
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {ticket.rejectionReason && (
                                <div className="mt-4 bg-red-50 rounded-xl p-5 border border-red-100">
                                    <h4 className="text-xs font-bold uppercase text-red-600 tracking-wider mb-2">❌ Rejection Reason</h4>
                                    <p className="text-sm text-red-800 leading-relaxed">{ticket.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        {/* Images */}
                        {images.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    📸 Evidence Images ({images.length})
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Evidence ${idx + 1}`}
                                            className="w-full h-40 object-cover rounded-xl border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <CommentSection
                                ticketId={ticket.id}
                                comments={ticket.comments || []}
                                currentUser={user}
                                onRefresh={fetchTicket}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Actions */}
                        {getStatusActions().length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Actions</h3>
                                <div className="space-y-2">
                                    {getStatusActions().map(action => (
                                        <button
                                            key={action.status}
                                            onClick={() => {
                                                if (action.status === 'REJECTED') setShowRejectModal(true);
                                                else if (action.status === 'RESOLVED') setShowResolveModal(true);
                                                else handleStatusChange(action.status);
                                            }}
                                            disabled={actionLoading}
                                            className={`w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all active:scale-[0.98] ${action.color} ${actionLoading ? 'opacity-50' : ''}`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details Sidebar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Created By</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-emerald-700">
                                                {ticket.createdByUsername?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{ticket.createdByUsername}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Assigned To</span>
                                    {ticket.assignedToUsername ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-blue-700">
                                                    {ticket.assignedToUsername?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-700">{ticket.assignedToUsername}</span>
                                                {ticket.assignedToTechnicianType && (
                                                    <p className="text-[11px] text-slate-500 font-semibold">
                                                        {ticket.assignedToTechnicianType.replace('_', ' ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 mt-1">Unassigned</p>
                                    )}
                                </div>

                                {ticket.preferredContact && (
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Contact</span>
                                        <p className="text-sm text-slate-700 mt-1">{ticket.preferredContact}</p>
                                    </div>
                                )}

                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Last Updated</span>
                                    <p className="text-sm text-slate-700 mt-1">{formatDate(ticket.updatedAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Assign Technician (Admin Only) */}
                        {isAdmin && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Assign Technician</h3>
                                {showAssign ? (
                                    <div className="space-y-2">
                                        <select
                                            value={assignUserId}
                                            onChange={(e) => setAssignUserId(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                        >
                                            <option value="">Select technician</option>
                                            {technicians.map(tech => (
                                                <option key={tech.id} value={tech.id}>
                                                    {tech.username} - {String(tech.technicianType || '').replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAssign}
                                                disabled={actionLoading}
                                                className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all"
                                            >
                                                Assign
                                            </button>
                                            <button
                                                onClick={() => { setShowAssign(false); setAssignUserId(''); }}
                                                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowAssign(true)}
                                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                    >
                                        + Assign Technician
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Workflow Visualization */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Workflow</h3>
                            <div className="space-y-1">
                                {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((step, idx) => {
                                    const statusOrder = { OPEN: 0, IN_PROGRESS: 1, RESOLVED: 2, CLOSED: 3 };
                                    const currentOrder = statusOrder[ticket.status] ?? -1;
                                    const stepOrder = statusOrder[step];
                                    const isActive = ticket.status === step;
                                    const isPast = stepOrder < currentOrder;
                                    const isRejected = ticket.status === 'REJECTED';

                                    return (
                                        <div key={step} className="flex items-center gap-3 py-2">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                isActive ? 'bg-emerald-600 text-white' :
                                                isPast ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-slate-100 text-slate-400'
                                            }`}>
                                                {isPast ? '✓' : idx + 1}
                                            </div>
                                            <span className={`text-xs font-semibold ${
                                                isActive ? 'text-emerald-700' :
                                                isPast ? 'text-emerald-500' :
                                                'text-slate-400'
                                            }`}>
                                                {step.replace('_', ' ')}
                                            </span>
                                        </div>
                                    );
                                })}
                                {ticket.status === 'REJECTED' && (
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">✕</div>
                                        <span className="text-xs font-semibold text-red-600">REJECTED</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRejectModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Reject Ticket</h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                            placeholder="Reason for rejection..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm resize-none"
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowRejectModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold">Cancel</button>
                            <button
                                onClick={() => handleStatusChange('REJECTED', { rejectionReason })}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resolve Modal */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowResolveModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Resolve Ticket</h3>
                        <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            rows={3}
                            placeholder="Resolution notes (what was done to fix the issue)..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm resize-none"
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowResolveModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold">Cancel</button>
                            <button
                                onClick={() => handleStatusChange('RESOLVED', { resolutionNotes })}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all"
                            >
                                Resolve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="Evidence" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" />
                </div>
            )}
        </div>
    );
};

export default TicketDetailPage;
