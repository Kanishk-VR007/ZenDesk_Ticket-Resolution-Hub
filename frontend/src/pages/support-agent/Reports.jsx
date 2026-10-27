import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../store/slices/ticketSlice';

const AgentReports = () => {
    const dispatch = useDispatch();
    const { items: tickets, isLoading } = useSelector(state => state.tickets);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    if (isLoading) return <div className="p-6 text-center text-cyan-400 animate-pulse">Loading reports...</div>;

    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;
    const escalatedTickets = tickets.filter(t => t.status === 'ESCALATED').length;
    const closedTickets = tickets.filter(t => t.status === 'CLOSED').length;

    return (
        <div className="space-y-6 mt-6">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                Personal Reports
            </h2>
            
            <div className="bg-[#160b2b]/60 backdrop-blur-xl p-6 rounded-3xl border border-purple-500/20 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-purple-500/30 pb-2">Ticket Status Breakdown</h3>
                
                <div className="space-y-4">
                    {[
                        { label: 'Open', count: openTickets, color: 'bg-emerald-500' },
                        { label: 'In Progress', count: inProgressTickets, color: 'bg-blue-500' },
                        { label: 'Resolved', count: resolvedTickets, color: 'bg-purple-500' },
                        { label: 'Escalated', count: escalatedTickets, color: 'bg-rose-500' },
                        { label: 'Closed', count: closedTickets, color: 'bg-slate-500' },
                    ].map(stat => (
                        <div key={stat.label}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-300 font-medium">{stat.label}</span>
                                <span className="text-slate-400">{stat.count} ({totalTickets ? Math.round((stat.count / totalTickets) * 100) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                                <div className={`h-2.5 rounded-full ${stat.color} shadow-[0_0_10px_currentColor]`} style={{ width: `${totalTickets ? (stat.count / totalTickets) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-[#1a0b2e] p-4 rounded-xl border border-cyan-500/20">
                        <div className="text-sm text-cyan-400 mb-1">Total Assigned</div>
                        <div className="text-3xl font-bold text-white">{totalTickets}</div>
                    </div>
                    <div className="bg-[#1a0b2e] p-4 rounded-xl border border-pink-500/20">
                        <div className="text-sm text-pink-400 mb-1">Active (Open/In Progress)</div>
                        <div className="text-3xl font-bold text-white">{openTickets + inProgressTickets}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentReports;
