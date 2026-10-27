import { useState, useCallback } from 'react';

function readDeletedTicketIds() {
    try {
        if (typeof window === "undefined" || !window.localStorage) {
            return [];
        }
        const value = window.localStorage.getItem("zendesk_deleted_ticket_ids");
        const parsed = value ? JSON.parse(value) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function useTicketDeletion() {
    const [deletedTicketIds, setDeletedTicketIds] = useState(readDeletedTicketIds);

    const isTicketDeleted = useCallback((ticketId) => {
        return deletedTicketIds.includes(ticketId);
    }, [deletedTicketIds]);

    const deleteTicket = useCallback((ticketId) => {
        setDeletedTicketIds(prev => {
            if (prev.includes(ticketId)) return prev;
            
            const updated = [...prev, ticketId];
            try {
                if (typeof window !== "undefined" && window.localStorage) {
                    window.localStorage.setItem(
                        "zendesk_deleted_ticket_ids",
                        JSON.stringify(updated)
                    );
                }
            } catch {
                // Do not crash if storage is unavailable
            }
            return updated;
        });
    }, []);

    return { deletedTicketIds, isTicketDeleted, deleteTicket };
}
