
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
    Bell
} from 'lucide-react';
import { useStore } from '../store/useStore';

const SidebarItem = ({ icon: Icon, label, path, collapsed, active }) => (
    <Link to={path}>
        <motion.div
            whileHover={{ backgroundColor: '#000', color: '#fff' }}
            className={`flex items-center gap-4 p-4 cursor-pointer transition-colors border-b-2 border-[#000] ${active ? 'bg-[#000] text-[#fff]' : 'bg-[#fff] text-[#000]'
                }`}
        >
            <Icon size={24} />
            {!collapsed && (
                <span className="font-black uppercase tracking-tighter text-sm">{label}</span>
            )}
        </motion.div>
    </Link>
);

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useStore();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Upcoming', path: '/upcoming' },
        { icon: CheckCircle2, label: 'Attended', path: '/attended' },
        { icon: XCircle, label: 'Missed', path: '/missed' },
        { icon: StickyNote, label: 'Notes', path: '/notes' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Terminal, label: 'Playground', path: '/playground' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ];


    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 260 }}
            className="fixed left-0 top-0 h-screen border-r-4 border-[#000] bg-[#fff] z-[70] hidden md:flex flex-col"
        >
            <div className="p-6 border-b-4 border-[#000] flex justify-between items-center bg-[#000] text-[#fff]">
                {!collapsed && <span className="font-black text-2xl tracking-tighter italic font-serif">CE_</span>}
                <button onClick={() => setCollapsed(!collapsed)} className="hover:scale-110 transition-transform">
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        {...item}
                        collapsed={collapsed}
                        active={location.pathname === item.path}
                    />
                ))}
            </div>

            <div className="mt-auto border-t-4 border-[#000]">
                <SidebarItem
                    icon={User}
                    label="My Profile"
                    path="/profile"
                    collapsed={collapsed}
                    active={location.pathname === '/profile'}
                />
                <button
                    onClick={() => { setUser(null); navigate('/login'); }}
                    className="w-full flex items-center gap-4 p-4 cursor-pointer transition-colors bg-red-500 text-[#fff] hover:bg-[#000] group"
                >
                    <LogOut size={24} className="group-hover:rotate-12 transition-transform" />
                    {!collapsed && <span className="font-black uppercase tracking-tighter text-sm">Kill System</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) return children;

    return (
        <div className="min-h-screen bg-[#f5f5f7] text-[#000] font-sans">
            <Sidebar />
            <main className="md:ml-[260px] md:pl-4 transition-all duration-300 min-h-screen relative">
                {/* Grid Overlay for Background */}
                <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
                    <div className="h-full w-full grid grid-cols-4 border-[#000] border-x">
                        <div className="border-r border-[#000]" />
                        <div className="border-r border-[#000]" />
                        <div className="border-r border-[#000]" />
                    </div>
                </div>

                <header className="sticky top-0 z-50 bg-[#f5f5f7]/80 backdrop-blur-md border-b-4 border-[#000] p-6 flex justify-between items-center">
                    <div className="font-black uppercase italic tracking-tighter md:hidden">CodeEvents_</div>
                    <div className="hidden md:block" />
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => toast.info('System Check: All modules are operational. No new alerts.')}
                            className="relative hover:scale-110 transition-transform"
                        >
                            <Bell size={24} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#fff]" />
                        </button>
                        <Link
                            to="/profile"
                            className="w-10 h-10 border-2 border-[#000] bg-yellow-400 flex items-center justify-center font-black cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                        >
                            {useStore.getState().profileImage ? (
                                <img src={useStore.getState().profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                useStore.getState().user?.username?.[0]?.toUpperCase() || 'U'
                            )}
                        </Link>
                    </div>
                </header>


                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 p-6 md:p-12 pb-24"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};
