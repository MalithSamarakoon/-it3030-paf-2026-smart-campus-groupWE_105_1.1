import React from 'react';

const statusColors = {
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
    RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
};

const priorityColors = {
    LOW: 'bg-green-100 text-green-700 border-green-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons = {
    OPEN: '🔵',
    IN_PROGRESS: '🔧',
    RESOLVED: '✅',
    CLOSED: '🔒',
    REJECTED: '❌',
};

const StatusBadge = ({ type = 'status', value }) => {
    const colors = type === 'priority' ? priorityColors : statusColors;
    const colorClass = colors[value] || 'bg-gray-100 text-gray-600 border-gray-200';
    const icon = type === 'status' ? statusIcons[value] || '' : '';
    const label = value?.replace('_', ' ') || 'UNKNOWN';

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${colorClass}`}>
            {icon && <span className="text-xs">{icon}</span>}
            {label}
        </span>
    );
};

export default StatusBadge;
