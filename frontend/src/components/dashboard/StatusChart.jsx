import React from 'react';
import { useSelector } from 'react-redux';

const StatusChart = () => {
    const { stats, isLoading } = useSelector((state) => state.tickets);

    if (isLoading || !stats) {
        return <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)] animate-pulse h-64"></div>;
    }
    
    // Updated color strings to use deep space neon gradients with drop shadows
    const data = [
        { label: 'Open', value: stats['OPEN'] || 0, color: 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)]' },
        { label: 'In Progress', value: stats['IN_PROGRESS'] || 0, color: 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' },
        { label: 'Escalated', value: stats['ESCALATED'] || 0, color: 'bg-gradient-to-r from-rose-400 to-pink-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' },
        { label: 'Resolved', value: stats['RESOLVED'] || 0, color: 'bg-gradient-to-r from-slate-400 to-slate-600 shadow-[0_0_10px_rgba(148,163,184,0.3)]' },
        { label: 'Closed', value: stats['CLOSED'] || 0, color: 'bg-gradient-to-r from-purple-400 to-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]' }
    ];
    const maxTicketCount = Math.max(...data.map(item => item.value), 1);

    return (
        <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)]">
            <h2 className="pb-2 mb-6 text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 border-b border-purple-500/30">
                Ticket Distribution by Status
            </h2>
            
            <div className="space-y-4">
                {data.map((item) => {
                    const widthPercentage = Math.round((item.value / maxTicketCount) * 100);
                    
                    return (
                        <div key={item.label} className="flex items-center hover:bg-[#1e293b]/30 p-2 rounded-lg transition-colors duration-300 -mx-2">
                            {/* Label */}
                            <div className="w-24 text-sm font-semibold text-cyan-300 tracking-wide">
                                {item.label}
                            </div>
                            
                            {/* Chart Bar Area */}
                            <div className="flex-1 ml-4 flex items-center h-5">
                                <div 
                                    className={`h-full rounded-md ${item.color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${widthPercentage}%`, minWidth: item.value > 0 ? '4px' : '0' }}
                                ></div>
                                <span className="ml-3 text-sm font-bold text-slate-200">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusChart;