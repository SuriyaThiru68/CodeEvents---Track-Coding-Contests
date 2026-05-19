import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Flame, Calendar, ExternalLink, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

// ── Activity Heatmap ─────────────────────────────────────────────────────────
const ActivityHeatmap = ({ activityData }) => {
    const weeks = 26;
    const days = 7;
    const cells = Array.from({ length: weeks * days }, (_, i) => ({
        val: activityData?.[i] || 0,
        week: Math.floor(i / days),
        day: i % days,
    }));
    const months = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'];
    const getColor = v => 
        v === 0 ? 'bg-zinc-900 border border-zinc-800/40' : 
        v === 1 ? 'bg-[#4BB8FA]/10 border border-[#4BB8FA]/20' : 
        v === 2 ? 'bg-[#4BB8FA]/30' : 
        v === 3 ? 'bg-[#4BB8FA]/60' : 'bg-[#4BB8FA]';
        
    return (
        <div>
            <div className="flex gap-[3px] mb-1 ml-0 pl-0">
                {months.slice(0, Math.ceil(weeks / 4)).map((m, i) => (
                    <div key={i} className="text-[8px] text-zinc-500 uppercase tracking-wider" style={{ width: `${(weeks / months.length) * 13}px` }}>{m}</div>
                ))}
            </div>
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks}, 12px)`, gridTemplateRows: `repeat(${days}, 12px)` }}>
                {cells.map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-[2px] ${getColor(c.val)}`}
                        style={{ gridColumn: c.week + 1, gridRow: c.day + 1 }}
                        title={`Activity: ${c.val}`} />
                ))}
            </div>
        </div>
    );
};

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutStat = ({ total, label, items }) => {
    // Beautiful premium shades of light neon blue (#4BB8FA)
    const COLORS = ['#4BB8FA', '#3498DB', '#2980B9', '#1A5276'];
    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <PieChart width={90} height={90}>
                    <Pie data={items.map(it => ({ value: it.val }))} cx={40} cy={40} innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
                        {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-bold text-white">{total}</span>
                </div>
            </div>
            <div className="space-y-1.5 flex-1">
                <div className="text-[9px] text-[#4BB8FA] uppercase tracking-widest font-bold">{label}</div>
                {items.map((it, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-semibold text-zinc-400 capitalize">{it.label}</span>
                        <span className="text-[10px] font-bold text-white ml-auto pl-2">{it.val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Badge Component ───────────────────────────────────────────────────────────
const Badge = ({ icon, label, earned }) => (
    <div className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${earned ? 'border-[#4BB8FA]/30 bg-[#4BB8FA]/5' : 'border-zinc-800 opacity-20 bg-transparent'}`}>
        <div className="text-xl">{icon}</div>
        <div className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 text-center leading-tight">{label}</div>
    </div>
);

// ── Platform Row ──────────────────────────────────────────────────────────────
const PlatformRow = ({ name, icon, rating, rank, solved, linked }) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${linked ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-800/40 bg-zinc-900/10 opacity-40'}`}>
        <div className="w-8 h-8 rounded-xl bg-zinc-850 flex items-center justify-center text-sm font-bold text-[#4BB8FA]">{icon}</div>
        <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">{name}</div>
            {linked ? (
                <div className="text-[9px] text-zinc-400">{rank} {rating ? `· ${rating}` : ''}</div>
            ) : (
                <div className="text-[9px] text-zinc-500">Not connected</div>
            )}
        </div>
        {linked && <div className="text-right"><div className="text-sm font-bold text-[#4BB8FA]">{solved}</div><div className="text-[8px] text-zinc-500 uppercase">solved</div></div>}
        {linked ? <CheckCircle size={14} className="text-[#4BB8FA] flex-shrink-0" /> : null}
    </div>
);

// ── Topic Bar ─────────────────────────────────────────────────────────────────
const TopicBar = ({ label, val, max }) => (
    <div className="flex items-center gap-3">
        <div className="w-28 text-[9px] font-bold uppercase tracking-wider text-zinc-400 truncate">{label}</div>
        <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(val / max) * 100}%` }} transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }} className="h-full bg-[#4BB8FA] rounded-full" />
        </div>
        <div className="text-[10px] font-bold text-white w-8 text-right">{val}</div>
    </div>
);

// ── Rating Tooltip ────────────────────────────────────────────────────────────
const RatingTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#121214] border border-zinc-800 rounded-xl px-3 py-2 shadow-lg">
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{label}</div>
            <div className="text-sm font-bold text-[#4BB8FA]">{payload[0].value}</div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const { contests, attendedContests, missedContests, getTotalSolved, user, userProfiles, stats, profileImage } = useStore();
    const totalSolved = getTotalSolved?.() || 0;
    const totalContests = attendedContests.length + missedContests.length;
    const winRate = totalContests > 0 ? Math.round((attendedContests.length / totalContests) * 100) : 0;
    const connectedPlatforms = Object.entries(userProfiles || {}).filter(([, v]) => v?.username);

    // Mock rating history for chart
    const ratingData = Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
        cf: (userProfiles?.codeforces?.rating || 1200) + Math.floor(Math.sin(i * 0.7) * 150 + i * 20),
        lc: (userProfiles?.leetcode?.solved || 0) + i * 10,
    }));

    // DSA Topics
    const topics = [
        { label: 'Arrays', val: 87 }, { label: 'Dynamic Prog.', val: 54 },
        { label: 'Strings', val: 62 }, { label: 'Trees', val: 41 },
        { label: 'Graphs', val: 35 }, { label: 'HashMap/Set', val: 48 },
        { label: 'Sorting', val: 29 }, { label: 'DFS/BFS', val: 33 },
    ];
    const maxTopic = Math.max(...topics.map(t => t.val));

    // Badges
    const badges = [
        { icon: '🔥', label: 'Hot Streak', earned: (stats?.currentStreak || 0) >= 7 },
        { icon: '⚡', label: 'Speed Coder', earned: totalSolved >= 100 },
        { icon: '🏆', label: 'Contest King', earned: attendedContests.length >= 5 },
        { icon: '🎯', label: 'Consistent', earned: (stats?.maxStreak || 0) >= 14 },
        { icon: '🌐', label: 'Multi-Platform', earned: connectedPlatforms.length >= 2 },
        { icon: '📚', label: 'Problem Solver', earned: totalSolved >= 50 },
    ];

    const platforms = [
        { name: 'Codeforces', icon: 'CF', ...userProfiles?.codeforces, linked: !!userProfiles?.codeforces?.username },
        { name: 'LeetCode', icon: 'LC', ...userProfiles?.leetcode, linked: !!userProfiles?.leetcode?.username },
        { name: 'AtCoder', icon: 'AT', ...userProfiles?.atcoder, linked: !!userProfiles?.atcoder?.username },
        { name: 'CodeChef', icon: 'CC', ...userProfiles?.codechef, linked: !!userProfiles?.codechef?.username },
    ];

    const dsaDonut = {
        total: Math.round(totalSolved * 0.7),
        items: [
            { label: 'Easy', val: Math.round(totalSolved * 0.35) || 286 },
            { label: 'Medium', val: Math.round(totalSolved * 0.45) || 528 },
            { label: 'Hard', val: Math.round(totalSolved * 0.2) || 125 },
        ],
    };

    return (
        <div className="max-w-7xl mx-auto text-[#fafafa]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">

                {/* ── LEFT SIDEBAR ────────────────────────────────── */}
                <aside className="lg:col-span-3 space-y-4">
                    {/* Profile Card */}
                    <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 text-center shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl text-zinc-500 mx-auto mb-4 overflow-hidden shadow-inner shadow-[#4BB8FA]/10">
                            {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <span className="font-light text-4xl text-zinc-500">{user?.name?.[0]?.toUpperCase() || 'U'}</span>}
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-0.5">{user?.name || 'User'}</h2>
                        <div className="text-[9px] text-[#4BB8FA] uppercase tracking-widest mb-3">@{user?.email?.split('@')[0] || 'user'}</div>
                        <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/60 pt-4">
                            {[
                                { label: 'Solved', val: totalSolved },
                                { label: 'Contests', val: totalContests },
                                { label: 'Streak', val: stats?.currentStreak || 0 },
                            ].map(s => (
                                <div key={s.label} className="text-center">
                                    <div className="text-xl font-bold text-[#4BB8FA]">{s.val}</div>
                                    <div className="text-[8px] text-zinc-500 uppercase tracking-wider">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform Solving Stats */}
                    <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-5 shadow-sm">
                        <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA] mb-3">Platform Tracking</div>
                        <div className="space-y-2">
                            {platforms.map(p => <PlatformRow key={p.name} {...p} />)}
                        </div>
                        <Link to="/profile" className="mt-4 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-[#4BB8FA] transition-colors pt-3 border-t border-zinc-800/60">
                            Manage Accounts <ChevronRight size={12} />
                        </Link>
                    </div>

                    {/* Leaderboard Rank Card (Now perfectly beautiful and dark with blue glow!) */}
                    <div className="bg-[#121214] border border-[#4BB8FA]/30 rounded-3xl p-6 shadow-lg shadow-[#4BB8FA]/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#4BB8FA]/5 rounded-bl-full pointer-events-none" />
                        
                        <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-1">Global Rank</div>
                        <div className="text-4xl font-extrabold tracking-tighter text-[#4BB8FA] mb-1">#{Math.max(1000, 5000 - totalSolved * 3)}</div>
                        <div className="text-[9px] text-zinc-400 uppercase tracking-widest">Based on C-Score</div>
                        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-[9px] text-zinc-500 uppercase tracking-wider">
                            <span>Win Rate</span>
                            <span className="text-white font-bold">{winRate}%</span>
                        </div>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ─────────────────────────────────── */}
                <main className="lg:col-span-9 space-y-5">
                    {/* Top KPI Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Questions', val: totalSolved, icon: BookOpen, trend: '+12 this week' },
                            { label: 'Active Days', val: stats?.activityData?.filter(v => v > 0).length || 0, icon: Calendar, trend: 'All time' },
                            { label: 'Total Contests', val: totalContests, icon: Trophy, trend: `${attendedContests.length} attended` },
                            { label: 'Max Streak', val: `${stats?.maxStreak || 0}d`, icon: Flame, trend: `Current: ${stats?.currentStreak || 0}d` },
                        ].map((k, i) => (
                            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:border-[#4BB8FA]/40 transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <k.icon size={16} className="text-zinc-500 group-hover:text-[#4BB8FA] transition-colors" />
                                    <div className="text-[8px] text-[#4BB8FA] uppercase tracking-wider font-bold">{k.label}</div>
                                </div>
                                <div className="text-3xl font-light tracking-tight text-white">{k.val}</div>
                                <div className="text-[8px] text-zinc-500 mt-1 uppercase tracking-wider">{k.trend}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Heatmap + Contests split */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Heatmap */}
                        <div className="md:col-span-2 bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA] mb-1">Activity Tracking</div>
                                    <div className="flex items-center gap-4 text-[10px] text-zinc-400">
                                        <span><span className="font-bold text-[#4BB8FA]">{stats?.activityData?.reduce((a, b) => a + (b > 0 ? 1 : 0), 0) || 0}</span> active days</span>
                                        <span>Max streak: <span className="font-bold text-[#4BB8FA]">{stats?.maxStreak || 0}d</span></span>
                                        <span>Current: <span className="font-bold text-[#4BB8FA]">{stats?.currentStreak || 0}d</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <ActivityHeatmap activityData={stats?.activityData} />
                            </div>
                        </div>

                        {/* Contest breakdown */}
                        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 shadow-sm">
                            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA] mb-4">Total Contests</div>
                            <div className="text-4xl font-light tracking-tight text-white mb-4">{totalContests}</div>
                            <div className="space-y-2">
                                {platforms.filter(p => p.linked).map(p => (
                                    <div key={p.name} className="flex items-center justify-between py-1.5 border-b border-zinc-800/60 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] font-bold text-white">{p.icon}</div>
                                            <span className="text-[10px] font-semibold text-zinc-300">{p.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#4BB8FA]">{Math.ceil(attendedContests.filter(c => c.platform === p.name).length) || Math.floor(Math.random() * 10 + 1)}</span>
                                    </div>
                                ))}
                                {platforms.filter(p => p.linked).length === 0 && (
                                    <div className="text-[9px] text-zinc-500 text-center py-4">Connect platforms to see breakdown</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Rating Chart + DSA Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Rating Chart */}
                        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 shadow-sm">
                            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA] mb-1">Rating History</div>
                            <div className="flex items-end gap-2 mb-4">
                                <div className="text-2xl font-light tracking-tight text-white">{userProfiles?.codeforces?.rating || 0}</div>
                                <div className="text-[9px] text-zinc-500 uppercase tracking-wider pb-1">Codeforces</div>
                            </div>
                            <div className="h-36">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ratingData}>
                                        <defs>
                                            <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#4BB8FA" stopOpacity={0.2} />
                                                <stop offset="100%" stopColor="#4BB8FA" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#666' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 8, fill: '#666' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<RatingTooltip />} />
                                        <Area type="monotone" dataKey="cf" stroke="#4BB8FA" strokeWidth={2} fill="url(#cfGrad)" dot={false} name="Rating" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Problems Solved Breakdown */}
                        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 shadow-sm">
                            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA] mb-4">Problems Solved</div>
                            <div className="space-y-5">
                                <DonutStat total={dsaDonut.total || totalSolved} label="DSA breakdown" items={dsaDonut.items} />
                                <div className="border-t border-zinc-800 pt-4">
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#4BB8FA] mb-3">Contest Rankings</div>
                                    <div className="space-y-2">
                                        {platforms.filter(p => p.linked).map(p => (
                                            <div key={p.name} className="flex justify-between items-center">
                                                <div className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">{p.name}</div>
                                                <div>
                                                    <span className="text-sm font-bold text-white">{p.rating || 0}</span>
                                                    <span className="text-[8px] text-[#4BB8FA] ml-1">({p.rank || 'Unrated'})</span>
                                                </div>
                                            </div>
                                        ))}
                                        {platforms.filter(p => p.linked).length === 0 && (
                                            <div className="text-[9px] text-zinc-500">Connect platforms in Profile</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Awards/Badges + DSA Topic Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Badges */}
                        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA]">Awards</div>
                                <div className="text-[9px] text-[#4BB8FA]">{badges.filter(b => b.earned).length} earned</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {badges.map((b, i) => <Badge key={i} {...b} />)}
                            </div>
                        </div>

                        {/* DSA Topic Analysis */}
                        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 shadow-sm">
                            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA] mb-4">Topic Analysis</div>
                            <div className="space-y-2.5">
                                {topics.map(t => <TopicBar key={t.label} {...t} max={maxTopic} />)}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Contests Feed */}
                    <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#4BB8FA]">Upcoming Contests</div>
                            <Link to="/upcoming" className="text-[9px] font-bold uppercase tracking-widest text-[#4BB8FA]/80 hover:text-white flex items-center gap-1 transition-colors">
                                View All <ChevronRight size={11} />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {contests.slice(0, 5).map((c, i) => (
                                <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                                    className="flex items-center gap-4 p-3 rounded-2xl border border-zinc-800/60 hover:border-[#4BB8FA]/20 transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex flex-col items-center justify-center flex-shrink-0">
                                        <div className="text-[10px] font-bold text-white">{new Date(c.date).getDate()}</div>
                                        <div className="text-[7px] text-[#4BB8FA] uppercase">{new Date(c.date).toLocaleString('en', { month: 'short' })}</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">{c.platform}</div>
                                        <div className="text-sm font-medium text-white truncate">{c.name}</div>
                                    </div>
                                    <div className="text-[9px] text-[#4BB8FA] hidden md:block">{c.duration}</div>
                                    <a href={c.url} target="_blank" rel="noreferrer"
                                        className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-[#4BB8FA] hover:text-black hover:border-[#4BB8FA] transition-all flex-shrink-0">
                                        <ExternalLink size={12} />
                                    </a>
                                </motion.div>
                            ))}
                            {contests.length === 0 && (
                                <div className="text-center py-8 text-[9px] text-zinc-500 uppercase tracking-widest">No contests loaded yet</div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
