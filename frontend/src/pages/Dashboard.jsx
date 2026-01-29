
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Calendar,
    CheckCircle2,
    Clock,
    BarChart,
    ArrowUpRight,
    TrendingUp,
    ExternalLink,
    ChevronRight,
    Target
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Dashboard() {
    const { contests, attendedContests, missedContests, getTotalSolved } = useStore();
    const totalSolved = getTotalSolved();

    const stats = [
        { label: 'Upcoming Contests', value: contests.length, icon: Calendar, color: 'bg-blue-50' },
        { label: 'Total Solved', value: totalSolved, icon: Target, color: 'bg-green-50' },
        { label: 'Attended Events', value: attendedContests.length, icon: CheckCircle2, color: 'bg-yellow-50' },
        { label: 'Missed Battles', value: missedContests.length, icon: Clock, color: 'bg-red-50' },
    ];

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4">Command_Center</h1>
                <p className="text-xl font-bold opacity-80 uppercase tracking-widest leading-none text-red-600">Your coding career at a glance</p>
            </header>

            {/* Stats Overview */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`border-4 border-[#000] p-8 shadow-[10px_10px_0px_0px_#000] relative group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[15px_15px_0px_0px_#000] transition-all ${stat.color}`}
                    >
                        <stat.icon size={32} className="mb-6" />
                        <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-80 text-zinc-900">{stat.label}</h3>
                        <p className="text-5xl font-black tracking-tight">{stat.value}</p>
                    </motion.div>
                ))}
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Quick Contest Preview */}
                <section className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-end border-b-4 border-[#000] pb-4">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Next_Challenges</h2>
                        <div className="flex gap-6">
                            <Link to="/calendar" className="font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:underline text-blue-600">
                                Tactical Calendar <Calendar size={16} />
                            </Link>
                            <Link to="/upcoming" className="font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:underline">
                                View All <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>


                    <div className="space-y-4">
                        {contests.slice(0, 3).map((contest) => {
                            const contestDate = new Date(contest.date);
                            return (
                                <motion.div
                                    key={contest.id}
                                    whileHover={{ scale: 1.01 }}
                                    className="border-4 border-[#000] bg-[#fff] p-6 flex flex-col md:flex-row justify-between items-center group transition-colors hover:bg-[#000] hover:text-[#fff] cursor-pointer"
                                    onClick={() => window.open(contest.url, '_blank')}
                                >

                                    <div className="flex items-center gap-6 w-full">
                                        <div className="w-16 h-16 border-2 border-[#000] flex flex-col items-center justify-center font-black group-hover:border-[#fff]">
                                            <span className="text-xs uppercase opacity-50">
                                                {contestDate.toLocaleString('default', { month: 'short' })}
                                            </span>
                                            <span className="text-2xl">
                                                {contestDate.getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase border border-current px-2 py-0.5">{contest.platform}</span>
                                                <span className="text-[10px] font-black uppercase border border-current px-2 py-0.5 bg-red-500 text-[#fff] border-red-500">{contest.difficulty}</span>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">{contest.name}</h3>
                                            <p className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1">
                                                Duration: {contest.duration} • {contestDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0">
                                        <button className="flex-1 md:flex-none border-2 border-[#000] group-hover:border-[#fff] px-4 py-2 font-black uppercase text-xs hover:bg-[#fff] hover:text-[#000] transition-colors">Register</button>
                                        <button className="flex-1 md:flex-none bg-[#000] group-hover:bg-[#fff] group-hover:text-[#000] text-[#fff] px-4 py-2 font-black uppercase text-xs">Notify</button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Quick Insights / Analytics */}
                <section className="space-y-8">
                    <div className="border-b-4 border-[#000] pb-4">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Status_</h2>
                    </div>

                    <div className="border-4 border-[#000] bg-[#000] text-[#fff] p-8 shadow-[10px_10px_0px_0px_#facc15]">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 italic text-yellow-400">Current Rank</h3>
                        <p className="text-7xl font-black tracking-tighter mb-2">#1,234</p>
                        <div className="flex items-center gap-2 text-green-400 font-bold uppercase text-xs tracking-widest">
                            <ArrowUpRight size={16} /> 24 positions gained this week
                        </div>
                    </div>

                    <div className="border-4 border-[#000] bg-[#fff] p-8 space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Engagement</h3>
                        <div className="h-4 bg-gray-100 border-2 border-[#000]">
                            <div className="h-full bg-[#000] w-[65%]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">65% of monthly goals completed</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
