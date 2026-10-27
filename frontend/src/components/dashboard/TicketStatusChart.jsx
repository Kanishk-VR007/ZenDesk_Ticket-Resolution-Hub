import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTickets } from '../../store/slices/ticketSlice';
import { useTicketDeletion } from '../../hooks/useTicketDeletion';

const STATUS_CONFIG = {
    OPEN: { label: "Open", color: "#3B82F6", glowColor: "rgba(59,130,246,0.6)" },
    IN_PROGRESS: { label: "In Progress", color: "#2563EB", glowColor: "rgba(37,99,235,0.6)" },
    RESOLVED: { label: "Resolved", color: "#22C55E", glowColor: "rgba(34,197,94,0.6)" },
    ESCALATED: { label: "Escalated", color: "#EF4444", glowColor: "rgba(239,68,68,0.6)" },
    CLOSED: { label: "Closed", color: "#64748B", glowColor: "rgba(100,116,139,0.6)" }
};

const ORDER = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED', 'CLOSED'];

const TicketStatusChart = () => {
    const { items: tickets, isLoading, error } = useSelector((state) => state.tickets);
    const { isTicketDeleted } = useTicketDeletion();
    const [hoveredStatus, setHoveredStatus] = useState(null);
    const [animateIn, setAnimateIn] = useState(false);
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);
    
    // Trigger entrance animation smoothly when loading completes
    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setAnimateIn(true), 100);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isLoading]);

    const { statusCounts, totalTickets, safeTickets } = useMemo(() => {
        const activeTickets = Array.isArray(tickets) ? tickets.filter(t => !isTicketDeleted(t?.id)) : [];
        const counts = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, ESCALATED: 0, CLOSED: 0 };
        
        activeTickets.forEach(ticket => {
            const status = ticket?.status;
            if (status && Object.prototype.hasOwnProperty.call(counts, status)) {
                counts[status] += 1;
            }
        });

        const total = ORDER.reduce((sum, key) => sum + counts[key], 0);
        return { statusCounts: counts, totalTickets: total, safeTickets: activeTickets };
    }, [tickets, isTicketDeleted]);

    if (error) {
        return (
            <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)] flex items-center justify-center min-h-[300px]">
                <p className="text-rose-400 font-medium">Unable to load ticket statistics</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)] min-h-[350px]">
                <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500">Ticket Status Overview</h2>
                <p className="text-slate-400 text-sm mb-6 pb-2 border-b border-purple-500/30">Tickets by current status</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8 animate-pulse">
                    <div className="w-48 h-48 rounded-full border-4 border-slate-700/50"></div>
                    <div className="space-y-4 w-48">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-4 bg-slate-700/50 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (safeTickets.length === 0 || totalTickets === 0) {
        return (
            <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)] min-h-[350px] flex flex-col">
                <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500">Ticket Status Overview</h2>
                <p className="text-slate-400 text-sm mb-6 pb-2 border-b border-purple-500/30">Tickets by current status</p>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="font-medium text-slate-300">No ticket statistics available</p>
                </div>
            </div>
        );
    }

    // Chart dimensions
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    const segments = ORDER.map(status => {
        const value = statusCounts[status];
        const percentage = totalTickets ? (value / totalTickets) : 0;
        
        // Ensure a small gap between segments for visual polish unless it's a 100% segment
        const displayPercentage = percentage === 1 ? 1 : Math.max(0, percentage - 0.005);
        
        const strokeDasharray = `${displayPercentage * circumference} ${circumference}`;
        // SVG strokeDashoffset goes backwards, so we use negative offset
        const strokeDashoffset = -currentOffset * circumference;
        
        const centerAngle = (currentOffset + percentage / 2) * 360;
        
        currentOffset += percentage;
        
        return {
            status,
            value,
            percentage: (percentage * 100).toFixed(1),
            strokeDasharray,
            strokeDashoffset,
            centerAngle,
            ...STATUS_CONFIG[status]
        };
    });

    const hoveredSegment = hoveredStatus ? segments.find(s => s.status === hoveredStatus) : null;

    return (
        <div className="p-6 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)] min-h-[350px] flex flex-col transition-all">
            <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500">
                Ticket Status Overview
            </h2>
            <p className="text-slate-400 text-sm mb-6 pb-2 border-b border-purple-500/30">
                Tickets by current status
            </p>
            
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                
                {/* DONUT CHART */}
                <div className="relative w-56 h-56 group">
                    <svg 
                        viewBox="0 0 200 200" 
                        className={`w-full h-full transform -rotate-90 transition-opacity duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
                        style={{ filter: hoveredStatus ? 'none' : 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                    >
                        {/* Background track */}
                        <circle
                            cx="100" cy="100" r={radius}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="20"
                        />
                        
                        {segments.map((seg) => {
                            if (seg.value === 0) return null;
                            const isActive = hoveredStatus === seg.status;
                            const isDimmed = hoveredStatus && !isActive;
                            
                            return (
                                <circle
                                    key={seg.status}
                                    cx="100" cy="100" r={radius}
                                    fill="transparent"
                                    stroke={seg.color}
                                    strokeWidth={isActive ? 24 : 20}
                                    strokeDasharray={seg.strokeDasharray}
                                    strokeDashoffset={animateIn ? seg.strokeDashoffset : 0}
                                    strokeLinecap={seg.value === totalTickets ? "butt" : "round"}
                                    style={{
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        filter: isActive ? `drop-shadow(0 0 12px ${seg.glowColor})` : 'none',
                                        opacity: isDimmed ? 0.3 : 1,
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={() => setHoveredStatus(seg.status)}
                                    onMouseLeave={() => setHoveredStatus(null)}
                                />
                            );
                        })}
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">TOTAL TICKETS</span>
                        <span className="text-4xl font-bold text-white drop-shadow-md">{totalTickets}</span>
                    </div>

                    {/* Tooltip */}
                    {hoveredSegment && hoveredSegment.value > 0 && (
                        <div 
                            className="absolute pointer-events-none bg-[#0b071b]/95 border border-purple-500/50 p-3 rounded-xl shadow-2xl backdrop-blur-md z-10 transition-opacity duration-200"
                            style={{
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%) scale(1.1)',
                                minWidth: '130px',
                                textAlign: 'center'
                            }}
                        >
                            <div className="text-sm font-bold text-white mb-1" style={{ color: hoveredSegment.color }}>
                                {hoveredSegment.label}
                            </div>
                            <div className="text-xs text-slate-300">
                                {hoveredSegment.value} ticket{hoveredSegment.value !== 1 ? 's' : ''}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400 mt-1">
                                {hoveredSegment.percentage}%
                            </div>
                        </div>
                    )}
                </div>

                {/* LEGEND */}
                <div className={`flex flex-col space-y-3 w-full max-w-[220px] transition-opacity duration-1000 delay-100 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                    {segments.map((seg) => {
                        const isActive = hoveredStatus === seg.status;
                        const isDimmed = hoveredStatus && !isActive;
                        
                        return (
                            <div 
                                key={seg.status}
                                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 cursor-pointer border border-transparent
                                    ${isActive ? 'bg-slate-800/60 shadow-lg scale-105' : 'hover:bg-slate-800/30'}
                                    ${isActive ? 'border-purple-500/30' : ''}
                                `}
                                style={{ opacity: isDimmed ? 0.5 : 1 }}
                                onMouseEnter={() => setHoveredStatus(seg.status)}
                                onMouseLeave={() => setHoveredStatus(null)}
                                aria-label={`${seg.label}: ${seg.value} tickets`}
                            >
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-3 h-3 rounded-full shadow-sm"
                                        style={{ 
                                            backgroundColor: seg.color,
                                            boxShadow: isActive ? `0 0 10px ${seg.glowColor}` : 'none'
                                        }}
                                    ></div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                        {seg.label}
                                    </span>
                                </div>
                                <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {seg.value}
                                </span>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default TicketStatusChart;
