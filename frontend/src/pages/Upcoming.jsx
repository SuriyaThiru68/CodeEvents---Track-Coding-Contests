
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink,
    Loader2,
    ChevronDown,
    X
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import { scheduleReminder } from '../services/api';

export default function Upcoming() {
    const { contests, refreshContests, isLoading, user } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [platformFilter, setPlatformFilter] = useState('All');
    const [selectedContest, setSelectedContest] = useState(null);
    const [alertData, setAlertData] = useState({ email: '', time: '15', notes: '' });

    useEffect(() => {
        refreshContests();
    }, []);

    useEffect(() => {
        if (user?.email) {
            setAlertData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const platforms = ['All', 'LeetCode', 'CodeChef', 'Codeforces', 'AtCoder', 'CodingNinjas', 'HackerRank'];

    const filteredContests = contests.filter(c =>
        (platformFilter === 'All' || c.platform === platformFilter) &&
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateAlert = (contest) => {
        setSelectedContest(contest);
        setAlertData({
            email: user?.email || '',
            time: '15',
            notes: `Reminder for ${contest.name}`
        });
    };

    const submitAlert = async () => {
        if (!alertData.email) {
            toast.error('Uplink email required.');
            return;
        }

        toast.promise(scheduleReminder(selectedContest, parseInt(alertData.time), alertData.email), {
            loading: 'Synchronizing alert...',
            success: 'Alert deployed. Check your registry mail.',
            error: 'Uplink synchronization failure.'
        });
        setSelectedContest(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 relative text-white">
            <header className="space-y-4 pt-16">
                <div className="editorial-subtitle !text-[10px] !tracking-[0.3em] opacity-50">Global Coding Ecosystem</div>
                <div className="flex flex-col">
                    <h1 className="text-[6rem] md:text-[8rem] font-serif italic font-black leading-[1.1] tracking-tighter uppercase text-white pt-4">
                        Upcoming
                    </h1>
                    <h1 className="text-[6rem] md:text-[8rem] font-serif italic font-black leading-[1.1] tracking-tighter uppercase text-white/10">
                        Contests.
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-12 items-center">
                    <div className="relative flex-[4] w-full group">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search archives by name or node..."
                            className="input-minimal px-10 h-20 !text-lg !bg-zinc-900 border-zinc-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.3)] focus:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                        />
                    </div>
                    <div className="relative flex-[1] w-full md:w-auto">
                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="input-minimal px-10 h-20 appearance-none cursor-pointer pr-16 w-full !text-sm font-black uppercase tracking-widest !bg-zinc-900 border-zinc-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.3)]"
                        >
                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={20} strokeWidth={2.5} />
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 border border-dashed border-zinc-900 rounded-3xl">
                    <Loader2 className="animate-spin mb-4 text-zinc-700" size={32} strokeWidth={1.5} />
                    <h3 className="editorial-subtitle !text-[10px] text-zinc-500">Synchronizing archive...</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredContests.map((contest, idx) => (
                        <motion.div
                            key={contest.id}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            whileHover={{
                                scale: 1.02,
                                y: -10,
                                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                            }}
                            transition={{
                                delay: idx * 0.05,
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="card-minimal flex flex-col p-10 group relative overflow-hidden cursor-default shadow-sm hover:shadow-2xl hover:shadow-black/5"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-800 rounded-bl-full translate-x-8 -translate-y-8" />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="editorial-subtitle !text-[10px] !text-zinc-500">{contest.platform}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-serif mb-8 leading-tight h-20 line-clamp-2 pr-12 text-white">
                                {contest.name}
                            </h3>

                            <div className="space-y-4 mb-12 flex-1 relative z-10">
                                <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-bold text-zinc-400">
                                    <span>{new Date(contest.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                    <span className="opacity-20">•</span>
                                    <span>{new Date(contest.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="bg-zinc-900 text-[9px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest text-zinc-400">{contest.duration}</span>
                                    <span className="bg-zinc-900 text-[9px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest text-zinc-400">Mixed</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 pt-8 relative z-10 border-t border-zinc-900">
                                <a
                                    href={contest.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-black w-full justify-center !py-4 shadow-xl shadow-black/5 !text-xs font-bold tracking-[0.1em]"
                                >
                                    Access Node <ExternalLink size={14} className="ml-2" />
                                </a>
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleCreateAlert(contest)}
                                        className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
                                    >
                                        Initialize Alert
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedContest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedContest(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-zinc-900 w-full max-w-xl rounded-[40px] p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative z-10 border border-zinc-800"
                        >
                            <button
                                onClick={() => setSelectedContest(null)}
                                className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={28} strokeWidth={1.5} />
                            </button>

                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <div className="editorial-subtitle !text-[12px] !tracking-[0.4em] opacity-40">Protocol Initialization</div>
                                    <h2 className="text-5xl font-serif italic font-black leading-none text-white">Deploy Alert.</h2>
                                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed border-l-2 border-zinc-800 pl-4">{selectedContest.name}</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="editorial-subtitle !text-[10px] !text-white font-black tracking-[0.2em]">Registry Email</label>
                                        <div className="relative">
                                            <input
                                                value={alertData.email}
                                                onChange={(e) => setAlertData({ ...alertData, email: e.target.value })}
                                                className="input-minimal px-8 !py-5 !text-sm !bg-black/50 border-zinc-800 rounded-2xl"
                                                placeholder="coder@gmail.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="editorial-subtitle !text-[10px] !text-white font-black tracking-[0.2em]">Pre-Contest Buffer (Minutes)</label>
                                        <div className="relative">
                                            <select
                                                value={alertData.time}
                                                onChange={(e) => setAlertData({ ...alertData, time: e.target.value })}
                                                className="input-minimal px-8 !py-5 !text-sm appearance-none !bg-black/50 border-zinc-800 rounded-2xl cursor-pointer"
                                            >
                                                <option value="5">5 Minutes Before</option>
                                                <option value="15">15 Minutes Before</option>
                                                <option value="30">30 Minutes Before</option>
                                                <option value="60">1 Hour Before</option>
                                            </select>
                                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="editorial-subtitle !text-[10px] !text-white font-black tracking-[0.2em]">Transmission Notes</label>
                                        <div className="relative">
                                            <textarea
                                                value={alertData.notes}
                                                onChange={(e) => setAlertData({ ...alertData, notes: e.target.value })}
                                                className="input-minimal px-8 !py-6 !text-sm h-32 resize-none !bg-black/50 border-zinc-800 rounded-2xl"
                                                placeholder="Reminder for node access..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={submitAlert}
                                    className="btn-black w-full justify-center !py-6 !text-lg !rounded-[100px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]"
                                >
                                    Sync Alert System
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {!isLoading && filteredContests.length === 0 && (
                <div className="py-40 text-center">
                    <div className="editorial-title italic opacity-10">EmptyArchive_</div>
                    <p className="mt-4 editorial-subtitle !text-[10px]">No active data streams detected for this query.</p>
                </div>
            )}
        </div>
    );
}
