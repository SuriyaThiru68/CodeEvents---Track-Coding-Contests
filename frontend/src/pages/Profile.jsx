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
import { updatePreferencesToDb } from '../services/api';

export default function Profile() {
    const { user, setUser, stats, profileImage, setProfileImage, userProfiles, getTotalSolved, emailDigest, toggleEmailDigest } = useStore();
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        alertPreference: 'email',
        bio: 'Competitive programmer focused on high-performance algorithms and system design.',
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || 'User',
                email: user.email || 'user@example.com',
                phoneNumber: user.phoneNumber || '',
                alertPreference: user.alertPreference || 'email'
            }));
        }
    }, [user]);

    const totalSolved = getTotalSolved?.() || 0;

    const handleSave = async () => {
        try {
            const res = await updatePreferencesToDb({
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                alertPreference: formData.alertPreference
            });
            if (res.user) {
                setUser({ ...user, ...res.user });
                toast.success('System parameters updated');
            }
        } catch (e) {
            toast.error('Failed to update parameters');
        }
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
            className="max-w-6xl mx-auto space-y-16 pt-6 text-[#fafafa]"
        >
            <header className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.5, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35"
                >
                    Profile Management
                </motion.div>
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl font-light uppercase tracking-tighter text-white"
                    >
                        User <br /><span className="text-white/35 font-normal">Profile.</span>
                    </motion.h1>
                    <div className="flex gap-2 p-1 bg-[#121215] rounded-full border border-white/5 shadow-sm">
                        {['info', 'accounts', 'analytics', 'security'].map((tab, idx) => (
                            <motion.button
                                key={tab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.05) }}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab ? 'bg-white text-black shadow-lg font-semibold' : 'text-white/40 hover:text-white'}`}
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
                        className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center text-center relative overflow-hidden shadow-sm"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full -mr-4 -mt-4" />

                        <div className="w-32 h-32 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-5xl text-white/20 mb-8 relative group overflow-hidden shadow-inner">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                formData.name?.[0]?.toUpperCase() || 'U'
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                <Settings className="text-white" size={20} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <h3 className="text-2xl font-light mb-1 text-white">{formData.name}</h3>
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-10">{formData.email}</p>

                        <div className="w-full grid grid-cols-3 gap-4 pt-8 border-t border-white/5 relative z-10">
                            <StatColumn label="Rank" value="#1.2k" />
                            <StatColumn label="Solved" value={totalSolved} />
                            <StatColumn label="Streak" value={stats?.currentStreak || 0} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-[2.5rem] text-black p-10 group shadow-lg shadow-white/5"
                    >
                        <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/35 mb-8 group-hover:text-black/60 transition-colors">
                            Connected Accounts
                        </h4>
                        <div className="space-y-6">
                            {userProfiles && Object.entries(userProfiles).map(([platform, data]) => (
                                <div key={platform} className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/50 group-hover/item:text-black/80">{platform}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${data.username ? 'bg-black shadow-[0_0_8px_rgba(0,0,0,0.6)]' : 'bg-black/10'}`} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter text-black/25">{data.username ? 'Linked' : 'No Link'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setActiveTab('accounts')}
                            className="w-full mt-10 py-4 border border-black/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 hover:bg-black hover:text-white hover:border-black transition-all duration-500 font-semibold"
                        >
                            Manage Accounts
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-sm"
                    >
                        <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">Preferences</h4>
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
                                <section className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-12 space-y-12 shadow-sm">
                                    <h3 className="text-3xl font-light text-white/40 leading-none">Personal Info</h3>
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Name</label>
                                                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] focus:border-white/20 outline-none transition-all placeholder:text-white/20 text-white" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Email</label>
                                                <input value={formData.email} disabled className="w-full px-6 py-4 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] outline-none transition-all text-white/50 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Phone Number (WhatsApp)</label>
                                                <input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="+1234567890" className="w-full px-6 py-4 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] focus:border-white/20 outline-none transition-all placeholder:text-white/20 text-white" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Alert Preference</label>
                                                <select 
                                                    value={formData.alertPreference} 
                                                    onChange={(e) => setFormData({ ...formData, alertPreference: e.target.value })}
                                                    className="w-full px-6 py-4 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] focus:border-white/20 outline-none transition-all text-white appearance-none cursor-pointer"
                                                >
                                                    <option value="email">Email Only</option>
                                                    <option value="whatsapp">WhatsApp Only</option>
                                                    <option value="both">Both Email & WhatsApp</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Bio</label>
                                            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-6 py-4 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] focus:border-white/20 outline-none transition-all placeholder:text-white/20 text-white h-40 resize-none font-medium" />
                                        </div>
                                        <div className="pt-6 flex flex-col md:flex-row gap-4">
                                            <motion.button
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSave}
                                                className="px-8 py-4 bg-white hover:bg-white/85 text-black font-semibold rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-white/5"
                                            >
                                                <Save size={16} /> Save Changes
                                            </motion.button>
                                            <motion.button
                                                whileTap={{ scale: 0.98 }}
                                                onClick={async () => {
                                                    const loadingToast = toast.loading('Sending test email...');
                                                    try {
                                                        const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://codeevents-tracking.onrender.com';
                                                        const res = await fetch(`${BACKEND_URL}/api/reminders/test-email/${formData.email}`);
                                                        if (res.ok) {
                                                            toast.success('Test email sent to ' + formData.email, { id: loadingToast });
                                                        } else {
                                                            toast.error('Failed to send', { id: loadingToast });
                                                        }
                                                    } catch (err) {
                                                        toast.error('Error', { id: loadingToast });
                                                    }
                                                }}
                                                className="px-8 py-4 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-white"
                                            >
                                                <Mail size={14} /> Send Test Mail
                                            </motion.button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'accounts' && (
                                <section className="space-y-12">
                                    <div className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-12 space-y-12 shadow-sm">
                                        <h3 className="text-3xl font-light text-white/40 leading-none">Connected Platforms</h3>
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
                                <section className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-12 space-y-16 shadow-sm">
                                    <h3 className="text-3xl font-light text-white/40 leading-none">Performance Overview</h3>
                                    <div className="space-y-12">
                                        <ProgressRow label="Codeforces" value={userProfiles.codeforces?.rating || 0} max={3000} />
                                        <ProgressRow label="LeetCode" value={userProfiles.leetcode?.solved || 0} max={1500} />
                                        <ProgressRow label="CodeChef" value={userProfiles.codechef?.rating || 0} max={3000} />
                                        <ProgressRow label="AtCoder" value={userProfiles.atcoder?.rating || 0} max={3000} />
                                    </div>

                                    <div className="pt-12 border-t border-white/5">
                                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-center mb-8 text-white/35">Activity Heatmap</div>
                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                            {stats?.activityData?.map((val, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.001 }}
                                                    className={`w-3.5 h-3.5 rounded-sm ${val === 0 ? 'bg-white/5' :
                                                        val === 1 ? 'bg-white/15' :
                                                            val === 2 ? 'bg-white/40' :
                                                                val === 3 ? 'bg-white/70' : 'bg-white'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'security' && (
                                <section className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-12 space-y-12 shadow-sm">
                                    <h3 className="text-3xl font-light text-white/40 leading-none">Access Control</h3>
                                    <div className="space-y-10">
                                        <div className="p-8 bg-[#09090b] border border-white/5 rounded-2xl flex items-center justify-between shadow-lg shadow-white/5">
                                            <div className="space-y-1">
                                                <div className="text-sm font-bold uppercase tracking-widest text-white">Active Session</div>
                                                <div className="text-[10px] text-white/40 font-medium uppercase tracking-[0.2em]">Verified • Professional Terminal</div>
                                            </div>
                                            <ShieldCheck className="text-white" size={24} strokeWidth={1.5} />
                                        </div>

                                        <div className="max-w-md space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">New Password</label>
                                                <input type="password" placeholder="At least 12 symbols" className="w-full px-6 py-4 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] focus:border-white/20 outline-none transition-all placeholder:text-white/20 text-white" />
                                            </div>
                                            <button className="px-8 py-4 bg-white hover:bg-white/85 text-black font-semibold rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-white/5">
                                                Update Security Keys
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <section className="mt-12 p-10 border border-white/10 rounded-[2.5rem] bg-white/[0.02] flex flex-col md:flex-row justify-between items-center group cursor-pointer hover:bg-red-950 hover:border-red-500/30 transition-all duration-700 gap-6"
                        onClick={() => {
                            if (window.confirm("Delete profile? This will delete all your local data permanently.")) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                    >
                        <div className="space-y-2 text-center md:text-left">
                            <h4 className="text-2xl font-light text-white group-hover:text-red-200 transition-colors">Risk Zone</h4>
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 group-hover:text-red-400 transition-colors">This will delete all your local data permanently.</p>
                        </div>
                        <Trash2 className="text-white group-hover:text-red-500 transition-colors" size={24} strokeWidth={1.5} />
                    </section>
                </main>
            </div>
        </motion.div>
    );
}

const StatColumn = ({ label, value }) => (
    <div className="text-center group/stat">
        <div className="text-3xl mb-1 group-hover/stat:scale-110 transition-transform text-white font-semibold tracking-tight">{value}</div>
        <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 group-hover/stat:text-white">{label}</div>
    </div>
);

const ProgressRow = ({ label, value, max }) => (
    <div className="space-y-4 group/progress">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 group-hover/progress:text-white/80 transition-opacity">{label}</span>
            <span className="text-xs font-semibold tracking-tighter text-white">{value} / {max}</span>
        </div>
        <div className="h-1 w-full bg-white/5 overflow-hidden rounded-full">
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
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 group-hover:text-white transition-all">{label}</span>
        <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${active ? 'bg-white' : 'bg-white/5'}`}>
            <motion.div
                animate={{ x: active ? 22 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-4 h-4 rounded-full shadow-sm ${active ? 'bg-black' : 'bg-white'}`}
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
        <div className="bg-[#121215] border border-white/5 p-8 group hover:border-white/15 rounded-[2rem] relative overflow-hidden transition-all shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-all duration-700" />

            <div className="relative z-10 flex flex-col gap-6">
                {/* Platform info row */}
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white group-hover:text-black transition-all duration-500 border border-white/5 text-white flex-shrink-0">
                        <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="text-xl text-white font-semibold tracking-tight">{name}</h4>
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5 text-white/25 group-hover:text-white/50 transition-opacity">
                            {profile.username ? `@${profile.username}` : 'Disconnected'}
                        </div>
                    </div>
                </div>

                {/* Input + button row */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <input
                        value={profile.username}
                        onChange={(e) => updateProfile(platform, { username: e.target.value })}
                        placeholder="Username / Handle"
                        className="flex-1 min-w-0 px-5 py-3 bg-[#09090b] border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] focus:border-white/20 outline-none transition-all placeholder:text-white/20 text-white"
                    />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={isSyncing}
                        className="flex-shrink-0 px-6 py-3 bg-white hover:bg-white/85 text-black font-semibold rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2 whitespace-nowrap"
                        onClick={handleSync}
                    >
                        {isSyncing ? <Loader2 className="animate-spin" size={14} /> : 'Sync Account'}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
