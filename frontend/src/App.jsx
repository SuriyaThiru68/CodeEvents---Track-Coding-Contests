
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { useStore } from './store/useStore';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Upcoming from './pages/Upcoming';
import Attended from './pages/Attended';
import Missed from './pages/Missed';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Playground from './pages/Playground';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import CalendarPage from './pages/Calendar';


const ProtectedRoute = ({ children }) => {
    const user = useStore((state) => state.user);
    console.log('[DEBUG] ProtectedRoute - User State:', user ? 'Authenticated' : 'Not Authenticated');
    if (!user) return <Navigate to="/login" replace />;
    return <Layout>{children}</Layout>;
};

export default function App() {
    console.log('[DEBUG] App rendering...');
    return (
        <Router>
            <Toaster
                position="top-right"
                expand={true}
                richColors
                className="font-sans"
                toastOptions={{
                    className: 'font-sans',
                    style: {
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        fontSize: '13px',
                    }
                }}
            />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Landing />} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/upcoming" element={<ProtectedRoute><Upcoming /></ProtectedRoute>} />
                <Route path="/attended" element={<ProtectedRoute><Attended /></ProtectedRoute>} />
                <Route path="/missed" element={<ProtectedRoute><Missed /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />


                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}
