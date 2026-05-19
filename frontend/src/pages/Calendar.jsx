import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { Bell, ExternalLink, ChevronLeft, ChevronRight, Loader2, CalendarPlus, Search, ChevronDown } from 'lucide-react';

const PLATFORMS = ['All', 'Codeforces', 'LeetCode', 'AtCoder', 'CodeChef', 'CodingNinjas', 'HackerRank'];

const PLATFORM_DOT = {
    Codeforces: 'bg-white',
    LeetCode: 'bg-white/60',
    AtCoder: 'bg-white/80',
    CodeChef: 'bg-white/50',
    CodingNinjas: 'bg-white/40',
    HackerRank: 'bg-white/30',
};

const addToGoogleCalendar = (contest) => {
    const start = new Date(contest.date);
    const end = new Date(start.getTime() + 2 * 3600 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.name)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent('Contest on ' + contest.platform)}&location=${encodeURIComponent(contest.url || '')}`;
    window.open(url, '_blank');
};

export default function CalendarPage() {
    const { contests, isLoading, refreshContests } = useStore();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selected, setSelected] = useState(new Date());
    const [platformFilter, setPlatformFilter] = useState('All');
    const [search, setSearch] = useState('');

    React.useEffect(() => { refreshContests(); }, []);

    const filtered = contests.filter(c =>
        (platformFilter === 'All' || c.platform === platformFilter) &&
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Group by date for the left list (upcoming only, sorted)
    const upcoming = [...filtered]
        .filter(c => new Date(c.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const grouped = upcoming.reduce((acc, c) => {
        const key = format(parseISO(c.date), 'M/d/yyyy');
        if (!acc[key]) acc[key] = [];
        acc[key].push(c);
        return acc;
    }, {});

    // Calendar grid
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPad = getDay(monthStart);
    const contestsOnDay = (day) => filtered.filter(c => isSameDay(parseISO(c.date), day));
    const selectedContests = contestsOnDay(selected);

    return (
        <div className="max-w-7xl mx-auto text-[#fafafa] pt-6">
            {/* Search + Filter bar */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Contests..."
                        className="w-full pl-10 pr-4 py-3 bg-[#121215] border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/25 outline-none focus:border-white/25 transition-all shadow-sm" />
                </div>
                <div className="relative">
                    <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}
                        className="pl-4 pr-10 py-3 bg-[#121215] border border-white/5 rounded-2xl text-sm font-medium text-white appearance-none cursor-pointer outline-none hover:border-white/20 transition-all shadow-sm">
                        {PLATFORMS.map(p => <option key={p} value={p} className="bg-[#121215]">{p === 'All' ? 'All Platforms' : p}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ── LEFT: Upcoming List ───────────────────────── */}
                <aside className="lg:col-span-4 space-y-4">
                    <div>
                        <h2 className="text-xl font-light uppercase tracking-tight text-white mb-1">Upcoming Contests</h2>
                        <p className="text-[9px] text-white/35 uppercase tracking-widest">Don't miss scheduled events</p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={24} className="animate-spin text-white/30" />
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                            {Object.entries(grouped).slice(0, 20).map(([dateKey, list]) => (
                                <div key={dateKey}>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-2 px-1">{dateKey}</div>
                                    <div className="space-y-2">
                                        {list.map(c => (
                                            <motion.div key={c.id} whileHover={{ x: 3 }}
                                                className="bg-[#121215] border border-white/5 rounded-2xl p-4 hover:border-white/15 transition-all shadow-sm">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                                                        {format(parseISO(c.date), 'dd-MM-yyyy  HH:mm')} – {format(new Date(parseISO(c.date).getTime() + 2 * 3600000), 'HH:mm')}
                                                    </div>
                                                    <a href={c.url} target="_blank" rel="noreferrer"
                                                        className="text-white/25 hover:text-white transition-colors flex-shrink-0">
                                                        <ExternalLink size={13} />
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PLATFORM_DOT[c.platform] || 'bg-white/30'}`} />
                                                    <span className="text-sm font-medium text-white leading-snug">{c.name}</span>
                                                </div>
                                                <button onClick={() => addToGoogleCalendar(c)}
                                                    className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                                    <CalendarPlus size={11} /> Add to Calendar
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {upcoming.length === 0 && (
                                <div className="text-center py-12 text-[9px] text-white/25 uppercase tracking-widest">No upcoming contests</div>
                            )}
                        </div>
                    )}
                </aside>

                {/* ── RIGHT: Calendar Grid ─────────────────────── */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-[#121215] border border-white/5 rounded-3xl p-6 shadow-sm">
                        {/* Month navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-light uppercase tracking-tight text-white">
                                {format(currentMonth, 'MMMM yyyy')}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentMonth(d => subMonths(d, 1))}
                                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white transition-all">
                                    <ChevronLeft size={14} />
                                </button>
                                <button onClick={() => setCurrentMonth(d => addMonths(d, 1))}
                                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black hover:border-white transition-all">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                                <div key={d} className="text-center text-[9px] font-bold uppercase tracking-widest text-white/25 py-2">{d}</div>
                            ))}
                        </div>

                        {/* Grid cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
                            {days.map(day => {
                                const dayContests = contestsOnDay(day);
                                const isSelected = isSameDay(day, selected);
                                const isToday = isSameDay(day, new Date());
                                return (
                                    <button key={day.toString()} onClick={() => setSelected(day)}
                                        className={`relative min-h-[70px] rounded-xl p-1.5 text-left border transition-all ${isSelected ? 'bg-white border-white' : isToday ? 'border-white/40 bg-white/5' : 'border-transparent hover:bg-white/5 hover:border-white/10'}`}>
                                        <div className={`text-[10px] font-bold mb-1 ${isSelected ? 'text-black' : isToday ? 'text-white' : 'text-white/50'}`}>
                                            {format(day, 'd')}
                                        </div>
                                        <div className="space-y-0.5">
                                            {dayContests.slice(0, 2).map(c => (
                                                <div key={c.id} className={`text-[7px] font-bold uppercase truncate px-1 py-0.5 rounded ${isSelected ? 'bg-black text-black' : 'bg-white/10 text-white/60'}`}>
                                                    {c.platform.slice(0, 2).toUpperCase()} {c.name.slice(0, 10)}
                                                </div>
                                            ))}
                                            {dayContests.length > 2 && (
                                                <div className={`text-[7px] font-bold px-1 ${isSelected ? 'text-black/60' : 'text-white/30'}`}>+{dayContests.length - 2} more</div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected day contests */}
                    <AnimatePresence mode="wait">
                        <motion.div key={selected?.toString()} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-[#121215] border border-white/5 rounded-3xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1">Events</div>
                                    <h3 className="text-lg font-light uppercase tracking-tight text-white">
                                        {format(selected, 'dd MMM yyyy')}
                                    </h3>
                                </div>
                                <span className="bg-white text-black text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{selectedContests.length} found</span>
                            </div>

                            {selectedContests.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedContests.map(c => (
                                        <div key={c.id} className="border border-white/5 rounded-2xl p-4 hover:border-white/15 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white text-black rounded-full">{c.platform}</span>
                                                <span className="text-[9px] text-white/35 flex items-center gap-1"><Bell size={10} /> {format(parseISO(c.date), 'HH:mm')}</span>
                                            </div>
                                            <h4 className="text-sm font-medium text-white mb-3 leading-snug">{c.name}</h4>
                                            <div className="flex gap-2">
                                                <a href={c.url} target="_blank" rel="noreferrer"
                                                    className="flex-1 py-2 bg-white hover:bg-white/80 text-black rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all text-center font-semibold">
                                                    View
                                                </a>
                                                <button onClick={() => addToGoogleCalendar(c)}
                                                    className="flex-1 py-2 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white/50 hover:bg-white/5 transition-all flex items-center justify-center gap-1">
                                                    <CalendarPlus size={11} /> Add
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-[9px] text-white/25 uppercase tracking-widest">No events on this day</div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
