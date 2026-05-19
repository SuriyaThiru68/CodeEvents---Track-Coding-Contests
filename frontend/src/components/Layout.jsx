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
    CalendarDays,
    Brain
} from 'lucide-react';
import { useStore } from '../store/useStore';


const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link to={path} className="w-full block px-4">
        <div className={`sidebar-item relative flex items-center justify-start gap-3 px-4 w-full ${active ? 'active' : ''}`}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} className={active ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'} />
            <span className={`text-sm font-semibold tracking-normal ${active ? 'text-black font-semibold' : 'text-[#7C7872] group-hover:text-white transition-colors'}`}>
                {label}
            </span>
            {active && (
                <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute right-4 w-2 h-2 bg-black rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
        </div>
    </Link>
);

const SectionLabel = ({ label }) => (
    <div className="px-6 pt-6 pb-2">
        <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">{label}</span>
    </div>
);

const Sidebar = ({ isCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useStore();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Upcoming', path: '/upcoming' },
        { icon: CheckCircle2, label: 'Attended', path: '/attended' },
        { icon: XCircle, label: 'Missed', path: '/missed' },
        { icon: StickyNote, label: 'Notes', path: '/notes' },
        { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
    ];

    const toolItems = [
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Brain, label: 'AI Analytics', path: '/ai-analytics' },
        { icon: Terminal, label: 'Playground', path: '/playground' },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-screen transition-all duration-700 ease-[0.16,1,0.3,1] border-r border-[#EAE5DC]/10 z-[70] flex flex-col pt-8 pb-8 overflow-hidden bg-[#09090b] ${isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-64 opacity-100'}`}
        >
            {/* Logo */}
            <div className="px-6 flex items-center gap-3 mb-10 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4BB8FA] to-[#0F9BF2] rounded-xl flex items-center justify-center text-black font-bold text-sm flex-shrink-0 shadow-lg shadow-[#4BB8FA]/20">
                    CE
                </div>
                <span className="font-sans text-xl tracking-tight font-bold text-white whitespace-nowrap">
                    Code<span className="text-[#4BB8FA]">Events</span>
                </span>
            </div>

            {/* Scrollable Nav */}
            <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <SectionLabel label="Navigation" />
                <div className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </div>

                <SectionLabel label="Tools" />
                <div className="space-y-1 px-2">
                    {toolItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-1 pt-6 border-t border-[#EAE5DC]/10 flex-shrink-0">
                <SectionLabel label="Account" />
                <div className="px-2">
                    <SidebarItem icon={User} label="Profile" path="/profile" active={location.pathname === '/profile'} />
                    <button
                        onClick={() => { setUser(null); navigate('/login'); }}
                        className="sidebar-item relative flex items-center gap-3 px-4 hover:bg-red-500/10 group transition-all duration-300 w-full text-left mt-1"
                    >
                        <LogOut size={20} strokeWidth={1.8} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
                        <span className="text-sm font-semibold tracking-normal text-zinc-400 group-hover:text-red-400 transition-colors">
                            Sign Out
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default function LayoutWrapper({ children }) {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
    const user = useStore(state => state.user);

    const [isCollapsed, setIsCollapsed] = useState(false);

    if (isAuthPage) return children;

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-[#4BB8FA] selection:text-black">
            <Sidebar isCollapsed={isCollapsed} />
            <main className={`transition-all duration-700 ease-[0.16,1,0.3,1] min-h-screen ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
                {/* Global Sync Progress Bar */}
                <AnimatePresence>
                    {useStore(state => state.isLoading) && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100%', opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4BB8FA] to-[#0F9BF2] z-[100] shadow-lg shadow-[#4BB8FA]/20"
                        />
                    )}
                </AnimatePresence>

                <header className="px-8 py-6 flex justify-between items-center bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#EAE5DC]/10">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-all duration-300 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700 cursor-pointer"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                        <div className="text-sm font-bold tracking-wider uppercase text-zinc-400">
                            {location.pathname.replace('/', '').toUpperCase() || 'Dashboard'}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer">
                            <Bell size={20} strokeWidth={1.8} />
                        </button>
                        <Link to="/profile" className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4BB8FA] to-[#0F9BF2] flex items-center justify-center font-bold text-xs text-black shadow-md shadow-[#4BB8FA]/20 group cursor-pointer hover:shadow-[#4BB8FA]/40 transition-all border border-[#4BB8FA]/30">
                            {user?.name?.[0] || 'U'}
                        </Link>
                    </div>
                </header>

                <div className="px-8 py-8 pb-32">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export { LayoutWrapper as Layout };
