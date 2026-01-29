
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
        <div className="space-y-12">
            <header className="flex justify-between items-end border-b-8 border-[#000] pb-8">
                <div>
                    <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4 text-green-600">Victory_Log</h1>
                    <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none">Your journey through code</p>
                </div>
                <button className="bg-[#000] text-[#fff] px-8 py-4 font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#333] transition-colors shadow-[10px_10px_0px_0px_#4ade80]">
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
                        className="border-4 border-[#000] bg-[#fff] overflow-hidden group hover:shadow-[15px_15px_0px_0px_#000] transition-all"
                    >
                        <div className="flex flex-col lg:flex-row divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-[#000]">
                            {/* Main Info */}
                            <div className="flex-1 p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-[#000] text-[#fff] px-3 py-1 text-[10px] font-black uppercase tracking-widest">{contest.platform}</span>
                                    <span className="text-[10px] font-black uppercase opacity-40 italic">{contest.date}</span>
                                </div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 group-hover:text-green-600 transition-colors">{contest.name}</h3>
                                <button className="flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:underline">
                                    View Problem Set <ChevronRight size={14} />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="lg:w-[450px] flex divide-x-4 divide-[#000] bg-[#fafafa]">
                                <StatItem icon={Hash} label="Rank" value={contest.rank} />
                                <StatItem icon={Target} label="Solved" value={contest.solved} />
                                <StatItem icon={Zap} label="Score" value={contest.score} />
                            </div>

                            {/* Action */}
                            <button className="lg:w-32 bg-[#fff] hover:bg-[#000] hover:text-[#fff] transition-colors flex items-center justify-center p-8 group/btn">
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
        <Icon size={20} className="mb-2 opacity-30" />
        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">{label}</p>
        <p className="text-2xl font-black tracking-tighter">{value}</p>
    </div>
);
