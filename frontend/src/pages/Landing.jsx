
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
    Linkedin,
    ExternalLink,
    ArrowRight
} from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-16 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center font-serif text-white text-xs">
                            CE
                        </div>
                        <span className="font-serif text-lg tracking-tight font-medium text-white">CodeEvents</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link to="/login" className="editorial-subtitle !text-[10px] hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn-black !text-[10px] !py-2.5 !px-6 !tracking-[0.2em]">
                            Initialize
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="editorial-title uppercase mb-10">
                            Master the <br />
                            <span className="italic opacity-30">Coding Arena.</span>
                        </h1>
                        <p className="text-xl text-zinc-500 font-light max-w-lg mb-12 leading-relaxed">
                            A unified command center for elite programmers. Track global contests, sync performance metrics, and optimize your algorithmic path.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/register" className="btn-black text-xs tracking-widest px-10 py-5">
                                Start Journey <ArrowRight size={16} />
                            </Link>
                            <Link to="/login" className="flex items-center gap-2 editorial-subtitle !text-white hover:opacity-60 transition-opacity">
                                Access Terminal <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="mt-24 flex items-center gap-16 border-t border-zinc-900 pt-10">
                            <Stat number="12+" label="Platforms" />
                            <Stat number="50K" label="Events" />
                            <Stat number="0.1s" label="Latency" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-zinc-900 bg-zinc-950 aspect-[4/5] group">
                            <img
                                src="/landing-meme.jpg"
                                alt="Dashboard Preview"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100 transition-all"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                            <div className="absolute bottom-8 left-8 right-8 bg-zinc-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700 border border-white/5">
                                <div className="editorial-subtitle !text-[9px] mb-3 flex items-center gap-2">
                                    <Bell size={10} className="text-white" /> Incoming Transmission
                                </div>
                                <p className="font-serif text-xl italic leading-tight text-white">"Codeforces Global Round 25 initializing in 15 minutes."</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-40 px-12 bg-zinc-950/30">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-4 mb-24">
                        <div className="editorial-subtitle text-center">Core Architecture</div>
                        <h2 className="text-5xl font-serif text-center uppercase tracking-tight text-white">Platform <br /> <span className="italic opacity-30">Capabilities.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={LayoutDashboard}
                            title="Unified Node"
                            desc="Monitor LeetCode, Codeforces, and AtCoder from a single professional interface."
                        />
                        <FeatureCard
                            icon={Bell}
                            title="Smart Alerts"
                            desc="Precision notifications for upcoming battles cross-synced with your profile."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Global Sync"
                            desc="Real-time synchronization of ratings and performance metrics across ecosystem."
                        />
                        <FeatureCard
                            icon={Terminal}
                            title="Command Line"
                            desc="Execute and test algorithmic snippets in a distraction-free high-end environment."
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Master Path"
                            desc="Visualize your professional growth trajectory with our advanced logic engine."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Secure Identity"
                            desc="Encrypted personal data management with local-first security protocols."
                        />
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="border-t border-zinc-900 py-20 px-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center font-serif text-white text-[10px]">CE</div>
                        <span className="font-serif text-xl tracking-tighter text-white">CodeEvents</span>
                    </div>


                    <div className="editorial-subtitle !text-[9px] !text-zinc-500">
                        © 2026 CODEEVENTS / OPERATIONAL
                    </div>
                </div>
            </footer>
        </div>
    );
}

const Stat = ({ number, label }) => (
    <div className="space-y-1">
        <div className="text-3xl font-serif italic">{number}</div>
        <div className="editorial-subtitle !text-[9px]">{label}</div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="card-minimal p-10 group hover:bg-zinc-900">
        <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black transition-all duration-500">
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-serif mb-4 group-hover:translate-x-1 transition-transform duration-500 text-white">{title}</h3>
        <p className="text-zinc-500 font-light leading-relaxed text-sm group-hover:text-zinc-300 transition-colors duration-500">{desc}</p>
    </div>
);

const SocialLink = ({ href, icon: Icon, label }) => (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5">
        <Icon size={16} />
        <span className="editorial-subtitle !text-[9px] !text-white">{label}</span>
    </a>
);

const FooterLink = ({ label }) => (
    <a href="#" className="editorial-subtitle !text-[9px] hover:text-black transition-colors">{label}</a>
);
