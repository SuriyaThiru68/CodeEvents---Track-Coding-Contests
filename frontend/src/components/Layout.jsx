
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
            className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 relative group ${active ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
        >
            <Icon size={20} strokeWidth={1.5} />
            {!collapsed && (
                <span className="font-medium tracking-wide text-xs uppercase font-sans relative z-10">{label}</span>
            )}
            {active && !collapsed && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-black rounded-r-full"
                />
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
            animate={{ width: collapsed ? 80 : 280 }}
            className="fixed left-0 top-0 h-screen border-r border-gray-100 bg-white z-[70] hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >
            <div className="p-8 flex justify-between items-center bg-white">
                {!collapsed && <span className="font-serif text-2xl tracking-tight text-black">CodeEvents<span className="text-xs font-sans tracking-widest ml-1 text-gray-400">Dashboard</span></span>}
                <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-50">
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        {...item}
                        collapsed={collapsed}
                        active={location.pathname === item.path}
                    />
                ))}
            </div>

            <div className="mt-auto p-4 border-t border-gray-50">
                <SidebarItem
                    icon={User}
                    label="My Profile"
                    path="/profile"
                    collapsed={collapsed}
                    active={location.pathname === '/profile'}
                />
                <button
                    onClick={() => { setUser(null); navigate('/login'); }}
                    className="w-full flex items-center gap-4 p-4 cursor-pointer text-gray-400 hover:text-[#2563eb] transition-colors group"
                >
                    <LogOut size={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                    {!collapsed && <span className="font-medium uppercase tracking-wide text-xs">Sign Out</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const theme = useStore(state => state.theme);
    const profileImage = useStore(state => state.profileImage);
    const user = useStore(state => state.user);

    if (isAuthPage) return children;

    return (
        <div className={`min-h-screen text-gray-900 font-sans selection:bg-black selection:text-white ${theme === 'dark' ? 'dark' : ''}`}>
            <Sidebar />
            <main className={`md:ml-[280px] transition-all duration-300 min-h-screen relative ${theme === 'dark' ? 'bg-[#071226] text-gray-100' : 'bg-white'}`}>

                <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-50 px-8 py-5 flex justify-between items-center">
                    <div className="font-serif text-xl tracking-tight md:hidden">CodeEvents</div>
                    <div className="hidden md:block text-xs font-medium text-gray-400 uppercase tracking-widest">{location.pathname.replace('/', '')}</div>

                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => toast.info('System operational')}
                            className="relative hover:text-black text-gray-400 transition-colors"
                        >
                            <Bell size={20} strokeWidth={1.5} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2563eb] rounded-full ring-2 ring-white" />
                        </button>
                        <Link
                            to="/profile"
                            className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden hover:border-gray-300 transition-colors"
                        >
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-medium text-gray-500">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                            )}
                        </Link>
                    </div>
                </header>


                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};
