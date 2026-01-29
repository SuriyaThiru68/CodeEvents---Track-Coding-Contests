
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Edit3, ChevronDown, ChevronUp, FileText, Tag, MoreHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

export default function Notes() {
    const { notes, addNote, deleteNote } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', platform: 'General' });
    const [expandedNote, setExpandedNote] = useState(null);

    const handleAdd = () => {
        if (!newNote.title || !newNote.content) {
            toast.error('Note needs a title and content');
            return;
        }
        addNote({
            ...newNote,
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
        });
        setNewNote({ title: '', content: '', platform: 'General' });
        setIsAdding(false);
        toast.success('Note added to library');
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b-8 border-[#000] pb-8">
                <div>
                    <h1 className="text-7xl font-black uppercase tracking-tighter italic mb-4">Archives_</h1>
                    <p className="text-xl font-bold opacity-50 uppercase tracking-widest leading-none">Your contest knowledge base</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search notes..."
                            className="pl-12 pr-4 py-4 border-4 border-[#000] font-bold uppercase tracking-widest text-xs focus:bg-[#000] focus:text-[#fff] transition-colors outline-none min-w-[300px]"
                        />
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#000] text-[#fff] px-8 py-4 font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#333] transition-all shadow-[10px_10px_0px_0px_#facc15]"
                    >
                        <Plus size={20} /> New Note
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Add Note Section */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-8 border-[#000] bg-yellow-50 overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest">Contest Title</label>
                                        <input
                                            value={newNote.title}
                                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                            className="w-full p-4 border-4 border-[#000] font-bold uppercase tracking-widest text-xs focus:bg-[#000] focus:text-[#fff] transition-colors outline-none"
                                            placeholder="Codeforces Round 900 Analysis"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest">Platform</label>
                                        <select
                                            value={newNote.platform}
                                            onChange={(e) => setNewNote({ ...newNote, platform: e.target.value })}
                                            className="w-full p-4 border-4 border-[#000] font-bold uppercase tracking-widest text-xs outline-none cursor-pointer"
                                        >
                                            <option>General</option>
                                            <option>Codeforces</option>
                                            <option>LeetCode</option>
                                            <option>AtCoder</option>
                                            <option>Google</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest">Your Findings</label>
                                    <textarea
                                        value={newNote.content}
                                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                        className="w-full h-40 p-6 border-4 border-[#000] font-medium text-lg focus:bg-[#000] focus:text-[#fff] transition-colors outline-none resize-none"
                                        placeholder="What did you learn? Key patterns, problem observations..."
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleAdd} className="bg-[#000] text-[#fff] px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#333]">Save to Archives</button>
                                    <button onClick={() => setIsAdding(false)} className="border-4 border-[#000] px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-red-500 hover:text-[#fff] transition-colors">Cancel</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredNotes.length > 0 ? filteredNotes.map((note) => (
                        <motion.div
                            key={note.id}
                            layout
                            className="border-4 border-[#000] bg-[#fff] p-8 shadow-[10px_10px_0px_0px_#000] group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#000] text-[#fff] px-3 py-1 text-[10px] font-black uppercase tracking-widest">{note.platform}</span>
                                    <span className="text-[10px] font-black uppercase opacity-40 italic">{note.date}</span>
                                </div>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="opacity-20 hover:opacity-100 hover:text-red-500 transition-opacity"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{note.title}</h3>

                            <div className={`mt-4 overflow-hidden relative ${expandedNote === note.id ? 'h-auto pb-12' : 'h-24'}`}>
                                <p className="text-lg font-medium opacity-70 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                {expandedNote !== note.id && <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />}
                            </div>

                            <button
                                onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                                className="mt-6 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:underline decoration-2"
                            >
                                {expandedNote === note.id ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Read Full Analysis</>}
                            </button>

                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                <FileText size={80} />
                            </div>
                        </motion.div>
                    )) : !isAdding && (
                        <div className="lg:col-span-2 border-8 border-[#000] border-dashed p-40 text-center">
                            <FileText size={48} className="mx-auto mb-6 opacity-20" />
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic opacity-20">Your archives are empty_</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


const submit = async () => {
    await saveNote({ title, content });
};
