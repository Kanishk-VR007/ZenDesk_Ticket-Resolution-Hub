import React, { useState, useEffect, useCallback } from 'react';
import { commentService } from '../../services/commentService';
import IllustratedAvatar from '../common/IllustratedAvatar';
import { normalizeComment } from '../../utils/normalization';

const TicketConversation = ({ ticketId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadComments = useCallback(async () => {
        if (!ticketId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await commentService.getComments(ticketId);
            setComments((Array.isArray(data) ? data : []).map(normalizeComment));
        } catch (err) {
            setError('Failed to load comments');
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !ticketId) return;

        setSubmitting(true);
        try {
            await commentService.addComment(ticketId, {
                content: newComment,
                internal: isInternal
            });
            setNewComment('');
            setIsInternal(false);
            await loadComments();
        } catch (err) {
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && comments.length === 0) return <div className="text-slate-400 p-4 text-center animate-pulse">Loading comments...</div>;
    if (error) return <div className="text-rose-400 p-4 text-center">{error}</div>;

    return (
        <div className="flex flex-col space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-purple-500/30 pb-2">Conversation</h3>
            
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-slate-400 italic text-sm text-center py-4">No comments yet.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className={`p-4 rounded-xl border ${comment.internal ? 'bg-amber-900/20 border-amber-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                            <div className="flex items-start gap-3">
                                <IllustratedAvatar name={comment.authorName} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className="font-semibold text-slate-200 text-sm">{comment.authorName}</span>
                                            <span className="text-xs text-slate-500 ml-2">{comment.authorRole?.replace('ROLE_', '')}</span>
                                            {comment.internal && (
                                                <span className="ml-2 text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Internal</span>
                                            )}
                                        </div>
                                        {comment.createdAt && (
                                            <span className="text-xs text-slate-500 whitespace-nowrap">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-300 text-sm whitespace-pre-wrap mt-2">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 bg-[#1a0b2e]/50 p-4 rounded-xl border border-purple-500/20">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-[#0b071b] border border-purple-500/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500 min-h-[100px] resize-y"
                    disabled={submitting}
                />
                <div className="flex justify-between items-center mt-3">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isInternal}
                            onChange={(e) => setIsInternal(e.target.checked)}
                            disabled={submitting}
                            className="w-4 h-4 rounded border-purple-500/50 text-pink-500 focus:ring-pink-500 focus:ring-offset-[#1a0b2e]"
                        />
                        Internal Note
                    </label>
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {submitting ? 'Sending...' : 'Reply'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketConversation;
