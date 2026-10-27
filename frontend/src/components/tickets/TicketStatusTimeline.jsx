import React from 'react';

const TicketStatusTimeline = ({ ticket }) => {
    if (!ticket) return null;

    const currentStatus = ticket.status;
    const isAssigned = !!ticket.assignedAgentName;

    const nodeColors = {
        OPEN: 'border-blue-400 bg-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
        IN_PROGRESS: 'border-blue-600 bg-blue-600/20 text-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]',
        RESOLVED: 'border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
        CLOSED: 'border-slate-400 bg-slate-500/20 text-slate-400 shadow-[0_0_10px_rgba(100,116,139,0.3)]',
        ESCALATED: 'border-rose-400 bg-rose-500/20 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
    };

    const glowColors = {
        OPEN: 'rgba(59,130,246,0.5)',
        IN_PROGRESS: 'rgba(37,99,235,0.5)',
        RESOLVED: 'rgba(16,185,129,0.5)',
        CLOSED: 'rgba(100,116,139,0.5)',
        ESCALATED: 'rgba(244,63,94,0.5)'
    };

    const getTimelineNodes = () => {
        const baseStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
        const nodes = [];
        
        let hasPassedCurrent = false;

        for (const status of baseStatuses) {
            const isActive = status === currentStatus && currentStatus !== 'ESCALATED';
            const isCompleted = !hasPassedCurrent && !isActive && currentStatus !== 'OPEN' && currentStatus !== 'ESCALATED';
            
            if (isActive) hasPassedCurrent = true;

            nodes.push({
                status,
                isActive,
                isCompleted: isCompleted || (status === 'OPEN' && currentStatus === 'ESCALATED') || (status === 'IN_PROGRESS' && currentStatus === 'ESCALATED'),
                isFuture: hasPassedCurrent && !isActive
            });
        }
        
        // Treat ESCALATED as a special branch connected after IN_PROGRESS logically, 
        // or just active if it is the current state
        if (currentStatus === 'ESCALATED') {
            nodes.push({
                status: 'ESCALATED',
                isActive: true,
                isCompleted: false,
                isFuture: false
            });
        }

        return nodes;
    };

    const nodes = getTimelineNodes();

    return (
        <div className="mt-8 mb-6">
            <style>{`
                @media (prefers-reduced-motion: no-preference) {
                    .node-pulse::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        border: 2px solid currentColor;
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.8;
                        animation: statusPulse 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
                        pointer-events: none;
                        z-index: -1;
                    }
                    @keyframes statusPulse {
                        0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                        70% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                    }
                }
            `}</style>

            <h3 className="text-lg font-bold text-white border-b border-purple-500/30 pb-2 mb-6">Ticket Progress</h3>
            
            <div className="relative space-y-8 ml-2">
                {/* Background Vertical connecting line */}
                <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-slate-700/50 -z-10 transform -translate-x-1/2"></div>
                
                {nodes.map((node, index) => {
                    const isCurrent = node.isActive;
                    const colorClass = nodeColors[node.status];
                    
                    let nodeStyle = {};
                    if (isCurrent) {
                        nodeStyle.color = glowColors[node.status].replace(',0.5)', ', 1)');
                    }

                    return (
                        <div key={node.status} className="relative flex items-start group">
                            {/* Connector Highlight (completed path) */}
                            {node.isCompleted && index < nodes.length - 1 && (
                                <div className="absolute left-3 top-6 bottom-[-32px] w-0.5 bg-cyan-400/80 -z-10 transform -translate-x-1/2"></div>
                            )}

                            {/* Circular Node */}
                            <div className="relative z-10 flex-shrink-0 mt-0.5">
                                <div 
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                        isCurrent ? `${colorClass} scale-125 node-pulse` : 
                                        node.isCompleted ? 'bg-cyan-500 border-cyan-400' : 
                                        'bg-[#0b071b] border-slate-600'
                                    }`}
                                    style={nodeStyle}
                                >
                                    {node.isCompleted && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`ml-6 ${isCurrent ? 'opacity-100' : node.isCompleted ? 'opacity-80' : 'opacity-40'}`}>
                                <div className={`font-bold tracking-wider text-sm ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                                    {node.status}
                                </div>
                                
                                {node.status === 'OPEN' && (
                                    <div className="text-xs text-slate-400 mt-1">
                                        {isAssigned ? `Assigned to: ${ticket.assignedAgentName}` : 'Unassigned'}
                                    </div>
                                )}
                                
                                {isCurrent && (
                                    <div className="text-xs font-semibold mt-1" style={{ color: nodeStyle.color }}>
                                        Current Status
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TicketStatusTimeline;
