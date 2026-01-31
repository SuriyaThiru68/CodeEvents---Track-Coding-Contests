
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
        <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-gray-50 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-16 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center font-serif text-white text-xs">
                            CE
                        </div>
                        <span className="font-serif text-lg tracking-tight font-medium">CodeEvents</span>
                    </div>

                    <div className="hidden md:flex items-center gap-12">
                        <a href="#features" className="editorial-subtitle !text-[10px] hover:text-black transition-colors">Capabilities</a>
                        <a href="#creator" className="editorial-subtitle !text-[10px] hover:text-black transition-colors">Manifesto</a>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link to="/login" className="editorial-subtitle !text-[10px] hover:text-black transition-colors">
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
                        <div className="editorial-subtitle mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            System Active / V 2.0
                        </div>
                        <h1 className="editorial-title uppercase mb-10">
                            Master the <br />
                            <span className="italic opacity-30">Coding Arena.</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-light max-w-lg mb-12 leading-relaxed">
                            A unified command center for elite programmers. Track global contests, sync performance metrics, and optimize your algorithmic path.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/register" className="btn-black text-xs tracking-widest px-10 py-5">
                                Start Journey <ArrowRight size={16} />
                            </Link>
                            <Link to="/login" className="flex items-center gap-2 editorial-subtitle !text-black hover:opacity-60 transition-opacity">
                                Access Terminal <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="mt-24 flex items-center gap-16 border-t border-gray-50 pt-10">
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
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 bg-gray-50 aspect-[4/5] group">
                            <img
                                src="/landing-meme.jpg"
                                alt="Dashboard Preview"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                <div className="editorial-subtitle !text-[9px] mb-3 flex items-center gap-2">
                                    <Bell size={10} className="text-black" /> Incoming Transmission
                                </div>
                                <p className="font-serif text-xl italic leading-tight">"Codeforces Global Round 25 initializing in 15 minutes."</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-40 px-12 bg-gray-50/30">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-4 mb-24">
                        <div className="editorial-subtitle text-center">Core Architecture</div>
                        <h2 className="text-5xl font-serif text-center uppercase tracking-tight">Platform <br /> <span className="italic opacity-30">Capabilities.</span></h2>
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

            {/* Creator Section */}
            <section id="creator" className="py-40 px-12">
                <div className="max-w-5xl mx-auto">
                    <div className="card-minimal bg-black text-white p-16 md:p-24 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)] group-hover:scale-110 transition-transform duration-1000" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10 items-center">
                            <div className="space-y-10">
                                <h2 className="text-5xl font-serif leading-none uppercase">Designed <br /><span className="italic text-white/30">From Code.</span></h2>
                                <p className="text-white/40 text-lg leading-relaxed font-light">
                                    Crafted by Suriya Thiruppathy, a developer obsessed with the intersection of high-performance logic and minimalist aesthetics. CodeEvents is a tool built for those who value both function and form.
                                </p>

                                <div className="flex gap-6">
                                    <SocialLink href="https://github.com/suriyathiruppathy" icon={Github} label="GitHub" />
                                    <SocialLink href="https://www.linkedin.com/in/suriyathiruppathy/" icon={Linkedin} label="LinkedIn" />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-3xl">
                                    <img src="/creator.jpg" alt="Creator" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-50 py-20 px-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center font-serif text-white text-[10px]">CE</div>
                        <span className="font-serif text-xl tracking-tighter">CodeEvents</span>
                    </div>

                    <div className="flex gap-12">
                        <FooterLink label="Privacy Policy" />
                        <FooterLink label="Terms of Access" />
                        <FooterLink label="Connect" />
                    </div>

                    <div className="editorial-subtitle !text-[9px] !text-gray-300">
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
    <div className="card-minimal p-10 group hover:bg-white">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-white transition-all duration-500">
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-serif mb-4 group-hover:translate-x-1 transition-transform duration-500">{title}</h3>
        <p className="text-gray-400 font-light leading-relaxed text-sm group-hover:text-gray-600 transition-colors duration-500">{desc}</p>
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
