
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Save,
    Trash2,
    Copy,
    RotateCcw,
    Download,
    Terminal as TerminalIcon,
    FileCode,
    Search,
    Check,
    Code
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

export default function Playground() {
    const { snippets, addSnippet, deleteSnippet } = useStore();
    const [activeTab, setActiveTab] = useState('editor');
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('// JavaScript Prototyping\nconsole.log("System Initialized...");\n\nfunction solve(n) {\n  return n * 2;\n}\n\nconsole.log(solve(21));');
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const languages = [
        { id: 'javascript', name: 'JavaScript', icon: 'JS' },
        { id: 'python', name: 'Python', icon: 'PY' },
        { id: 'cpp', name: 'C++', icon: 'C+' },
        { id: 'java', name: 'Java', icon: 'JV' },
        { id: 'c', name: 'C', icon: 'C' },
    ];

    const runCode = () => {
        setIsRunning(true);
        setOutput([{ type: 'log', content: `Compiling ${language.toUpperCase()}...` }]);

        setTimeout(() => {
            if (language === 'javascript') {
                const logs = [];
                const customConsole = {
                    log: (...args) => logs.push({ type: 'log', content: args.join(' ') }),
                    error: (...args) => logs.push({ type: 'error', content: args.join(' ') }),
                    warn: (...args) => logs.push({ type: 'warn', content: args.join(' ') }),
                };

                try {
                    const execute = new Function('console', code);
                    execute(customConsole);
                    setOutput(logs);
                    toast.success('JS Execution Finished');
                } catch (err) {
                    setOutput([{ type: 'error', content: err.message }]);
                    toast.error('JS Runtime Error');
                }
            } else {
                // Simulated execution for other languages
                const simulatedOutput = [
                    { type: 'log', content: `[SIMULATED] Executing ${language.toUpperCase()} binary...` },
                    { type: 'log', content: `Output: Hello from ${language.toUpperCase()} competitive solver!` },
                    { type: 'warn', content: 'Note: Real non-JS execution requires a backend runner API.' }
                ];
                setOutput(simulatedOutput);
                toast.success(`${language.toUpperCase()} Simulated Finished`);
            }
            setIsRunning(false);
        }, 800);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard');
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "snippet.js";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="space-y-12 text-white">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b border-zinc-900 pb-12">
                <div className="space-y-4">
                    <div className="editorial-subtitle !text-[10px] !tracking-[0.3em] opacity-50 uppercase">Neural Intelligence Lab</div>
                    <h1 className="text-7xl font-serif italic font-black uppercase tracking-tighter text-white">
                        Neural_<span className="opacity-30">Lab</span>
                    </h1>
                    <p className="text-sm font-medium opacity-40 uppercase tracking-[0.2em] leading-none">JS Prototyping & Snippet Library</p>
                </div>
                <div className="flex gap-1 border border-zinc-800 p-1 bg-zinc-900 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${activeTab === 'editor' ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('snippets')}
                        className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${activeTab === 'snippets' ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Library
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'editor' ? (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]"
                    >
                        {/* Toolbar Side */}
                        <div className="lg:col-span-1 border border-zinc-900 bg-zinc-950/50 rounded-3xl flex flex-col items-center py-8 gap-6">
                            {languages.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => setLanguage(lang.id)}
                                    className={`w-10 h-10 border border-zinc-800 rounded-xl flex items-center justify-center font-black text-[10px] transition-all hover:scale-110 ${language === lang.id ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 opacity-40'}`}
                                    title={lang.name}
                                >
                                    {lang.icon}
                                </button>
                            ))}
                            <div className="h-4 border-b border-zinc-900 w-full" />
                            <ToolButton icon={Copy} onClick={copyToClipboard} label="Copy" />
                            <ToolButton icon={Download} onClick={handleDownload} label="Save" />
                            <ToolButton icon={RotateCcw} onClick={() => setCode('')} label="Clear" />
                            <div className="flex-1" />
                            <button
                                onClick={runCode}
                                className={`w-16 h-16 rounded-2xl border border-zinc-800 flex items-center justify-center transition-all ${isRunning ? 'bg-zinc-800' : 'bg-white text-black hover:scale-110 shadow-xl shadow-white/5'}`}
                            >
                                <Play size={24} fill="currentColor" />
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="lg:col-span-7 border border-zinc-900 bg-zinc-950 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
                            <div className="bg-zinc-900 text-zinc-400 px-6 py-4 flex justify-between items-center border-b border-zinc-800">
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Main.js - Execution Buffer</span>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                </div>
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 p-8 font-mono text-lg bg-transparent border-none focus:outline-none resize-none selection:bg-white selection:text-black text-zinc-300"
                                spellCheck="false"
                            />
                        </div>

                        {/* Console Output */}
                        <div className="lg:col-span-4 border border-zinc-900 bg-black text-white rounded-3xl flex flex-col shadow-2xl overflow-hidden">
                            <div className="border-b border-zinc-900 px-6 py-4 flex items-center gap-3 bg-zinc-950">
                                <TerminalIcon size={18} className="text-zinc-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Standard Out</span>
                            </div>
                            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2 bg-black">
                                {output.map((line, i) => (
                                    <div key={i} className={`flex gap-3 ${line.type === 'error' ? 'text-red-400' : line.type === 'warn' ? 'text-yellow-400/70' : 'text-zinc-400'}`}>
                                        <span className="opacity-20">{i + 1}</span>
                                        <span className="opacity-40">{line.type === 'log' ? '>>' : '!!'}</span>
                                        <span className="flex-1">{line.content}</span>
                                    </div>
                                ))}
                                {output.length === 0 && <span className="opacity-20 italic uppercase tracking-widest text-[10px]">Waiting for execution...</span>}
                            </div>
                            <div className="bg-zinc-950 p-4 border-t border-zinc-900 flex justify-between text-[10px] font-black uppercase tracking-widest italic text-zinc-600">
                                <span>Memory: Stable</span>
                                <span>Cycles: 0.2ms</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="snippets"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-center gap-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={24} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search library..."
                                    className="w-full pl-16 pr-6 py-6 border border-zinc-900 rounded-[32px] bg-zinc-950 font-serif italic text-2xl tracking-tighter text-white placeholder:text-zinc-800 outline-none focus:border-zinc-700 transition-all shadow-2xl"
                                />
                            </div>
                            <button className="bg-white text-black px-12 py-7 rounded-[32px] font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-4 shadow-xl">
                                <FileCode size={24} /> New Snippet
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                            {snippets.map((snippet) => (
                                <div key={snippet.id} className="card-minimal border border-zinc-900 bg-zinc-950/50 flex flex-col group overflow-hidden">
                                    <div className="p-8 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-zinc-900 text-zinc-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">{snippet.category}</span>
                                            <button onClick={() => deleteSnippet(snippet.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-serif italic font-black uppercase tracking-tighter mb-4 text-white group-hover:text-white/70 transition-colors">{snippet.title}</h3>
                                        <pre className="bg-black border border-zinc-900 p-4 rounded-xl font-mono text-[10px] text-zinc-500 overflow-hidden truncate">
                                            {snippet.code}
                                        </pre>
                                    </div>
                                    <button
                                        onClick={() => { setCode(snippet.code); setActiveTab('editor'); toast.success(`Loaded ${snippet.title}`); }}
                                        className="w-full bg-zinc-900 text-zinc-400 py-6 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all duration-500 border-t border-zinc-900"
                                    >
                                        Load into Neural_Net
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const ToolButton = ({ icon: Icon, onClick, label }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 group"
    >
        <div className="w-12 h-12 border border-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <Icon size={18} strokeWidth={1.5} />
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">{label}</span>
    </button>
);
