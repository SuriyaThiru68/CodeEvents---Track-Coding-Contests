
import React from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Activity, Award, Target, Hash, Zap } from 'lucide-react';

const OVERVIEW_DATA = [
    { name: 'Week 1', participation: 2, problems: 5 },
    { name: 'Week 2', participation: 5, problems: 12 },
    { name: 'Week 3', participation: 3, problems: 8 },
    { name: 'Week 4', participation: 8, problems: 24 },
    { name: 'Week 5', participation: 4, problems: 15 },
    { name: 'Week 6', participation: 6, problems: 18 },
];

const PLATFORM_DATA = [
    { name: 'Codeforces', value: 45, color: '#000000' },
    { name: 'LeetCode', value: 30, color: '#facc15' },
    { name: 'AtCoder', value: 15, color: '#ef4444' },
    { name: 'Others', value: 10, color: '#4ade80' },
];

export default function Analytics() {
    return (
        <div className="space-y-12 text-white">
            <header className="border-b border-zinc-900 pb-12 space-y-4">
                <div className="editorial-subtitle !text-[10px] !tracking-[0.3em] opacity-50 uppercase">Performance Metrics</div>
                <h1 className="text-7xl font-serif italic font-black uppercase tracking-tighter text-white">
                    Neural_<span className="opacity-30">Net</span>
                </h1>
                <p className="text-sm font-medium opacity-40 uppercase tracking-[0.2em] leading-none">Statistical performance analysis</p>
            </header>

            {/* High-Level Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard icon={Activity} label="Efficiency Index" value="92.4" sub="Top 5% globally" color="bg-zinc-950/50 border-zinc-900" />
                <AnalyticsCard icon={Award} label="Total Points" value="12,450" sub="+1.2k this month" color="bg-zinc-950/50 border-zinc-900" />
                <AnalyticsCard icon={Target} label="Accuracy" value="78%" sub="Avg problems/contest" color="bg-zinc-950/50 border-zinc-900" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Participation Graph */}
                <section className="card-minimal border-zinc-900 bg-zinc-950/50 p-12 overflow-hidden">
                    <header className="flex justify-between items-center mb-12">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-serif italic font-black uppercase tracking-tighter text-white">Growth_Velocity</h3>
                            <p className="editorial-subtitle !text-[9px] text-zinc-500 uppercase tracking-widest">Efficiency over time</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-white">
                                <div className="w-2 h-2 rounded-full bg-white" /> Contests
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                <div className="w-2 h-2 rounded-full bg-zinc-800" /> Problems
                            </div>
                        </div>
                    </header>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={OVERVIEW_DATA}>
                                <defs>
                                    <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#52525b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#52525b' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px', padding: '12px' }}
                                    itemStyle={{ color: '#fff', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="participation" stroke="#fff" strokeWidth={3} fillOpacity={1} fill="url(#colorPart)" />
                                <Area type="monotone" dataKey="problems" stroke="#3f3f46" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Platform Distribution */}
                <section className="card-minimal border-zinc-900 bg-zinc-950/50 p-12">
                    <div className="space-y-1 mb-12">
                        <h3 className="text-3xl font-serif italic font-black uppercase tracking-tighter text-white">Platform_Matrix</h3>
                        <p className="editorial-subtitle !text-[9px] text-zinc-500 uppercase tracking-widest">Resource distribution</p>
                    </div>
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
                        <div className="h-[300px] w-full xl:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PLATFORM_DATA}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {PLATFORM_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color === '#000000' ? '#ffffff' : entry.color === '#facc15' ? '#71717a' : entry.color} stroke="#09090b" strokeWidth={4} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full xl:w-1/2 space-y-3">
                            {PLATFORM_DATA.map(p => (
                                <div key={p.name} className="flex justify-between items-center p-5 border border-zinc-900 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color === '#000000' ? '#ffffff' : p.color }} />
                                        <span className="font-black uppercase text-[10px] tracking-[0.2em]">{p.name}</span>
                                    </div>
                                    <span className="font-serif italic font-black tracking-tighter">{p.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Heatmap Section */}
            <section className="card-minimal bg-zinc-950 border-zinc-900 p-16">
                <div className="flex justify-between items-end mb-16">
                    <div className="space-y-2">
                        <h3 className="text-4xl font-serif italic font-black uppercase tracking-tighter text-white">Burst_Activity</h3>
                        <p className="editorial-subtitle !text-[9px] text-zinc-600 uppercase tracking-widest">Consistency tracking over the last 12 months</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className={`w-3 h-3 rounded-sm ${i > 4 ? 'bg-white' : 'bg-zinc-900'}`} />)}
                    </div>
                </div>

                <div className="grid grid-cols-12 md:grid-cols-24 gap-3">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-sm border border-white/5 group relative hover:border-white transition-all duration-300 ${i % 7 === 0 ? 'bg-white' : i % 5 === 0 ? 'bg-zinc-700' : 'bg-zinc-900'
                                }`}
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white text-black px-3 py-1 text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all rounded-lg pointer-events-none">
                                Intensity: {i % 7 === 0 ? 'Maximum' : 'Nominal'}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const AnalyticsCard = ({ icon: Icon, label, value, sub, color }) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className={`card-minimal p-10 border-zinc-900 bg-zinc-950/50 group transition-all duration-500`}
    >
        <div className="flex justify-between items-start mb-8">
            <Icon size={32} className="text-zinc-600 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-black bg-zinc-900 group-hover:bg-white group-hover:text-black text-zinc-500 px-3 py-1 rounded-full uppercase tracking-widest transition-all">{sub}</span>
        </div>
        <h3 className="editorial-subtitle !text-[9px] text-zinc-600 uppercase tracking-widest mb-3">{label}</h3>
        <p className="text-5xl font-serif italic font-black tracking-tighter text-white">{value}</p>
    </motion.div>
);
