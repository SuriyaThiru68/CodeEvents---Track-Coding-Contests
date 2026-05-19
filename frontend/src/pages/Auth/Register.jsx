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
            const res = await fetch($/api/auth/register, {
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
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col md:flex-row text-gray-900 selection:bg-orange-400 selection:text-white">
            <div className="w-full md:w-5/12 bg-gradient-to-b from-white via-gray-50 to-gray-100 border-r border-gray-200 flex flex-col p-12 lg:p-16 justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 mb-16">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg shadow-orange-500/20">
                            CE
                        </div>
                        <span className="text-lg tracking-tight font-bold text-gray-900">Code<span className="text-orange-500">Events</span></span>
                    </Link>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                        Join CodeEvents
                    </h1>

                    <p className="text-gray-600 font-normal max-w-xs leading-relaxed text-sm">
                        Create an account to participate in coding contests, track your progress, and master competitive programming.
                    </p>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-500">Secure Registration</span>
                </div>

                {/* Visual Accent */}
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="w-full md:w-7/12 flex items-center justify-center p-12 lg:p-24 bg-gray-50/50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
                        <p className="text-gray-600 text-sm">Create your account to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-minimal pl-10 bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-900 placeholder:text-gray-400 w-full rounded-lg transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-minimal pl-10 bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-900 placeholder:text-gray-400 w-full rounded-lg transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-minimal pl-10 pr-10 bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-900 placeholder:text-gray-400 w-full rounded-lg transition-colors"
                                    placeholder="At least 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-minimal pl-10 pr-10 bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-900 placeholder:text-gray-400 w-full rounded-lg transition-colors"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    Create Account <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
