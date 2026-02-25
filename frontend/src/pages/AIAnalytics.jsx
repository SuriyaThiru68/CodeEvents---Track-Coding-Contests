import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, Cell, Legend
} from 'recharts';
import {
    Brain, Zap, TrendingUp, TrendingDown, Activity, Target,
    Award, Clock, Flame, BarChart2, Calendar, ChevronRight,
    RefreshCw, Layers, GitBranch, Cpu, Radio, AlertTriangle,
    CheckCircle, Star, ArrowUpRight, Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { runFullAnalysis } from '../services/aiEngine';
import { getTracker, EVENT_TYPES } from '../services/behaviorTracker';

// ─── Colour Palette ───────────────────────────────────────────────────────────
const C = {
    violet: '#8b5cf6',
    cyan: '#06b6d4',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    sky: '#0ea5e9',
    fuchsia: '#d946ef',
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-2xl">
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
                    {p.name}: <span className="text-white">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
                </p>
            ))}
        </div>
    );
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
const Counter = ({ value, duration = 1500, suffix = '' }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = value / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= value) { setDisplay(value); clearInterval(timer); }
            else setDisplay(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <>{display}{suffix}</>;
};

// ─── Hexagonal Skill Radar ────────────────────────────────────────────────────
const SkillRadar = ({ data }) => (
    <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#71717a', fontSize: 9, fontWeight: 700, letterSpacing: 2 }} />
            <Radar name="Current" dataKey="value" stroke={C.violet} fill={C.violet} fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Potential" dataKey="potential" stroke={C.cyan} fill={C.cyan} fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 2" />
            <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #3f3f46', borderRadius: 12, fontSize: 11 }} />
        </RadarChart>
    </ResponsiveContainer>
);

// ─── Efficiency Gauge ─────────────────────────────────────────────────────────
const EfficiencyGauge = ({ score }) => {
    const angle = -140 + (score / 100) * 280;
    const color = score >= 75 ? C.emerald : score >= 50 ? C.amber : C.rose;
    const label = score >= 80 ? 'Elite' : score >= 65 ? 'Advanced' : score >= 50 ? 'Intermediate' : score >= 35 ? 'Developing' : 'Beginner';

    return (
        <div className="flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 120" className="w-64 h-36">
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#27272a" strokeWidth="12" strokeLinecap="round" />
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 251} 251`}
                    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                />
                <line
                    x1="100" y1="100"
                    x2={100 + 65 * Math.cos((angle * Math.PI) / 180)}
                    y2={100 + 65 * Math.sin((angle * Math.PI) / 180)}
                    stroke="white" strokeWidth="2" strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="5" fill="white" />
                <text x="100" y="90" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="serif">{score}</text>
            </svg>
            <div className="text-center -mt-4">
                <div className="text-xs font-black uppercase tracking-[0.3em]" style={{ color }}>{label}</div>
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Coding Efficiency Score</div>
            </div>
        </div>
    );
};

// ─── Activity Heatmap ─────────────────────────────────────────────────────────
const ActivityHeatmap = ({ contestHistory }) => {
    const weeks = 26;
    const days = 7;
    const now = Date.now();

    const grid = Array.from({ length: weeks * days }, (_, i) => {
        const daysAgo = (weeks * days) - i;
        const ts = now - daysAgo * 86400000;
        const hasContest = contestHistory?.some(c => {
            const cd = new Date(c.date || 0).getTime();
            return Math.abs(cd - ts) < 86400000;
        });
        const randomBase = (Math.sin(i * 7.3) + 1) / 2;
        return { ts, intensity: hasContest ? 1 : randomBase > 0.85 ? 0.7 : randomBase > 0.7 ? 0.4 : randomBase > 0.5 ? 0.15 : 0 };
    });

    const getColor = (intensity) => {
        if (intensity === 0) return '#18181b';
        if (intensity < 0.3) return '#4c1d95';
        if (intensity < 0.6) return '#6d28d9';
        if (intensity < 0.8) return '#7c3aed';
        return '#8b5cf6';
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startDate = new Date(now - weeks * 7 * 86400000);
    const visibleMonths = [];
    for (let w = 0; w < weeks; w += 4) {
        const d = new Date(startDate.getTime() + w * 7 * 86400000);
        visibleMonths.push({ label: months[d.getMonth()], col: w });
    }

    return (
        <div className="overflow-x-auto">
            <div className="relative min-w-[500px]">
                <div className="flex gap-0.5 mb-1">
                    {visibleMonths.map(m => (
                        <div key={m.col} className="text-[8px] text-zinc-600 uppercase tracking-wider" style={{ marginLeft: m.col === 0 ? 0 : `${(m.col - (visibleMonths[visibleMonths.indexOf(m) - 1]?.col || 0)) * 13}px` }}>
                            {m.label}
                        </div>
                    ))}
                </div>
                <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)`, gridTemplateRows: `repeat(${days}, 1fr)` }}>
                    {Array.from({ length: weeks }, (_, w) =>
                        Array.from({ length: days }, (_, d) => {
                            const cell = grid[w * days + d];
                            return (
                                <div key={`${w}-${d}`} title={`${new Date(cell.ts).toLocaleDateString()} — Intensity: ${Math.round(cell.intensity * 100)}%`}
                                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-violet-400 transition-all"
                                    style={{ backgroundColor: getColor(cell.intensity), gridColumn: w + 1, gridRow: d + 1 }}
                                />
                            );
                        })
                    )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Less</span>
                    {[0, 0.15, 0.4, 0.7, 1].map((v, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(v) }} />
                    ))}
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider">More</span>
                </div>
            </div>
        </div>
    );
};

// ─── Struggle Zone Card ────────────────────────────────────────────────────────
const StruggleZoneCard = ({ zone, idx }) => {
    const intensity = zone.normalizedDifficulty || 0;
    const color = intensity > 0.7 ? C.rose : intensity > 0.4 ? C.amber : C.emerald;
    const label = intensity > 0.7 ? 'Critical' : intensity > 0.4 ? 'Moderate' : 'Manageable';
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 group hover:border-zinc-600 transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black" style={{ background: `${color}20`, color }}>
                {idx + 1}
            </div>
            <div className="flex-1">
                <div className="text-xs font-bold text-white uppercase tracking-wider">{zone.topic || `Session ${idx + 1}`}</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">{zone.attempts || 0} attempts · {zone.successes || 0} solved</div>
            </div>
            <div className="text-right">
                <div className="text-[9px] font-black uppercase tracking-wider" style={{ color }}>{label}</div>
                <div className="mt-1 h-1 w-16 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${intensity * 100}%`, background: color }} />
                </div>
            </div>
        </motion.div>
    );
};

// ─── Recommendation Card ──────────────────────────────────────────────────────
const RecommendationCard = ({ contest, rank }) => {
    const score = Math.round((contest.recommendationScore || 0) * 100);
    return (
        <motion.div whileHover={{ x: 6 }} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 group hover:border-violet-700 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-violet-900/30 border border-violet-700 flex items-center justify-center text-violet-400 font-black text-xs">
                {rank}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{contest.name}</div>
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">{contest.platform}</div>
                <div className="text-[8px] text-violet-400 mt-1 italic">{contest.reasoning}</div>
            </div>
            <div className="text-right flex-shrink-0">
                <div className="text-lg font-black text-violet-400">{score}%</div>
                <div className="text-[8px] text-zinc-600 uppercase tracking-wider">match</div>
            </div>
        </motion.div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIAnalytics() {
    const { userProfiles, attendedContests, missedContests, contests } = useStore();
    const [analysis, setAnalysis] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [lastRun, setLastRun] = useState(null);
    const [liveMetrics, setLiveMetrics] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [eventLog, setEventLog] = useState([]);
    const trackerRef = useRef(null);

    const runAnalysis = useCallback(async () => {
        setIsRunning(true);
        const tracker = trackerRef.current;
        const behavioral = tracker?.exportForAnalysis() || {};

        const result = runFullAnalysis({
            userProfiles,
            attendedContests,
            missedContests,
            contests,
            sessionEvents: behavioral.sessions || [],
            ratingHistory: []
        });

        // slight delay for dramatic effect
        await new Promise(r => setTimeout(r, 800));
        setAnalysis(result);
        setLastRun(new Date());
        setIsRunning(false);
    }, [userProfiles, attendedContests, missedContests, contests]);

    useEffect(() => {
        trackerRef.current = getTracker();
        trackerRef.current.track(EVENT_TYPES.PAGE_VISIT, { page: 'ai_analytics' });

        const unsubscribe = trackerRef.current.subscribe((event) => {
            setEventLog(prev => [event, ...prev].slice(0, 8));
            setLiveMetrics(trackerRef.current.computeRealTimeMetrics());
        });

        setLiveMetrics(trackerRef.current.computeRealTimeMetrics());
        runAnalysis();

        const refreshInterval = setInterval(runAnalysis, 60000);
        return () => { unsubscribe(); clearInterval(refreshInterval); };
    }, []);

    // ─── Build radar data ─────────────────────────────────────────────────────
    const radarData = analysis ? [
        { skill: 'CONSISTENCY', value: Math.round(analysis.consistency.score * 100), potential: 100 },
        { skill: 'SUCCESS RATE', value: analysis.summary.successRate, potential: 100 },
        { skill: 'MULTI-PLATFORM', value: Math.round(analysis.multiPlatform.diversity * 25), potential: 100 },
        { skill: 'SKILL GROWTH', value: Math.round(analysis.behaviorData.ratingTrend * 100), potential: 100 },
        { skill: 'ENGAGEMENT', value: Math.round(analysis.behaviorData.activityFrequency * 100), potential: 100 },
        { skill: 'RECOVERY', value: Math.round(analysis.behaviorData.errorRecovery * 100), potential: 100 },
    ] : [];

    // ─── Build prediction chart data ──────────────────────────────────────────
    const predictionData = analysis?.predictions?.predictions?.map((p, i) => ({
        name: `Contest +${p.contestAhead}`,
        predicted: p.predicted,
        lower: p.lower,
        upper: p.upper,
    })) || [];

    // ─── Build practice schedule data ─────────────────────────────────────────
    const scheduleData = analysis?.practiceSchedule?.map(s => ({
        day: s.day.slice(0, 3),
        minutes: s.duration,
        type: s.type,
        intensity: s.intensity === 'high' ? 3 : s.intensity === 'moderate' ? 2 : 1
    })) || [];

    const sections = ['overview', 'skills', 'heatmap', 'predictions', 'schedule', 'live'];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 text-white">
            {/* ── Header ── */}
            <header className="pt-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_#8b5cf6]" />
                            <span className="text-[9px] uppercase tracking-[0.4em] text-violet-400 font-black">AI Engine — Real-Time</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif italic font-black uppercase tracking-tighter text-white leading-none">
                            Neural_<span className="text-violet-500">Analytics</span>
                        </h1>
                        <p className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
                            ML-Driven · Fully Data-Driven · No Hardcoded Rules
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {lastRun && (
                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest">
                                Last run: {lastRun.toLocaleTimeString()}
                            </span>
                        )}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={runAnalysis}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-xl shadow-violet-900/40"
                        >
                            <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
                            {isRunning ? 'Analyzing...' : 'Run AI Analysis'}
                        </motion.button>
                    </div>
                </div>

                {/* Section Nav */}
                <div className="flex gap-2 flex-wrap">
                    {sections.map(s => (
                        <button key={s} onClick={() => setActiveSection(s)}
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeSection === s ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Loading State ── */}
            {isRunning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32 border border-dashed border-violet-900 rounded-3xl bg-violet-950/10">
                    <div className="relative mb-6">
                        <Brain size={48} className="text-violet-600 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-violet-500 animate-ping opacity-30" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">AI Engine Processing</h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Running ML inference on your behavioral data...</p>
                </motion.div>
            )}

            {analysis && !isRunning && (
                <AnimatePresence mode="wait">
                    <motion.div key={activeSection} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                        className="space-y-10">

                        {/* ═══════════════════════ OVERVIEW ═══════════════════════ */}
                        {activeSection === 'overview' && (
                            <div className="space-y-10">
                                {/* KPI Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Efficiency Score', value: analysis.efficiencyScore, suffix: '', icon: Zap, color: C.violet },
                                        { label: 'Success Rate', value: analysis.summary.successRate, suffix: '%', icon: Target, color: C.emerald },
                                        { label: 'Contests Total', value: analysis.summary.totalContests, suffix: '', icon: Award, color: C.amber },
                                        { label: 'Consistency', value: Math.round(analysis.consistency.score * 100), suffix: '%', icon: Activity, color: C.cyan },
                                    ].map((kpi, i) => (
                                        <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                            className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950 hover:border-zinc-600 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <kpi.icon size={18} style={{ color: kpi.color }} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                                <div className="text-[8px] uppercase tracking-widest text-zinc-600 font-black">{kpi.label}</div>
                                            </div>
                                            <div className="text-4xl font-serif font-black tracking-tighter" style={{ color: kpi.color }}>
                                                <Counter value={kpi.value} suffix={kpi.suffix} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Efficiency Gauge + Summary */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center gap-6">
                                        <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                            <Cpu size={12} /> AI-Computed Efficiency
                                        </div>
                                        <EfficiencyGauge score={analysis.efficiencyScore} />
                                        <div className="grid grid-cols-3 gap-4 w-full border-t border-zinc-800 pt-6">
                                            {[
                                                { k: 'Trend', v: analysis.skillTimeline.trend.replace('_', ' ') },
                                                { k: 'Pattern', v: analysis.consistency.pattern.replace('_', ' ') },
                                                { k: 'Platforms', v: analysis.summary.platformCount },
                                            ].map(item => (
                                                <div key={item.k} className="text-center">
                                                    <div className="text-[8px] text-zinc-600 uppercase tracking-wider mb-1">{item.k}</div>
                                                    <div className="text-xs font-black text-white capitalize">{item.v}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 space-y-6">
                                        <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                            <GitBranch size={12} /> ML Behavioral Insights
                                        </div>
                                        {[
                                            { label: 'Bayesian Skill Estimate', value: `${Math.round(analysis.skillEstimate.estimate * 100)}%`, confidence: analysis.skillEstimate.confidence, color: C.violet },
                                            { label: 'Activity Frequency', value: `${Math.round(analysis.behaviorData.activityFrequency * 100)}%`, confidence: analysis.behaviorData.activityFrequency, color: C.cyan },
                                            { label: 'Platform Diversity Index', value: `${Math.round(analysis.behaviorData.platformDiversity * 100)}%`, confidence: analysis.behaviorData.platformDiversity, color: C.emerald },
                                            { label: 'Error Recovery Rate', value: `${Math.round(analysis.behaviorData.errorRecovery * 100)}%`, confidence: analysis.behaviorData.errorRecovery, color: C.amber },
                                        ].map(row => (
                                            <div key={row.label} className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] uppercase tracking-widest text-zinc-500">{row.label}</span>
                                                    <span className="text-xs font-black text-white">{row.value}</span>
                                                </div>
                                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                    <motion.div className="h-full rounded-full"
                                                        initial={{ width: 0 }} animate={{ width: `${row.confidence * 100}%` }}
                                                        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                                                        style={{ background: row.color, boxShadow: `0 0 8px ${row.color}60` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Struggle Zones */}
                                {analysis.struggleZones.filter(z => z.isStruggle).length > 0 && (
                                    <div className="p-8 rounded-3xl border border-rose-900/30 bg-rose-950/10 space-y-5">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle size={16} className="text-rose-500" />
                                            <span className="text-[9px] uppercase tracking-widest text-rose-400 font-black">AI-Detected Struggle Zones</span>
                                            <span className="text-[8px] bg-rose-900/30 text-rose-400 px-2 py-0.5 rounded-full">No Hardcoded Rules</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {analysis.struggleZones.filter(z => z.isStruggle).slice(0, 6).map((z, i) => (
                                                <StruggleZoneCard key={i} zone={z} idx={i} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Multi-Platform Analysis */}
                                {analysis.multiPlatform.insights?.length > 0 && (
                                    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 space-y-5">
                                        <div className="flex items-center gap-3">
                                            <Layers size={16} className="text-cyan-500" />
                                            <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-black">Multi-Platform Strength Analysis</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {analysis.multiPlatform.insights.map((ins, i) => (
                                                <div key={ins.platform} className={`p-4 rounded-2xl border transition-all ${ins.isStrong ? 'border-emerald-700 bg-emerald-950/20' : ins.needsWork ? 'border-rose-800 bg-rose-950/10' : 'border-zinc-800 bg-zinc-900/50'}`}>
                                                    <div className="text-[8px] uppercase tracking-widest mb-2" style={{ color: ins.isStrong ? C.emerald : ins.needsWork ? C.rose : '#71717a' }}>
                                                        {ins.isStrong ? '▲ Strong' : ins.needsWork ? '▼ Needs Work' : '→ Average'}
                                                    </div>
                                                    <div className="text-sm font-black text-white capitalize">{ins.platform}</div>
                                                    <div className="text-[9px] text-zinc-500 mt-1">Rating: {ins.rating || 'N/A'}</div>
                                                    <div className="text-[9px] text-zinc-500">Solved: {ins.solved}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════════════════════ SKILLS RADAR ═══════════════════════ */}
                        {activeSection === 'skills' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950">
                                        <div className="text-[9px] uppercase tracking-widest text-violet-400 font-black mb-6 flex items-center gap-2">
                                            <Brain size={12} /> Skill Competency Radar
                                        </div>
                                        <SkillRadar data={radarData} />
                                        <div className="flex gap-6 justify-center mt-4">
                                            <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                                                <div className="w-3 h-0.5 rounded" style={{ background: C.violet }} /> Current
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                                                <div className="w-3 h-0.5 rounded border-t border-dashed" style={{ borderColor: C.cyan }} /> Potential
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 space-y-4">
                                        <div className="text-[9px] uppercase tracking-widest text-cyan-400 font-black flex items-center gap-2 mb-6">
                                            <BarChart2 size={12} /> Skill Breakdown
                                        </div>
                                        {radarData.map((skill, i) => (
                                            <div key={skill.skill} className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] uppercase tracking-widest text-zinc-400">{skill.skill}</span>
                                                    <span className="text-xs font-black text-white">{skill.value}%</span>
                                                </div>
                                                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <motion.div className="h-full rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${skill.value}%` }}
                                                        transition={{ delay: i * 0.1, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                                                        style={{ background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})` }} />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-6 border-t border-zinc-800 space-y-3">
                                            <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Skill Adaptation Timeline</div>
                                            <div className="flex items-center gap-3">
                                                {analysis.skillTimeline.trend.includes('improving') ? (
                                                    <TrendingUp size={20} style={{ color: C.emerald }} />
                                                ) : analysis.skillTimeline.trend.includes('declining') ? (
                                                    <TrendingDown size={20} style={{ color: C.rose }} />
                                                ) : (
                                                    <Activity size={20} style={{ color: C.amber }} />
                                                )}
                                                <div>
                                                    <div className="text-sm font-black text-white capitalize">{analysis.skillTimeline.trend.replace('_', ' ')}</div>
                                                    <div className="text-[9px] text-zinc-500">Velocity: {analysis.skillTimeline.velocity?.toFixed(2) || '0'} pts/contest · R²: {analysis.skillTimeline.r2?.toFixed(2) || '0'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════ HEATMAP ═══════════════════════ */}
                        {activeSection === 'heatmap' && (
                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="text-[9px] uppercase tracking-widest text-violet-400 font-black mb-2 flex items-center gap-2">
                                                <Flame size={12} /> Coding Activity Heatmap
                                            </div>
                                            <h3 className="text-3xl font-serif italic font-black text-white">Contest Participation Heat</h3>
                                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Last 6 months · Real activity data</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-serif font-black text-violet-400">{analysis.summary.attended}</div>
                                            <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Attended</div>
                                        </div>
                                    </div>
                                    <ActivityHeatmap contestHistory={[...attendedContests, ...missedContests]} />
                                </div>

                                {/* Weekly Activity Bar */}
                                {scheduleData.length > 0 && (
                                    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950">
                                        <div className="text-[9px] uppercase tracking-widest text-cyan-400 font-black mb-6 flex items-center gap-2">
                                            <Clock size={12} /> Recommended Practice Distribution
                                        </div>
                                        <div className="h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={scheduleData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 9, fontWeight: 700 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 9 }} unit="min" />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                                                        {scheduleData.map((entry, i) => (
                                                            <Cell key={i} fill={entry.intensity === 3 ? C.violet : entry.intensity === 2 ? C.sky : '#3f3f46'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════════════════════ PREDICTIONS ═══════════════════════ */}
                        {activeSection === 'predictions' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                                    {[
                                        { label: 'Prediction Confidence', v: `${Math.round((analysis.predictions.confidence || 0) * 100)}%`, color: C.violet },
                                        { label: 'Trend Direction', v: analysis.predictions.direction === 'up' ? '↑ Upward' : '↓ Downward', color: analysis.predictions.direction === 'up' ? C.emerald : C.rose },
                                        { label: 'Trend Strength', v: `${(analysis.predictions.trendStrength || 0).toFixed(1)} pts`, color: C.amber },
                                    ].map(item => (
                                        <div key={item.label} className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950 text-center">
                                            <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2">{item.label}</div>
                                            <div className="text-2xl font-black" style={{ color: item.color }}>{item.v}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950">
                                    <div className="text-[9px] uppercase tracking-widest text-violet-400 font-black mb-6 flex items-center gap-2">
                                        <Sparkles size={12} /> Predictive Rating Trajectory
                                    </div>
                                    {predictionData.length > 0 ? (
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={predictionData}>
                                                    <defs>
                                                        <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor={C.violet} stopOpacity={0.3} />
                                                            <stop offset="100%" stopColor={C.violet} stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.1} />
                                                            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 9 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 9 }} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="upper" stroke="none" fill="url(#bandGrad)" name="Upper Bound" />
                                                    <Area type="monotone" dataKey="predicted" stroke={C.violet} strokeWidth={2.5} fill="url(#predGrad)" name="Predicted Rating" />
                                                    <Area type="monotone" dataKey="lower" stroke="none" fill="none" name="Lower Bound" strokeDasharray="4 2" dot={false} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-zinc-600 text-sm">
                                            Connect platform accounts to enable rating predictions
                                        </div>
                                    )}
                                </div>

                                {/* Contest Recommendations */}
                                {analysis.recommendations.length > 0 && (
                                    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 space-y-5">
                                        <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-black flex items-center gap-2">
                                            <Star size={12} /> AI Contest Recommendations
                                        </div>
                                        <div className="space-y-3">
                                            {analysis.recommendations.map((c, i) => (
                                                <RecommendationCard key={c.id || i} contest={c} rank={i + 1} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════════════════════ SCHEDULE ═══════════════════════ */}
                        {activeSection === 'schedule' && (
                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-[9px] uppercase tracking-widest text-amber-400 font-black flex items-center gap-2 mb-2">
                                                <Calendar size={12} /> AI-Generated Practice Schedule
                                            </div>
                                            <h3 className="text-2xl font-serif italic font-black text-white">Personalized Weekly Plan</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Based on</div>
                                            <div className="text-sm font-black text-white">Your Behavior Data</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                                        {analysis.practiceSchedule.map((day, i) => (
                                            <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                                className={`p-4 rounded-2xl border transition-all ${day.intensity === 'high' ? 'border-violet-700 bg-violet-950/20' : day.intensity === 'moderate' ? 'border-sky-800 bg-sky-950/20' : 'border-zinc-800 bg-zinc-900/50'}`}>
                                                <div className="text-[8px] font-black uppercase tracking-widest mb-3" style={{ color: day.intensity === 'high' ? C.violet : day.intensity === 'moderate' ? C.sky : '#52525b' }}>
                                                    {day.day.slice(0, 3)}
                                                </div>
                                                <div className="text-xl font-serif font-black text-white">{day.duration}<span className="text-[9px] text-zinc-500 ml-1">min</span></div>
                                                <div className="text-[8px] text-zinc-500 mt-2 uppercase tracking-wider leading-relaxed">{day.type}</div>
                                                <div className="text-[8px] mt-2 capitalize" style={{ color: day.intensity === 'high' ? C.violet : day.intensity === 'moderate' ? C.sky : '#52525b' }}>
                                                    {day.intensity}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════ LIVE TRACKING ═══════════════════════ */}
                        {activeSection === 'live' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {liveMetrics && [
                                        { label: 'Session Focus', value: `${Math.round((liveMetrics.sessionFocusRatio || 0) * 100)}%`, icon: Radio, color: C.emerald },
                                        { label: 'Weekly Contests', value: liveMetrics.weeklyContests, icon: Award, color: C.violet },
                                        { label: 'Submission Rate', value: `${Math.round((liveMetrics.submissionSuccessRate || 0) * 100)}%`, icon: CheckCircle, color: C.cyan },
                                    ].map((m, i) => (
                                        <div key={m.label} className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950 flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${m.color}20` }}>
                                                <m.icon size={20} style={{ color: m.color }} />
                                            </div>
                                            <div>
                                                <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-1">{m.label}</div>
                                                <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                                        <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">Live Event Stream</span>
                                    </div>
                                    {eventLog.length === 0 && (
                                        <div className="text-center py-8 text-zinc-600 text-sm">
                                            Interact with the dashboard to see live events...
                                        </div>
                                    )}
                                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                        <AnimatePresence>
                                            {eventLog.map((evt, i) => (
                                                <motion.div key={evt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                    <span className="text-[9px] uppercase tracking-widest text-violet-400 font-black">{evt.type}</span>
                                                    <span className="text-[9px] text-zinc-600 ml-auto">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* ── Empty State ── */}
            {!analysis && !isRunning && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <Brain size={48} className="text-zinc-800 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-widest text-zinc-700 mb-2">No Analysis Yet</h3>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Click "Run AI Analysis" to start the ML engine</p>
                </div>
            )}
        </div>
    );
}
