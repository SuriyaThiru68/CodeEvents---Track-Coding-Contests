import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, KeyRound, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { BACKEND_URL } from "../../services/api";

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const API_URL = BACKEND_URL;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/forgot-password-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.msg || "Failed to send OTP");
                return;
            }
            toast.success(data.msg || "OTP sent to your email");
            setStep(2);
        } catch (err) {
            toast.error("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !password) {
            toast.error("Please enter the OTP and a new password.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.msg || "Failed to reset password");
                return;
            }
            toast.success(data.msg || "Password reset successful");
            navigate("/login");
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
                        Reset Password
                    </h1>

                    <p className="text-zinc-400 font-normal max-w-xs leading-relaxed text-sm">
                        Recover access to your account by verifying your email and setting a new secure password.
                    </p>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-[#4BB8FA] rounded-full"></div>
                    <span className="text-xs font-medium text-zinc-500">Secure Recovery</span>
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
                        <h2 className="text-3xl font-extrabold text-white">
                            {step === 1 ? "Forgot Password" : "Set New Password"}
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            {step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP sent to your email and your new password."}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-white hover:bg-[#4BB8FA] text-black font-semibold rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-70 cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin text-black" size={18} />
                                ) : (
                                    <>
                                        Send OTP <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">6-Digit OTP</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="pl-10 bg-zinc-900 border border-zinc-800 focus:border-[#4BB8FA]/50 focus:ring-1 focus:ring-[#4BB8FA]/50 text-white placeholder:text-zinc-500 w-full rounded-xl py-3 transition-colors outline-none tracking-widest font-mono"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-wider uppercase text-zinc-500">New Password</label>
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
                                        Change Password <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="pt-6 border-t border-zinc-800/80 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
