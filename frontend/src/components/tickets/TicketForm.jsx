import React, { useState } from 'react';
import { ticketService } from '../../services/ticketService';

const TicketForm = ({ onTicketCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('MEDIUM'); 
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            setError('Title is required');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMsg('');

        try {
            const ticketData = { title, description, category, priority };
            const newTicket = await ticketService.createTicket(ticketData);
            
            setSuccessMsg(`Ticket #${newTicket.id} created successfully!`);
            
            setTitle('');
            setDescription('');
            setCategory('');
            setPriority('MEDIUM');

            if (onTicketCreated) onTicketCreated();
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 bg-[#160b2b]/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.1)] max-w-2xl mx-auto mt-6">
            <h2 className="mb-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 border-b border-purple-500/30 pb-4 drop-shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                Submit a Support Ticket
            </h2>
            
            {error && <div className="mb-6 p-4 text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold">{error}</div>}
            {successMsg && <div className="mb-6 p-4 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold">{successMsg}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-cyan-300 tracking-wide">Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full p-3 bg-[#0b071b]/80 border border-purple-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 text-white placeholder-purple-300/40 shadow-inner"
                        placeholder="Brief summary of the issue"
                        required 
                    />
                </div>
                
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-cyan-300 tracking-wide">Category</label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 bg-[#0b071b]/80 border border-purple-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 text-white placeholder-purple-300/40 shadow-inner"
                        required
                    >
                        <option value="" className="bg-[#1a0b2e] text-slate-300">Select a category</option>
                        <option value="Network" className="bg-[#1a0b2e] text-slate-300">Network</option>
                        <option value="Hardware" className="bg-[#1a0b2e] text-slate-300">Hardware</option>
                        <option value="Software" className="bg-[#1a0b2e] text-slate-300">Software</option>
                    </select>
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-cyan-300 tracking-wide">Priority</label>
                    <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-3 bg-[#0b071b]/80 border border-purple-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 text-white placeholder-purple-300/40 shadow-inner"
                    >
                        <option value="LOW" className="bg-[#1a0b2e] text-emerald-400">Low</option>
                        <option value="MEDIUM" className="bg-[#1a0b2e] text-blue-400">Medium</option>
                        <option value="HIGH" className="bg-[#1a0b2e] text-yellow-400">High</option>
                        <option value="CRITICAL" className="bg-[#1a0b2e] text-rose-400">Critical</option>
                    </select>
                </div>
                
                <div className="mb-8">
                    <label className="block mb-2 text-sm font-semibold text-cyan-300 tracking-wide">Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Describe the issue in detail (steps to reproduce)..."
                        className="w-full p-3 bg-[#0b071b]/80 border border-purple-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 text-white placeholder-purple-300/40 shadow-inner h-32"
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full p-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-300 border ${
                        isSubmitting 
                        ? 'bg-slate-700/50 text-slate-400 border-slate-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400/50 shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] hover:scale-[1.02]'
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </form>
        </div>
    );
};

export default TicketForm;