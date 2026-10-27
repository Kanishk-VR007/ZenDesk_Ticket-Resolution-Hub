import React, { useState } from 'react';
import { ticketService } from '../../services/ticketService';

const TicketStatusActions = ({ ticket, onStatusUpdated }) => {
    const [updating, setUpdating] = useState(false);

    if (!ticket) return null;

    const currentStatus = ticket.status;
    const allowedTransitions = {
        'OPEN': ['IN_PROGRESS', 'CLOSED', 'ESCALATED'],
        'IN_PROGRESS': ['RESOLVED', 'ESCALATED', 'OPEN'],
        'ESCALATED': ['IN_PROGRESS', 'CLOSED'],
        'RESOLVED': ['CLOSED', 'OPEN'],
        'CLOSED': []
    };

    const availableStatuses = allowedTransitions[currentStatus] || [];

    const handleStatusChange = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
        
        setUpdating(true);
        try {
            await ticketService.updateStatus(ticket.id, newStatus);
            if (onStatusUpdated) {
                onStatusUpdated(newStatus);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (availableStatuses.length === 0) {
        return (
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
                <p className="text-sm text-slate-400 italic">No further status transitions available from {currentStatus}.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {availableStatuses.map(status => (
                <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-slate-800 border border-purple-500/30 text-slate-300 hover:bg-purple-900/40 hover:text-white disabled:opacity-50"
                >
                    Mark {status.replace('_', ' ')}
                </button>
            ))}
        </div>
    );
};

export default TicketStatusActions;
