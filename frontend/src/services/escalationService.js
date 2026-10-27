
import api from './api';

const escalateTicket = async (escalationData) => {
    const response = await api.post('/escalations', escalationData);
    return response.data;
};

const createEscalation = async (escalationData) => {
    const response = await api.post('/escalations', escalationData);
    return response.data;
};


const resolveEscalation = async (escalationId) => {
    const response = await api.put(`/escalations/${escalationId}/resolve`, {});
    return response.data;
};

const getEscalationsByTicket = async (ticketId) => {
    const response = await api.get(`/escalations/ticket/${ticketId}`);
    return response.data;
};

const getUnresolvedEscalations = async () => {
    const response = await api.get('/escalations/unresolved');
    return response.data;
};

const getAllEscalations = async () => {
    const response = await api.get('/escalations');
    return response.data;
};

export const escalationService = {
    escalateTicket,
    createEscalation, 
    resolveEscalation,
    getEscalationsByTicket,
    getUnresolvedEscalations,
    getAllEscalations
};