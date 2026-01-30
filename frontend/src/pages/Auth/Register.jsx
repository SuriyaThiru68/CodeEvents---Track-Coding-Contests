
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !name) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Account created.');
                navigate('/login');
            } else {
                toast.error(data.msg || 'Registration Failed');
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
            <div className="w-full md:w-1/2 lg:w-5/12 bg-black text-white flex flex-col p-8 md:p-12 lg:p-16 justify-between relative overflow-hidden order-last md:order-first">
                <div className="z-10">
                    <Link to="/" className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-serif text-black text-sm font-medium">CE</div>
                        <span className="font-serif text-xl tracking-tight font-medium">CodeEvents</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-6 tracking-tight">
                        Join the <br /><span className="italic text-gray-400">Elite Network.</span>
                    </h1>
                    <p className="text-gray-400 font-light text-lg max-w-sm">
                        Create your profile and start tracking your competitive journey today.
                    </p>
                </div>

                <div className="z-10 text-xs font-medium text-gray-500 uppercase tracking-widest mt-12 md:mt-0">
                    System Registration v2.0
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none transition-all font-medium placeholder:text-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none transition-all font-medium placeholder:text-gray-400"
                                    placeholder="At least 8 characters"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input type="checkbox" id="terms" className="mt-1" />
                            <label htmlFor="terms" className="text-sm text-gray-500 leading-tight">
                                I agree to the <a href="#" className="text-black underline">Terms of Service</a> and <a href="#" className="text-black underline">Privacy Policy</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account? <Link to="/login" className="font-medium text-black hover:underline underline-offset-4">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
