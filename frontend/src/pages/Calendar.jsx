
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
    --rdp-accent-color: #000;
    --rdp-background-color: #f3f4f6;
    margin: 0;
  }
  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
    background-color: #000 !important;
    color: #fff !important;
    border-radius: 0 !important;
  }
  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: #facc15 !important;
    border-radius: 0 !important;
    color: #000 !important;
  }
  .rdp-day {
    font-weight: 900 !important;
    text-transform: uppercase !important;
    font-size: 1rem !important;
    border: 2px solid transparent;
  }
  .rdp-head_cell {
    font-weight: 900 !important;
    text-transform: uppercase !important;
    color: #000 !important;
    opacity: 1 !important;
  }
  .rdp-month_caption {
    font-weight: 900 !important;
    text-transform: uppercase !important;
    font-size: 1.5rem !important;
    letter-spacing: -0.05em !important;
    font-style: italic !important;
    margin-bottom: 20px !important;
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
    width: 6px;
    height: 6px;
    background-color: #ef4444;
    border-radius: 50%;
    border: 1px solid #000;
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
        <div className="space-y-12">
            <style>{calendarStyles}</style>
            <header>
                <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4">Tactical_Calendar</h1>
                <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none">Strategic planning for upcoming battles</p>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 border-8 border-[#000] border-dashed">
                    <Loader2 className="animate-spin mb-4" size={48} />
                    <h3 className="text-2xl font-black uppercase tracking-widest italic opacity-40">Syncing Global Conflict Data...</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <section className="border-8 border-[#000] bg-[#fff] p-8 shadow-[20px_20px_0px_0px_#000]">
                        <div className="flex justify-center">
                            <DayPicker
                                mode="single"
                                selected={selected}
                                onSelect={(day) => day && setSelected(day)}
                                modifiers={modifiers}
                                modifiersClassNames={{
                                    hasContest: 'has-contest'
                                }}
                            />
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="border-b-4 border-[#000] pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                                Battles: {format(selected, 'dd MMM yyyy')}
                            </h2>
                            <span className="bg-[#000] text-[#fff] px-4 py-1 font-black uppercase text-xs">
                                {contestsOnSelectedDay.length} Events Logged
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
                                            onClick={() => window.open(contest.url, '_blank')}
                                            className="border-4 border-[#000] bg-[#fff] p-6 shadow-[8px_8px_0px_0px_#000] group hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] transition-all cursor-pointer"
                                        >

                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-black uppercase border-2 border-[#000] px-2 py-0.5 bg-[#000] text-[#fff]">
                                                    {contest.platform}
                                                </span>
                                                <span className="text-xs font-black uppercase opacity-60 flex items-center gap-2">
                                                    <Bell size={14} /> {format(parseISO(contest.date), 'HH:mm')} UTC
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight mb-6">
                                                {contest.name}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <a
                                                    href={contest.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-[#2563eb] text-[#fff] py-3 font-black uppercase tracking-widest text-xs text-center border-4 border-[#000] hover:bg-[#1e40af] transition-colors"
                                                >
                                                    Register Now
                                                </a>
                                                <button className="flex-1 border-4 border-[#000] py-3 font-black uppercase tracking-widest text-xs hover:bg-[#000] hover:text-[#fff] transition-all">
                                                    Add Intel
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-8 border-[#000] border-dashed p-20 text-center bg-[#f9fafb]"
                                    >
                                        <p className="text-3xl font-black uppercase tracking-tighter italic opacity-20">No Hostile Activity Detected_</p>
                                        <p className="font-bold uppercase tracking-widest text-[10px] opacity-40 mt-2">Check another date for incoming operations</p>
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
