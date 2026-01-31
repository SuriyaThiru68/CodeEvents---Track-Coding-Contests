import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useStore } from "../../store/useStore";
import { toast } from "sonner";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    // 🔥 Backend URL (works locally & in production)
    const API_URL = "https://codeevents-tracking.onrender.com";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter your credentials.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.msg || "Authentication failed");
                return;
            }

            // ✅ Save token & user
            localStorage.setItem("token", data.token);

            const userObj = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email
            };

            localStorage.setItem("user", JSON.stringify(userObj));
            setUser(userObj);

            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            toast.error("Unable to connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900">
            {/* LEFT PANEL */}
            <div className="w-full md:w-1/2 lg:w-5/12 bg-gray-50 border-r border-gray-100 flex flex-col p-8 md:p-12 lg:p-16 justify-between relative overflow-hidden">
                <div>
                    <Link to="/" className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm font-medium">
                            CE
                        </div>
                        <span className="font-serif text-xl font-medium">
                            CodeEvents
                        </span>
                    </Link>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
                        Log in to your <br />
                        <span className="italic text-gray-400">Command Center.</span>
                    </h1>

                    <p className="text-gray-500 text-lg max-w-sm">
                        Access your contests, notes, and analytics in one dashboard.
                    </p>
                </div>

                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    Protected by Secure Node v2.0
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* EMAIL */}
                        <div>
                            <label className="text-xs font-semibold uppercase text-gray-500">
                                Email Address
                            </label>
                            <div className="relative mt-2">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl outline-none border focus:bg-white focus:border-gray-200"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-xs font-semibold uppercase text-gray-500">
                                Password
                            </label>
                            <div className="relative mt-2">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl outline-none border focus:bg-white focus:border-gray-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            New to CodeEvents?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-black hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
