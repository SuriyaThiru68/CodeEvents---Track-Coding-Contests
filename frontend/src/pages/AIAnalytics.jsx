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
    violet: '#ffffff',
    cyan: '#e4e4e7',
    emerald: '#d4d4d8',
    amber: '#a1a1aa',
    rose: '#71717a',
    sky: '#52525b',
    fuchsia: '#27272a',
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#121215] border border-white/5 rounded-2xl px-4 py-3 shadow-2xl">
            <p className="text-[9px] uppercase tracking-widest text-white/45 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-xs font-bold" style={{ color: '#ffffff' }}>
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
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#fafafa', fontSize: 9, fontWeight: 700, letterSpacing: 2 }} />
            <Radar name="Current" dataKey="value" stroke="#ffffff" fill="#ffffff" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Potential" dataKey="potential" stroke="#71717a" fill="#71717a" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 2" />
            <Tooltip contentStyle={{ background: '#121215', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 11, color: '#fff' }} />
        </RadarChart>
    </ResponsiveContainer>
);

// ─── Efficiency Gauge ─────────────────────────────────────────────────────────
const EfficiencyGauge = ({ score }) => {
    const angle = -140 + (score / 100) * 280;
    const color = score >= 75 ? '#ffffff' : score >= 50 ? '#a1a1aa' : '#52525b';
    const label = score >= 80 ? 'Elite' : score >= 65 ? 'Advanced' : score >= 50 ? 'Intermediate' : score >= 35 ? 'Developing' : 'Beginner';

    return (
        <div className="flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 120" className="w-64 h-36">
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 251} 251`}
                />
                <line
                    x1="100" y1="100"
                    x2={100 + 65 * Math.cos((angle * Math.PI) / 180)}
                    y2={100 + 65 * Math.sin((angle * Math.PI) / 180)}
                    stroke="white" strokeWidth="2" strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="5" fill="white" />
                <text x="100" y="90" textAnchor="middle" fill="#fafafa" fontSize="22" fontWeight="700" className="font-light">{score}</text>
            </svg>
            <div className="text-center -mt-4">
                <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color }}>{label}</div>
                <div className="text-[9px] text-white/35 uppercase tracking-widest mt-1">Efficiency Score</div>
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
        if (intensity === 0) return 'rgba(255,255,255,0.05)';
        if (intensity < 0.3) return 'rgba(255,255,255,0.15)';
        if (intensity < 0.6) return 'rgba(255,255,255,0.4)';
        if (intensity < 0.8) return 'rgba(255,255,255,0.7)';
        return '#ffffff';
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
                        <div key={m.col} className="text-[8px] text-white/35 uppercase tracking-wider" style={{ marginLeft: m.col === 0 ? 0 : `${(m.col - (visibleMonths[visibleMonths.indexOf(m) - 1]?.col || 0)) * 13}px` }}>
                            {m.label}
                        </div>
                    ))}
                </div>
                <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)`, gridTemplateRows: `repeat(${days}, 1fr)` }}>
                    {Array.from({ length: weeks }, (_, w) =>
                        Array.from({ length: days }, (_, d) => {
                            const cell = grid[w * days + d];
                            return (
                                <div key={`${w}-${d}`} title={`${new Date(cell.ts).toLocaleDateString()} — Activity: ${Math.round(cell.intensity * 100)}%`}
                                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-white transition-all"
                                    style={{ backgroundColor: getColor(cell.intensity), gridColumn: w + 1, gridRow: d + 1 }}
                                />
                            );
                        })
                    )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-[8px] text-white/35 uppercase tracking-wider">Less</span>
                    {[0, 0.15, 0.4, 0.7, 1].map((v, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(v) }} />
                    ))}
                    <span className="text-[8px] text-white/35 uppercase tracking-wider">More</span>
                </div>
            </div>
        </div>
    );
};

// ─── Struggle Zone Card ────────────────────────────────────────────────────────
const StruggleZoneCard = ({ zone, idx }) => {
    const intensity = zone.normalizedDifficulty || 0;
    const color = intensity > 0.7 ? '#ffffff' : intensity > 0.4 ? '#a1a1aa' : '#52525b';
    const label = intensity > 0.7 ? 'Critical' : intensity > 0.4 ? 'Moderate' : 'Manageable';
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#121215] group hover:border-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold bg-white/5 text-white">
                {idx + 1}
            </div>
            <div className="flex-1">
                <div className="text-xs font-bold text-white uppercase tracking-wider">{zone.topic || `Session ${idx + 1}`}</div>
                <div className="text-[9px] text-white/40 mt-0.5">{zone.attempts || 0} attempts · {zone.successes || 0} solved</div>
            </div>
            <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white">{label}</div>
                <div className="mt-1 h-1 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all bg-white" style={{ width: `${intensity * 100}%` }} />
                </div>
            </div>
        </motion.div>
    );
};

// ─── Recommendation Card ──────────────────────────────────────────────────────
const RecommendationCard = ({ contest, rank }) => {
    const score = Math.round((contest.recommendationScore || 0) * 100);
    return (
        <motion.div whileHover={{ x: 6 }} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#121215] group hover:border-white transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                {rank}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{contest.name}</div>
                <div className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5">{contest.platform}</div>
                <div className="text-[8px] text-white/60 mt-1 italic">{contest.reasoning}</div>
            </div>
            <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-white">{score}%</div>
                <div className="text-[8px] text-white/30 uppercase tracking-wider">match</div>
            </div>
        </motion.div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIAnalytics() {
    const { userProfiles, attendedContests, missedContests, contests, ratingHistory } = useStore();
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
            ratingHistory: ratingHistory || []
        });

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

    const radarData = analysis ? [
        { skill: 'CONSISTENCY', value: Math.round(analysis.consistency.score * 100), potential: 100 },
        { skill: 'SUCCESS RATE', value: analysis.summary.successRate, potential: 100 },
        { skill: 'MULTI-PLATFORM', value: Math.round(analysis.multiPlatform.diversity * 25), potential: 100 },
        { skill: 'SKILL GROWTH', value: Math.round(analysis.behaviorData.ratingTrend * 100), potential: 100 },
        { skill: 'ENGAGEMENT', value: Math.round(analysis.behaviorData.activityFrequency * 100), potential: 100 },
        { skill: 'RECOVERY', value: Math.round(analysis.behaviorData.errorRecovery * 100), potential: 100 },
    ] : [];

    const predictionData = analysis?.predictions?.predictions?.map((p, i) => ({
        name: `Contest +${p.contestAhead}`,
        predicted: p.predicted,
        lower: p.lower,
        upper: p.upper,
    })) || [];

    const scheduleData = analysis?.practiceSchedule?.map(s => ({
        day: s.day.slice(0, 3),
        minutes: s.duration,
        type: s.type,
        intensity: s.intensity === 'high' ? 3 : s.intensity === 'moderate' ? 2 : 1
    })) || [];

    const sections = ['overview', 'skills', 'heatmap', 'predictions', 'schedule', 'live'];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 text-[#fafafa] pt-6">
            {/* ── Header ── */}
            <header className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            <span className="text-[9px] uppercase tracking-[0.4em] text-white font-bold">AI Engine — Live</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-white leading-none">
                            Smart <span className="text-white/35 font-normal">Analysis</span>
                        </h1>
                        <p className="text-sm text-white/30 uppercase tracking-[0.2em]">
                            Automated · Data-Driven · Intelligent
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {lastRun && (
                            <span className="text-[9px] text-white/30 uppercase tracking-widest">
                                Updated: {lastRun.toLocaleTimeString()}
                            </span>
                        )}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={runAnalysis}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/85 text-black font-semibold rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-lg shadow-white/5"
                        >
                            <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
                            {isRunning ? 'Analyzing...' : 'Run Analysis'}
                        </motion.button>
                    </div>
                </div>

                {/* Section Nav */}
                <div className="flex gap-2 flex-wrap bg-[#121215] p-1 border border-white/5 rounded-full w-fit">
                    {sections.map(s => (
                        <button key={s} onClick={() => setActiveSection(s)}
                            className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${activeSection === s ? 'bg-white text-black font-semibold shadow-lg' : 'text-white/40 hover:text-white'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Loading State ── */}
            {isRunning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5">
                    <div className="relative mb-6">
                        <Brain size={48} className="text-white animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-30" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-2">Analyzing Data</h3>
                    <p className="text-[9px] text-white/35 uppercase tracking-widest">Processing your behavioral insights...</p>
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
                                        { label: 'Efficiency Score', value: analysis.efficiencyScore, suffix: '', icon: Zap, color: '#ffffff' },
                                        { label: 'Success Rate', value: analysis.summary.successRate, suffix: '%', icon: Target, color: '#a1a1aa' },
                                        { label: 'Total Contests', value: analysis.summary.totalContests, suffix: '', icon: Award, color: '#71717a' },
                                        { label: 'Consistency', value: Math.round(analysis.consistency.score * 100), suffix: '%', icon: Activity, color: '#52525b' },
                                    ].map((kpi, i) => (
                                        <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                            className="p-6 rounded-3xl border border-white/5 bg-[#121215] hover:border-white/15 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <kpi.icon size={18} style={{ color: kpi.color }} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                                <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">{kpi.label}</div>
                                            </div>
                                            <div className="text-4xl font-light tracking-tighter" style={{ color: kpi.color }}>
                                                <Counter value={kpi.value} suffix={kpi.suffix} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Efficiency Gauge + Summary */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-3xl border border-white/5 bg-[#121215] flex flex-col items-center justify-center gap-6">
                                        <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                                            <Cpu size={12} /> Computed Efficiency
                                        </div>
                                        <EfficiencyGauge score={analysis.efficiencyScore} />
                                        <div className="grid grid-cols-3 gap-4 w-full border-t border-white/5 pt-6">
                                            {[
                                                { k: 'Trend', v: analysis.skillTimeline.trend.replace('_', ' ') },
                                                { k: 'Pattern', v: analysis.consistency.pattern.replace('_', ' ') },
                                                { k: 'Platforms', v: analysis.summary.platformCount },
                                            ].map(item => (
                                                <div key={item.k} className="text-center">
                                                    <div className="text-[8px] text-white/30 uppercase tracking-wider mb-1">{item.k}</div>
                                                    <div className="text-xs font-bold text-white capitalize">{item.v}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl border border-white/5 bg-[#121215] space-y-6">
                                        <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                                            <GitBranch size={12} /> Behavioral Insights
                                        </div>
                                        {[
                                            { label: 'Skill Estimate', value: `${Math.round(analysis.skillEstimate.estimate * 100)}%`, confidence: analysis.skillEstimate.confidence, color: '#ffffff' },
                                            { label: 'Activity Frequency', value: `${Math.round(analysis.behaviorData.activityFrequency * 100)}%`, confidence: analysis.behaviorData.activityFrequency, color: '#a1a1aa' },
                                            { label: 'Platform Diversity', value: `${Math.round(analysis.behaviorData.platformDiversity * 100)}%`, confidence: analysis.behaviorData.platformDiversity, color: '#71717a' },
                                            { label: 'Error Recovery Rate', value: `${Math.round(analysis.behaviorData.errorRecovery * 100)}%`, confidence: analysis.behaviorData.errorRecovery, color: '#52525b' },
                                        ].map(row => (
                                            <div key={row.label} className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] uppercase tracking-widest text-white/40">{row.label}</span>
                                                    <span className="text-xs font-bold text-white">{row.value}</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div className="h-full rounded-full"
                                                        initial={{ width: 0 }} animate={{ width: `${row.confidence * 100}%` }}
                                                        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                                                        style={{ background: row.color }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Struggle Zones */}
                                {analysis.struggleZones.filter(z => z.isStruggle).length > 0 && (
                                    <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-5">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle size={16} className="text-white" />
                                            <span className="text-[9px] uppercase tracking-widest text-white font-bold">Focus Areas</span>
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
                                    <div className="p-8 rounded-3xl border border-white/5 bg-[#121215] space-y-5">
                                        <div className="flex items-center gap-3">
                                            <Layers size={16} className="text-white" />
                                            <span className="text-[9px] uppercase tracking-widest text-white font-bold">Platform Analysis</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {analysis.multiPlatform.insights.map((ins, i) => (
                                                <div key={ins.platform} className={`p-4 rounded-2xl border transition-all ${ins.isStrong || ins.needsWork ? 'border-white bg-white/5' : 'border-white/5 bg-white/[0.02]'}`}>
                                                    <div className="text-[8px] uppercase tracking-widest mb-2 text-white/50">
                                                        {ins.isStrong ? '▲ Strong' : ins.needsWork ? '▼ Needs Work' : '→ Average'}
                                                    </div>
                                                    <div className="text-sm font-bold text-white capitalize">{ins.platform}</div>
                                                    <div className="text-[9px] text-white/40 mt-1">Rating: {ins.rating || 'N/A'}</div>
                                                    <div className="text-[9px] text-white/40">Solved: {ins.solved}</div>
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
                                    <div className="p-8 rounded-3xl border border-white/5 bg-[#121215]">
                                        <div className="text-[9px] uppercase tracking-widest text-white font-bold mb-6 flex items-center gap-2">
                                            <Brain size={12} /> Skill Proficiency Radar
                                        </div>
                                        <SkillRadar data={radarData} />
                                        <div className="flex gap-6 justify-center mt-4">
                                            <div className="flex items-center gap-2 text-zinc-400 text-[9px]">
                                                <div className="w-3 h-0.5 rounded bg-white" /> Current
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400 text-[9px]">
                                                <div className="w-3 h-0.5 rounded border-t border-dashed border-white/40" /> Potential
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl border border-white/5 bg-[#121215] space-y-4">
                                        <div className="text-[9px] uppercase tracking-widest text-white font-bold flex items-center gap-2 mb-6">
                                            <BarChart2 size={12} /> Skill Breakdown
                                        </div>
                                        {radarData.map((skill, i) => (
                                            <div key={skill.skill} className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] uppercase tracking-widest text-white/40">{skill.skill}</span>
                                                    <span className="text-xs font-bold text-white">{skill.value}%</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div className="h-full rounded-full bg-white"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${skill.value}%` }}
                                                        transition={{ delay: i * 0.1, duration: 1, ease: [0.34, 1.56, 0.64, 1] }} />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-6 border-t border-white/5 space-y-3">
                                            <div className="text-[9px] text-white/40 uppercase tracking-widest">Growth Timeline</div>
                                            <div className="flex items-center gap-3">
                                                {analysis.skillTimeline.trend.includes('improving') ? (
                                                    <TrendingUp size={20} className="text-white" />
                                                ) : analysis.skillTimeline.trend.includes('declining') ? (
                                                    <TrendingDown size={20} className="text-white/50" />
                                                ) : (
                                                    <Activity size={20} className="text-white/70" />
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-white capitalize">{analysis.skillTimeline.trend.replace('_', ' ')}</div>
                                                    <div className="text-[9px] text-white/40">Velocity: {analysis.skillTimeline.velocity?.toFixed(2) || '0'} pts/contest</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── HEATMAP ─── */}
                        {activeSection === 'heatmap' && (
                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl border border-white/5 bg-[#121215]">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="text-[9px] uppercase tracking-widest text-white font-bold mb-2 flex items-center gap-2">
                                                <Flame size={12} /> Activity Heatmap
                                            </div>
                                            <h3 className="text-3xl font-light uppercase tracking-tight text-white">Participation Trace</h3>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Based on your contest history</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-light text-white">{analysis.summary.attended}</div>
                                            <div className="text-[8px] text-zinc-400 uppercase tracking-widest">Attended</div>
                                        </div>
                                    </div>
                                    <ActivityHeatmap contestHistory={[...attendedContests, ...missedContests]} />
                                </div>

                                {styleScheduleData(scheduleData)}
                            </div>
                        )}

                        {/* ─── PREDICTIONS ─── */}
                        {activeSection === 'predictions' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                                    {[
                                        { label: 'Confidence', v: `${Math.round((analysis.predictions.confidence || 0) * 100)}%`, color: '#ffffff' },
                                        { label: 'Trend', v: analysis.predictions.direction === 'up' ? '↑ Upward' : '↓ Downward', color: '#a1a1aa' },
                                        { label: 'Strength', v: `${(analysis.predictions.trendStrength || 0).toFixed(1)} pts`, color: '#71717a' },
                                    ].map(item => (
                                        <div key={item.label} className="p-6 rounded-3xl border border-white/5 bg-[#121215] text-center">
                                            <div className="text-[8px] text-white/30 uppercase tracking-widest mb-2">{item.label}</div>
                                            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.v}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 rounded-3xl border border-white/5 bg-[#121215]">
                                    <div className="text-[9px] uppercase tracking-widest text-white font-bold mb-6 flex items-center gap-2">
                                        <Sparkles size={12} /> Predicted Trajectory
                                    </div>
                                    {predictionData.length > 0 ? (
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={predictionData}>
                                                    <defs>
                                                        <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
                                                            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#71717a" stopOpacity={0.1} />
                                                            <stop offset="100%" stopColor="#71717a" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 9 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 9 }} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="upper" stroke="none" fill="url(#bandGrad)" name="Upper Bound" />
                                                    <Area type="monotone" dataKey="predicted" stroke="#ffffff" strokeWidth={2.5} fill="url(#predGrad)" name="Predicted Rating" />
                                                    <Area type="monotone" dataKey="lower" stroke="none" fill="none" name="Lower Bound" strokeDasharray="4 2" dot={false} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-white/30 text-sm italic">
                                            No prediction data available.
                                        </div>
                                    )}
                                </div>

                                {/* Contest Recommendations */}
                                {analysis.recommendations.length > 0 && (
                                    <div className="p-8 rounded-3xl border border-white/5 bg-[#121215] space-y-5">
                                        <div className="text-[9px] uppercase tracking-widest text-white font-bold flex items-center gap-2">
                                            <Star size={12} /> Recommendations
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

                        {/* ─── SCHEDULE ─── */}
                        {activeSection === 'schedule' && (
                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl border border-white/5 bg-[#121215] space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-[9px] uppercase tracking-widest text-white font-bold flex items-center gap-2 mb-2">
                                                <Calendar size={12} /> Training Plan
                                            </div>
                                            <h3 className="text-2xl font-light uppercase tracking-tight text-white">Weekly Schedule</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-white/30 uppercase tracking-wider">Based on</div>
                                            <div className="text-sm font-bold text-white">Your Activity</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                                        {analysis.practiceSchedule.map((day, i) => (
                                            <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                                className={`p-4 rounded-2xl border transition-all ${day.intensity === 'high' || day.intensity === 'moderate' ? 'border-white bg-white/5' : 'border-white/5 bg-white/[0.02]'}`}>
                                                <div className="text-[8px] font-bold uppercase tracking-widest mb-3 text-white">
                                                    {day.day.slice(0, 3)}
                                                </div>
                                                <div className="text-xl font-light text-white">{day.duration}<span className="text-[9px] text-white/30 ml-1">min</span></div>
                                                <div className="text-[8px] text-white/30 mt-2 uppercase tracking-wider leading-relaxed">{day.type}</div>
                                                <div className="text-[8px] mt-2 capitalize font-semibold text-white">
                                                    {day.intensity}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── LIVE TRACKING ─── */}
                        {activeSection === 'live' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {liveMetrics && [
                                        { label: 'Session Focus', value: `${Math.round((liveMetrics.sessionFocusRatio || 0) * 100)}%`, icon: Radio, color: '#ffffff' },
                                        { label: 'Weekly Contests', value: liveMetrics.weeklyContests, icon: Award, color: '#a1a1aa' },
                                        { label: 'Success Rate', value: `${Math.round((liveMetrics.submissionSuccessRate || 0) * 100)}%`, icon: CheckCircle, color: '#71717a' },
                                    ].map((m, i) => (
                                        <div key={m.label} className="p-6 rounded-3xl border border-white/5 bg-[#121215] flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5">
                                                <m.icon size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[8px] text-white/30 uppercase tracking-wider mb-1">{m.label}</div>
                                                <div className="text-2xl font-bold text-white">{m.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 rounded-3xl border border-white/5 bg-[#121215] space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
                                        <span className="text-[9px] uppercase tracking-widest text-white font-bold">Live Event Stream</span>
                                    </div>
                                    {eventLog.length === 0 && (
                                        <div className="text-center py-8 text-white/30 text-sm italic">
                                            Waiting for events...
                                        </div>
                                    )}
                                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                        <AnimatePresence>
                                            {eventLog.map((evt, i) => (
                                                <motion.div key={evt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                                                    <span className="text-[9px] uppercase tracking-widest text-white font-bold">{evt.type.replace('_', ' ')}</span>
                                                    <span className="text-[9px] text-white/30 ml-auto">{new Date(evt.timestamp).toLocaleTimeString()}</span>
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
                    <Brain size={48} className="text-white/15 mb-4" />
                    <h3 className="text-xl font-bold uppercase tracking-widest text-white/40 mb-2">No Analysis</h3>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">Click "Run Analysis" to begin</p>
                </div>
            )}
        </div>
    );
}

// ─── Helper components / renderers to keep layout clean ───
function styleScheduleData(scheduleData) {
    if (scheduleData.length === 0) return null;
    return (
        <div className="p-8 rounded-3xl border border-white/5 bg-[#121215]">
            <div className="text-[9px] uppercase tracking-widest text-white font-bold mb-6 flex items-center gap-2">
                <Clock size={12} /> Practice Distribution
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scheduleData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#fafafa', fontSize: 9, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#fafafa', fontSize: 9 }} unit="min" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                            {scheduleData.map((entry, i) => (
                                <Cell key={i} fill={entry.intensity === 3 ? '#ffffff' : entry.intensity === 2 ? '#a1a1aa' : '#52525b'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
