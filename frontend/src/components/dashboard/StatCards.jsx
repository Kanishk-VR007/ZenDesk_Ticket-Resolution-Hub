import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketStats } from '../../store/slices/ticketSlice';

const StatCards = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.tickets);

    useEffect(() => {
        dispatch(fetchTicketStats());
    }, [dispatch]);

    if (isLoading || !stats) {
        return <div className="p-4 text-cyan-400 animate-pulse font-medium tracking-wider">Loading statistics...</div>;
    }

    return (
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
            <div className="p-5 bg-[#160b2b]/60 backdrop-blur-xl border border-white/5 border-l-4 border-l-emerald-400 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(52,211,153,0.15)] transition-all duration-300">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Open Tickets</h3>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">
                    {stats['OPEN'] || 0}
                </p>
            </div>
            
            <div className="p-5 bg-[#160b2b]/60 backdrop-blur-xl border border-white/5 border-l-4 border-l-blue-400 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(96,165,250,0.15)] transition-all duration-300">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">In Progress</h3>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400">
                    {stats['IN_PROGRESS'] || 0}
                </p>
            </div>
            
            <div className="p-5 bg-[#160b2b]/60 backdrop-blur-xl border border-white/5 border-l-4 border-l-rose-500 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] transition-all duration-300">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Escalated</h3>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
                    {stats['ESCALATED'] || 0}
                </p>
            </div>
            
            <div className="p-5 bg-[#160b2b]/60 backdrop-blur-xl border border-white/5 border-l-4 border-l-slate-400 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(148,163,184,0.15)] transition-all duration-300">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Resolved</h3>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
                    {stats['RESOLVED'] || 0}
                </p>
            </div>
        </div>
    );
};

export default StatCards;