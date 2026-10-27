
import api from './api';
const getComments = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
};
const addComment = async (ticketId, commentData) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
};

const deleteComment = async (ticketId, commentId) => {
    const response = await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
    return response.data;
};

export const commentService = {
    getComments,
    addComment,
    deleteComment
};