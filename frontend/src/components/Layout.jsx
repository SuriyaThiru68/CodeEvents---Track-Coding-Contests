
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
    LayoutDashboard,
    Calendar,
    CheckCircle2,
    XCircle,
    StickyNote,
    BarChart3,
    Terminal,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    Plus,
    CalendarDays
} from 'lucide-react';
import { useStore } from '../store/useStore';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link to={path} className="w-full">
        <div className={`sidebar-item flex items-center justify-start gap-4 px-6 w-full ${active ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.5} className={active ? 'text-black' : 'text-gray-400'} />
            <span className={`editorial-subtitle !text-[10px] !tracking-wider ${active ? '!text-black !font-bold' : '!text-gray-400'}`}>
                {label}
            </span>
            {active && (
                <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 w-1 h-6 bg-black rounded-r-full"
                />
            )}
        </div>
    </Link>
);

const Sidebar = ({ isCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useStore();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Upcoming', path: '/upcoming' },
        { icon: CheckCircle2, label: 'Attended', path: '/attended' },
        { icon: XCircle, label: 'Missed', path: '/missed' },
        { icon: StickyNote, label: 'Notes', path: '/notes' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Terminal, label: 'Playground', path: '/playground' },
        { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-screen transition-all duration-700 ease-[0.16,1,0.3,1] border-r border-gray-50 bg-white z-[70] flex flex-col pt-12 pb-10 gap-16 ${isCollapsed ? 'w-0 -translate-x-full' : 'w-72 translate-x-0'}`}
        >
            <div className="px-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-serif text-base shadow-xl shadow-black/20">
                    CE
                </div>
                <span className="font-serif text-2xl tracking-tighter font-black italic">CodeEvents</span>
            </div>

            <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1 pt-10 border-t border-gray-50/50 pb-4">
                <div className="px-10 editorial-subtitle !text-[9px] mb-6 opacity-20 font-black tracking-[0.3em]">Identity Node</div>
                <div className="space-y-1">
                    <SidebarItem icon={User} label="Profile" path="/profile" active={location.pathname === '/profile'} />
                    <button
                        onClick={() => { setUser(null); navigate('/login'); }}
                        className="sidebar-item flex items-center gap-4 px-10 hover:bg-red-50 group transition-all duration-300 w-full text-left"
                    >
                        <LogOut size={18} strokeWidth={1.5} className="text-gray-400 group-hover:text-red-500" />
                        <span className="editorial-subtitle !text-[10px] !text-gray-400 font-bold group-hover:text-red-500">Initialize Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
    const user = useStore(state => state.user);

    const [isCollapsed, setIsCollapsed] = useState(false);

    if (isAuthPage) return children;

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
            <Sidebar isCollapsed={isCollapsed} />
            <main className={`transition-all duration-500 min-h-screen ${isCollapsed ? 'ml-0' : 'ml-72'}`}>
                {/* Global Sync Progress Bar */}
                <AnimatePresence>
                    {useStore(state => state.isLoading) && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100%', opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-0 left-0 right-0 h-1 bg-black z-[100] shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                        />
                    )}
                </AnimatePresence>

                <header className="px-12 py-6 flex justify-between items-center bg-white/60 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-50/50">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-300 text-gray-400 hover:text-black border border-transparent hover:border-gray-100 shadow-sm hover:shadow-md"
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                        <div className="editorial-subtitle !text-[10px] !tracking-[0.4em] opacity-30">
                            {location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD'}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-gray-400 hover:text-black transition-all duration-300 hover:scale-110">
                            <Bell size={18} strokeWidth={1.5} />
                        </button>
                        <Link to="/profile" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-400 shadow-inner group cursor-pointer hover:border-black transition-colors overflow-hidden">
                            {user?.name?.[0] || 'U'}
                        </Link>
                    </div>
                </header>

                <div className="px-12 pb-32">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, scale: 0.99, filtering: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filtering: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.01, filtering: 'blur(10px)' }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
