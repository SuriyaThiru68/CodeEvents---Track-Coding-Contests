
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Download, ChevronRight, Hash, Target, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Attended() {
    const { attendedContests } = useStore();

    // Mock data for attended contests if empty
    const mockAttended = attendedContests.length > 0 ? attendedContests : [
        { id: 101, name: 'Codeforces Round 898', platform: 'Codeforces', rank: '#245', score: '1020', solved: '4/6', date: '2026-01-15' },
        { id: 102, name: 'LeetCode Weekly 375', platform: 'LeetCode', rank: '#12', score: 'Max', solved: '4/4', date: '2026-01-12' },
        { id: 103, name: 'AtCoder Beginner 330', platform: 'AtCoder', rank: '#1056', score: '800', solved: '5/8', date: '2026-01-05' },
    ];

    return (
        <div className="space-y-12 text-white">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b border-zinc-900 pb-12">
                <div className="space-y-4">
                    <div className="editorial-subtitle !text-[10px] !tracking-[0.3em] opacity-50 uppercase">Operational Victories</div>
                    <h1 className="text-7xl font-serif italic font-black uppercase tracking-tighter text-white">
                        Victory_<span className="opacity-30">Log</span>
                    </h1>
                    <p className="text-sm font-medium opacity-40 uppercase tracking-[0.2em] leading-none">Your journey through code</p>
                </div>
                <button className="btn-black !text-[10px] !tracking-[0.2em] shadow-xl shadow-white/5">
                    <Download size={18} /> Export History
                </button>
            </header>

            <section className="space-y-6">
                {mockAttended.map((contest, i) => (
                    <motion.div
                        key={contest.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-minimal border-zinc-900 bg-zinc-950/50 overflow-hidden group hover:-translate-y-1 transition-all"
                    >
                        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-900">
                            {/* Main Info */}
                            <div className="flex-1 p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-zinc-900 text-zinc-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">{contest.platform}</span>
                                    <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest italic">{contest.date}</span>
                                </div>
                                <h3 className="text-4xl font-serif italic font-black uppercase tracking-tighter mb-6 group-hover:text-white transition-colors">{contest.name}</h3>
                                <button className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                                    View Problem Set <ChevronRight size={14} />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="lg:w-[450px] flex divide-x divide-zinc-900 bg-zinc-950/20">
                                <StatItem icon={Hash} label="Rank" value={contest.rank} />
                                <StatItem icon={Target} label="Solved" value={contest.solved} />
                                <StatItem icon={Zap} label="Score" value={contest.score} />
                            </div>

                            {/* Action */}
                            <button className="lg:w-32 bg-zinc-950 hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center p-8 group/btn">
                                <ChevronRight size={40} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}

const StatItem = ({ icon: Icon, label, value }) => (
    <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
        <Icon size={20} className="mb-3 text-zinc-700" />
        <p className="editorial-subtitle !text-[9px] text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-serif italic font-black tracking-tighter text-white">{value}</p>
    </div>
);
