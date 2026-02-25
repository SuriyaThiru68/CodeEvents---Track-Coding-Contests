
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, ChevronRight } from "lucide-react";
import { useStore } from "../../store/useStore";
import { toast } from "sonner";
import { BACKEND_URL } from "../../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);
    const API_URL = BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Credentials required.");
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
                toast.error(data.msg || "Access Denied");
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
            toast.success("Identity Verified.");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Uplink Failure.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row text-white selection:bg-white selection:text-black">
            <div className="w-full md:w-5/12 bg-zinc-950 border-r border-zinc-900 flex flex-col p-12 lg:p-20 justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 mb-16">
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-white text-[10px] font-serif">
                            CE
                        </div>
                        <span className="font-serif text-lg tracking-tight font-medium text-white">CodeEvents</span>
                    </Link>

                    <h1 className="editorial-title uppercase mb-10 text-white">
                        Login to <br />
                        <span className="italic opacity-30 text-white">Command.</span>
                    </h1>

                    <p className="text-zinc-500 font-light max-w-[280px] leading-relaxed">
                        Secure access to your coding intelligence hub. Contests, analytics, and tactical notes in one place.
                    </p>
                </div>

                <div className="editorial-subtitle !text-[9px] relative z-10 text-zinc-600">
                    System Node V 2.0 / Secure
                </div>
            </div>

            <div className="w-full md:w-7/12 flex items-center justify-center p-12 lg:p-24 bg-black">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-sm space-y-12"
                >
                    <div className="space-y-4 text-center md:text-left">
                        <div className="editorial-subtitle text-zinc-500">Security Authentication</div>
                        <h2 className="text-4xl font-serif text-white">Access Credentials</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="editorial-subtitle !text-white !text-[10px]">Registry Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-minimal"
                                placeholder="name@domain.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="editorial-subtitle !text-white !text-[10px]">Access Core Key</label>
                                <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Forgot Key?</button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-minimal"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-black w-full justify-center !py-4 !text-[10px] !tracking-[0.2em]"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    Verify Identity <ChevronRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-zinc-900 text-center md:text-left">
                        <p className="editorial-subtitle !text-[10px] text-zinc-500">
                            Not Registered?{" "}
                            <Link to="/register" className="text-white hover:opacity-50 transition-opacity">
                                Initialize New Node
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
