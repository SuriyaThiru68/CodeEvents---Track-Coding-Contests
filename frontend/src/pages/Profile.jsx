
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    Database,
    ShieldCheck,
    Save,
    Code2,
    Smartphone,
    CheckCircle2,
    Trash2,
    ArrowUpRight,
    Loader2,
    Mail
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

export default function Profile() {
    const { user, setUser, stats, profileImage, setProfileImage, userProfiles, getTotalSolved, emailDigest, toggleEmailDigest } = useStore();
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: 'Competitive programmer focused on high-performance algorithms and system design.',
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || 'User',
                email: user.email || 'user@example.com'
            }));
        }
    }, [user]);

    const totalSolved = getTotalSolved?.() || 0;

    const handleSave = () => {
        setUser({ ...user, ...formData });
        toast.success('System parameters updated');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                toast.success('New profile visual synced');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-16 pt-12"
        >
            <header className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.5, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="editorial-subtitle text-zinc-500"
                >
                    User Management Console
                </motion.div>
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="editorial-title uppercase text-white"
                    >
                        Profile <br /><span className="italic opacity-30 text-white">Identity.</span>
                    </motion.h1>
                    <div className="flex gap-2 p-1 bg-zinc-900 rounded-full border border-zinc-800">
                        {['info', 'accounts', 'analytics', 'security'].map((tab, idx) => (
                            <motion.button
                                key={tab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.05) }}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {tab}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <aside className="lg:col-span-4 space-y-8">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="card-minimal p-10 flex flex-col items-center text-center relative overflow-hidden border-zinc-900"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-zinc-800 rounded-bl-full -mr-4 -mt-4" />

                        <div className="w-32 h-32 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center font-serif text-5xl text-zinc-700 mb-8 relative group overflow-hidden shadow-inner">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                formData.name?.[0]?.toUpperCase() || 'U'
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                <Settings className="text-white" size={20} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <h3 className="text-2xl font-serif mb-1 text-white">{formData.name}</h3>
                        <p className="editorial-subtitle !text-zinc-500 mb-10">{formData.email}</p>

                        <div className="w-full grid grid-cols-3 gap-4 pt-8 border-t border-zinc-900 relative z-10">
                            <StatColumn label="Rank" value="#1.2k" />
                            <StatColumn label="Solved" value={totalSolved} />
                            <StatColumn label="Streak" value={stats?.currentStreak || 0} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card-minimal !bg-zinc-900 border-zinc-800 text-white p-10 group"
                    >
                        <h4 className="editorial-subtitle !text-zinc-600 mb-8 flex items-center gap-2 group-hover:text-zinc-400 transition-colors">
                            System Nodes
                        </h4>
                        <div className="space-y-6">
                            {userProfiles && Object.entries(userProfiles).map(([platform, data]) => (
                                <div key={platform} className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                                    <span className="editorial-subtitle !text-zinc-500 group-hover/item:text-zinc-300">{platform}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${data.username ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/10'}`} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-20">{data.username ? 'Online' : 'Offline'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setActiveTab('accounts')}
                            className="w-full mt-10 py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
                        >
                            Manage Nodes
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card-minimal p-10 space-y-8 border-zinc-900"
                    >
                        <h4 className="editorial-subtitle !text-white mb-2">Preferences</h4>
                        <div className="space-y-6">
                            <Toggle label="Notifications" active={true} />
                            <Toggle label="Email Digest" active={emailDigest} onToggle={toggleEmailDigest} />
                        </div>
                    </motion.div>
                </aside>

                <main className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {activeTab === 'info' && (
                                <section className="card-minimal p-12 space-y-12 border-zinc-900">
                                    <h3 className="text-3xl font-serif italic text-zinc-700 leading-none">Personal Details</h3>
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="editorial-subtitle !text-white font-black">Display Name</label>
                                                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-minimal !bg-zinc-950/50 border-zinc-900 text-white" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="editorial-subtitle !text-white font-black">Email Address</label>
                                                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-minimal !bg-zinc-950/50 border-zinc-900 text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="editorial-subtitle !text-white font-black">Professional Bio</label>
                                            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="input-minimal h-40 resize-none !bg-zinc-950/50 border-zinc-900 text-white" />
                                        </div>
                                        <div className="pt-6 flex gap-4">
                                            <motion.button
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSave}
                                                className="btn-black shadow-lg shadow-black/40"
                                            >
                                                <Save size={16} /> Update Identity
                                            </motion.button>
                                            <motion.button
                                                whileTap={{ scale: 0.98 }}
                                                onClick={async () => {
                                                    const loadingToast = toast.loading('Dispatching test transmission...');
                                                    try {
                                                        const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://codeevents-tracking.onrender.com';
                                                        const res = await fetch(`${BACKEND_URL}/api/reminders/test-email/${formData.email}`);
                                                        if (res.ok) {
                                                            toast.success('Test email dispatched to ' + formData.email, { id: loadingToast });
                                                        } else {
                                                            toast.error('Transmission failure', { id: loadingToast });
                                                        }
                                                    } catch (err) {
                                                        toast.error('Uplink error', { id: loadingToast });
                                                    }
                                                }}
                                                className="px-8 py-4 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all flex items-center gap-3 text-white"
                                            >
                                                <Mail size={14} /> Send Test Mail
                                            </motion.button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'accounts' && (
                                <section className="space-y-12">
                                    <div className="card-minimal p-12 space-y-12 border-zinc-900">
                                        <h3 className="text-3xl font-serif italic text-zinc-700 leading-none">Connected Platforms</h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <SocialLink icon={Code2} name="Codeforces" platform="codeforces" />
                                            <SocialLink icon={Smartphone} name="LeetCode" platform="leetcode" />
                                            <SocialLink icon={CheckCircle2} name="AtCoder" platform="atcoder" />
                                            <SocialLink icon={Code2} name="CodeChef" platform="codechef" />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'analytics' && (
                                <section className="card-minimal p-12 space-y-16 border-zinc-900">
                                    <h3 className="text-3xl font-serif italic text-zinc-700 leading-none">Performance Overview</h3>
                                    <div className="space-y-12">
                                        <ProgressRow label="Codeforces" value={userProfiles.codeforces?.rating || 0} max={3000} />
                                        <ProgressRow label="LeetCode" value={userProfiles.leetcode?.solved || 0} max={1500} />
                                        <ProgressRow label="CodeChef" value={userProfiles.codechef?.rating || 0} max={3000} />
                                        <ProgressRow label="AtCoder" value={userProfiles.atcoder?.rating || 0} max={3000} />
                                    </div>

                                    <div className="pt-12 border-t border-zinc-900">
                                        <div className="editorial-subtitle text-center mb-8 text-zinc-500">Activity Pulse</div>
                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                            {stats?.activityData?.map((val, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.001 }}
                                                    className={`w-3.5 h-3.5 rounded-sm ${val === 0 ? 'bg-zinc-900' :
                                                        val === 1 ? 'bg-white/10' :
                                                            val === 2 ? 'bg-white/30' :
                                                                val === 3 ? 'bg-white/60' : 'bg-white'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'security' && (
                                <section className="card-minimal p-12 space-y-12 border-zinc-900">
                                    <h3 className="text-3xl font-serif italic text-zinc-700 leading-none">Access Control</h3>
                                    <div className="space-y-10">
                                        <div className="p-8 bg-zinc-900 rounded-2xl flex items-center justify-between border border-zinc-800">
                                            <div className="space-y-1">
                                                <div className="text-sm font-bold uppercase tracking-widest text-white">Active Session</div>
                                                <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.2em]">Verified Node • System Terminal</div>
                                            </div>
                                            <ShieldCheck className="text-green-500" size={24} strokeWidth={1.5} />
                                        </div>

                                        <div className="max-w-md space-y-8">
                                            <div className="space-y-3">
                                                <label className="editorial-subtitle !text-white font-black">New Access Key</label>
                                                <input type="password" placeholder="At least 12 symbols" className="input-minimal !bg-zinc-950/50 border-zinc-900 text-white" />
                                            </div>
                                            <button className="btn-black shadow-lg shadow-black/40">
                                                Rotate Security Keys
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <section className="mt-12 p-10 border border-red-950/30 rounded-[40px] bg-red-950/10 flex justify-between items-center group cursor-pointer hover:bg-black transition-all duration-700"
                        onClick={() => {
                            if (window.confirm("Perform system wipe? This identity will be permanently deleted.")) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                    >
                        <div className="space-y-2">
                            <h4 className="text-2xl font-serif text-red-500 group-hover:text-white transition-colors italic">Danger Zone</h4>
                            <p className="editorial-subtitle !text-[10px] text-red-900/40 group-hover:text-white/40 transition-colors uppercase tracking-[0.2em]">Permanently terminate this node and all associated data.</p>
                        </div>
                        <Trash2 className="text-red-500 group-hover:text-white transition-colors" size={24} strokeWidth={1.5} />
                    </section>
                </main>
            </div>
        </motion.div>
    );
}

const StatColumn = ({ label, value }) => (
    <div className="text-center group/stat">
        <div className="text-3xl font-serif mb-1 group-hover/stat:scale-110 transition-transform text-white">{value}</div>
        <div className="editorial-subtitle !text-[9px] opacity-40 group-hover/stat:opacity-100 text-zinc-500">{label}</div>
    </div>
);

const ProgressRow = ({ label, value, max }) => (
    <div className="space-y-4 group/progress">
        <div className="flex justify-between items-end">
            <span className="editorial-subtitle !text-white font-black opacity-40 group-hover/progress:opacity-80 transition-opacity uppercase tracking-widest">{label}</span>
            <span className="text-xs font-black tracking-tighter text-white">{value} / {max}</span>
        </div>
        <div className="h-1 w-full bg-zinc-900 overflow-hidden rounded-full">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="h-full bg-white"
            />
        </div>
    </div>
);

const Toggle = ({ label, active, onToggle }) => (
    <div className="flex justify-between items-center cursor-pointer group" onClick={() => onToggle && onToggle()}>
        <span className="editorial-subtitle !text-white/50 group-hover:!text-white transition-all font-black uppercase tracking-widest">{label}</span>
        <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${active ? 'bg-white' : 'bg-zinc-800'}`}>
            <motion.div
                animate={{ x: active ? 22 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-black rounded-full shadow-sm"
            />
        </div>
    </div>
);

const SocialLink = ({ icon: Icon, name, platform }) => {
    const { userProfiles, updateProfile, syncPlatform } = useStore();
    const profile = userProfiles?.[platform] || { username: '', rating: 0 };
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        if (!profile.username) return toast.error("Identifier required.");
        setIsSyncing(true);
        try {
            await syncPlatform(platform);
            toast.success(`Syncing Node: ${name}`);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="card-minimal p-10 group hover:bg-zinc-900/50 relative overflow-hidden border-zinc-900">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-all duration-700 opacity-50" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="p-5 bg-zinc-900 rounded-3xl group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-sm border border-zinc-800">
                        <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-serif italic text-white">{name}</h4>
                        <div className="editorial-subtitle !text-[10px] mt-1 uppercase tracking-[0.2em] font-black opacity-30 group-hover:opacity-100 transition-opacity text-zinc-500">
                            {profile.username ? 'Encrypted Connection' : 'Disconnected'}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto items-center">
                    <input
                        value={profile.username}
                        onChange={(e) => updateProfile(platform, { username: e.target.value })}
                        placeholder="Node Identifier"
                        className="input-minimal !py-3 !text-xs !bg-black border-zinc-800 focus:shadow-lg focus:shadow-white/5 w-full md:w-64 text-white"
                    />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={isSyncing}
                        className="btn-black !h-12 !px-8 !text-[10px] !tracking-[0.3em] font-black whitespace-nowrap shadow-xl shadow-black/40 flex items-center gap-3"
                        onClick={handleSync}
                    >
                        {isSyncing ? <Loader2 className="animate-spin" size={14} /> : 'Sync Node'}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
