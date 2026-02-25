
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useStore } from '../store/useStore';
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Bell, ExternalLink, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom styles for react-day-picker to match Neo-Brutalism
const calendarStyles = `
  .rdp {
    --rdp-cell-size: 50px;
    --rdp-accent-color: #fff;
    --rdp-background-color: #09090b;
    margin: 0;
  }
  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
    background-color: #fff !important;
    color: #000 !important;
    border-radius: 12px !important;
  }
  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: #1a1a1a !important;
    border-radius: 12px !important;
    color: #fff !important;
  }
  .rdp-day {
    font-weight: 500 !important;
    text-transform: uppercase !important;
    font-size: 0.875rem !important;
    border: 1px solid transparent;
    color: #a1a1aa;
  }
  .rdp-head_cell {
    font-weight: 700 !important;
    text-transform: uppercase !important;
    color: #52525b !important;
    opacity: 1 !important;
    font-size: 0.75rem !important;
    tracking: 0.1em !important;
  }
  .rdp-month_caption {
    font-weight: 700 !important;
    text-transform: uppercase !important;
    font-size: 1.25rem !important;
    letter-spacing: 0.1em !important;
    font-family: inherit !important;
    margin-bottom: 20px !important;
    color: #fff !important;
  }
  .has-contest, .rdp-day_hasContest {
    position: relative;
  }
  .has-contest::after, .rdp-day_hasContest::after {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background-color: #ffffff;
    border-radius: 50%;
  }

  @media (max-width: 640px) {
    .rdp {
      --rdp-cell-size: 40px;
    }
  }
`;

export default function CalendarPage() {
    const { contests, isLoading, refreshContests } = useStore();
    const [selected, setSelected] = useState(new Date());

    React.useEffect(() => {
        refreshContests();
    }, []);


    const contestsOnSelectedDay = contests.filter(c =>
        isSameDay(parseISO(c.date), selected)
    );

    const modifiers = {
        hasContest: contests.map(c => parseISO(c.date))
    };

    return (
        <div className="space-y-12 text-white">
            <style>{calendarStyles}</style>
            <header className="space-y-4">
                <div className="editorial-subtitle !text-[10px] !tracking-[0.3em] opacity-50 uppercase">Strategic Planning</div>
                <h1 className="text-7xl font-serif italic font-black uppercase tracking-tighter text-white">
                    Tactical_<span className="opacity-30">Calendar</span>
                </h1>
                <p className="text-sm font-medium opacity-40 uppercase tracking-[0.2em]">Operational intelligence for upcoming deployments</p>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 border border-dashed border-zinc-900 rounded-[40px]">
                    <Loader2 className="animate-spin mb-4 text-zinc-700" size={32} />
                    <h3 className="editorial-subtitle !text-[10px] text-zinc-500">Syncing conflict streams...</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <section className="card-minimal p-12 flex justify-center border-zinc-900 bg-zinc-950/50">
                        <DayPicker
                            mode="single"
                            selected={selected}
                            onSelect={(day) => day && setSelected(day)}
                            modifiers={modifiers}
                            modifiersClassNames={{
                                hasContest: 'has-contest'
                            }}
                        />
                    </section>

                    <section className="space-y-8">
                        <div className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-serif italic font-black uppercase tracking-tighter text-white">
                                    Battles: {format(selected, 'dd MMM yyyy')}
                                </h2>
                                <p className="editorial-subtitle !text-[10px] text-zinc-500 uppercase tracking-widest">Incident log for selected period</p>
                            </div>
                            <span className="bg-zinc-800 text-white px-4 py-2 rounded-full font-black uppercase text-[10px] tracking-widest">
                                {contestsOnSelectedDay.length} Events detected
                            </span>
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {contestsOnSelectedDay.length > 0 ? (
                                    contestsOnSelectedDay.map((contest, i) => (
                                        <motion.div
                                            key={contest.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="card-minimal p-8 group hover:-translate-y-1 transition-all cursor-default border-zinc-900"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="text-[9px] font-black uppercase px-3 py-1 bg-zinc-800 text-white rounded-full tracking-widest">
                                                    {contest.platform}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase text-zinc-500 flex items-center gap-2 tracking-widest">
                                                    <Bell size={12} /> {format(parseISO(contest.date), 'HH:mm')} UTC
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-serif italic font-black uppercase tracking-tight mb-8 text-white">
                                                {contest.name}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-900">
                                                <a
                                                    href={contest.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-black flex-1 justify-center !py-4 !text-[10px] !tracking-[0.2em] font-black"
                                                >
                                                    Access Node
                                                </a>
                                                <button className="flex-1 border border-zinc-800 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all text-zinc-400 hover:text-white">
                                                    Intelligence
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="card-minimal border-dashed p-20 text-center border-zinc-900 bg-zinc-950/30"
                                    >
                                        <p className="text-3xl font-serif italic font-black uppercase tracking-tighter text-white opacity-20">No Hostile Activity Detected_</p>
                                        <p className="editorial-subtitle !text-[9px] text-zinc-500 uppercase tracking-widest mt-4">Check another date for incoming operations</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
