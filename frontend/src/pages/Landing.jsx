
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Zap,
    Bell,
    LayoutDashboard,
    Calendar,
    Terminal,
    ChevronRight,
    Code2,
    Globe,
    Shield,
    Github,
    Twitter,
    Linkedin,
    ExternalLink
} from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Space_Grotesk'] overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black italic text-xl shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                            CE
                        </div>
                        <span className="font-black text-2xl tracking-tighter italic uppercase">CodeEvents_</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">Tactical Features</a>
                        <a href="#creator" className="text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">The Creator</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-6 py-2.5 font-bold uppercase tracking-widest text-xs hover:text-red-500 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-red-600 px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            Register_
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ef444415_0%,_transparent_70%)]" />
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Zap size={14} /> System v2.0 is Online
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8 uppercase">
                            Never Miss a <br />
                            <span className="text-red-600">Coding Duel_</span>
                        </h1>
                        <p className="text-xl text-zinc-400 font-medium max-w-xl mb-10 leading-relaxed">
                            The ultimate combat deck for competitive programmers. Sync all platforms, track your progress, and get notified before the battlefield opens.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 group flex items-center justify-center gap-3 text-center">
                                Start Training <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-10 py-5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all text-center">
                                Identity Access_
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
                            <div>
                                <div className="text-3xl font-black italic">10+</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Platforms</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <div className="text-3xl font-black italic">50K+</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Contests Tracked</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <div className="text-3xl font-black italic">⚡</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Instant Sync</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Meme Image Container */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-red-600 to-blue-600 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-zinc-900 border-4 border-white/10 p-2 rounded-[1.5rem] overflow-hidden shadow-2xl skew-y-1 group-hover:skew-y-0 transition-transform duration-500">
                                <img
                                    src="/landing-meme.jpg"
                                    alt="Contest Reminder Meme"
                                    className="w-full h-auto rounded-[1rem] brightness-90 contrast-125 group-hover:brightness-100 transition-all"
                                />
                                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-red-500 mb-1 italic">Tactical Briefing</p>
                                    <p className="text-xs font-bold text-zinc-300 italic">"Broo Today contest In Codeforces 📊 ..., Yeah, I get it..."</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Stats Card */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 bg-red-600 p-6 rounded-2xl shadow-2xl border-2 border-white/20 hidden md:block"
                        >
                            <Bell className="text-white mb-2" size={32} />
                            <div className="text-xs font-black uppercase tracking-widest">Active Alerts</div>
                            <div className="text-4xl font-black italic tracking-tighter">LIVE_</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">Command <span className="text-red-600">Capabilities_</span></h2>
                        <p className="text-zinc-500 max-w-2xl font-bold uppercase tracking-widest text-sm">Engineered for competitive excellence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={LayoutDashboard}
                            title="Unified Command"
                            desc="Monitor LeetCode, Codeforces, CodeChef, and AtCoder from a single tactical display."
                        />
                        <FeatureCard
                            icon={Bell}
                            title="Neural Alerts"
                            desc="Real-time notifications pushed to your browser and email before the round starts."
                            highlight
                        />
                        <FeatureCard
                            icon={Terminal}
                            title="The Playground"
                            desc="Test logic and store code snippets in our integrated development sandbox."
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Strategic Calendar"
                            desc="A 360-degree view of all upcoming global conflicts and coding marathons."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Global Sync"
                            desc="Instantly pull your ratings and rankings from across the coding universe."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Combat Logs"
                            desc="Keep detailed notes on your performance and analyze missed opportunities."
                        />
                    </div>
                </div>
            </section>

            {/* Creator Section */}
            <section id="creator" className="py-32 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-zinc-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden p-8 md:p-16 lg:p-20 shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] -z-10" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-red-600 to-blue-600 rounded-[2rem] blur-2xl opacity-20" />
                                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                                    <img
                                        src="/creator.jpg"
                                        alt="Suriya Thiruppathy - The Architect"
                                        className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <header>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                        <Code2 size={12} /> System Architect
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
                                        Suriya <br />
                                        <span className="text-red-600">Thiruppathy_</span>
                                    </h2>
                                    <p className="text-xl text-zinc-400 font-medium italic">
                                        Full Stack Developer | Aspiring Software Engineer | Tech Enthusiast
                                    </p>
                                </header>

                                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                                    Designed and developed CodeEvents to bridge the gap between technical skill and tactical preparation. Born out of a passion for competitive programming and an obsession with clean, high-performance user interfaces.
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <CreatorLink
                                        icon={Linkedin}
                                        label="Professional Node"
                                        value="Connect"
                                        href="https://www.linkedin.com/in/suriyathiruppathy/"
                                    />
                                    <CreatorLink
                                        icon={Github}
                                        label="Source Repository"
                                        value="Explore"
                                        href="https://github.com/suriyathiruppathy"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <a href="https://www.linkedin.com/in/suriyathiruppathy/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs text-center hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group">
                                        View Identity <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6 bg-[#080808]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center font-black italic text-sm">
                            CE
                        </div>
                        <span className="font-black text-xl tracking-tighter italic uppercase text-zinc-400">CodeEvents_</span>
                    </div>

                    <div className="flex gap-10">
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Privacy Protocol</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Contact Hub</a>
                    </div>

                    <div className="text-[10px] font-mono text-zinc-700 uppercase">
                        &copy; 2026 CodeEvents System // Global Node v2.0
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, highlight }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={`p-10 rounded-3xl border border-white/5 relative overflow-hidden group ${highlight ? 'bg-red-600/5' : 'bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors'}`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${highlight ? 'bg-red-600 rotate-12 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-zinc-800 group-hover:bg-red-600 transition-colors group-hover:rotate-12 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}>
                <Icon className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">{desc}</p>

            {/* Corner Accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-tl-2xl rotate-45 group-hover:bg-red-600/20 transition-colors" />
        </motion.div>
    );
}

function CreatorLink({ icon: Icon, label, value, href }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-zinc-800/50 border border-white/5 rounded-2xl group hover:bg-zinc-800 hover:border-white/20 transition-all"
        >
            <div className="flex items-center gap-3 mb-1">
                <Icon size={16} className="text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
            </div>
            <div className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{value}</div>
        </a>
    )
}
