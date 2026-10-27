import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgentWorkload, toggleAgentStatus } from '../../store/slices/agentSlice';

const AgentList = () => {
    const dispatch = useDispatch();
    const { agents, isLoading, error } = useSelector((state) => state.agents);
    useEffect(() => {
        dispatch(fetchAgentWorkload());
    }, [dispatch]);

    const handleToggleStatus = (agentId) => {
        dispatch(toggleAgentStatus(agentId));
    };

    if (isLoading) return <div className="p-4 text-blue-600 font-semibold">Loading agent workload...</div>;
    if (error) return <div className="p-4 text-red-500 font-semibold">Error: {error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-6">
            <h2 className="mb-4 text-2xl font-bold border-b pb-2">Agent Workload Summary</h2>
            
            {agents.length === 0 ? (
                <p className="text-gray-500">No active agents found in the system.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                        <div key={agent.id} className="p-4 border rounded shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">{agent.fullName}</h3>
                                    <p className="text-xs text-gray-500">{agent.department} - {agent.specialization}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded ${agent.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {agent.isAvailable ? 'Online' : 'Offline'}
                                </span>
                            </div>
                            
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Current Load:</span>
                                    <span className="font-semibold">{agent.currentLoad} / {agent.maxCapacity} Tickets</span>
                                </div>
                                
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${agent.loadPercentage >= 100 ? 'bg-red-600' : agent.loadPercentage >= 80 ? 'bg-yellow-400' : 'bg-blue-600'}`} 
                                        style={{ width: `${Math.min(agent.loadPercentage, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-xs mt-1 text-gray-500">{agent.loadPercentage}% Capacity</p>
                            </div>

                            <button 
                                onClick={() => handleToggleStatus(agent.id)}
                                className="mt-4 w-full py-2 border rounded text-sm font-semibold hover:bg-gray-50 transition"
                            >
                                Toggle Availability
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentList;