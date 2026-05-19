import React, { useState } from 'react';
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
    Code,
    ChevronDown,
    ChevronUp
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
    const [stdin, setStdin] = useState('');
    const [customInputEnabled, setCustomInputEnabled] = useState(false);

    const languages = [
        { id: 'javascript', name: 'JavaScript', icon: 'JS', defaultCode: '// JavaScript Prototyping\nconsole.log("System Initialized...");\n\nfunction solve(n) {\n  return n * 2;\n}\n\nconsole.log(solve(21));' },
        { id: 'python', name: 'Python', icon: 'PY', defaultCode: '# Python competitive solver\nimport sys\n\n# Read all input from standard input\n# input_data = sys.stdin.read()\n\nprint("Python Engine Online")\nprint("Result:", 42)' },
        { id: 'cpp', name: 'C++', icon: 'C+', defaultCode: '// C++ Solution\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "C++ Compiler Online" << endl;\n    cout << "Result: " << 42 << endl;\n    return 0;\n}' },
        { id: 'java', name: 'Java', icon: 'JV', defaultCode: '// Java Solution\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Java Compiler Online");\n        System.out.println("Result: " + 42);\n    }\n}' },
        { id: 'c', name: 'C', icon: 'C', defaultCode: '// C Solution\n#include <stdio.h>\n\nint main() {\n    printf("C Compiler Online\\n");\n    printf("Result: %d\\n", 42);\n    return 0;\n}' },
    ];

    const handleLanguageChange = (langId) => {
        setLanguage(langId);
        const selected = languages.find(l => l.id === langId);
        if (selected) {
            setCode(selected.defaultCode);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput([{ type: 'log', content: `Running code via compiler engine...` }]);

        const pistonLangMap = {
            javascript: { lang: 'javascript', ext: 'js', version: '18.15.0' },
            python: { lang: 'python3', ext: 'py', version: '3.10.0' },
            cpp: { lang: 'cpp', ext: 'cpp', version: '10.2.0' },
            java: { lang: 'java', ext: 'java', version: '15.0.2' },
            c: { lang: 'c', ext: 'c', version: '10.2.0' }
        };

        const target = pistonLangMap[language] || { lang: language, ext: 'txt', version: '*' };

        try {
            const res = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: target.lang,
                    version: target.version,
                    files: [{
                        name: `main.${target.ext}`,
                        content: code
                    }],
                    stdin: customInputEnabled ? stdin : ''
                })
            });

            if (!res.ok) throw new Error(`Compiler API error: ${res.statusText}`);
            const data = await res.json();

            const logs = [];
            if (data.run) {
                if (data.run.stdout) {
                    logs.push(...data.run.stdout.split('\n').filter(l => l !== '').map(l => ({ type: 'log', content: l })));
                }
                if (data.run.stderr) {
                    logs.push(...data.run.stderr.split('\n').filter(l => l !== '').map(l => ({ type: 'error', content: l })));
                }
                if (data.run.output && !data.run.stdout && !data.run.stderr) {
                    logs.push({ type: 'log', content: data.run.output });
                }
                if (logs.length === 0) {
                    logs.push({ type: 'log', content: '[No Output]' });
                }
                setOutput(logs);
                if (data.run.code === 0) {
                    toast.success('Execution Successful');
                } else {
                    toast.error(`Execution failed with code ${data.run.code}`);
                }
            } else {
                throw new Error('Invalid response structure from compile engine');
            }
        } catch (err) {
            // Local JS Fallback if Javascript is selected
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
                    toast.success('Executed locally (fallback)');
                } catch (localErr) {
                    setOutput([{ type: 'error', content: `[Fallback Error] ${localErr.message}` }]);
                    toast.error('Runtime Error');
                }
            } else {
                setOutput([{ type: 'error', content: `Compilation failed: ${err.message}` }]);
                toast.error('Compiler Engine Offline');
            }
        } finally {
            setIsRunning(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        toast.success('Copied to clipboard');
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        const ext = language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'c' ? 'c' : 'js';
        element.download = `solution.${ext}`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="space-y-12 text-[#fafafa] pt-6">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/35">Development Lab</div>
                    <h1 className="text-[5rem] leading-[0.95] tracking-tighter uppercase text-white font-light">
                        Code <span className="text-white/35 font-normal">Shell</span>
                    </h1>
                    <p className="text-sm font-semibold text-white/30 uppercase tracking-[0.2em] leading-none">Universal Compiler & Snippet Library</p>
                </div>
                <div className="flex gap-1 border border-white/5 p-1 bg-[#121215] rounded-2xl shadow-sm">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${activeTab === 'editor' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('snippets')}
                        className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${activeTab === 'snippets' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
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
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]"
                    >
                        {/* Toolbar Side */}
                        <div className="lg:col-span-1 border border-white/5 bg-[#121215] rounded-3xl flex flex-col items-center py-8 gap-6 shadow-sm">
                            {languages.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => handleLanguageChange(lang.id)}
                                    className={`w-10 h-10 border rounded-xl flex items-center justify-center font-bold text-[10px] transition-all hover:scale-110 ${language === lang.id ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/5 opacity-60'}`}
                                    title={lang.name}
                                >
                                    {lang.icon}
                                </button>
                            ))}
                            <div className="h-4 border-b border-white/5 w-full" />
                            <ToolButton icon={Copy} onClick={copyToClipboard} label="Copy" />
                            <ToolButton icon={Download} onClick={handleDownload} label="Save" />
                            <ToolButton icon={RotateCcw} onClick={() => setCode('')} label="Clear" />
                            <div className="flex-1" />
                            <button
                                onClick={runCode}
                                className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all ${isRunning ? 'bg-white/10 border-white/10' : 'bg-white text-black border-white hover:bg-white/85 hover:scale-110 shadow-lg shadow-white/5'}`}
                            >
                                <Play size={24} fill="currentColor" />
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            <div className="border border-white/5 bg-[#121215] rounded-3xl flex flex-col overflow-hidden shadow-sm flex-1">
                                <div className="bg-white/5 text-white/40 px-6 py-4 flex justify-between items-center border-b border-white/5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'c' ? 'c' : 'js'} - Execution Buffer</span>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-white/35" />
                                        <div className="w-2 h-2 rounded-full bg-white/20" />
                                        <div className="w-2 h-2 rounded-full bg-white/10" />
                                    </div>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="flex-1 p-8 font-mono text-lg bg-transparent border-none focus:outline-none resize-none selection:bg-white selection:text-black text-white min-h-[400px]"
                                    spellCheck="false"
                                />
                            </div>

                            {/* Stdin Panel */}
                            <div className="border border-white/5 bg-[#121215] rounded-3xl p-6 space-y-4">
                                <button
                                    onClick={() => setCustomInputEnabled(!customInputEnabled)}
                                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                                >
                                    {customInputEnabled ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    Custom Input (Stdin)
                                </button>
                                {customInputEnabled && (
                                    <textarea
                                        value={stdin}
                                        onChange={(e) => setStdin(e.target.value)}
                                        placeholder="Provide inputs for standard in here..."
                                        className="w-full h-24 p-4 bg-[#09090b] border border-white/5 rounded-2xl font-mono text-sm text-white focus:outline-none focus:border-white/20 transition-all resize-none"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Console Output */}
                        <div className="lg:col-span-4 border border-white/10 bg-[#09090b] text-[#f5f5f7] rounded-3xl flex flex-col shadow-2xl overflow-hidden shadow-black/10">
                            <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
                                <TerminalIcon size={18} className="text-white/30" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Standard Out</span>
                            </div>
                            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2">
                                {output.map((line, i) => (
                                    <div key={i} className={`flex gap-3 ${line.type === 'error' ? 'text-red-400' : line.type === 'warn' ? 'text-yellow-400/70' : 'text-white/60'}`}>
                                        <span className="opacity-20">{i + 1}</span>
                                        <span className="opacity-40">{line.type === 'log' ? '>>' : '!!'}</span>
                                        <span className="flex-1">{line.content}</span>
                                    </div>
                                ))}
                                {output.length === 0 && <span className="opacity-20 italic uppercase tracking-widest text-[10px]">Waiting for execution...</span>}
                            </div>
                            <div className="bg-black p-4 border-t border-white/10 flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
                                <span>Memory: Live</span>
                                <span>Runner: Piston Engine</span>
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
                            <div className="relative flex-1 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white transition-colors" size={24} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search library..."
                                    className="w-full pl-16 pr-6 py-6 border border-white/5 rounded-[32px] bg-[#121215] font-light text-2xl tracking-tighter text-white placeholder:text-white/15 outline-none focus:border-white/30 transition-all shadow-sm"
                                />
                            </div>
                            <button className="bg-white text-black px-12 py-7 rounded-[32px] font-bold uppercase tracking-widest text-sm hover:bg-white/85 transition-all flex items-center gap-4 shadow-lg shadow-white/5">
                                <FileCode size={24} /> New Snippet
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                            {snippets.map((snippet) => (
                                <div key={snippet.id} className="bg-[#121215] border border-white/5 rounded-[2.5rem] flex flex-col group overflow-hidden shadow-sm hover:border-white/15 transition-all">
                                    <div className="p-10 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-white/5 text-white/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/5">
                                                {snippet.category}
                                            </span>
                                            <button onClick={() => deleteSnippet(snippet.id)} className="text-white/20 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="text-3xl font-light uppercase tracking-tight mb-4 text-white group-hover:text-white transition-colors leading-none">
                                            {snippet.title}
                                        </h3>
                                        <pre className="bg-[#09090b] p-5 rounded-2xl font-mono text-[10px] text-white/40 overflow-hidden truncate">
                                            {snippet.code}
                                        </pre>
                                    </div>
                                    <button
                                        onClick={() => { setCode(snippet.code); setActiveTab('editor'); toast.success(`Loaded ${snippet.title}`); }}
                                        className="w-full bg-white/5 text-white/40 py-6 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all duration-500 border-t border-white/5"
                                    >
                                        Load into Machine
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
        <div className="w-12 h-12 border border-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all bg-white/5">
            <Icon size={18} strokeWidth={1.5} />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-opacity">{label}</span>
    </button>
);
