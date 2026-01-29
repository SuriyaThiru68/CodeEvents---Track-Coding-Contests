import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Bell, ExternalLink, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

export default function Upcoming() {
    const { contests, registerContest, refreshContests, isLoading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [platformFilter, setPlatformFilter] = useState('All');

    useEffect(() => {
        refreshContests();
    }, []);

    const platforms = ['All', 'LeetCode', 'CodeChef', 'Codeforces', 'AtCoder', 'Basecamp', 'Naukri'];


    const filteredContests = contests.filter(c =>
        (platformFilter === 'All' || c.platform === platformFilter) &&
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">
                <div>
                    <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4">Upcoming_</h1>
                    <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none">Register and prepare for the next battle</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search contests..."
                            className="pl-12 pr-4 py-3 border-4 border-[#000] font-bold uppercase tracking-widest text-xs focus:bg-[#000] focus:text-[#fff] transition-colors outline-none min-w-[300px]"
                        />
                    </div>
                    <div className="flex items-center gap-2 border-4 border-[#000] px-4 py-2 bg-[#fff]">
                        <SlidersHorizontal size={18} />
                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="bg-transparent font-black uppercase text-xs tracking-widest outline-none cursor-pointer"
                        >
                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 border-8 border-[#000] border-dashed">
                    <Loader2 className="animate-spin mb-4" size={48} />
                    <h3 className="text-2xl font-black uppercase tracking-widest italic opacity-40">Syncing Global Conflict Data...</h3>
                </div>
            ) : (
                <>
                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredContests.map((contest) => (
                            <motion.div
                                key={contest.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => window.open(contest.url, '_blank')}
                                className="border-4 border-[#000] bg-[#fff] p-8 shadow-[10px_10px_0px_0px_#000] group flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-all"
                            >

                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="bg-[#000] text-[#fff] px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                            {contest.platform}
                                        </span>
                                        {contest.registered ? (
                                            <span className="text-green-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-1">
                                                <Calendar size={12} /> Registered
                                            </span>
                                        ) : (
                                            <span className="opacity-40 font-black uppercase text-[10px] tracking-widest italic">Open</span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-red-500 transition-colors">
                                        {contest.name}
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-60">
                                            <Calendar size={16} /> {new Date(contest.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-60">
                                            <Bell size={16} /> {new Date(contest.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="border border-current px-2 py-0.5 text-[10px] font-black uppercase">{contest.duration}</span>
                                            <span className="border border-current px-2 py-0.5 text-[10px] font-black uppercase bg-gray-100">{contest.difficulty}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-6 border-t-2 border-[#000]/10">
                                    {contest.registered ? (
                                        <button className="w-full border-4 border-red-500 text-red-500 py-3 font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-[#fff] transition-colors">
                                            Unregister
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { registerContest(contest.id); toast.success(`Registered for ${contest.name}`); }}
                                            className="w-full bg-[#000] text-[#fff] py-3 font-black uppercase tracking-widest text-xs hover:bg-[#333] transition-colors border-4 border-[#000]"
                                        >
                                            Register Now
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            const user = useStore.getState().user;
                                            toast.promise(
                                                new Promise((resolve) => setTimeout(resolve, 1500)),
                                                {
                                                    loading: 'Generating Protocol...',
                                                    success: `System: Reminder sent to ${user?.email || 'authenticated email'}`,
                                                    error: 'Transmission Failure',
                                                }
                                            );
                                        }}
                                        className="w-full border-4 border-[#000] py-3 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#000] hover:text-[#fff] transition-all shadow-[4px_4px_0px_0px_#000]"
                                    >
                                        Remind Me <ExternalLink size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </section>

                    {filteredContests.length === 0 && (
                        <div className="border-8 border-[#000] border-dashed p-32 text-center">
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic opacity-20">No Battles Found_</h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
