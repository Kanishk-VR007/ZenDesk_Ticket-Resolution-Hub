import React from 'react';

const PriorityBadge = ({ priority }) => {
    let colors = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    if (priority === 'LOW') colors = 'bg-green-500/20 text-green-300 border-green-500/30';
    if (priority === 'MEDIUM') colors = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (priority === 'HIGH') colors = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (priority === 'CRITICAL') colors = 'bg-red-500/20 text-red-300 border-red-500/30';

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors}`}>
            {priority || 'UNKNOWN'}
        </span>
    );
};

export default PriorityBadge;
