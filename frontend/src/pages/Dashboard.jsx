
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Calendar,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    ChevronRight,
    Target,
    Zap,
    Trophy,
    TrendingUp
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Dashboard() {
    const { contests, attendedContests, missedContests, getTotalSolved, user } = useStore();
    const totalSolved = getTotalSolved?.() || 0;

    const stats = [
        { label: 'Upcoming', value: contests.length, icon: Calendar, color: 'bg-blue-500' },
        { label: 'Solved', value: totalSolved, icon: Target, color: 'bg-green-500' },
        { label: 'Attended', value: attendedContests.length, icon: CheckCircle2, color: 'bg-black' },
        { label: 'Success', value: '84%', icon: Zap, color: 'bg-yellow-500' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-7xl mx-auto space-y-24 pt-12"
        >
            <motion.header variants={itemVariants} className="space-y-4 mb-4">
                <div className="editorial-subtitle opacity-50 tracking-[0.3em]">Personal Command Center</div>
                <h1 className="text-[5rem] md:text-[7rem] font-serif italic font-black leading-[1.1] tracking-tighter uppercase text-black pt-4">
                    Overview. <br />
                    <span className="text-4xl md:text-6xl lg:text-5xl text-gray-400">A quick view of your upcoming events, completed tasks, and success rate.</span>
                </h1>
            </motion.header>

            {/* Stats Grid */}
            <motion.section
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        className="card-minimal p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-16 h-16 ${stat.color} opacity-0 group-hover:opacity-5 rounded-bl-full transition-opacity duration-500`} />
                        <stat.icon className="mb-6 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" size={24} strokeWidth={1.5} />
                        <div className="editorial-subtitle mb-2 transition-colors duration-500 group-hover:text-black">{stat.label}</div>
                        <div className="text-6xl font-serif tracking-tighter group-hover:scale-105 transition-transform duration-500">{stat.value}</div>
                    </motion.div>
                ))}
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Challenges Section */}
                <motion.section variants={itemVariants} className="lg:col-span-2 space-y-12">
                    <div className="flex justify-between items-end">
                        <h2 className="text-4xl font-serif italic">Next Challenges <span className="opacity-20">/ Recent</span></h2>
                        <Link to="/upcoming" className="editorial-subtitle text-black flex items-center gap-1 group">
                            Full Calendar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {contests.length > 0 ? contests.slice(0, 4).map((contest, i) => (
                            <motion.div
                                key={contest.id}
                                variants={itemVariants}
                                whileHover={{ x: 10 }}
                                className="card-minimal flex items-center p-8 group hover:border-black transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center font-serif text-2xl shadow-xl shadow-black/10 group-hover:rotate-6 transition-transform">
                                    {new Date(contest.date).getDate()}
                                </div>
                                <div className="ml-8 flex-1">
                                    <div className="editorial-subtitle !text-[10px] mb-2 opacity-40 group-hover:opacity-100 uppercase tracking-widest">{contest.platform}</div>
                                    <h3 className="text-2xl font-serif group-hover:tracking-tight transition-all">{contest.name}</h3>
                                </div>
                                <div className="text-right pr-8 border-r border-gray-50 group-hover:border-black/10 transition-colors">
                                    <div className="editorial-subtitle !text-[10px] mb-1 opacity-30">Window</div>
                                    <div className="text-sm font-black uppercase tracking-widest">{contest.duration}</div>
                                </div>
                                <Link to="/upcoming" className="ml-8 w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500">
                                    <ArrowUpRight size={20} strokeWidth={1.5} />
                                </Link>
                            </motion.div>
                        )) : (
                            <div className="p-20 text-center border-2 border-dashed border-gray-50 rounded-[40px]">
                                <p className="editorial-subtitle opacity-30">No active challenges in orbit.</p>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Performance Analytics Sidebar */}
                <motion.section variants={itemVariants} className="space-y-12">
                    <h2 className="text-4xl font-serif italic">Global Status <span className="opacity-20">/ Rank</span></h2>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card-minimal !bg-black text-white p-12 relative overflow-hidden group shadow-2xl shadow-black/20"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                        <Trophy className="text-white opacity-20 mb-8" size={40} strokeWidth={1} />
                        <div className="editorial-subtitle text-white/50 mb-3 font-bold tracking-[0.4em] uppercase !text-[9px]">Global Protocol Tier</div>
                        <div className="text-5xl font-serif mb-8 italic tracking-tighter">Grandmaster</div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                            <TrendingUp size={16} className="text-green-500" />
                            <span>+24 positions gained</span>
                        </div>
                    </motion.div>

                    <div className="card-minimal p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="flex justify-between editorial-subtitle !text-black font-black uppercase !text-[10px] tracking-widest">
                                <span className="opacity-40">System Engagement</span>
                                <span>64%</span>
                            </div>
                            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '64%' }}
                                    transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
                                    className="h-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">65% of monthly combat objectives successfully secured across all nodes.</p>
                    </div>

                    <div className="p-8 border border-gray-100 rounded-[30px] flex items-center gap-6 group hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 transition-transform group-hover:rotate-12">
                            <Target size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest">Precision Goal</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Next target: Expert Tier</div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
}
