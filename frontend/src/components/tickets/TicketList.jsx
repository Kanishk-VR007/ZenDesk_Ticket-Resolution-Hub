import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, setSearchQuery, setFilterStatus, autoAssignTicket, unassignTicket, resolveTicket } from '../../store/slices/ticketSlice';
import SearchFilterBar from '../common/SearchFilterBar';
import { escalationService } from '../../services/escalationService'; 
import { ticketService } from '../../services/ticketService';
import DetailDrawer from '../common/DetailDrawer';
import TicketDetail from './TicketDetail';
import { useTicketDeletion } from '../../hooks/useTicketDeletion';
import ActionConfirmationModal from '../common/ActionConfirmationModal';

const TicketList = () => {
    const dispatch = useDispatch();

    const { items: tickets, isLoading, error, searchQuery, filterStatus } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    const { isTicketDeleted, deleteTicket } = useTicketDeletion();
    const [actionModal, setActionModal] = useState({ isOpen: false, type: null, ticketId: null });
    const [processingAction, setProcessingAction] = useState(false);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch, filterStatus, searchQuery]); 

    if (isLoading) return (
        <div className="p-6 font-semibold text-cyan-400 bg-[#160b2b]/60 backdrop-blur-xl rounded-3xl border border-pink-500/20 shadow-[0_0_40px_rgba(255,0,127,0.1)] tracking-wider animate-pulse mt-6">
            Loading tickets...
        </div>
    );
    if (error) return (
        <div className="p-6 font-semibold text-rose-400 bg-[#160b2b]/60 backdrop-blur-xl rounded-3xl border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.1)] mt-6">
            Error: {error}
        </div>
    );

    // Role Checks
    const canAssign = user?.role === 'ROLE_SUPERVISOR' || user?.role === 'ROLE_ADMIN';
    const isSupervisor = user?.role === 'ROLE_SUPERVISOR';
    const isAgent = user?.role === 'ROLE_SUPPORT_AGENT';
    const isCustomer = user?.role === 'ROLE_CUSTOMER'; 
    const showActions = canAssign || isAgent || isCustomer; 

    // Filter deleted tickets BEFORE other filters
    const visibleTickets = tickets.filter(ticket => !isTicketDeleted(ticket.id));

    const filteredTickets = visibleTickets.filter(ticket => {
        const matchStatus = filterStatus === 'All Status' || ticket.status === filterStatus;
        const searchLower = searchQuery.toLowerCase();
        const matchSearch = 
            ticket.title.toLowerCase().includes(searchLower) || 
            ticket.id.toString().includes(searchLower);

        return matchStatus && matchSearch;
    });

    const handleAssignClick = (ticketId) => {
        dispatch(autoAssignTicket(ticketId))
            .unwrap()
            .then((message) => alert(message))
            .catch((err) => alert(`Error: ${err}`));
    };

    const handleUnassignClick = (ticketId) => {
        if (window.confirm('Are you sure you want to unassign this ticket?')) {
            dispatch(unassignTicket(ticketId))
                .unwrap()
                .then((message) => alert(message || 'Ticket unassigned successfully'))
                .catch((err) => alert(`Error: ${err}`));
        }
    };
    
    const handleResolveClick = (ticketId) => {
        if (window.confirm('Are you sure you want to mark this ticket as resolved?')) {
            dispatch(resolveTicket(ticketId))
                .unwrap()
                .then(() => alert('Ticket successfully resolved!'))
                .catch((err) => alert(`Error: ${err}`));
        }
    };

    const handleEscalateClick = (ticketId) => {
        const reason = window.prompt('Why are you escalating this ticket?');

        if (reason && reason.trim() !== '') {
            escalationService.createEscalation({ ticketId, reason })
                .then(() => {
                    alert('Ticket successfully escalated.');
                    dispatch(fetchTickets()); 
                })
                .catch((err) => alert(`Error: ${err}`));
        }
    };

    const handleActionClick = (ticketId, type) => {
        setActionModal({ isOpen: true, type, ticketId });
    };

    const confirmAction = async () => {
        const { type, ticketId } = actionModal;
        setProcessingAction(true);

        if (type === 'DELETE') {
            // Frontend-only delete
            deleteTicket(ticketId);
            if (selectedTicketId === ticketId) {
                setSelectedTicketId(null);
            }
            setProcessingAction(false);
            setActionModal({ isOpen: false, type: null, ticketId: null });
        } else if (type === 'CLOSE') {
            // Backend update
            try {
                await ticketService.updateStatus(ticketId, 'CLOSED');
                dispatch(fetchTickets());
                setActionModal({ isOpen: false, type: null, ticketId: null });
            } catch (err) {
                alert('Unable to close ticket. Please try again.');
            } finally {
                setProcessingAction(false);
            }
        }
    };

    return (
        <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl rounded-3xl border border-pink-500/20 shadow-[0_0_40px_rgba(255,0,127,0.1)] mt-6">
            <h2 className="mb-6 text-2xl font-extrabold pb-4 border-b border-purple-500/30 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 drop-shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                Support Tickets
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <SearchFilterBar 
                        searchTerm={searchQuery} 
                        onSearchChange={(val) => dispatch(setSearchQuery(val))} 
                        placeholder="Search by ticket title"
                    />
                </div>

                <select 
                    value={filterStatus}
                    onChange={(e) => dispatch(setFilterStatus(e.target.value))} 
                    className="p-3 h-fit bg-[#0b071b]/80 border border-purple-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 text-white rounded-xl transition-all duration-300 outline-none shadow-inner"
                >
                    <option value="All Status" className="bg-[#1a0b2e] text-slate-300">All Status</option>
                    <option value="OPEN" className="bg-[#1a0b2e] text-emerald-400">Open</option>
                    <option value="IN_PROGRESS" className="bg-[#1a0b2e] text-blue-400">In Progress</option>
                    <option value="RESOLVED" className="bg-[#1a0b2e] text-slate-400">Resolved</option>
                    <option value="CLOSED" className="bg-[#1a0b2e] text-purple-400">Closed</option>
                </select>
            </div>

            {filteredTickets.length === 0 ? (
                <p className="text-purple-300/60 py-8 text-center italic font-medium">No tickets found.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-purple-500/20 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1a0b2e]/80">
                            <tr className="border-b-2 border-pink-500/30">
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">ID</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Title</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Priority</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Assigned Agent</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">SLA Deadline</th>
                                {showActions && (
                                    <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="border-b border-purple-500/10 hover:bg-[#1e293b]/40 transition-colors duration-300">
                                    <td className="p-4 text-sm font-medium text-cyan-400">#{ticket.id}</td>
                                    <td className="p-4 text-sm font-semibold text-slate-100">{ticket.title}</td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                                            ticket.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
                                            ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/30' : 
                                            ticket.status === 'ESCALATED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 
                                            'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-300">{ticket.priority}</td>
                                    <td className="p-4 text-sm font-medium text-purple-300/80">{ticket.assignedAgentName || 'Unassigned'}</td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {ticket.slaDeadline ? new Date(ticket.slaDeadline).toLocaleString() : 'N/A'}
                                    </td>
                                    {showActions && (
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSelectedTicketId(ticket.id)}
                                                    className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                                >
                                                    View Detail
                                                </button>

                                                {canAssign && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAssignClick(ticket.id)}
                                                            disabled={!!ticket.assignedAgentName} 
                                                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                                                                ticket.assignedAgentName 
                                                                    ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-600' 
                                                                    : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] border-none hover:scale-105 active:scale-95'  
                                                            }`}
                                                        >
                                                            {ticket.assignedAgentName ? 'Assigned' : 'Assign'}
                                                        </button>

                                                        {ticket.assignedAgentName && (
                                                            <button 
                                                                onClick={() => handleUnassignClick(ticket.id)}
                                                                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95"
                                                            >
                                                                Unassign
                                                            </button>
                                                        )}
                                                    </>
                                                )}

                                                {isAgent && (
                                                    <button 
                                                        onClick={() => handleResolveClick(ticket.id)}
                                                        disabled={ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'} 
                                                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                                                            ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                                                                ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-600' 
                                                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] border-none hover:scale-105 active:scale-95'  
                                                        }`}
                                                    >
                                                        {ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'Resolved' : 'Resolve'}
                                                    </button>
                                                )}

                                                {isCustomer && ticket.status === 'RESOLVED' && (
                                                    <button 
                                                        onClick={() => handleEscalateClick(ticket.id)}
                                                        className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)] hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95"
                                                    >
                                                        Escalate
                                                    </button>
                                                )}

                                                {/* Supervisor Actions */}
                                                {isSupervisor && (ticket.status === 'ESCALATED' || ticket.status === 'RESOLVED') && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleActionClick(ticket.id, 'DELETE')}
                                                            aria-label="Delete ticket"
                                                            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-[rgba(239,68,68,0.08)] text-red-400 border border-[rgba(239,68,68,0.45)] hover:shadow-[0_0_24px_rgba(239,68,68,0.38)] shadow-[0_0_16px_rgba(239,68,68,0.22)] hover:bg-red-500/20 hover:-translate-y-0.5"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button 
                                                            onClick={() => handleActionClick(ticket.id, 'CLOSE')}
                                                            aria-label="Close ticket"
                                                            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-amber-500/10 text-amber-500 border border-amber-500/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.38)] shadow-[0_0_16px_rgba(245,158,11,0.22)] hover:bg-amber-500/20 hover:-translate-y-0.5"
                                                        >
                                                            Close
                                                        </button>
                                                    </>
                                                )}
                                                {isSupervisor && ticket.status === 'CLOSED' && (
                                                    <button 
                                                        onClick={() => handleActionClick(ticket.id, 'DELETE')}
                                                        aria-label="Delete ticket"
                                                        className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-[rgba(239,68,68,0.08)] text-red-400 border border-[rgba(239,68,68,0.45)] hover:shadow-[0_0_24px_rgba(239,68,68,0.38)] shadow-[0_0_16px_rgba(239,68,68,0.22)] hover:bg-red-500/20 hover:-translate-y-0.5"
                                                    >
                                                        Delete
                                                    </button>
                                                )}

                                                {/* Customer Action */}
                                                {isCustomer && ticket.creatorId === user.id && (
                                                    <button 
                                                        onClick={() => handleActionClick(ticket.id, 'DELETE')}
                                                        aria-label="Delete ticket"
                                                        className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 bg-[rgba(239,68,68,0.08)] text-red-400 border border-[rgba(239,68,68,0.45)] hover:shadow-[0_0_24px_rgba(239,68,68,0.38)] shadow-[0_0_16px_rgba(239,68,68,0.22)] hover:bg-red-500/20 hover:-translate-y-0.5"
                                                    >
                                                        Delete
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <DetailDrawer 
                isOpen={!!selectedTicketId && !isTicketDeleted(selectedTicketId)} 
                onClose={() => setSelectedTicketId(null)}
                title={`Ticket #${selectedTicketId}`}
            >
                {selectedTicketId && !isTicketDeleted(selectedTicketId) && (
                    <TicketDetail 
                        ticketId={selectedTicketId} 
                        onClose={() => setSelectedTicketId(null)} 
                        onUpdate={() => dispatch(fetchTickets())}
                    />
                )}
            </DetailDrawer>

            {(() => {
                const targetTicket = actionModal.ticketId ? tickets.find(t => t.id === actionModal.ticketId) : null;
                const isResolved = targetTicket?.status === 'RESOLVED';
                
                return (
                    <ActionConfirmationModal 
                        isOpen={actionModal.isOpen}
                        onClose={() => !processingAction && setActionModal({ isOpen: false, type: null, ticketId: null })}
                        onConfirm={confirmAction}
                        processing={processingAction}
                        title={actionModal.type === 'DELETE' 
                            ? (isCustomer ? 'Delete ticket?' : 'Delete this ticket from the application?') 
                            : (isResolved ? 'Close this resolved ticket?' : 'Mark this ticket as CLOSED?')}
                        message={actionModal.type === 'DELETE' 
                            ? (isCustomer 
                                ? "This ticket will be removed from your view." 
                                : "Deletion is handled locally and will remove this ticket from your ticket list.") 
                            : "This ticket will be marked as closed."}
                        confirmText={actionModal.type === 'DELETE' ? 'Delete' : 'Close Ticket'}
                        confirmColor={actionModal.type === 'DELETE' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}
                    />
                );
            })()}
        </div>
    );
};

export default TicketList;