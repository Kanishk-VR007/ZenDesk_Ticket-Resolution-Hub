import api from './api';
import axios from 'axios';

const getAllAgents = async () => {
    const response = await api.get('/agents');
    return response.data;
};

const getAgentWorkload = async () => {
    const response = await api.get('/agents/workload');
    return response.data;
};


const toggleAvailability = async (id) => {
    const response = await api.put(`/agents/${id}/toggle-availability`);
    return response.data;
};


const recalculateLoad = async (id) => {
    const response = await api.post(`/agents/${id}/recalculate`);
    return response.data;
};

const updateTicketStatus = async (ticketId, status) => {

    const response = await axios.put(`/api/tickets/${ticketId}/status`, { status });
    return response.data;
};


export const agentService = {
    getAllAgents,
    getAgentWorkload,
    toggleAvailability,
    recalculateLoad,
    updateTicketStatus
};