import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import StatCards from './components/dashboard/StatCards';
import RecentActivity from './components/dashboard/RecentActivity';
import TicketStatusChart from './components/dashboard/TicketStatusChart'; 
import TicketList from './components/tickets/TicketList';
import TicketForm from './components/tickets/TicketForm';
import AgentList from './components/agents/AgentList';
import EscalationList from './components/escalations/EscalationList';

// Support Agent Pages
import AgentDashboard from './pages/support-agent/Dashboard';
import AgentEscalations from './pages/support-agent/Escalations';
import AgentReports from './pages/support-agent/Reports';
import AgentProfile from './pages/support-agent/Profile';
import KnowledgeBase from './pages/support-agent/KnowledgeBase';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/tickets" replace />;
    }
    return children;
};

const RoleBasedDashboard = () => {
    const { role } = useSelector((state) => state.auth);
    if (role === 'ROLE_SUPPORT_AGENT') return <AgentDashboard />;
    return (
        <div className="space-y-6">
            <StatCards />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TicketStatusChart />
                <RecentActivity />
            </div>
        </div>
    );
};

const RoleBasedEscalations = () => {
    const { role } = useSelector((state) => state.auth);
    if (role === 'ROLE_SUPPORT_AGENT') return <AgentEscalations />;
    return <EscalationList />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                    <ProtectedRoute>
                        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#0b071b] to-[#05030a] text-slate-100">
                            <Navbar />
                            
                            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]">
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={
                                        <ProtectedRoute allowedRoles={['ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR']}>
                                            <RoleBasedDashboard />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/tickets" element={<TicketList />} />
                                    <Route path="/create-ticket" element={
                                        <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                                            <TicketForm />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/dashboard/agents" element={
                                        <ProtectedRoute allowedRoles={['ROLE_SUPERVISOR']}>
                                            <AgentList />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/escalations" element={
                                        <ProtectedRoute allowedRoles={['ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR']}>
                                            <RoleBasedEscalations />
                                        </ProtectedRoute>
                                    } />
                                    {/* Support Agent routes */}
                                    <Route path="/reports" element={
                                        <ProtectedRoute allowedRoles={['ROLE_SUPPORT_AGENT']}>
                                            <AgentReports />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/profile" element={
                                        <ProtectedRoute allowedRoles={['ROLE_SUPPORT_AGENT']}>
                                            <AgentProfile />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/knowledge-base" element={
                                        <ProtectedRoute allowedRoles={['ROLE_SUPPORT_AGENT']}>
                                            <KnowledgeBase />
                                        </ProtectedRoute>
                                    } />

                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
