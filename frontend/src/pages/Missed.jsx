
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Archive, Trash2, AlertTriangle, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Missed() {
    const { missedContests } = useStore();

    const mockMissed = missedContests.length > 0 ? missedContests : [
        { id: 201, name: 'Google Kick Start Round G', platform: 'HackerRank', date: '2026-01-20', reason: 'Internet Outage' },
        { id: 202, name: 'Codeforces Round 910', platform: 'Codeforces', date: '2026-01-18', reason: 'Slept through the event' },
    ];

    return (
        <div className="space-y-12">
            <header className="border-b-8 border-[#000] pb-8">
                <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4 text-red-500">Missed_Battles</h1>
                <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none">Opportunities lost. Learn and move forward.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mockMissed.map((contest, i) => (
                    <motion.div
                        key={contest.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="border-4 border-[#000] bg-[#fff] p-8 shadow-[10px_10px_0px_0px_#ef4444] relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle size={120} />
                        </div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <span className="bg-red-500 text-[#fff] px-3 py-1 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Clock size={12} /> Missed
                            </span>
                            <span className="font-black uppercase text-[10px] tracking-widest opacity-40 italic">{contest.platform}</span>
                        </div>

                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 relative z-10">{contest.name}</h3>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-60">
                                <Clock size={16} /> Originally on {contest.date}
                            </div>
                            <div className="bg-red-50 border-2 border-red-500/20 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Reason for missing:</p>
                                <p className="font-bold italic opacity-80">"{contest.reason || 'No specific reason provided.'}"</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button className="flex-1 border-4 border-[#000] py-3 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#000] hover:text-[#fff] transition-all">
                                <Archive size={14} /> Archive
                            </button>
                            <button className="flex-1 bg-red-500 text-[#fff] py-3 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-600 transition-colors border-4 border-[#000] shadow-[5px_5px_0px_0px_#000]">
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="bg-red-500 text-[#fff] border-8 border-[#000] p-12">
                <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">Efficiency Alert</h3>
                    <p className="text-lg font-bold opacity-80 uppercase tracking-widest mb-8">
                        You missed 2 registered contests this week. Consider enabling desktop push notifications to avoid future misses.
                    </p>
                    <button className="bg-[#fff] text-red-500 px-10 py-4 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[10px_10px_0px_0px_#000]">
                        Set Reminders
                    </button>
                </div>
            </section>
        </div>
    );
}
