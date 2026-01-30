
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
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b-8 border-[#000] pb-8">
                <div>
                    <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4">Neural_Lab</h1>
                    <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none">JS Prototyping & Snippet Library</p>
                </div>
                <div className="flex gap-1 border-4 border-[#000] p-1 bg-[#000]">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`px-8 py-3 font-black uppercase tracking-widest text-xs transition-colors ${activeTab === 'editor' ? 'bg-[#fff] text-[#000]' : 'text-[#fff] hover:bg-[#333]'}`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('snippets')}
                        className={`px-8 py-3 font-black uppercase tracking-widest text-xs transition-colors ${activeTab === 'snippets' ? 'bg-[#fff] text-[#000]' : 'text-[#fff] hover:bg-[#333]'}`}
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
                        <div className="lg:col-span-1 border-4 border-[#000] bg-[#fff] flex flex-col items-center py-8 gap-4 shadow-[8px_8px_0px_0px_#000]">
                            {languages.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => setLanguage(lang.id)}
                                    className={`w-10 h-10 border-2 border-[#000] flex items-center justify-center font-black text-[10px] transition-all hover:scale-110 ${language === lang.id ? 'bg-[#000] text-[#fff]' : 'bg-gray-100 opacity-40'}`}
                                    title={lang.name}
                                >
                                    {lang.icon}
                                </button>
                            ))}
                            <div className="h-4 border-b-2 border-[#000] w-full" />
                            <ToolButton icon={Copy} onClick={copyToClipboard} label="Copy" />
                            <ToolButton icon={Download} onClick={handleDownload} label="Save" />
                            <ToolButton icon={RotateCcw} onClick={() => setCode('')} label="Clear" />
                            <div className="flex-1" />
                            <button
                                onClick={runCode}
                                className={`w-16 h-16 border-4 border-[#000] flex items-center justify-center transition-all ${isRunning ? 'bg-gray-100' : 'bg-[#2563eb] text-[#fff] hover:scale-110 shadow-[4px_4px_0px_0px_#000]'}`}
                            >
                                <Play size={24} fill="currentColor" />
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="lg:col-span-7 border-4 border-[#000] bg-[#fff] flex flex-col shadow-[8px_8px_0px_0px_#facc15]">
                            <div className="bg-[#000] text-[#fff] px-6 py-3 flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest">Main.js - Execution Buffer</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                </div>
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 p-8 font-mono text-lg bg-transparent border-none focus:outline-none resize-none selection:bg-[#2563eb] selection:text-white"
                                spellCheck="false"
                            />
                        </div>

                        {/* Console Output */}
                        <div className="lg:col-span-4 border-4 border-[#000] bg-[#000] text-[#fff] flex flex-col shadow-[8px_8px_0px_0px_#000]">
                            <div className="border-b-2 border-[#fff]/10 px-6 py-4 flex items-center gap-3">
                                <TerminalIcon size={18} className="text-[#2563eb]" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Standard Out</span>
                            </div>
                            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2">
                                {output.map((line, i) => (
                                    <div key={i} className={`flex gap-3 ${line.type === 'error' ? 'text-[#60a5fa]' : line.type === 'warn' ? 'text-yellow-400' : 'text-green-400'}`}>
                                        <span className="opacity-20">{i + 1}</span>
                                        <span className="opacity-40">{line.type === 'log' ? '>>' : '!!'}</span>
                                        <span className="flex-1">{line.content}</span>
                                    </div>
                                ))}
                                {output.length === 0 && <span className="opacity-20 italic uppercase tracking-widest text-xs">Waiting for execution...</span>}
                            </div>
                            <div className="bg-[#fff]/5 p-4 flex justify-between text-[10px] font-black uppercase tracking-widest italic">
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
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" size={24} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search library..."
                                    className="w-full pl-16 pr-6 py-6 border-8 border-[#000] font-black uppercase text-2xl tracking-tighter italic placeholder:text-gray-300 outline-none focus:bg-yellow-50 transition-colors"
                                />
                            </div>
                            <button className="bg-[#000] text-[#fff] px-12 py-7 font-black uppercase tracking-widest text-lg hover:scale-105 transition-transform flex items-center gap-4">
                                <FileCode size={24} /> New Snippet
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {snippets.map((snippet) => (
                                <div key={snippet.id} className="border-4 border-[#000] bg-[#fff] p-1 shadow-[10px_10px_0px_0px_#000] flex flex-col group">
                                    <div className="p-8 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-[#000] text-[#fff] px-3 py-1 text-[10px] font-black uppercase tracking-widest italic">{snippet.category}</span>
                                            <button onClick={() => deleteSnippet(snippet.id)} className="opacity-20 hover:opacity-100 hover:text-[#2563eb] transition-opacity">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#2563eb] transition-colors underline decoration-4 underline-offset-4">{snippet.title}</h3>
                                        <pre className="bg-gray-50 border-2 border-[#000] p-4 font-mono text-[10px] overflow-hidden truncate">
                                            {snippet.code}
                                        </pre>
                                    </div>
                                    <button
                                        onClick={() => { setCode(snippet.code); setActiveTab('editor'); toast.success(`Loaded ${snippet.title}`); }}
                                        className="w-full bg-[#000] text-[#fff] py-4 font-black uppercase tracking-widest text-xs hover:bg-[#2563eb] transition-colors border-t-4 border-[#000]"
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
        <div className="w-12 h-12 border-2 border-[#000] flex items-center justify-center group-hover:bg-[#000] group-hover:text-[#fff] transition-all">
            <Icon size={20} />
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{label}</span>
    </button>
);
