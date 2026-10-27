import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux';
import { agentService } from '../../services/agentService';
import IllustratedAvatar from '../../components/common/IllustratedAvatar';

const AgentProfile = () => {
    const { user } = useSelector(state => state.auth);
    const { agents: cachedAgents } = useSelector(state => state.agents || { agents: [] });
    const [agentProfile, setAgentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchStatus, setFetchStatus] = useState('loading'); // loading, success, error, empty

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) {
                setLoading(false);
                setFetchStatus('error');
                return;
            }

            // Step 2 & 13: Reuse existing data if possible
            const existingAgent = cachedAgents?.find(a => String(a.userId) === String(user.id));
            if (existingAgent) {
                setAgentProfile(existingAgent);
                setFetchStatus('success');
                setLoading(false);
                return;
            }

            try {
                // Fetch all agents and match correctly (Step 3: agent.userId === authenticatedUser.id)
                const agentsData = await agentService.getAllAgents();
                const matchedAgent = agentsData.find(a => String(a.userId) === String(user.id));
                
                if (matchedAgent) {
                    setAgentProfile(matchedAgent);
                    setFetchStatus('success');
                } else {
                    setFetchStatus('empty');
                }
            } catch (err) {
                // Step 6 & 7: Do not crash, do not logout, use distinct states
                const status = err?.response?.status;
                if (status === 404 || status === 403 || status === 401) {
                    setFetchStatus('empty');
                } else {
                    setFetchStatus('error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id, cachedAgents]);

    // Step 16: Normalized profile model combining auth user and agent profile
    const normalizedAgent = {
        id: agentProfile?.id ?? null,
        userId: agentProfile?.userId ?? user?.id ?? null,
        fullName: agentProfile?.fullName ?? user?.fullName ?? "Unknown User",
        email: agentProfile?.email ?? user?.email ?? "No email available",
        department: agentProfile?.department ?? "Not available",
        specialization: agentProfile?.specialization ?? "Not available",
        currentLoad: agentProfile?.currentLoad ?? null,
        maxCapacity: agentProfile?.maxCapacity ?? null,
        isAvailable: agentProfile?.isAvailable ?? null,
        loadPercentage: agentProfile?.loadPercentage ?? null
    };

    if (loading) {
        return (
            <div className="space-y-6 mt-6 max-w-3xl mx-auto p-6 text-center animate-pulse">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-slate-700/50 rounded w-1/3 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-700/50 rounded w-1/4 mx-auto mb-2"></div>
                <div className="text-cyan-400">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 max-w-3xl mx-auto">
            <div className="bg-[#160b2b]/60 backdrop-blur-xl p-8 rounded-3xl border border-purple-500/20 shadow-lg">
                
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                    <IllustratedAvatar name={normalizedAgent.fullName} size="lg" />
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white mb-1">{normalizedAgent.fullName}</h2>
                        <div className="text-pink-400 font-medium mb-3">{user?.role?.replace('ROLE_', '').replace('_', ' ') || 'SUPPORT AGENT'}</div>
                        <div className="text-slate-400 text-sm">{normalizedAgent.email}</div>
                        
                        {(fetchStatus === 'empty' || fetchStatus === 'error') && (
                            <div className="mt-3 text-xs text-rose-400/80 italic bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 inline-block">
                                Additional agent information is currently unavailable.
                            </div>
                        )}
                        
                        {fetchStatus === 'success' && normalizedAgent.department !== "Not available" && (
                            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${normalizedAgent.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                                    {normalizedAgent.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-purple-500/20">
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Department</div>
                        <div className="text-slate-200 font-medium">{normalizedAgent.department}</div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Specialization</div>
                        <div className="text-slate-200 font-medium">{normalizedAgent.specialization}</div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Current Load</div>
                        <div className="text-slate-200 font-medium">
                            {normalizedAgent.currentLoad !== null && normalizedAgent.maxCapacity !== null 
                                ? `${normalizedAgent.currentLoad} / ${normalizedAgent.maxCapacity}` 
                                : "Not available"}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Availability</div>
                        <div className="text-slate-200 font-medium">
                            {normalizedAgent.isAvailable !== null 
                                ? (normalizedAgent.isAvailable ? 'Available' : 'Unavailable') 
                                : "Not available"}
                        </div>
                    </div>
                    
                    {normalizedAgent.loadPercentage !== null && (
                        <div className="md:col-span-2 mt-2">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500 uppercase tracking-wider">Utilization</span>
                                <span className="text-slate-300">{Math.round(normalizedAgent.loadPercentage)}%</span>
                            </div>
                            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                                <div 
                                    className={`h-2 rounded-full shadow-[0_0_10px_currentColor] ${
                                        normalizedAgent.loadPercentage > 90 ? 'bg-rose-500 text-rose-500' :
                                        normalizedAgent.loadPercentage > 75 ? 'bg-amber-500 text-amber-500' :
                                        'bg-emerald-500 text-emerald-500'
                                    }`} 
                                    style={{ width: `${Math.min(100, normalizedAgent.loadPercentage)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentProfile;
