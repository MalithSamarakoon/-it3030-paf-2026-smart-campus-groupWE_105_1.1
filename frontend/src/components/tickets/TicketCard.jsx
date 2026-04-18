import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const categoryIcons = {
    ELECTRICAL: '⚡',
    PLUMBING: '🔧',
    IT_EQUIPMENT: '💻',
    FURNITURE: '🪑',
    HVAC: '❄️',
    SAFETY: '🛡️',
    OTHER: '📋',
};

const TicketCard = ({ ticket }) => {
    const timeAgo = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <Link
            to={`/maintenance/${ticket.id}`}
            className="block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group overflow-hidden"
        >
            {/* Top accent bar */}
            <div className={`h-1 ${
                ticket.priority === 'CRITICAL' ? 'bg-red-500' :
                ticket.priority === 'HIGH' ? 'bg-orange-500' :
                ticket.priority === 'MEDIUM' ? 'bg-yellow-400' : 'bg-green-400'
            }`} />

            <div className="p-5">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryIcons[ticket.category] || '📋'}</span>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {ticket.category?.replace('_', ' ')}
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                        #{ticket.id}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {ticket.title}
                </h3>

                {/* Description Preview */}
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {ticket.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <StatusBadge type="status" value={ticket.status} />
                    <StatusBadge type="priority" value={ticket.priority} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-emerald-700">
                                {ticket.createdByUsername?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <span className="text-xs text-slate-500">{ticket.createdByUsername}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        {ticket.commentCount > 0 && (
                            <span className="flex items-center gap-1">
                                💬 {ticket.commentCount}
                            </span>
                        )}
                        <span>{timeAgo(ticket.createdAt)}</span>
                    </div>
                </div>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1">
                    <span className="text-xs">📍</span>
                    <span className="text-[11px] text-slate-400">{ticket.resourceLocation}</span>
                </div>
            </div>
        </Link>
    );
};

export default TicketCard;
