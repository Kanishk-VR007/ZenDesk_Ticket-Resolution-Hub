import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { fullName, role } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout()); 
        navigate('/login'); 
    };

    return (
        <nav className="bg-[#0b071b] text-white shadow-[0_4px_20px_rgba(255,0,127,0.15)] border-b border-purple-500/20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                            ZenDesk Hub
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {role === 'ROLE_CUSTOMER' && (
                            <>
                                <Link to="/tickets" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">My Tickets</Link>
                                <Link to="/create-ticket" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">New Ticket</Link>
                            </>
                        )}
                        {role === 'ROLE_SUPPORT_AGENT' && (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">Dashboard</Link>
                                <Link to="/tickets" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">My Tickets</Link>
                                <Link to="/escalations" className="text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors duration-300">Escalations</Link>
                                <Link to="/knowledge-base" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors duration-300">Knowledge Base</Link>
                                <Link to="/reports" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-300">Reports</Link>
                                <Link to="/profile" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-300">Profile</Link>
                            </>
                        )}
                        {role === 'ROLE_SUPERVISOR' && (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">Dashboard</Link>
                                <Link to="/tickets" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">All Tickets</Link>
                                <Link to="/dashboard/agents" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">Agent Workload</Link>
                                <Link to="/escalations" className="text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors duration-300">System Escalations</Link>
                            </>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium border-r pr-4 border-purple-500/30 text-cyan-300">
                            Welcome, <span className="text-white">{fullName}</span>
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="bg-transparent border border-pink-500/50 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 shadow-[0_0_10px_rgba(236,72,153,0.1)] hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] text-white"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;