import React, { useState } from 'react';

const KnowledgeBase = () => {
    const [search, setSearch] = useState('');

    const articles = [
        { id: 1, title: 'How to reset customer passwords', category: 'Authentication', content: 'Navigate to the admin portal, search for the user email, and click "Send Reset Link".' },
        { id: 2, title: 'Handling refund requests', category: 'Billing', content: 'Verify the purchase date. If within 30 days, process via Stripe dashboard.' },
        { id: 3, title: 'Troubleshooting login issues', category: 'Authentication', content: 'Ask the user to clear their cache or try an incognito window.' },
        { id: 4, title: 'SLA Guidelines', category: 'Policies', content: 'Critical: 1h, High: 4h, Medium: 24h, Low: 48h. Always prioritize Critical tickets.' }
    ];

    const filtered = articles.filter(a => 
        a.title.toLowerCase().includes(search.toLowerCase()) || 
        a.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 mt-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Knowledge Base (Static)
            </h2>
            
            <div className="bg-[#160b2b]/60 backdrop-blur-xl p-6 rounded-3xl border border-purple-500/20 shadow-lg">
                <input 
                    type="text" 
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 bg-[#0b071b]/80 border border-purple-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 text-white rounded-xl transition-all duration-300 outline-none mb-6"
                />

                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No articles found.</p>
                    ) : (
                        filtered.map(article => (
                            <div key={article.id} className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl hover:border-purple-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                                    <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/30">
                                        {article.category}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm">{article.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;
