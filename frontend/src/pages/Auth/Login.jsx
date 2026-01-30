
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter your credentials.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                const userObj = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                };
                setUser(userObj);
                localStorage.setItem('user', JSON.stringify(userObj));
                toast.success('Welcome back.');
                navigate('/dashboard');
            } else {
                toast.error(data.msg || 'Authentication Failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Unable to connect to server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900 selection:bg-black selection:text-white">
            {/* Left Panel - Visual */}
            <div className="w-full md:w-1/2 lg:w-5/12 bg-gray-50 border-r border-gray-100 flex flex-col p-8 md:p-12 lg:p-16 justify-between relative overflow-hidden">
                <div className="z-10">
                    <Link to="/" className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center font-serif text-white text-sm font-medium">CE</div>
                        <span className="font-serif text-xl tracking-tight font-medium">CodeEvents</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-6 tracking-tight">
                        Log in to your <br /><span className="italic text-gray-400">Command Center.</span>
                    </h1>
                    <p className="text-gray-500 font-light text-lg max-w-sm">
                        Access your contests, notes, and analytics in one unified dashboard.
                    </p>
                </div>

                <div className="z-10 text-xs font-medium text-gray-400 uppercase tracking-widest mt-12 md:mt-0">
                    Protected by Secure Node v2.0
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gray-200/50 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none transition-all font-medium placeholder:text-gray-400"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
                                <a href="#" className="text-xs font-medium text-gray-400 hover:text-black transition-colors">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none transition-all font-medium placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            New to CodeEvents? <Link to="/register" className="font-medium text-black hover:underline underline-offset-4">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
