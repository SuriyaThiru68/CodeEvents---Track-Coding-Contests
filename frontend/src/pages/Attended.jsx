import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Download, ChevronRight, Hash, Target, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Attended() {
    const { attendedContests } = useStore();

    return (
        <div className="space-y-12 text-[#fafafa] pt-6">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/35">History</div>
                    <h1 className="text-[5rem] leading-[0.95] tracking-tighter uppercase text-white font-light">
                        Victory <span className="text-white/35 font-normal">Feed</span>
                    </h1>
                    <p className="text-sm font-semibold text-white/30 uppercase tracking-[0.2em] leading-none">Contests you participated in.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/85 text-black font-semibold rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-white/5">
                    <Download size={18} /> Export
                </button>
            </header>

            <section className="space-y-6">
                {attendedContests.length > 0 ? attendedContests.map((contest, i) => (
                    <motion.div
                        key={contest.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#121215] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/15 transition-all shadow-sm"
                    >
                        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                            <div className="flex-1 p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-white/5 text-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">{contest.platform}</span>
                                    <span className="text-[10px] font-semibold uppercase text-white/35 tracking-widest">{contest.date}</span>
                                </div>
                                <h3 className="text-3xl font-light uppercase tracking-tight mb-6 text-white group-hover:text-white transition-colors">{contest.name}</h3>
                                <button className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-[0.2em] text-white/35 hover:text-white transition-colors">
                                    View Contest <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="lg:w-[450px] flex divide-x divide-white/5 bg-white/[0.02]">
                                <StatItem icon={Hash} label="Rank" value={contest.rank || '—'} />
                                <StatItem icon={Target} label="Solved" value={contest.solved || '—'} />
                                <StatItem icon={Zap} label="Score" value={contest.score || '—'} />
                            </div>
                            <button className="lg:w-32 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center p-8 group/btn text-white/35">
                                <ChevronRight size={40} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="p-32 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-[#121215] shadow-sm">
                        <Trophy size={64} className="mx-auto mb-8 text-white/10" />
                        <h3 className="text-3xl font-light uppercase tracking-tight text-white/20 mb-4">No Participation Record</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Wait for your next challenge.</p>
                    </div>
                )}
            </section>
        </div>
    );
}

const StatItem = ({ icon: Icon, label, value }) => (
    <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
        <Icon size={20} className="mb-3 text-white/35" />
        <p className="text-[9px] font-bold uppercase tracking-widest mb-1 text-white/30">{label}</p>
        <p className="text-2xl font-light tracking-tight text-white">{value}</p>
    </div>
);
