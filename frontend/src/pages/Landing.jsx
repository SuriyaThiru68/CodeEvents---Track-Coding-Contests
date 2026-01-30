
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
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center font-serif text-white text-sm font-medium">
                            CE
                        </div>
                        <span className="font-serif text-xl tracking-tight font-medium">CodeEvents</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-500 hover:text-black text-xs font-medium uppercase tracking-widest transition-colors">Features</a>
                        <a href="#creator" className="text-gray-500 hover:text-black text-xs font-medium uppercase tracking-widest transition-colors">Creator</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium hover:text-gray-600 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover-lift">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-8">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> System Online
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight mb-8 leading-[1.1]">
                            Master the <br />
                            <span className="italic text-gray-400">Coding Arena</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-light max-w-xl mb-10 leading-relaxed">
                            A unified command center for competitive programmers. Track contests, sync ratings, and elevate your algorithmic potential.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all hover-lift flex items-center justify-center gap-2 group">
                                Start Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all text-center">
                                Access Dashboard
                            </Link>
                        </div>

                        <div className="mt-16 flex items-center gap-12 border-t border-gray-100 pt-8">
                            <Stat number="10+" label="Platforms" />
                            <Stat number="50K+" label="Contests Tracked" />
                            <Stat number="0.1s" label="Sync Latency" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 bg-gray-50 aspect-[4/3] group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent opacity-50" />
                            <img
                                src="/landing-meme.jpg"
                                alt="Dashboard Preview"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-black rounded-lg text-white"><Bell size={14} /></div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Incoming Alert</span>
                                </div>
                                <p className="font-serif text-lg">"Codeforces Round #934 starting in 15 minutes."</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-8 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4">Platform Capabilities</h2>
                        <div className="w-20 h-1 bg-black rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={LayoutDashboard}
                            title="Unified Dashboard"
                            desc="Monitor LeetCode, Codeforces, and more from a single, elegant interface."
                        />
                        <FeatureCard
                            icon={Bell}
                            title="Smart Notifications"
                            desc="Never miss a contest again with intelligent, timely alerts."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Global Sync"
                            desc="Automatic synchronization of your ratings and rankings across platforms."
                        />
                        <FeatureCard
                            icon={Terminal}
                            title="Code Playground"
                            desc="Test algorithms and snippets in a distraction-free environment."
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Master Calendar"
                            desc="Visualize your competitive schedule with our advanced calendar system."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Performance Analytics"
                            desc="Deep dive into your progress with detailed charts and insights."
                        />
                    </div>
                </div>
            </section>

            {/* Creator Section */}
            <section id="creator" className="py-32 px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-black text-white rounded-3xl p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-800 rounded-full blur-[120px] opacity-50 -translate-y-1/2 translate-x-1/2" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Built by <br /><span className="italic text-gray-400">Design</span></h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
                                    Crafted by Suriya Thiruppathy, a Full Stack Developer obsessed with the intersection of performance and aesthetics. CodeEvents represents a vision of tools that are not just functional, but inspiring to use.
                                </p>

                                <div className="flex gap-4">
                                    <SocialLink href="https://github.com/suriyathiruppathy" icon={Github} label="GitHub" />
                                    <SocialLink href="https://www.linkedin.com/in/suriyathiruppathy/" icon={Linkedin} label="LinkedIn" />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img src="/creator.jpg" alt="Creator" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center font-serif text-white text-xs">CE</div>
                        <span className="font-serif text-lg tracking-tight">CodeEvents</span>
                    </div>

                    <div className="flex gap-8">
                        <FooterLink label="Privacy" />
                        <FooterLink label="Terms" />
                        <FooterLink label="Contact" />
                    </div>

                    <div className="text-xs text-gray-400 font-medium tracking-wide disabled">
                        © 2026 CODEEVENTS. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    );
}

const Stat = ({ number, label }) => (
    <div>
        <div className="text-3xl font-serif font-medium">{number}</div>
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">{label}</div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 group">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
            <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-serif mb-3">{title}</h3>
        <p className="text-gray-500 font-light leading-relaxed text-sm">{desc}</p>
    </div>
);

const SocialLink = ({ href, icon: Icon, label }) => (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/5">
        <Icon size={18} />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </a>
);

const FooterLink = ({ label }) => (
    <a href="#" className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-black transition-colors">{label}</a>
);
