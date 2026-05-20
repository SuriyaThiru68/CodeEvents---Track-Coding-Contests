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
import { scheduleReminder, updatePreferencesToDb } from '../services/api';

export default function Upcoming() {
    const { contests, refreshContests, isLoading, user } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [platformFilter, setPlatformFilter] = useState('All');
    const [selectedContest, setSelectedContest] = useState(null);
    const [alertData, setAlertData] = useState({ 
        email: '', 
        time: '15', 
        notes: '',
        alertMethod: 'email',
        phoneNumber: '' 
    });

    useEffect(() => {
        refreshContests();
    }, []);

    useEffect(() => {
        if (user) {
            setAlertData(prev => ({ 
                ...prev, 
                email: user.email || '',
                alertMethod: user.alertPreference || 'email',
                phoneNumber: user.phoneNumber || ''
            }));
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
            notes: `Reminder for ${contest.name}`,
            alertMethod: user?.alertPreference || 'email',
            phoneNumber: user?.phoneNumber || ''
        });
    };

    const submitAlert = async () => {
        if (!alertData.email) {
            toast.error('Email address is required to set an alert.');
            return;
        }

        const toastId = toast.loading('Setting alert & updating preferences...');
        try {
            // Update preferences in backend first so the reminder worker picks it up
            if (user) {
                await updatePreferencesToDb({
                    phoneNumber: alertData.phoneNumber,
                    alertPreference: alertData.alertMethod
                });
            }

            const result = await scheduleReminder(selectedContest, parseInt(alertData.time), alertData.email);
            toast.success(
                `Alert set! Confirmation sent to ${alertData.email}. You'll be reminded ${alertData.time} min before the contest.`,
                { id: toastId, duration: 6000 }
            );
            setSelectedContest(null);
        } catch (err) {
            toast.error('Failed to set alert. Please try again.', { id: toastId });
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 relative text-[#fafafa] pt-6">
            <header className="space-y-4">
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#4BB8FA]">Event Calendar</div>
                <div className="flex flex-col">
                    <h1 className="text-[5rem] md:text-[6.5rem] font-light leading-[0.95] tracking-tighter uppercase text-white">
                        Upcoming
                    </h1>
                    <h1 className="text-3xl md:text-5xl font-normal tracking-tight text-zinc-500 pt-2">
                        events.
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-12 items-center">
                    <div className="relative flex-[4] w-full group">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search events..."
                            className="w-full px-10 h-20 bg-[#121214] border border-zinc-800 rounded-[2rem] text-lg font-normal uppercase tracking-[0.1em] focus:border-[#4BB8FA]/50 outline-none transition-all placeholder:text-zinc-500 text-white shadow-sm"
                        />
                    </div>
                    <div className="relative flex-[1] w-full md:w-auto">
                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="w-full md:w-auto px-10 h-20 bg-[#121214] border border-zinc-800 rounded-[2rem] appearance-none cursor-pointer pr-16 text-sm font-semibold uppercase tracking-widest text-white outline-none hover:border-[#4BB8FA]/40 transition-all shadow-sm"
                        >
                            {platforms.map(p => <option key={p} value={p} className="bg-[#121214]">{p}</option>)}
                        </select>
                        <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} strokeWidth={2.5} />
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 border border-dashed border-zinc-800 rounded-[3rem]">
                    <Loader2 className="animate-spin mb-4 text-[#4BB8FA]" size={32} strokeWidth={1.5} />
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Loading Events...</h3>
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
                            className="bg-[#121214] border border-zinc-800 flex flex-col p-10 group relative overflow-hidden cursor-default shadow-sm hover:border-[#4BB8FA]/40 rounded-[2.5rem] transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#4BB8FA]/5 rounded-bl-full translate-x-8 -translate-y-8 group-hover:bg-[#4BB8FA]/10 transition-colors" />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4BB8FA]" />
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">{contest.platform}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-light mb-8 leading-tight h-20 line-clamp-2 pr-12 text-white tracking-tight uppercase">
                                {contest.name}
                            </h3>

                            <div className="space-y-4 mb-12 flex-1 relative z-10">
                                <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-bold text-zinc-500">
                                    <span>{new Date(contest.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                    <span className="opacity-20">•</span>
                                    <span>{new Date(contest.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="bg-[#4BB8FA]/10 border border-[#4BB8FA]/20 text-[9px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest text-[#4BB8FA]">{contest.duration}</span>
                                    <span className="bg-zinc-800/40 border border-zinc-700/50 text-[9px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest text-zinc-400">Global</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 pt-8 relative z-10 border-t border-zinc-800">
                                <a
                                    href={contest.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-8 py-4 bg-[#4BB8FA] hover:bg-[#0F9BF2] text-black rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#4BB8FA]/5 text-center font-semibold"
                                >
                                    View Event <ExternalLink size={14} className="ml-2" />
                                </a>
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleCreateAlert(contest)}
                                        className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-[#4BB8FA] transition-colors"
                                    >
                                        Add Alert
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#121214] w-full max-w-lg rounded-[2rem] p-10 shadow-2xl relative z-10 border border-zinc-800 max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setSelectedContest(null)}
                                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={24} strokeWidth={1.5} />
                            </button>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#4BB8FA]">Notifications</div>
                                    <h2 className="text-3xl font-light leading-none text-white">Get Alerted.</h2>
                                    <p className="text-[11px] text-zinc-400 uppercase tracking-widest leading-relaxed border-l-2 border-[#4BB8FA] pl-4">{selectedContest.name}</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500">Email</label>
                                        <input
                                            value={alertData.email}
                                            onChange={(e) => setAlertData({ ...alertData, email: e.target.value })}
                                            className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] focus:border-[#4BB8FA]/50 outline-none transition-all placeholder:text-zinc-650 text-white"
                                            placeholder="you@email.com"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500">Notification Method</label>
                                        <div className="relative">
                                            <select
                                                value={alertData.alertMethod}
                                                onChange={(e) => setAlertData({ ...alertData, alertMethod: e.target.value })}
                                                className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] appearance-none cursor-pointer outline-none hover:border-[#4BB8FA]/40 transition-all text-white"
                                            >
                                                <option value="email" className="bg-[#121214]">Email Only</option>
                                                <option value="whatsapp" className="bg-[#121214]">WhatsApp Only</option>
                                                <option value="both" className="bg-[#121214]">Both Email & WhatsApp</option>
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {(alertData.alertMethod === 'whatsapp' || alertData.alertMethod === 'both') && (
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500">Phone Number (WhatsApp)</label>
                                            <input
                                                value={alertData.phoneNumber}
                                                onChange={(e) => setAlertData({ ...alertData, phoneNumber: e.target.value })}
                                                className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] focus:border-[#4BB8FA]/50 outline-none transition-all placeholder:text-zinc-650 text-white"
                                                placeholder="+1234567890"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500">Alert Time</label>
                                        <div className="relative">
                                            <select
                                                value={alertData.time}
                                                onChange={(e) => setAlertData({ ...alertData, time: e.target.value })}
                                                className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] appearance-none cursor-pointer outline-none hover:border-[#4BB8FA]/40 transition-all text-white"
                                            >
                                                <option value="5" className="bg-[#121214]">5 Mins Before</option>
                                                <option value="15" className="bg-[#121214]">15 Mins Before</option>
                                                <option value="30" className="bg-[#121214]">30 Mins Before</option>
                                                <option value="60" className="bg-[#121214]">1 Hour Before</option>
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500">Notes</label>
                                        <textarea
                                            value={alertData.notes}
                                            onChange={(e) => setAlertData({ ...alertData, notes: e.target.value })}
                                            className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] focus:border-[#4BB8FA]/50 outline-none transition-all placeholder:text-zinc-650 text-white h-20 resize-none"
                                            placeholder="Extra notes..."
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={submitAlert}
                                    className="px-6 py-4 mt-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-[100px] text-[10px] font-bold uppercase tracking-[0.3em] transition-all w-full shadow-lg cursor-pointer"
                                >
                                    Save Alert
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {!isLoading && filteredContests.length === 0 && (
                <div className="py-40 text-center">
                    <div className="text-8xl font-light text-zinc-800 font-bold">Empty.</div>
                    <p className="mt-4 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">No events found.</p>
                </div>
            )}
        </div>
    );
}
