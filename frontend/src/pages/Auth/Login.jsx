import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useStore } from "../../store/useStore";
import { toast } from "sonner";
import { BACKEND_URL } from "../../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);
    const setProfilesFromDb = useStore((state) => state.setProfilesFromDb);
    const API_URL = BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Email and password are required.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.msg || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            const userObj = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            setUser(userObj);
            if (data.user.profiles) {
                setProfilesFromDb(data.user.profiles);
            }
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col md:flex-row selection:bg-[#4BB8FA]/20 selection:text-[#4BB8FA] font-sans antialiased overflow-x-hidden">
            <div className="w-full md:w-5/12 bg-[#121214] border-r border-zinc-800/80 flex flex-col p-12 lg:p-16 justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4BB8FA] to-[#0F9BF2] text-black rounded-xl flex items-center justify-center text-base font-bold shadow-sm">
                            CE
                        </div>
                        <span className="text-xl tracking-tight font-semibold text-white">Code<span className="text-[#4BB8FA]">Events</span></span>
                    </Link>

                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                        Welcome Back
                    </h1>

                    <p className="text-zinc-400 font-normal max-w-xs leading-relaxed text-sm">
                        Access your coding contests, track progress, and master competitive programming with CodeEvents.
                    </p>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-[#4BB8FA] rounded-full"></div>
                    <span className="text-xs font-medium text-zinc-500">Secure Platform</span>
                </div>

                {/* Visual Accent */}
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4BB8FA]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#0F9BF2]/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="w-full md:w-7/12 flex items-center justify-center p-12 lg:p-24 bg-[#09090b]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold text-white">Sign In</h2>
                        <p className="text-zinc-400 text-sm">Enter your email and password to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-zinc-900 border border-zinc-800 focus:border-[#4BB8FA]/50 focus:ring-1 focus:ring-[#4BB8FA]/50 text-white placeholder:text-zinc-500 w-full rounded-xl py-3 transition-colors outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">Password</label>
                                <button 
                                    type="button" 
                                    onClick={handleForgotPassword}
                                    className="text-xs font-semibold text-[#4BB8FA] hover:text-[#0F9BF2] transition-colors cursor-pointer"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 bg-zinc-900 border border-zinc-800 focus:border-[#4BB8FA]/50 focus:ring-1 focus:ring-[#4BB8FA]/50 text-white placeholder:text-zinc-500 w-full rounded-xl py-3 transition-colors outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-white hover:bg-[#4BB8FA] text-black font-semibold rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-70 cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin text-black" size={18} />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-zinc-800/80 text-center">
                        <p className="text-sm text-zinc-400">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-[#4BB8FA] font-semibold hover:text-white transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
