import React, { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticketService';
import { escalationService } from '../../services/escalationService';
import { normalizeTicket, normalizeEscalation } from '../../utils/normalization';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import TicketConversation from './TicketConversation';
import TicketStatusActions from './TicketStatusActions';
import TicketStatusTimeline from './TicketStatusTimeline';
import IllustratedAvatar from '../common/IllustratedAvatar';
import { useTicketDeletion } from '../../hooks/useTicketDeletion';

const TicketDetail = ({ ticketId, onClose, onUpdate }) => {
    const [ticket, setTicket] = useState(null);
    const [escalations, setEscalations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isTicketDeleted } = useTicketDeletion();

    useEffect(() => {
        const loadData = async () => {
            if (!ticketId) return;
            if (isTicketDeleted(ticketId)) {
                setLoading(false);
                setError('Ticket is not available.');
                return;
            }
            setLoading(true);
            try {
                const tData = await ticketService.getTicketById(ticketId);
                setTicket(normalizeTicket(tData));
                
                try {
                    const escData = await escalationService.getEscalationsByTicket(ticketId);
                    setEscalations((Array.isArray(escData) ? escData : []).map(normalizeEscalation));
                } catch (e) {
                    console.warn("Failed to load escalations", e);
                    setEscalations([]);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load ticket details');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [ticketId, isTicketDeleted]);

    const handleStatusUpdated = () => {
        if (onUpdate) onUpdate();
        // Reload ticket data to reflect changes
        ticketService.getTicketById(ticketId)
            .then(data => setTicket(normalizeTicket(data)))
            .catch(console.error);
    };

    const handleCreateEscalation = async () => {
        const reason = window.prompt("Enter escalation reason:");
        if (reason && reason.trim() !== "") {
            try {
                const newEsc = await escalationService.createEscalation({ ticketId, reason });
                setEscalations([...escalations, normalizeEscalation(newEsc)]);
                if (onUpdate) onUpdate();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to create escalation');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-cyan-400 animate-pulse">Loading ticket details...</div>;
    if (error) return <div className="p-8 text-center text-rose-400">{error}</div>;
    if (!ticket) return null;

    // Calculate SLA
    let slaStatus = 'Normal';
    let slaDisplay = 'No SLA deadline';
    if (ticket.slaDeadline) {
        const now = new Date();
        const deadline = new Date(ticket.slaDeadline);
        const hoursLeft = (deadline - now) / (1000 * 60 * 60);
        
        if (hoursLeft < 0) {
            slaStatus = 'Overdue';
            slaDisplay = `Overdue by ${Math.abs(Math.round(hoursLeft))}h`;
        } else if (hoursLeft < 4) {
            slaStatus = 'Due Soon';
            slaDisplay = `Due in ${Math.round(hoursLeft)}h`;
        } else {
            slaStatus = 'Normal';
            slaDisplay = `Due in ${Math.round(hoursLeft)}h`;
        }
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header section */}
            <div className="bg-[#1a0b2e]/50 p-5 rounded-xl border border-purple-500/20">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-white leading-tight">{ticket.title}</h1>
                    <div className="flex gap-2">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-purple-500/20">
                    <div className="flex-shrink-0">
                        {ticket.assignedAgentName ? (
                            <IllustratedAvatar name={ticket.assignedAgentName} size="md" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 shadow-inner">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Assigned Agent</div>
                        <div className="font-semibold text-slate-200">{ticket.assignedAgentName || 'Unassigned'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-400 block mb-1">Requester</span>
                        <span className="text-slate-200 font-medium">{ticket.creatorName}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block mb-1">Category</span>
                        <span className="text-slate-200 font-medium">{ticket.category}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-slate-400 block mb-1">SLA Status</span>
                        <span className={`font-medium ${slaStatus === 'Overdue' ? 'text-rose-400' : slaStatus === 'Due Soon' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {slaDisplay}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="text-lg font-bold text-white border-b border-purple-500/30 pb-2 mb-4">Description</h3>
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 max-w-full overflow-hidden">
                    <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed break-words">{ticket.description || 'No description provided.'}</p>
                </div>
            </div>

            <TicketStatusTimeline ticket={ticket} />

            {/* Actions */}
            <div>
                <h3 className="text-lg font-bold text-white border-b border-purple-500/30 pb-2 mb-4">Actions</h3>
                <div className="flex flex-wrap items-center gap-4">
                    <TicketStatusActions ticket={ticket} onStatusUpdated={handleStatusUpdated} />
                    
                    {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && (
                        <div className="border-l border-slate-700 pl-4 ml-2 my-2">
                            <button 
                                onClick={handleCreateEscalation}
                                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                            >
                                Escalate
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Escalations */}
            {escalations.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-rose-400 border-b border-rose-500/30 pb-2 mb-4">Escalations</h3>
                    <div className="space-y-3">
                        {escalations.map(esc => (
                            <div key={esc.id} className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-semibold text-rose-300">{esc.escalationLevel}</span>
                                    <span className={esc.resolvedAt ? 'text-emerald-400' : 'text-rose-400'}>
                                        {esc.resolvedAt ? 'Resolved' : 'Open'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-300"><span className="text-slate-400">Reason:</span> {esc.reason}</p>
                                <div className="mt-2 text-xs text-slate-500">
                                    Escalated by {esc.escalatedByName} on {new Date(esc.escalatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Conversation */}
            <TicketConversation ticketId={ticket.id} />

        </div>
    );
};

export default TicketDetail;
