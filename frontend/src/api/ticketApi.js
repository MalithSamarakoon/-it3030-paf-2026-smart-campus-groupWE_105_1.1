import api from './api.js';

// Helper to get auth header
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    }
    return {};
};

// ==================== TICKET API ====================

export const createTicket = (data) => {
    return api.post('/tickets', data, { headers: authHeader() });
};

export const getAllTickets = () => {
    return api.get('/tickets', { headers: authHeader() });
};

export const getMyTickets = () => {
    return api.get('/tickets/my', { headers: authHeader() });
};

export const getAssignedTickets = () => {
    return api.get('/tickets/assigned', { headers: authHeader() });
};

export const getTicketById = (id) => {
    return api.get(`/tickets/${id}`, { headers: authHeader() });
};

export const updateTicketStatus = (id, data) => {
    return api.patch(`/tickets/${id}/status`, data, { headers: authHeader() });
};

export const assignTicket = (id, data) => {
    return api.patch(`/tickets/${id}/assign`, data, { headers: authHeader() });
};

export const getTechnicians = () => {
    return api.get('/users/technicians', { headers: authHeader() });
};

// ==================== COMMENT API ====================

export const addComment = (ticketId, data) => {
    return api.post(`/tickets/${ticketId}/comments`, data, { headers: authHeader() });
};

export const updateComment = (ticketId, commentId, data) => {
    return api.put(`/tickets/${ticketId}/comments/${commentId}`, data, { headers: authHeader() });
};

export const deleteComment = (ticketId, commentId) => {
    return api.delete(`/tickets/${ticketId}/comments/${commentId}`, { headers: authHeader() });
};
