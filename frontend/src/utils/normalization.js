export const normalizeTicket = (ticket) => ({
    id: ticket?.id ?? null,
    title: ticket?.title ?? "Untitled ticket",
    description: ticket?.description ?? "",
    category: ticket?.category ?? "Uncategorized",
    status: ticket?.status ?? "OPEN",
    priority: ticket?.priority ?? "MEDIUM",
    creatorId: ticket?.creatorId ?? ticket?.customerId ?? null,
    creatorName: ticket?.creatorName ?? "Unknown customer",
    assignedAgentName: ticket?.assignedAgentName ?? "Unassigned",
    slaDeadline: ticket?.slaDeadline ?? null,
    createdAt: ticket?.createdAt ?? null,
    updatedAt: ticket?.updatedAt ?? null,
    resolvedAt: ticket?.resolvedAt ?? null,
    commentCount: Number(ticket?.commentCount ?? 0),
    escalationCount: Number(ticket?.escalationCount ?? 0)
});

export const normalizeAgent = (agent) => ({
    id: agent?.id ?? null,
    userId: agent?.userId ?? null,
    fullName: agent?.fullName ?? "Unknown Agent",
    email: agent?.email ?? "No email",
    department: agent?.department ?? "Unassigned",
    specialization: agent?.specialization ?? "General",
    currentLoad: Number(agent?.currentLoad ?? 0),
    maxCapacity: Number(agent?.maxCapacity ?? 5),
    isAvailable: Boolean(agent?.isAvailable ?? false),
    loadPercentage: Number(agent?.loadPercentage ?? 0)
});

export const normalizeEscalation = (escalation) => ({
    id: escalation?.id ?? null,
    ticketId: escalation?.ticketId ?? null,
    ticketTitle: escalation?.ticketTitle ?? "Unknown Ticket",
    escalationLevel: escalation?.escalationLevel ?? "LEVEL_1",
    reason: escalation?.reason ?? "No reason provided",
    escalatedByName: escalation?.escalatedByName ?? "Unknown user",
    escalatedAt: escalation?.escalatedAt ?? null,
    resolvedAt: escalation?.resolvedAt ?? null
});

export const normalizeComment = (comment) => ({
    id: comment?.id ?? null,
    ticketId: comment?.ticketId ?? null,
    authorName: comment?.authorName ?? "Unknown author",
    authorRole: comment?.authorRole ?? "ROLE_CUSTOMER",
    content: comment?.content ?? "",
    internal: Boolean(comment?.internal ?? false),
    createdAt: comment?.resolvedAt ?? comment?.createdAt ?? null // Handle backend mapping resolvedAt to createdAt
});
