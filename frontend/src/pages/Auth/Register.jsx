import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useStore } from "../../store/useStore";
import { toast } from "sonner";
import { BACKEND_URL } from "../../services/api";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);
    const setProfilesFromDb = useStore((state) => state.setProfilesFromDb);
    const API_URL = BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error("All fields are required.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.msg || "Registration failed");
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
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                        Join CodeEvents
                    </h1>

                    <p className="text-zinc-400 font-normal max-w-xs leading-relaxed text-sm">
                        Create an account to participate in coding contests, track your progress, and master competitive programming.
                    </p>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-[#4BB8FA] rounded-full"></div>
                    <span className="text-xs font-medium text-zinc-500">Secure Registration</span>
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
                        <h2 className="text-3xl font-extrabold text-white">Sign up</h2>
                        <p className="text-zinc-400 text-sm">Create your account to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-10 bg-zinc-900 border border-zinc-800 focus:border-[#4BB8FA]/50 focus:ring-1 focus:ring-[#4BB8FA]/50 text-white placeholder:text-zinc-500 w-full rounded-xl py-3 transition-colors outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 bg-zinc-900 border border-zinc-800 focus:border-[#4BB8FA]/50 focus:ring-1 focus:ring-[#4BB8FA]/50 text-white placeholder:text-zinc-500 w-full rounded-xl py-3 transition-colors outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 pr-10 bg-zinc-900 border border-zinc-800 focus:border-[#4BB8FA]/50 focus:ring-1 focus:ring-[#4BB8FA]/50 text-white placeholder:text-zinc-500 w-full rounded-xl py-3 transition-colors outline-none"
                                    placeholder="At least 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="pl-10 pr-10 bg-zinc-900 border border-zinc-800 focus:border-[#4BB8FA]/50 focus:ring-1 focus:ring-[#4BB8FA]/50 text-white placeholder:text-zinc-500 w-full rounded-xl py-3 transition-colors outline-none"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
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
                                    Create Account <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-zinc-800/80 text-center">
                        <p className="text-sm text-zinc-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#4BB8FA] font-semibold hover:text-white transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
