import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllTickets, getMyTickets } from '../api/ticketApi';
import TicketCard from '../components/tickets/TicketCard';
import CreateTicketForm from '../components/tickets/CreateTicketForm';

const ADMIN_FILTER_TABS = [
    { key: 'ALL', label: 'All', icon: '📋' },
    { key: 'OPEN', label: 'Open', icon: '🔵' },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: '🔧' },
    { key: 'RESOLVED', label: 'Resolved', icon: '✅' },
    { key: 'CLOSED', label: 'Closed', icon: '🔒' },
    { key: 'REJECTED', label: 'Rejected', icon: '❌' },
];

const STUDENT_FILTER_TABS = [
    { key: 'MY_TICKETS', label: 'My Tickets', icon: '🧾' },
    { key: 'IN_PROGRESS', label: 'Under Review', icon: '🛠️' },
    { key: 'RESOLVED', label: 'Resolved', icon: '✨' },
    { key: 'CLOSED', label: 'Closed', icon: '📦' },
];

const getTicketStatus = (ticket) => String(ticket?.status || '').toUpperCase();

const MaintenancePage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState('ALL');

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const filterTabs = isAdmin ? ADMIN_FILTER_TABS : STUDENT_FILTER_TABS;

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = isAdmin ? await getAllTickets() : await getMyTickets();
            setTickets(res.data);
        } catch (err) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        setFilter(isAdmin ? 'ALL' : 'MY_TICKETS');
    }, [isAdmin]);

    const filteredTickets = filter === 'ALL' || filter === 'MY_TICKETS'
        ? tickets
        : tickets.filter(t => getTicketStatus(t) === filter);

    const statusCounts = {
        ALL: tickets.length,
        MY_TICKETS: tickets.length,
        OPEN: tickets.filter(t => getTicketStatus(t) === 'OPEN').length,
        IN_PROGRESS: tickets.filter(t => getTicketStatus(t) === 'IN_PROGRESS').length,
        RESOLVED: tickets.filter(t => getTicketStatus(t) === 'RESOLVED').length,
        CLOSED: tickets.filter(t => getTicketStatus(t) === 'CLOSED').length,
        REJECTED: tickets.filter(t => getTicketStatus(t) === 'REJECTED').length,
    };

    return (
        <div className={`min-h-screen ${isAdmin ? 'bg-gradient-to-br from-slate-50 to-emerald-50' : 'bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-100'}`}>
            {/* Page Header */}
            <div className={`${isAdmin ? 'bg-white border-b border-slate-100' : 'bg-white/70 backdrop-blur border-b border-emerald-100'}`}>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                                {isAdmin ? '🛠️ Maintenance Tickets' : '🎓 My Maintenance Space'}
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">
                                {isAdmin ? 'Manage all campus maintenance requests' : 'Track and create your requests with a student-friendly view'}
                            </p>
                        </div>

                        {!isAdmin && (
                            <button
                                onClick={() => setShowCreate(true)}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-200 hover:from-emerald-700 hover:to-cyan-700 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <span className="text-lg">+</span> Report New Issue
                            </button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className={`grid ${isAdmin ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6' : 'grid-cols-2 sm:grid-cols-4'} gap-3 mt-6`}>
                        {filterTabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key)}
                                className={`px-4 py-3 rounded-xl text-center transition-all ${
                                    filter === tab.key
                                        ? (isAdmin
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                            : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-cyan-200')
                                        : (isAdmin
                                            ? 'bg-white border border-slate-100 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'
                                            : 'bg-white border border-emerald-100 text-slate-600 hover:border-cyan-200 hover:bg-cyan-50')
                                }`}
                            >
                                <div className="text-lg">{tab.icon}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider mt-1">{tab.label}</div>
                                <div className={`text-xl font-black mt-0.5 ${filter === tab.key ? 'text-white' : 'text-slate-800'}`}>
                                    {statusCounts[tab.key]}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ticket Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">{isAdmin ? '🎉' : '📭'}</div>
                        <h3 className="text-lg font-bold text-slate-700">{isAdmin ? 'No tickets found' : 'Nothing here yet'}</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {filter === 'ALL'
                                ? "You haven't created any tickets yet."
                                : `No ${filter.replace('_', ' ').toLowerCase()} tickets.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <CreateTicketForm
                    onClose={() => setShowCreate(false)}
                    onCreated={fetchTickets}
                />
            )}
        </div>
    );
};

export default MaintenancePage;
