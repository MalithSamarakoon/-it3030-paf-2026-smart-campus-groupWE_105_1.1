import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addComment, updateComment, deleteComment } from '../../api/ticketApi';

const CommentSection = ({ ticketId, comments = [], currentUser, onRefresh }) => {
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(false);

    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            await addComment(ticketId, { content: newComment.trim() });
            setNewComment('');
            toast.success('Comment added');
            onRefresh?.();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (commentId) => {
        if (!editContent.trim()) return;
        setLoading(true);
        try {
            await updateComment(ticketId, commentId, { content: editContent.trim() });
            setEditingId(null);
            setEditContent('');
            toast.success('Comment updated');
            onRefresh?.();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await deleteComment(ticketId, commentId);
            toast.success('Comment deleted');
            onRefresh?.();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete comment');
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                💬 Comments
                <span className="text-sm font-normal text-slate-400">({comments.length})</span>
            </h3>

            {/* Comment List */}
            <div className="space-y-4 mb-6">
                {comments.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-6 bg-slate-50 rounded-xl">No comments yet. Be the first to comment!</p>
                )}
                {comments.map((comment) => {
                    const isOwner = currentUser?.id === comment.authorId;
                    const canEdit = isOwner;
                    const canDelete = isOwner || isAdmin;

                    return (
                        <div key={comment.id} className="bg-slate-50 rounded-xl p-4 group">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-emerald-700">
                                            {comment.authorUsername?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-700">{comment.authorUsername}</span>
                                        <span className="text-[10px] text-slate-400 ml-2">{formatDate(comment.createdAt)}</span>
                                        {comment.updatedAt !== comment.createdAt && (
                                            <span className="text-[10px] text-slate-400 ml-1">(edited)</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {(canEdit || canDelete) && editingId !== comment.id && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {canEdit && (
                                            <button
                                                onClick={() => startEdit(comment)}
                                                className="px-2 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Content or Edit Mode */}
                            {editingId === comment.id ? (
                                <div className="mt-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm resize-none"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleUpdate(comment.id)}
                                            disabled={loading}
                                            className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => { setEditingId(null); setEditContent(''); }}
                                            className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600 leading-relaxed ml-9">{comment.content}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Comment Form */}
            {currentUser && (
                <form onSubmit={handleAdd} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-white">
                            {currentUser.username?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-grow">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                            placeholder="Add a comment..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm resize-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className={`mt-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all active:scale-95 ${
                                loading || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CommentSection;
