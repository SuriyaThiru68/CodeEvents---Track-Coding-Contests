
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
        <div className="space-y-12">
            <header className="border-b-8 border-[#000] pb-8">
                <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4">Neural_Net</h1>
                <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none">Statistical performance analysis</p>
            </header>

            {/* High-Level Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard icon={Activity} label="Efficiency Index" value="92.4" sub="Top 5% globally" color="bg-green-50" />
                <AnalyticsCard icon={Award} label="Total Points" value="12,450" sub="+1.2k this month" color="bg-yellow-50" />
                <AnalyticsCard icon={Target} label="Accuracy" value="78%" sub="Avg problems/contest" color="bg-blue-50" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Participation Graph */}
                <section className="border-4 border-[#000] bg-[#fff] p-8 shadow-[10px_10px_0px_0px_#000]">
                    <header className="flex justify-between items-center mb-10">
                        <h3 className="text-3xl font-black uppercase tracking-tighter">Growth_Velocity</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                                <div className="w-3 h-3 bg-[#000]" /> Contests
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                                <div className="w-3 h-3 bg-[#2563eb]" /> Problems
                            </div>
                        </div>
                    </header>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={OVERVIEW_DATA}>
                                <defs>
                                    <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: 0 }}
                                    itemStyle={{ color: '#fff', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="participation" stroke="#000" strokeWidth={4} fillOpacity={1} fill="url(#colorPart)" />
                                <Area type="monotone" dataKey="problems" stroke="#2563eb" strokeWidth={4} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Platform Distribution */}
                <section className="border-4 border-[#000] bg-[#fff] p-8 shadow-[10px_10px_0px_0px_#000]">
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-10">Platform_Matrix</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-[400px]">
                        <div className="h-full w-full md:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PLATFORM_DATA}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PLATFORM_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={4} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            {PLATFORM_DATA.map(p => (
                                <div key={p.name} className="flex justify-between items-center p-4 border-2 border-[#000] hover:bg-[#000] hover:text-[#fff] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 border border-current" style={{ backgroundColor: p.color }} />
                                        <span className="font-black uppercase text-xs tracking-widest">{p.name}</span>
                                    </div>
                                    <span className="font-black">{p.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Heatmap Section */}
            <section className="border-4 border-[#000] bg-[#000] text-[#fff] p-12">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Burst_Activity</h3>
                        <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Consistency tracking over the last 12 months</p>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className={`w-4 h-4 border border-[#fff]/20 ${i > 4 ? 'bg-[#2563eb]' : 'bg-[#fff]/10'}`} />)}
                    </div>
                </div>

                <div className="grid grid-cols-12 md:grid-cols-24 gap-2">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square border-2 border-[#fff]/5 group relative hover:border-[#fff] transition-colors ${i % 7 === 0 ? 'bg-[#2563eb]' : i % 5 === 0 ? 'bg-[#1e40af]' : 'bg-[#fff]/10'
                                }`}
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#fff] text-[#000] px-2 py-1 text-[8px] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Intensity: {i % 7 === 0 ? 'High' : 'Low'}
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
        whileHover={{ scale: 1.02 }}
        className={`border-4 border-[#000] p-8 shadow-[10px_10px_0px_0px_#000] ${color}`}
    >
        <div className="flex justify-between items-start mb-6">
            <Icon size={32} />
            <span className="text-[10px] font-black bg-[#000] text-[#fff] px-2 py-1 uppercase">{sub}</span>
        </div>
        <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">{label}</h3>
        <p className="text-5xl font-black tracking-tight">{value}</p>
    </motion.div>
);
