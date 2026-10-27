import React from 'react';
import { useSelector } from 'react-redux';

const RecentActivity = () => {
    const { items: tickets } = useSelector((state) => state.tickets);
    const recentTickets = [...tickets]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)]">
            <h2 className="pb-2 mb-4 text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 border-b border-purple-500/30">
                Recent Activity
            </h2>
            
            {recentTickets.length === 0 ? (
                <p className="text-purple-300/60 italic font-medium">No recent activity</p>
            ) : (
                <div className="space-y-4">
                    {recentTickets.map((ticket) => (
                        <div key={ticket.id} className="flex items-start hover:bg-[#1e293b]/30 p-2 rounded-lg transition-colors duration-300">
                            <div className="flex-shrink-0 w-2 h-2 mt-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-slate-100">
                                    Ticket #{ticket.id}: {ticket.title}
                                </p>
                                <div className="flex items-center mt-1 space-x-3">
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 rounded-full shadow-[0_0_5px_rgba(236,72,153,0.2)]">
                                        {ticket.status}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivity;