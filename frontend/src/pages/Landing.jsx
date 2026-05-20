import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Search,
    Code,
    Sparkles,
    Clock,
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    Award,
    Calendar,
    Star,
    Zap,
    LayoutDashboard,
    Bell,
    Check
} from 'lucide-react';
import { useStore } from '../store/useStore';

// Mock avatars for social proof stack
const DEVELOPER_AVATARS = [
    { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', alt: 'Dev 1' },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', alt: 'Dev 2' },
    { url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', alt: 'Dev 3' },
    { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', alt: 'Dev 4' }
];

// Featured contests for the interactive slider card
const FEATURED_CONTESTS = [
    {
        id: 1,
        platform: 'LeetCode',
        title: 'Weekly Challenge 410',
        desc: '4 algorithmic questions testing problem solving under speed.',
        badgeColor: 'bg-[#4BB8FA]/10 text-[#4BB8FA] border-[#4BB8FA]/20',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        difficulty: 'Easy to Hard',
        prize: 'Free Access & Badges'
    },
    {
        id: 2,
        platform: 'Codeforces',
        title: 'Div. 2 Round 985',
        desc: 'Competitive format designed to sharpen mathematics & logic.',
        badgeColor: 'bg-[#4BB8FA]/10 text-[#4BB8FA] border-[#4BB8FA]/20',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
        difficulty: 'Medium to Hard',
        prize: 'Rating Points'
    },
    {
        id: 3,
        platform: 'AtCoder',
        title: 'Grand Contest 068',
        desc: 'Advanced problem sets ideal for testing complex algorithms.',
        badgeColor: 'bg-[#4BB8FA]/10 text-[#4BB8FA] border-[#4BB8FA]/20',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        difficulty: 'Very Hard',
        prize: 'Global Ranking'
    }
];

export default function Landing() {
    const { contests } = useStore();

    // Search widget state (buy/rent/sell equivalents)
    const [activeTab, setActiveTab] = useState('upcoming'); // 'live', 'upcoming', 'hackathons'
    const [searchValue, setSearchValue] = useState('');

    // Bottom filter bar selections
    const [filterPlatform, setFilterPlatform] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [filterDate, setFilterDate] = useState('this-week');
    const [filterLanguage, setFilterLanguage] = useState('all');

    // Featured contest slider state
    const [activeSlide, setActiveSlide] = useState(0);

    const handleNextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % FEATURED_CONTESTS.length);
    };

    const handlePrevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + FEATURED_CONTESTS.length) % FEATURED_CONTESTS.length);
    };

    // Derived counts
    const totalCount = contests?.length || 42;

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-[#4BB8FA]/20 selection:text-[#4BB8FA] font-sans antialiased overflow-x-hidden">

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

                    {/* Left: Brand Identity */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4BB8FA] to-[#0F9BF2] rounded-xl flex items-center justify-center text-black font-bold text-base shadow-sm">
                            CE
                        </div>
                        <span className="font-semibold text-xl tracking-tight text-white">
                            Code<span className="text-[#4BB8FA]">Events</span>
                        </span>
                    </div>

                  

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-semibold tracking-wide text-zinc-400 hover:text-white transition-all">
                            LOG IN
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 bg-white hover:bg-[#4BB8FA] text-black hover:text-black rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
                            Join Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-28 pb-20">

                {/* 1. Hero Card Container (Mimics premium asymmetry of the uploaded mockup) */}
                <section className="relative w-full rounded-[2.5rem] bg-[#121214] border border-zinc-800/80 p-6 sm:p-10 md:p-14 overflow-hidden mb-20 shadow-sm">
                    {/* Artistic gradient background accents */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#4BB8FA]/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">

                        {/* Left Side: Elegant typography & Pill Search Widget */}
                        <div className="lg:col-span-7 flex flex-col justify-center">

                            {/* Curved Header Tag */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/40 border border-zinc-800/80 rounded-full text-xs font-semibold text-[#4BB8FA] mb-6 w-fit shadow-xs">
                                <Sparkles size={12} />
                                <span>No.1 Coding Tracker</span>
                            </div>

                            {/* Headline matching image style */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-8">
                                Connecting you <span className="font-light text-zinc-400">to the</span> <br className="hidden sm:inline" />
                                <span className="text-[#4BB8FA] underline decoration-[#4BB8FA]/20 decoration-wavy decoration-2 underline-offset-8">contests</span> you love
                            </h1>

                            {/* Tab Filters (Like Buy, Rent, Sell) */}
                            <div className="flex gap-2 mb-3">
                                {[
                                    { id: 'upcoming', label: 'Upcoming' },
                                    { id: 'live', label: 'Live' },
                                    { id: 'hackathons', label: 'Hackathons' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab.id
                                                ? 'bg-zinc-800 text-[#4BB8FA] shadow-xs'
                                                : 'text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search bar inside pill card */}
                            <div className="relative max-w-xl bg-zinc-900 border border-zinc-850 rounded-full p-2 flex items-center shadow-md mb-8 hover:border-[#4BB8FA]/50 transition-all duration-300">
                                <Search className="text-zinc-500 ml-4 shrink-0" size={18} />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={
                                        activeTab === 'upcoming'
                                            ? 'Enter languages, platforms or keywords...'
                                            : activeTab === 'live'
                                                ? 'Search live matches now...'
                                                : 'Search community hackathons...'
                                    }
                                    className="w-full bg-transparent border-none outline-none pl-3 pr-4 py-2.5 text-sm text-white placeholder-zinc-500"
                                />
                                <Link
                                    to={`/register?q=${encodeURIComponent(searchValue)}`}
                                    className="w-12 h-12 bg-[#4BB8FA] hover:bg-[#0F9BF2] rounded-full flex items-center justify-center text-black shrink-0 shadow-sm transition-transform active:scale-95"
                                >
                                    <Search size={18} />
                                </Link>
                            </div>

                            {/* Quotation block matching "Turning your dreams..." */}
                            <div className="max-w-lg border-l-2 border-[#4BB8FA]/50 pl-5 py-1">
                                <p className="text-sm italic text-zinc-400 leading-relaxed">
                                    "CodeEvents solves the hardest part of competitive programming: staying synchronized. Never miss a rating change or a critical registration deadline again."
                                </p>
                            </div>
                        </div>

                        {/* Right Side: The Premium Asymmetric Curved Card & Visual Mockup */}
                        <div className="lg:col-span-5 relative flex justify-center items-center">

                            {/* Simulated graphic container */}
                            <div className="w-full aspect-[4/3.8] sm:aspect-[4/3] lg:aspect-[1.1] rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#4BB8FA] to-[#0F9BF2] border-4 border-zinc-900 shadow-xl relative group">
                                {/* Simulated coding visual */}
                                <img
                                    src={FEATURED_CONTESTS[activeSlide].image}
                                    alt={FEATURED_CONTESTS[activeSlide].title}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Gradient screen overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                                {/* The Floating Featured Contest Info Box (Mimicking the premium Bismillah House floating info widget) */}
                                <div className="absolute bottom-0 right-0 left-0 sm:left-auto sm:w-[22rem] bg-[#121214] border-t sm:border-l border-zinc-800/80 rounded-t-[1.5rem] sm:rounded-tl-[1.8rem] sm:rounded-br-[1.5rem] p-6 shadow-2xl transition-all duration-300">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <span className="text-[10px] font-bold tracking-widest text-[#4BB8FA] uppercase">
                                            {FEATURED_CONTESTS[activeSlide].platform}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full font-medium">
                                            {FEATURED_CONTESTS[activeSlide].difficulty}
                                        </span>
                                    </div>
                                    <h3 className="font-extrabold text-white text-lg mb-1 leading-snug">
                                        {FEATURED_CONTESTS[activeSlide].title}
                                    </h3>
                                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                                        {FEATURED_CONTESTS[activeSlide].desc}
                                    </p>

                                    {/* Action button & Carousel arrows */}
                                    <div className="flex items-center justify-between border-t border-zinc-800/85 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-wider text-zinc-500">Entry Fee</span>
                                            <span className="font-bold text-sm text-[#4BB8FA]">
                                                {FEATURED_CONTESTS[activeSlide].prize}
                                            </span>
                                        </div>

                                        {/* Slider control arrows */}
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={handlePrevSlide}
                                                className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
                                            >
                                                <ArrowLeft size={13} />
                                            </button>
                                            <button
                                                onClick={handleNextSlide}
                                                className="w-8 h-8 rounded-full bg-[#4BB8FA] hover:bg-[#0F9BF2] text-black flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                                            >
                                                <ArrowRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Trust, Statistics & Highlight Cards Section (Mimics trusted section from layout) */}
                <section id="features" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20 px-2">

                    {/* Left Column: Trusted title, stacks of coders & stats */}
                    <div className="lg:col-span-5 space-y-8 mt-20">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                                Track Coding Contests <br />
                                <span className="text-[#4BB8FA] font-black">Easily</span> Online
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                                Stay updated with upcoming programming contests
                                from multiple competitive coding platforms.
                                Never miss your next coding challenge.
                            </p>
                        </div>

                    
                    </div>

                    {/* Separator Line for Wide Screens */}
                    <div className="hidden lg:block lg:col-span-1 justify-self-center self-stretch w-[1px] bg-zinc-800" />

                    {/* Right Column: Three high-end Highlight Cards (with blue icons & right arrows) */}
                    <div className="lg:col-span-6 space-y-4">

                        {/* Card 1 */}
                        <Link to="/register" className="block bg-[#121214] hover:bg-zinc-900 border border-zinc-800 hover:border-[#4BB8FA]/40 rounded-2xl p-5 shadow-xs transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#4BB8FA]/10 rounded-full flex items-center justify-center text-[#4BB8FA] shrink-0 font-bold">
                                    <Code size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-extrabold text-white text-sm group-hover:text-[#4BB8FA] transition-colors">
                                            Explore top platforms
                                        </h3>
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-[#4BB8FA] group-hover:text-black text-zinc-400 flex items-center justify-center transition-all duration-300">
                                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed mt-2 pr-6">
                                        Track events on Codeforces, LeetCode, AtCoder, and CodeChef in one organized schedule. Easy to view, easy to prepare.
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Card 2 */}
                        <Link to="/register" className="block bg-[#121214] hover:bg-zinc-900 border border-zinc-800 hover:border-[#4BB8FA]/40 rounded-2xl p-5 shadow-xs transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#4BB8FA]/10 rounded-full flex items-center justify-center text-[#4BB8FA] shrink-0 font-bold">
                                    <Award size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-extrabold text-white text-sm group-hover:text-[#4BB8FA] transition-colors">
                                            Find highly rated contests
                                        </h3>
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-[#4BB8FA] group-hover:text-black text-zinc-400 flex items-center justify-center transition-all duration-300">
                                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed mt-2 pr-6">
                                        Discover contests voted best by top coders. Join only the rounds that will give you the best experience and rank increase.
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Card 3 */}
                        <Link to="/register" className="block bg-[#121214] hover:bg-zinc-900 border border-zinc-800 hover:border-[#4BB8FA]/40 rounded-2xl p-5 shadow-xs transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#4BB8FA]/10 rounded-full flex items-center justify-center text-[#4BB8FA] shrink-0 font-bold">
                                    <Sparkles size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-extrabold text-white text-sm group-hover:text-[#4BB8FA] transition-colors">
                                            Discover smart statistics
                                        </h3>
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-[#4BB8FA] group-hover:text-black text-zinc-400 flex items-center justify-center transition-all duration-300">
                                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed mt-2 pr-6">
                                        Track your attendance automatically. Write notes for missed questions, and watch your coding speed improve day after day.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* 3. Floating Bottom Search Panel (Mimicking the dream home search widget) */}
                <section id="contests" className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-[2.5rem] p-8 sm:p-10 text-center relative overflow-hidden shadow-xs">

                    <div className="max-w-2xl mx-auto mb-8">
                        <h2 className="text-3xl font-extrabold text-white">Find your perfect contest</h2>
                        <p className="text-sm text-zinc-400 mt-2">
                            Select the matching options to search for the perfect round for your timezone and language.
                        </p>
                    </div>

                    {/* Simulated Filter Bar */}
                    <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center shadow-md max-w-5xl mx-auto">

                        {/* Selector 1: Platform */}
                        <div className="text-left px-4 py-2 border-b sm:border-b-0 sm:border-r border-zinc-800 flex flex-col justify-center">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                Platform <ChevronDown size={10} />
                            </label>
                            <select
                                value={filterPlatform}
                                onChange={(e) => setFilterPlatform(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-extrabold text-white cursor-pointer appearance-none pr-4 w-full"
                            >
                                <option value="all" className="bg-[#121214]">All Platforms</option>
                                <option value="codeforces" className="bg-[#121214]">Codeforces</option>
                                <option value="leetcode" className="bg-[#121214]">LeetCode</option>
                                <option value="atcoder" className="bg-[#121214]">AtCoder</option>
                                <option value="codechef" className="bg-[#121214]">CodeChef</option>
                            </select>
                        </div>

                        {/* Selector 2: Difficulty */}
                        <div className="text-left px-4 py-2 border-b sm:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-center">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                Difficulty <ChevronDown size={10} />
                            </label>
                            <select
                                value={filterDifficulty}
                                onChange={(e) => setFilterDifficulty(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-extrabold text-white cursor-pointer appearance-none pr-4 w-full"
                            >
                                <option value="all" className="bg-[#121214]">Any Difficulty</option>
                                <option value="easy" className="bg-[#121214]">Easy (Div 3/4)</option>
                                <option value="medium" className="bg-[#121214]">Medium (Div 2)</option>
                                <option value="hard" className="bg-[#121214]">Hard (Div 1)</option>
                            </select>
                        </div>

                        {/* Selector 3: Date */}
                        <div className="text-left px-4 py-2 border-b sm:border-b-0 sm:border-r border-zinc-800 flex flex-col justify-center">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                When <ChevronDown size={10} />
                            </label>
                            <select
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-extrabold text-white cursor-pointer appearance-none pr-4 w-full"
                            >
                                <option value="today" className="bg-[#121214]">Today</option>
                                <option value="this-week" className="bg-[#121214]">This Week</option>
                                <option value="this-month" className="bg-[#121214]">This Month</option>
                            </select>
                        </div>

                        {/* Selector 4: Language */}
                        <div className="text-left px-4 py-2 border-b sm:border-b-0 flex flex-col justify-center">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                Language <ChevronDown size={10} />
                            </label>
                            <select
                                value={filterLanguage}
                                onChange={(e) => setFilterLanguage(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-extrabold text-white cursor-pointer appearance-none pr-4 w-full"
                            >
                                <option value="all" className="bg-[#121214]">All Languages</option>
                                <option value="cpp" className="bg-[#121214]">C++</option>
                                <option value="python" className="bg-[#121214]">Python</option>
                                <option value="javascript" className="bg-[#121214]">JavaScript</option>
                                <option value="java" className="bg-[#121214]">Java</option>
                            </select>
                        </div>

                        {/* Action Search Button */}
                        <Link
                            to={`/register?platform=${filterPlatform}&difficulty=${filterDifficulty}&date=${filterDate}&lang=${filterLanguage}`}
                            className="bg-white hover:bg-[#4BB8FA] text-black rounded-2xl h-14 flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-sm cursor-pointer"
                        >
                            <Search size={16} />
                            <span>Search</span>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer Area */}
            <footer id="about" className="border-t border-zinc-800/80 bg-[#121214] text-[#EFEBE0] pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">

                        {/* Footer Logo & Intro */}
                        <div className="md:col-span-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#4BB8FA] rounded-xl flex items-center justify-center text-black font-bold text-base">
                                    CE
                                </div>
                                <span className="font-semibold text-xl tracking-tight text-white">
                                    Code<span className="text-[#4BB8FA]">Events</span>
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500 max-w-sm">
                                Synchronizing coder schedules globally with real-time contest APIs, automatic calendar integration, and AI performance insights.
                            </p>
                        </div>

                        {/* Footer Navigation Columns */}
                        <div className="md:col-span-6 flex justify-start md:justify-end gap-16">

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#4BB8FA]">Features</h4>
                                <div className="flex flex-col gap-2.5">
                                    <Link to="/login" className="text-xs text-zinc-500 hover:text-white transition-colors">Track Contest</Link>
                                    <Link to="/register" className="text-xs text-zinc-500 hover:text-white transition-colors">Calendar View</Link>
                                    <Link to="/register" className="text-xs text-zinc-500 hover:text-white transition-colors">AI Analysis</Link>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#4BB8FA]">Company</h4>
                                <div className="flex flex-col gap-2.5">
                                    <a href="mailto:hello@codeevents.com" className="text-xs text-zinc-500 hover:text-white transition-colors">hello@codeevents.com</a>
                                    <a href="https://github.com" className="text-xs text-zinc-500 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Github</a>
                                    <span className="text-xs text-zinc-500/40">V2.1.0 Edition</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Trademark Row */}
                    <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 uppercase tracking-widest">
                        <div>© 2026 CodeEvents. All Rights Reserved.</div>
                        <div className="flex gap-6">
                            <a href="#features" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#features" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
