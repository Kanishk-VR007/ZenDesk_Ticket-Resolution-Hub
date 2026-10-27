import api from './api';
const getTickets = async () => {
    const response = await api.get('/tickets');
    return response.data;
};
const autoAssignTicket = async (ticketId) => {
    const response = await api.post(`/assignments/auto/${ticketId}`);
    return response.data;
};
const getTicketById = async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
};

const createTicket = async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
};

const updateStatus = async (id, status) => {
    const response = await api.put(`/tickets/${id}/status`, { status });
    return response.data;
};
const unassignTicket = async (ticketId) => {
    const response = await api.delete(`/assignments/${ticketId}`);
    return response.data;
};

const getTicketStats = async () => {
    const response = await api.get('/tickets/stats');
    return response.data;
};

const getSlaRiskTickets = async () => {
    const response = await api.get('/tickets/sla-risk');
    return response.data;
};

export const ticketService = {
    getTickets,
    autoAssignTicket,
    getTicketById,
    createTicket,
    updateStatus,
    getTicketStats,
    getSlaRiskTickets,
    unassignTicket
};