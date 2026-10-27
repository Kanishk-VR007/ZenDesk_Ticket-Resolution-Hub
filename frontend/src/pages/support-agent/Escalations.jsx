import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../store/slices/ticketSlice';
import { escalationService } from '../../services/escalationService';
import { normalizeEscalation } from '../../utils/normalization';

const AgentEscalations = () => {
    const dispatch = useDispatch();
    const { items: tickets, isLoading: ticketsLoading } = useSelector(state => state.tickets);
    const [escalations, setEscalations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    useEffect(() => {
        const loadEscalations = async () => {
            if (tickets.length === 0) return;
            setLoading(true);
            try {
                // For each ticket, fetch escalations
                const promises = tickets.map(t => escalationService.getEscalationsByTicket(t.id));
                const results = await Promise.allSettled(promises);
                
                let allEscalations = [];
                results.forEach(result => {
                    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                        allEscalations = [...allEscalations, ...result.value];
                    }
                });
                
                // Deduplicate by escalation ID
                const uniqueEscalations = Array.from(new Map(allEscalations.map(e => [e.id, e])).values());
                setEscalations(uniqueEscalations.map(normalizeEscalation).sort((a, b) => new Date(b.escalatedAt) - new Date(a.escalatedAt)));
            } catch (err) {
                setError('Failed to load escalations');
            } finally {
                setLoading(false);
            }
        };

        if (!ticketsLoading) {
            loadEscalations();
        }
    }, [tickets, ticketsLoading]);

    if (ticketsLoading || loading) return <div className="p-6 text-center text-cyan-400 animate-pulse">Loading escalations...</div>;
    if (error) return <div className="p-6 text-center text-rose-400">{error}</div>;

    return (
        <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl rounded-3xl border border-pink-500/20 shadow-lg mt-6">
            <h2 className="mb-6 text-2xl font-extrabold pb-4 border-b border-purple-500/30 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                My Escalations
            </h2>

            {escalations.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">No escalations found for your tickets.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-purple-500/20">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1a0b2e]/80">
                            <tr className="border-b-2 border-pink-500/30">
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">ID</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Ticket</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Level</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Reason</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Escalated By</th>
                                <th className="p-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {escalations.map(esc => (
                                <tr key={esc.id} className="border-b border-purple-500/10 hover:bg-[#1e293b]/40 transition-colors duration-300">
                                    <td className="p-4 text-sm font-medium text-cyan-400">#{esc.id}</td>
                                    <td className="p-4 text-sm font-semibold text-slate-100">{esc.ticketTitle} <span className="text-slate-500 text-xs">(#{esc.ticketId})</span></td>
                                    <td className="p-4 text-sm font-medium text-rose-300">{esc.escalationLevel}</td>
                                    <td className="p-4 text-sm text-slate-300 max-w-xs truncate" title={esc.reason}>{esc.reason}</td>
                                    <td className="p-4 text-sm text-slate-400">{esc.escalatedByName}</td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            esc.resolvedAt ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                        }`}>
                                            {esc.resolvedAt ? 'Resolved' : 'Open'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AgentEscalations;
