
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
        <div className="space-y-12 text-white">
            <header className="border-b border-zinc-900 pb-12 space-y-4">
                <div className="editorial-subtitle !text-[10px] !tracking-[0.3em] opacity-50 uppercase">Operational Lapses</div>
                <h1 className="text-7xl font-serif italic font-black uppercase tracking-tighter text-white">
                    Missed_<span className="opacity-30">Battles</span>
                </h1>
                <p className="text-sm font-medium opacity-40 uppercase tracking-[0.2em] leading-none">Opportunities lost. Learn and move forward.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mockMissed.map((contest, i) => (
                    <motion.div
                        key={contest.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-minimal border-zinc-900 bg-zinc-950/50 p-10 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                            <AlertTriangle size={120} />
                        </div>

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <span className="bg-zinc-800 text-zinc-400 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-1">
                                <Clock size={12} /> Missed
                            </span>
                            <span className="font-bold uppercase text-[9px] tracking-widest text-zinc-600 italic">{contest.platform}</span>
                        </div>

                        <h3 className="text-4xl font-serif italic font-black uppercase tracking-tighter mb-8 relative z-10 text-zinc-100">{contest.name}</h3>

                        <div className="space-y-6 mb-10 relative z-10">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <Clock size={14} /> Originally on {contest.date}
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                                <p className="editorial-subtitle !text-[9px] text-zinc-600 uppercase tracking-widest mb-2">Reason for missing:</p>
                                <p className="font-serif italic text-zinc-400">"{contest.reason || 'No specific reason provided.'}"</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button className="flex-1 border border-zinc-800 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all text-zinc-400 hover:text-white">
                                <Archive size={14} /> Archive
                            </button>
                            <button className="flex-1 btn-black !py-4 rounded-xl !text-[10px] !tracking-[0.2em]">
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="bg-zinc-900 border border-zinc-800 p-16 rounded-[40px] text-center">
                <div className="max-w-2xl mx-auto">
                    <h3 className="text-4xl font-serif italic font-black uppercase tracking-tighter mb-4 text-white">Efficiency Alert</h3>
                    <p className="text-sm font-medium opacity-40 uppercase tracking-[0.2em] mb-10 leading-relaxed">
                        You missed 2 registered contests this week. Consider enabling desktop push notifications to avoid future misses.
                    </p>
                    <button className="btn-black bg-white !text-black hover:bg-white/90 px-12 !py-5 shadow-2xl shadow-white/5">
                        Set Reminders
                    </button>
                </div>
            </section>
        </div>
    );
}
