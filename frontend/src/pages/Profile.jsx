
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
        <div className="space-y-12">
            <header className="border-b-8 border-[#000] pb-8 flex justify-between items-end gap-8">
                <div>
                    <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4">Core_ID_</h1>
                    <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none text-red-600">Level: Senior Architect</p>
                </div>
                <div className="flex gap-1 border-4 border-[#000] p-1 bg-[#000]">
                    {['info', 'accounts', 'analytics', 'security'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 font-black uppercase tracking-widest text-[10px] transition-colors ${activeTab === tab ? 'bg-[#fff] text-[#000]' : 'text-[#fff] hover:bg-[#333]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Profile Card */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="border-8 border-[#000] bg-[#fff] p-8 shadow-[15px_15px_0px_0px_#000] flex flex-col items-center text-center">
                        <div className="w-48 h-48 border-4 border-[#000] bg-yellow-400 flex items-center justify-center font-black text-8xl shadow-[8px_8px_0px_0px_#000] mb-8 group overflow-hidden relative">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                formData.name[0].toUpperCase()
                            )}
                            <label className="absolute inset-0 bg-[#000]/0 hover:bg-[#000]/60 flex items-center justify-center transition-all cursor-pointer">
                                <Settings className="text-[#fff] opacity-0 group-hover:opacity-100" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 italic underline decoration-red-500 decoration-8 underline-offset-4">{formData.name}</h3>
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-6">{formData.email}</p>

                        <div className="w-full space-y-4 pt-8 border-t-4 border-[#000]">
                            <StatRow label="Global Rank" value="#1,234" />
                            <StatRow label="Problems Solved" value={totalSolved} highlight />
                            <StatRow label="Active Streak" value={`${stats.currentStreak} Days`} />
                        </div>
                    </div>

                    <div className="border-4 border-[#000] bg-[#000] text-[#fff] p-8 space-y-6">
                        <h4 className="text-2xl font-black uppercase tracking-tighter italic text-yellow-400">Node Handles</h4>
                        <div className="space-y-4">
                            {Object.entries(userProfiles).map(([platform, data]) => (
                                <div key={platform} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="opacity-40">{platform}</span>
                                    <span className={data.username ? 'text-green-400' : 'text-red-500'}>
                                        {data.username || 'n/a'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-4 border-[#000] bg-[#000] text-[#fff] p-8 space-y-6">
                        <h4 className="text-2xl font-black uppercase tracking-tighter italic text-red-500">System Preferences</h4>
                        <div className="space-y-4">
                            <Toggle label="Push Notifications" active={true} />
                            <Toggle label="Email Alerts" active={true} />
                            <Toggle label="Dark Mode Sync" active={false} />
                        </div>
                    </div>
                </aside>

                {/* Settings Area */}
                <main className="lg:col-span-8 space-y-8">
                    {activeTab === 'info' && (
                        <section className="border-4 border-[#000] bg-[#fff] p-10 shadow-[10px_10px_0px_0px_#000]">
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-10 underline decoration-4 underline-offset-4">Meta_Data</h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Display Name</label>
                                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 border-4 border-[#000] font-bold focus:bg-[#000] focus:text-[#fff] outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Email Protocol</label>
                                        <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 border-4 border-[#000] font-bold focus:bg-[#000] focus:text-[#fff] outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Biography / System Log</label>
                                    <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full h-32 p-4 border-4 border-[#000] font-medium resize-none focus:bg-[#000] focus:text-[#fff] outline-none" />
                                </div>
                                <button onClick={handleSave} className="bg-[#000] text-[#fff] px-10 py-4 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-2">
                                    <Save size={18} /> Sync Changes
                                </button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'accounts' && (
                        <section className="border-4 border-[#000] bg-[#fff] p-10 shadow-[10px_10px_0px_0px_#000]">
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-10 underline decoration-4 underline-offset-4">Linked_Channels</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <SocialLink
                                    icon={Code2}
                                    name="Codeforces"
                                    platform="codeforces"
                                    color="bg-blue-50"
                                />
                                <SocialLink
                                    icon={Smartphone}
                                    name="LeetCode"
                                    platform="leetcode"
                                    color="bg-yellow-50"
                                />
                                <SocialLink
                                    icon={CheckCircle2}
                                    name="AtCoder"
                                    platform="atcoder"
                                    color="bg-red-50"
                                />
                                <SocialLink
                                    icon={Code2}
                                    name="CodeChef"
                                    platform="codechef"
                                    color="bg-green-50"
                                />
                            </div>

                            <div className="mt-12 p-8 border-8 border-double border-[#000] bg-gray-50">
                                <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-6">Profile_Analysis</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <AnalysisBox label="Codeforces" rating={userProfiles.codeforces.rating} rank={userProfiles.codeforces.rank} />
                                    <AnalysisBox label="LeetCode" rating={userProfiles.leetcode.solved} rank={userProfiles.leetcode.rank} />
                                    <AnalysisBox label="CodeChef" rating={1950} rank="5 Star" />
                                    <AnalysisBox label="AtCoder" rating={1520} rank="Blue" />
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'analytics' && (
                        <section className="border-4 border-[#000] bg-[#fff] p-10 shadow-[10px_10px_0px_0px_#000] space-y-12">
                            <div className="border-b-4 border-[#000] pb-4">
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic">Platform_Progress</h3>
                            </div>

                            <div className="space-y-8">
                                <ProgressRow label="Codeforces" value={userProfiles.codeforces.rating} max={3000} color="bg-blue-500" />
                                <ProgressRow label="LeetCode" value={userProfiles.leetcode.solved} max={3000} color="bg-yellow-400" />
                                <ProgressRow label="CodeChef" value={userProfiles.codechef.rating} max={3000} color="bg-green-500" />
                                <ProgressRow label="AtCoder" value={userProfiles.atcoder.rating} max={3000} color="bg-red-500" />
                            </div>

                            <div className="pt-12 border-t-4 border-[#000]">
                                <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-8 text-center">Consistency_Heatmap</h4>
                                <div className="grid grid-cols-52 gap-1 px-4">
                                    {stats.activityData.map((val, i) => (
                                        <div
                                            key={i}
                                            className={`w-full aspect-square border border-[#000]/10 ${val === 0 ? 'bg-gray-100' :
                                                val === 1 ? 'bg-red-200' :
                                                    val === 2 ? 'bg-red-400' :
                                                        val === 3 ? 'bg-red-600' : 'bg-red-800'
                                                }`}
                                            title={`${val} problems solved`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-center gap-4 text-[8px] font-black uppercase tracking-widest opacity-40">
                                    <span>Less Activity</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-100 border border-[#000]/10" />
                                        <div className="w-2 h-2 bg-red-200" />
                                        <div className="w-2 h-2 bg-red-400" />
                                        <div className="w-2 h-2 bg-red-600" />
                                        <div className="w-2 h-2 bg-red-800" />
                                    </div>
                                    <span>More Activity</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'security' && (
                        <section className="border-4 border-[#000] bg-[#fff] p-10 shadow-[10px_10px_0px_0px_#000]">
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-10 underline decoration-4 underline-offset-4">Security_Protocol</h3>
                            <div className="space-y-8">
                                <div className="p-6 border-4 border-[#000] bg-gray-50 space-y-4">
                                    <h4 className="text-xl font-black uppercase flex items-center gap-2">
                                        <ShieldCheck size={20} className="text-green-600" /> Active Sessions
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold opacity-60">
                                            <span>Current Device</span>
                                            <span>Windows 11 • New Delhi, IN</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full p-4 border-4 border-[#000] font-bold focus:bg-[#000] focus:text-[#fff] outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">New Access Key</label>
                                        <input type="password" placeholder="MIN 12 CHARS" className="w-full p-4 border-4 border-[#000] font-bold focus:bg-[#000] focus:text-[#fff] outline-none" />
                                    </div>
                                    <button className="bg-[#000] text-[#fff] px-10 py-4 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform">
                                        Update Protocol
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="p-10 bg-red-500 text-[#fff] border-8 border-[#000] flex justify-between items-center group cursor-pointer hover:bg-black transition-colors"
                        onClick={() => {
                            if (window.confirm("System override initiated. Confirm permanent data wipe?")) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                    >
                        <div>
                            <h4 className="text-3xl font-black uppercase tracking-tighter italic mb-1">Destruct Mode</h4>
                            <p className="font-bold uppercase text-[10px] opacity-70 tracking-widest">Wipe all local data and account information</p>
                        </div>
                        <Trash2 className="group-hover:scale-125 transition-transform" />
                    </section>
                </main>
            </div>
        </div>
    );
}

const StatRow = ({ label, value, highlight }) => (
    <div className={`flex justify-between items-center text-xs font-black uppercase tracking-widest ${highlight ? 'text-red-500' : ''}`}>
        <span className="opacity-40">{label}</span>
        <span className={highlight ? 'text-3xl italic' : ''}>{value}</span>
    </div>
);

const ProgressRow = ({ label, value, max, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            <span className="text-xl font-black italic">{value} / {max}</span>
        </div>
        <div className="h-4 border-2 border-[#000] bg-gray-100">
            <div className={`h-full ${color} border-r-2 border-[#000]`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
        </div>
    </div>
);

const AnalysisBox = ({ label, rating, rank }) => (
    <div className="bg-[#fff] border-4 border-[#000] p-6 text-center shadow-[6px_6px_0px_0px_#000]">
        <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">{label}</p>
        <p className="text-3xl font-black mb-1 italic tracking-tighter">{rating}</p>
        <p className="text-[10px] font-black uppercase text-red-500 tracking-tighter">{rank}</p>
    </div>
);

const Toggle = ({ label, active }) => (
    <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
        <div className={`w-12 h-6 border-2 border-[#fff] relative cursor-pointer ${active ? 'bg-red-500' : 'bg-[#fff]/10'}`}>
            <div className={`absolute top-0 w-5 h-full bg-[#fff] transition-all ${active ? 'right-0' : 'left-0'}`} />
        </div>
    </div>
);

const SocialLink = ({ icon: Icon, name, platform, color }) => {
    const { userProfiles, updateProfile, syncPlatform } = useStore();
    const profile = userProfiles[platform];

    return (
        <div className={`p-1 border-4 border-[#000] bg-[#000] group transition-all shadow-[8px_8px_0px_0px_#000]`}>
            <div className={`p-6 flex flex-col md:flex-row justify-between items-center gap-6 ${color}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border-2 border-black">
                        <Icon size={32} />
                    </div>
                    <div>
                        <p className="font-black uppercase text-sm tracking-widest">{name}</p>
                        <div className="flex gap-2 mt-1">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 border border-black ${profile.username ? 'bg-green-400' : 'bg-red-400'}`}>
                                {profile.username ? 'Protocol Active' : 'Offline'}
                            </span>
                            {profile.solved > 0 && (
                                <span className="text-[8px] font-black uppercase px-2 py-0.5 border border-black bg-white">
                                    Solved: {profile.solved}
                                </span>
                            )}
                            {profile.rating > 0 && (
                                <span className="text-[8px] font-black uppercase px-2 py-0.5 border border-black bg-white">
                                    Rating: {profile.rating}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        value={profile.username}
                        onChange={(e) => updateProfile(platform, { username: e.target.value })}
                        placeholder="Handle / Username"
                        className="flex-1 md:w-48 px-4 py-3 border-4 border-[#000] text-xs font-bold outline-none focus:bg-[#000] focus:text-[#fff] placeholder:opacity-30"
                    />
                    <button
                        className="bg-[#000] text-[#fff] px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-4 border-black"
                        onClick={() => {
                            syncPlatform(platform);
                            toast.success(`Broadcasting sync request to ${name}...`);
                        }}
                    >
                        Sync
                    </button>
                </div>
            </div>
        </div>
    );
};
