
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Settings,
    Database,
    ShieldCheck,
    Save,
    ExternalLink,
    Github,
    Code2,
    Smartphone,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

export default function Profile() {
    const { user, setUser, stats, profileImage, setProfileImage, userProfiles, getTotalSolved } = useStore();
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        bio: 'Competitive programmer focused on high-performance algorithms and system design.',
    });

    const totalSolved = getTotalSolved();

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
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-6xl font-serif text-gray-900 mb-2 leading-none tracking-tight">Profile</h1>
                    <p className="text-gray-500 font-medium">Manage your personal data and connected nodes.</p>
                </div>
                <div className="flex gap-2 p-1 bg-gray-50 rounded-full border border-gray-100">
                    {['info', 'accounts', 'analytics', 'security'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeTab === tab ? 'bg-black text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-black hover:bg-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Profile Card */}
                {/* Profile Card */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
                        <div className="w-40 h-40 rounded-full bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center font-serif text-6xl text-gray-300 mb-6 relative group overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                formData.name[0].toUpperCase()
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Settings className="text-white" size={24} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">{formData.name}</h3>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">{formData.email}</p>

                        <div className="w-full grid grid-cols-3 gap-2 border-t border-gray-100 pt-6">
                            <StatColumn label="Rank" value="#1.2k" />
                            <StatColumn label="Solved" value={totalSolved} highlight />
                            <StatColumn label="Streak" value={stats.currentStreak} />
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-lg">
                        <h4 className="text-lg font-serif mb-6 flex items-center gap-2 text-gray-200">
                            <Database size={18} /> Node Status
                        </h4>
                        <div className="space-y-4">
                            {Object.entries(userProfiles).map(([platform, data]) => (
                                <div key={platform} className="flex justify-between items-center text-xs font-medium tracking-wide">
                                    <span className="capitalize text-gray-400">{platform}</span>
                                    <span className={`flex items-center gap-2 ${data.username ? 'text-green-400' : 'text-gray-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${data.username ? 'bg-green-400' : 'bg-gray-600'}`} />
                                        {data.username ? 'Active' : 'Unlinked'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-8">
                        <h4 className="text-lg font-serif mb-6 text-gray-900">Preferences</h4>
                        <div className="space-y-6">
                            <Toggle label="Notifications" active={true} />
                            <Toggle label="Email Digest" active={useStore(state => state.emailDigest)} onToggle={() => useStore.getState().toggleEmailDigest()} />
                            <Toggle label="Dark Mode" active={useStore(state => state.theme === 'dark')} onToggle={() => useStore.getState().toggleTheme()} />
                        </div>
                    </div>
                </aside>

                {/* Settings Area */}
                <main className="lg:col-span-8 space-y-6">
                    {activeTab === 'info' && (
                        <section className="bg-white rounded-2xl border border-gray-100 p-10 lg:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-3xl font-serif text-gray-900 mb-8">Personal Information</h3>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Display Name</label>
                                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-sm font-medium outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Email Address</label>
                                        <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-sm font-medium outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Bio</label>
                                    <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full h-32 p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-sm leading-relaxed outline-none transition-all resize-none" />
                                </div>
                                <div className="pt-4">
                                    <button onClick={handleSave} className="bg-black text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 hover:shadow-lg transition-all flex items-center gap-2">
                                        <Save size={16} /> Save Changes
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'accounts' && (
                        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-2xl border border-gray-100 p-10 lg:p-12 shadow-sm">
                                <h3 className="text-3xl font-serif text-gray-900 mb-8">Connected Platforms</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <SocialLink
                                        icon={Code2}
                                        name="Codeforces"
                                        platform="codeforces"
                                    />
                                    <SocialLink
                                        icon={Smartphone}
                                        name="LeetCode"
                                        platform="leetcode"
                                    />
                                    <SocialLink
                                        icon={CheckCircle2}
                                        name="AtCoder"
                                        platform="atcoder"
                                    />
                                    <SocialLink
                                        icon={Code2}
                                        name="CodeChef"
                                        platform="codechef"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-10 border border-dashed border-gray-200">
                                <h4 className="text-xl font-serif text-gray-900 mb-8">Performance Overview</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <AnalysisBox label="Codeforces" rating={userProfiles.codeforces.rating || 'N/A'} rank={userProfiles.codeforces.rank || '-'} />
                                    <AnalysisBox label="LeetCode" rating={userProfiles.leetcode.solved || '0'} rank={userProfiles.leetcode.rank || '-'} />
                                    <AnalysisBox label="CodeChef" rating={1950} rank="5 Star" />
                                    <AnalysisBox label="AtCoder" rating={1520} rank="Blue" />
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'analytics' && (
                        <section className="bg-white rounded-2xl border border-gray-100 p-10 lg:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-3xl font-serif text-gray-900 mb-12">Analytics & Progress</h3>

                            <div className="space-y-10">
                                <ProgressRow label="Codeforces" value={userProfiles.codeforces.rating} max={3000} />
                                <ProgressRow label="LeetCode" value={userProfiles.leetcode.solved} max={3000} />
                                <ProgressRow label="CodeChef" value={userProfiles.codechef.rating} max={3000} />
                                <ProgressRow label="AtCoder" value={userProfiles.atcoder.rating} max={3000} />
                            </div>

                            <div className="mt-16 pt-12 border-t border-gray-100">
                                <h4 className="text-lg font-serif text-gray-900 mb-6 text-center">Activity Heatmap</h4>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {stats.activityData.map((val, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded-sm ${val === 0 ? 'bg-gray-100' :
                                                val === 1 ? 'bg-green-200' :
                                                    val === 2 ? 'bg-green-400' :
                                                        val === 3 ? 'bg-green-600' : 'bg-green-800'
                                                }`}
                                            title={`${val} problems solved`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'security' && (
                        <section className="bg-white rounded-2xl border border-gray-100 p-10 lg:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <ShieldCheck className="text-green-600" size={32} />
                                <h3 className="text-3xl font-serif text-gray-900">Security</h3>
                            </div>

                            <div className="space-y-12">
                                <div className="p-6 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-green-900">Active Session</div>
                                        <div className="text-xs text-green-700 mt-1">Windows 11 • Chrome 120.0 • 192.168.1.1</div>
                                    </div>
                                    <div className="px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-widest text-green-600 shadow-sm">
                                        Current
                                    </div>
                                </div>

                                <div className="max-w-md space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">New Password</label>
                                        <input type="password" placeholder="At least 12 characters" className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg outline-none transition-all" />
                                    </div>
                                    <button className="bg-black text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 hover:shadow-lg transition-all">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="p-8 rounded-2xl border border-gray-200 bg-gray-50 flex justify-between items-center group cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to verify deletion? This cannot be undone.")) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                    >
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-white mb-1">Danger Zone</h4>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400">Irreversibly delete your account and all local data.</p>
                        </div>
                        <div className="p-3 bg-white rounded-full text-black group-hover:bg-white/20 group-hover:text-white transition-colors">
                            <Trash2 size={20} />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

const StatColumn = ({ label, value, highlight }) => (
    <div className="text-center">
        <div className={`text-2xl font-serif font-medium ${highlight ? 'text-gray-900' : 'text-gray-600'}`}>{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{label}</div>
    </div>
);

const ProgressRow = ({ label, value, max }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-end">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value} pts</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full" style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
        </div>
    </div>
);

const AnalysisBox = ({ label, rating, rank }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 text-center hover:shadow-md transition-all">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</div>
        <div className="text-xl font-serif font-bold text-gray-900 mb-1">{rating}</div>
        <div className="text-[10px] font-medium px-2 py-0.5 bg-gray-50 rounded-full inline-block text-gray-600">{rank}</div>
    </div>
);

const Toggle = ({ label, active, onToggle }) => (
    <div className="flex justify-between items-center cursor-pointer group" onClick={() => onToggle && onToggle()}>
        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{label}</span>
        <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-black' : 'bg-gray-200'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${active ? 'left-[22px]' : 'left-0.5'}`} />
        </div>
    </div>
);

const SocialLink = ({ icon: Icon, name, platform }) => {
    const { userProfiles, updateProfile, syncPlatform } = useStore();
    const profile = userProfiles[platform];

    return (
        <div className="group border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all bg-white hover:border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                        <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="font-serif text-lg text-gray-900">{name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${profile.username ? 'bg-black' : 'bg-gray-300'}`} />
                            <span className="text-xs text-gray-500">{profile.username ? 'Connected' : 'Not Linked'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        value={profile.username}
                        onChange={(e) => updateProfile(platform, { username: e.target.value })}
                        placeholder="Username"
                        className="flex-1 md:w-48 px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-sm outline-none transition-all placeholder:text-gray-400"
                    />
                    <button
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black transition-all disabled:opacity-50"
                        onClick={() => {
                            if (!profile.username) return toast.error("Please enter a username first");
                            syncPlatform(platform);
                            toast.success(`Syncing ${name}...`);
                        }}
                    >
                        Sync
                    </button>
                </div>
            </div>
        </div>
    );
};
