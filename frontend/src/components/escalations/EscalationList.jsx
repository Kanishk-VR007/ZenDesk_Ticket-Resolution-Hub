import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnresolvedEscalations, resolveTicketEscalation } from '../../store/slices/escalationSlice';

const EscalationList = () => {
    const dispatch = useDispatch();
    const { items: escalations, isLoading, error } = useSelector((state) => state.escalations);
    const { role } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUnresolvedEscalations());
    }, [dispatch]);

    const handleResolve = (escalationId) => {
        if (window.confirm('Are you sure you want to resolve this escalation? The ticket will return to IN_PROGRESS.')) {
            dispatch(resolveTicketEscalation(escalationId));
        }
    };

    if (isLoading) return <div className="p-4 font-semibold text-cyan-400 tracking-wider animate-pulse">Loading escalations...</div>;
    if (error) return <div className="p-4 font-semibold text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]">Error: {error}</div>;

    return (
        <div className="p-6 mt-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)]">
            <h2 className="pb-2 mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 border-b border-purple-500/30 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                Active System Escalations
            </h2>
            
            {escalations.length === 0 ? (
                <p className="text-purple-300/60 italic font-medium">No active escalations require attention.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1a0b2e]/80 border-b-2 border-rose-500/30">
                                <th className="p-3 text-sm font-semibold text-rose-400 uppercase tracking-wider">Ticket ID</th>
                                <th className="p-3 text-sm font-semibold text-rose-400 uppercase tracking-wider">Level</th>
                                <th className="p-3 text-sm font-semibold text-rose-400 uppercase tracking-wider">Reason</th>
                                <th className="p-3 text-sm font-semibold text-rose-400 uppercase tracking-wider">Escalated By</th>
                                <th className="p-3 text-sm font-semibold text-rose-400 uppercase tracking-wider">Time</th>
                                <th className="p-3 text-sm font-semibold text-rose-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {escalations.map((escalation) => (
                                <tr key={escalation.id} className="border-b border-purple-500/10 hover:bg-[#1e293b]/40 transition-colors duration-300">
                                    <td className="p-3 text-sm font-medium text-slate-200">
                                        {/* Uses the ticketId from EscalationResponseDto */}
                                        <span className="text-cyan-400">#{escalation.ticketId}</span> - {escalation.ticketTitle}
                                    </td>
                                    <td className="p-3 text-sm">
                                        <span className="px-2 py-1 font-bold text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                            Lvl {escalation.escalationLevel}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-slate-300 max-w-xs truncate" title={escalation.reason}>
                                        {escalation.reason}
                                    </td>
                                    <td className="p-3 text-sm text-purple-300/80">{escalation.escalatedByName}</td>
                                    <td className="p-3 text-sm text-slate-400">
                                        {new Date(escalation.escalatedAt).toLocaleString()}
                                    </td>
                                    <td className="p-3 text-sm">
                                        {role === 'ROLE_SUPERVISOR' && (
                                            <button 
                                                onClick={() => handleResolve(escalation.id)}
                                                className="px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400/50 hover:scale-105 active:scale-95"
                                            >
                                                Resolve
                                            </button>
                                        )}
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

export default EscalationList;