import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Activity, Award, Target, Hash, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Analytics() {
    const { userProfiles, attendedContests, missedContests, ratingHistory, getTotalSolved, stats } = useStore();

    const totalSolved = getTotalSolved?.() || 0;
    const totalContests = (attendedContests?.length || 0) + (missedContests?.length || 0);
    const winRate = totalContests > 0 ? Math.round(((attendedContests?.length || 0) / totalContests) * 100) : 0;

    // Process rating history for the chart
    const chartData = useMemo(() => {
        if (!ratingHistory || ratingHistory.length === 0) {
            return [
                { name: 'Start', rating: 0 },
                { name: 'Today', rating: 0 },
            ];
        }
        return ratingHistory.map((entry, idx) => ({
            name: new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            rating: entry.rating,
            platform: entry.platform
        }));
    }, [ratingHistory]);

    // Process platform distribution for the pie chart
    const platformData = useMemo(() => {
        const data = Object.entries(userProfiles || {}).map(([name, profile]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: profile.solved || 0,
            color: name === 'codeforces' ? '#ffffff' :
                name === 'leetcode' ? '#a1a1aa' :
                    name === 'atcoder' ? '#52525b' : '#27272a'
        })).filter(p => p.value > 0);

        if (data.length === 0) {
            return [{ name: 'No Data', value: 1, color: '#27272a' }];
        }

        const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);
        return data.map(p => ({
            ...p,
            percentage: Math.round((p.value / totalValue) * 100)
        }));
    }, [userProfiles]);

    const efficiencyScore = useMemo(() => {
        if (totalContests === 0) return 0;
        const base = (attendedContests.length / totalContests) * 60;
        const volume = Math.min((totalSolved / 500) * 40, 40);
        return Math.round(base + volume);
    }, [attendedContests, totalContests, totalSolved]);

    return (
        <div className="space-y-12 text-[#fafafa] pt-6">
            <header className="border-b border-white/5 pb-12 space-y-4">
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/35">Performance Analytics</div>
                <h1 className="text-[5rem] leading-[0.95] tracking-tighter uppercase text-white font-light">
                    Your <span className="text-white/35 font-normal">Stats.</span>
                </h1>
                <p className="text-sm font-semibold text-white/30 uppercase tracking-[0.2em] leading-none">Real-time performance metrics.</p>
            </header>

            {/* High-Level Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard icon={Zap} label="Efficiency" value={efficiencyScore} sub="Power Score" />
                <AnalyticsCard icon={Award} label="Solved" value={totalSolved} sub="Total Problems" />
                <AnalyticsCard icon={Target} label="Success" value={`${winRate}%`} sub="Participation Rate" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Rating Evolution */}
                <section className="bg-[#121215] border border-white/5 p-12 overflow-hidden rounded-[2.5rem] shadow-sm">
                    <header className="flex justify-between items-center mb-12">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-light uppercase tracking-tight text-white">Timeline.</h3>
                            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">Rating Updates</p>
                        </div>
                    </header>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#666' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#666' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#ffffff', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="rating" stroke="#ffffff" strokeWidth={4} fillOpacity={1} fill="url(#colorPart)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Platform Distribution */}
                <section className="bg-[#121215] border border-white/5 p-12 rounded-[2.5rem] shadow-sm">
                    <div className="space-y-1 mb-12">
                        <h3 className="text-3xl font-light uppercase tracking-tight text-white">Platform Split.</h3>
                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">Solved Problems Breakdown</p>
                    </div>
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
                        <div className="h-[300px] w-full xl:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={platformData}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {platformData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#121215" strokeWidth={4} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#121215', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full xl:w-1/2 space-y-3">
                            {platformData.map(p => (
                                <div key={p.name} className="flex justify-between items-center p-5 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                        <span className="font-bold uppercase text-[10px] tracking-[0.2em]">{p.name}</span>
                                    </div>
                                    <span className="font-semibold tracking-tight">{p.percentage || 0}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Heatmap Section */}
            <section className="bg-[#121215] border border-white/5 p-16 rounded-[3rem] shadow-lg shadow-white/5 overflow-hidden text-white">
                <div className="flex justify-between items-end mb-16">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-light uppercase tracking-tight text-white">Daily Trace.</h1>
                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/35">Historical activity log</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-sm bg-white/5" />
                        <div className="w-3 h-3 rounded-sm bg-white/20" />
                        <div className="w-3 h-3 rounded-sm bg-white/50" />
                        <div className="w-3 h-3 rounded-sm bg-white" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(stats?.activityData || Array.from({ length: 365 }, () => 0)).slice(-150).map((val, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-sm transition-all duration-300 ${val === 0 ? 'bg-white/5' :
                                    val === 1 ? 'bg-white/20' :
                                        val === 2 ? 'bg-white/50' :
                                            val === 3 ? 'bg-white/75' : 'bg-white'
                                }`}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

const AnalyticsCard = ({ icon: Icon, label, value, sub }) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-[#121215] border border-white/5 p-10 group transition-all duration-500 rounded-[2.5rem] shadow-sm hover:border-white/15"
    >
        <div className="flex justify-between items-start mb-8">
            <Icon size={32} className="text-white/20 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-bold bg-white/5 group-hover:bg-white group-hover:text-black text-white/40 px-3 py-1 rounded-full uppercase tracking-widest transition-all border border-white/5">{sub}</span>
        </div>
        <h3 className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3">{label}</h3>
        <p className="text-5xl font-light tracking-tight text-white">{value}</p>
    </motion.div>
);
