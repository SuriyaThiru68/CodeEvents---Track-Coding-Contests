
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Code2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Identity required to proceed');
            return;
        }
        setIsLoading(true);
        // Simulate network delay for premium feel
        setTimeout(() => {
            setUser({ email, name: email.split('@')[0].toUpperCase() });
            toast.success('Access Granted. Welcome back, agent.');
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
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.15, 0.1],
                    x: [0, -40, 0],
                    y: [0, 40, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Decorative border wrapper */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-red-600 via-zinc-800 to-blue-600 rounded-2xl blur-[1px] opacity-30" />

                <div className="relative bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                    <header className="mb-10 text-center relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl mb-6 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        >
                            <Code2 className="text-white" size={32} />
                        </motion.div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2 uppercase italic">
                            System <span className="text-red-500">Login</span>
                        </h1>
                        <p className="text-zinc-500 font-medium text-sm tracking-widest uppercase">
                            Secure Authentication Protocol
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-red-500 transition-colors">
                                Access Token (Email)
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder:text-zinc-700"
                                    placeholder="agent@cmd.center"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-red-500 transition-colors">
                                Neural Key (Password)
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-12 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder:text-zinc-700"
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

                        <div className="flex items-center justify-between tabular-nums">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 bg-zinc-900 border border-white/10 rounded peer-checked:bg-red-500 peer-checked:border-red-500 transition-all" />
                                    <ShieldCheck className="absolute inset-0 m-auto text-white scale-0 peer-checked:scale-75 transition-transform" size={16} />
                                </div>
                                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Maintain Session</span>
                            </label>
                            <Link to="#" className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-red-500 transition-colors">Lost Key?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full overflow-hidden rounded-xl bg-red-600 py-4 font-bold text-white uppercase tracking-widest transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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
                                        Authorize Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </form>

                    <footer className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                            New Operative? <Link to="/register" className="text-red-500 hover:text-red-400 underline underline-offset-4 decoration-2">Initialize Profile_</Link>
                        </p>
                    </footer>
                </div>

                {/* Decorative Footer Detail */}
                <div className="mt-6 flex items-center justify-between px-2 opacity-20">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-1 bg-red-500 rounded-full" />)}
                    </div>
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">
                        v2.0.4 // secure_gateway_active
                    </div>
                </div>
            </motion.div>
        </div>
    );
}


const login = async () => {
    const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
};
