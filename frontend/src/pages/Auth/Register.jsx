
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Code2, Zap, ShieldAlert } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

export default function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password || !name) {
            toast.error('All fields are mandatory for initialization');
            return;
        }
        setIsLoading(true);

        setTimeout(() => {
            setUser({ email, name });
            toast.success('Profile Initialized. Welcome to the Network.');
            navigate('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-['Space_Grotesk']">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>

            {/* Glowing Orbs */}
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.15, 0.1],
                    x: [0, -50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] bg-green-600/10 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, 60, 0],
                    y: [0, -40, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[520px] relative z-10"
            >
                {/* Decorative border wrapper */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-green-500 via-zinc-800 to-blue-500 rounded-2xl blur-[1px] opacity-30" />

                <div className="relative bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden">
                    {/* Top Accent Strip */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500" />

                    <header className="mb-10 text-center">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        >
                            <User className="text-white" size={28} />
                        </motion.div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2 uppercase italic">
                            Join <span className="text-green-500">Hub_</span>
                        </h1>
                        <p className="text-zinc-500 font-medium text-sm tracking-widest uppercase">
                            Initialize Your Coder Profile
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-green-500 transition-colors">
                                Operative Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-zinc-700"
                                    placeholder="e.g. GhostRunner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-green-500 transition-colors">
                                Communication Port (Email)
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-zinc-700"
                                    placeholder="coder@net.hub"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-green-500 transition-colors">
                                Multi-Factor Key (Password)
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-500 transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-12 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder:text-zinc-700"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-3 px-1">
                            <div className="relative flex items-center mt-1">
                                <input type="checkbox" required className="peer sr-only" id="terms" />
                                <div className="w-5 h-5 bg-zinc-900 border border-white/10 rounded peer-checked:bg-green-500 peer-checked:border-green-500 transition-all" />
                                <ShieldAlert className="absolute inset-0 m-auto text-white scale-0 peer-checked:scale-75 transition-transform" size={16} />
                            </div>
                            <label htmlFor="terms" className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-tight cursor-pointer hover:text-zinc-300 transition-colors">
                                I accept the coding protocols & security ethics.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full overflow-hidden rounded-xl bg-green-600 py-4 font-bold text-white uppercase tracking-widest transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Zap size={20} />
                                    </motion.div>
                                ) : (
                                    <>
                                        Establish Profile <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </form>

                    <footer className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                            Already Synchronized? <Link to="/login" className="text-green-500 hover:text-green-400 underline underline-offset-4 decoration-2">Identity Access_</Link>
                        </p>
                    </footer>
                </div>

                <div className="mt-6 flex items-center justify-between px-2 opacity-20">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-1 bg-green-500 rounded-full" />)}
                    </div>
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">
                        secure_enrollment_node_v2
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
