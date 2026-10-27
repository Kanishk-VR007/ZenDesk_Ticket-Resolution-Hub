import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTickets } from '../../store/slices/ticketSlice';
import { useTicketDeletion } from '../../hooks/useTicketDeletion';

const AgentDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { items: tickets, isLoading } = useSelector(state => state.tickets);
    const { isTicketDeleted } = useTicketDeletion();

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    // Calculate metrics
    const activeTickets = tickets.filter(t => !isTicketDeleted(t.id));
    const totalTickets = activeTickets.length;
    const openTickets = activeTickets.filter(t => t.status === 'OPEN').length;
    const inProgressTickets = activeTickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = activeTickets.filter(t => t.status === 'RESOLVED').length;
    const escalatedTickets = activeTickets.filter(t => t.status === 'ESCALATED').length;

    const recentTickets = [...activeTickets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl rounded-3xl border border-purple-500/30">
                <h1 className="text-2xl font-bold text-white mb-2">Good Morning, {user?.fullName}</h1>
                <p className="text-slate-400">Here's your current workload overview.</p>
            </div>

            {isLoading ? (
                <div className="p-6 text-center text-cyan-400 animate-pulse">Loading dashboard...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { label: 'My Tickets', value: totalTickets, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Open', value: openTickets, color: 'from-emerald-500 to-teal-500' },
                            { label: 'In Progress', value: inProgressTickets, color: 'from-pink-500 to-purple-500' },
                            { label: 'Escalated', value: escalatedTickets, color: 'from-rose-500 to-red-500' },
                            { label: 'Resolved', value: resolvedTickets, color: 'from-slate-500 to-gray-500' }
                        ].map(stat => (
                            <div key={stat.label} className="p-4 rounded-2xl bg-[#160b2b]/60 border border-purple-500/20 shadow-lg">
                                <h3 className="text-sm font-medium text-slate-400 mb-2">{stat.label}</h3>
                                <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 p-6 rounded-2xl bg-[#160b2b]/60 border border-purple-500/20 shadow-lg">
                            <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-purple-500/20">My Recent Tickets</h2>
                            {recentTickets.length === 0 ? (
                                <p className="text-slate-400 italic">No tickets assigned to you.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentTickets.map(t => (
                                        <div key={t.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                            <div>
                                                <div className="font-semibold text-slate-200">{t.title}</div>
                                                <div className="text-xs text-slate-500 mt-1">ID: #{t.id} • Last updated: {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full border ${t.status === 'OPEN' ? 'border-emerald-500/50 text-emerald-400' : t.status === 'IN_PROGRESS' ? 'border-blue-500/50 text-blue-400' : t.status === 'ESCALATED' ? 'border-rose-500/50 text-rose-400' : 'border-slate-500/50 text-slate-400'}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 rounded-2xl bg-[#160b2b]/60 border border-purple-500/20 shadow-lg">
                            <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-purple-500/20">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link to="/tickets" className="block w-full p-3 text-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all text-sm font-semibold">
                                    View My Tickets
                                </Link>
                                <Link to="/escalations" className="block w-full p-3 text-center rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30 hover:bg-pink-500/20 transition-all text-sm font-semibold">
                                    View Escalations
                                </Link>
                                <Link to="/reports" className="block w-full p-3 text-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all text-sm font-semibold">
                                    My Reports
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AgentDashboard;
