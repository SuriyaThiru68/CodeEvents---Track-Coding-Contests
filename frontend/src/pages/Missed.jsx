import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Archive, Trash2, AlertTriangle, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Missed() {
    const { missedContests } = useStore();

    return (
        <div className="space-y-12 text-[#fafafa] pt-6">
            <header className="border-b border-white/5 pb-12 space-y-4">
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/35">Missed List</div>
                <h1 className="text-[5rem] leading-[0.95] tracking-tighter uppercase text-white font-light">
                    Missed <span className="text-white/35 font-normal">Events</span>
                </h1>
                <p className="text-sm font-semibold text-white/30 uppercase tracking-[0.2em] leading-none">Events you couldn't attend.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {missedContests.length > 0 ? missedContests.map((contest, i) => (
                    <motion.div
                        key={contest.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#121215] border border-white/5 p-10 relative group overflow-hidden rounded-[2.5rem] shadow-sm hover:border-white/15 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                            <AlertTriangle size={120} />
                        </div>

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <span className="bg-white/5 text-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-1">
                                <Clock size={12} /> Missed
                            </span>
                            <span className="font-bold uppercase text-[9px] tracking-widest text-white/35">{contest.platform}</span>
                        </div>

                        <h3 className="text-3xl font-light uppercase tracking-tight mb-8 relative z-10 text-white">{contest.name}</h3>

                        <div className="space-y-6 mb-10 relative z-10">
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                                <Clock size={14} /> Originally on {contest.date}
                            </div>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                                <p className="text-[9px] font-bold uppercase tracking-widest mb-2 text-white/35">Reason:</p>
                                <p className="font-light text-white/60">"{contest.reason || 'No specific reason provided.'}"</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button className="flex-1 border border-white/10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-white/60 flex items-center justify-center gap-2">
                                <Archive size={14} /> Archive
                            </button>
                            <button className="flex-1 px-4 py-4 bg-white hover:bg-white/85 text-black font-semibold rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="lg:col-span-2 p-32 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-[#121215] shadow-sm">
                        <Archive size={64} className="mx-auto mb-8 text-white/10" />
                        <h3 className="text-3xl font-light uppercase tracking-tight text-white/20 mb-4">No Missed Events</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Clean record maintained.</p>
                    </div>
                )}
            </div>

            {missedContests.length > 0 && (
                <section className="bg-[#121215] border border-white/5 p-16 rounded-[40px] text-center shadow-lg shadow-white/5">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-3xl font-light uppercase tracking-tight mb-4 text-white">Optimization Tip</h3>
                        <p className="text-sm font-semibold text-white/40 uppercase tracking-[0.2em] mb-10 leading-relaxed">
                            You missed {missedContests.length} events recently. Enable notifications to stay on track with your goals.
                        </p>
                        <button className="bg-white hover:bg-white/90 text-black font-semibold px-12 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-white/5">
                            Set Alert
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
