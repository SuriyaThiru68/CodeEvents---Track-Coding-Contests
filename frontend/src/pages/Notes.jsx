import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Edit3, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import { saveNote, fetchNotes, deleteNoteFromDb, updateNote } from '../services/api';

export default function Notes() {
    const { notes, addNote, deleteNote, setNotes, updateNoteInStore } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newNote, setNewNote] = useState({ title: '', content: '', platform: 'General' });
    const [expandedNote, setExpandedNote] = useState(null);

    useEffect(() => {
        fetchNotes().then(data => {
            if (Array.isArray(data)) {
                const mappedNotes = data.map(n => ({
                    ...n,
                    id: n._id,
                    date: n.createdAt ? n.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
                }));
                setNotes(mappedNotes);
            }
        });
    }, []);

    const handleAdd = async () => {
        if (!newNote.title || !newNote.content) {
            toast.error('Add a title and content');
            return;
        }
        try {
            if (editingId) {
                const response = await updateNote(editingId, newNote);
                if (response.ok) {
                    const updated = await response.json();
                    updateNoteInStore(editingId, {
                        ...updated, id: updated._id,
                        date: updated.createdAt ? updated.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
                    });
                    setNewNote({ title: '', content: '', platform: 'General' });
                    setEditingId(null);
                    setIsAdding(false);
                    toast.success('Note updated!');
                }
            } else {
                const response = await saveNote(newNote);
                if (response.ok) {
                    const savedNote = await response.json();
                    addNote({ ...savedNote, id: savedNote._id, date: savedNote.createdAt.split('T')[0] });
                    setNewNote({ title: '', content: '', platform: 'General' });
                    setIsAdding(false);
                    toast.success('Note saved!');
                }
            }
        } catch (error) {
            toast.error('Error saving note.');
        }
    };

    const handleEdit = (note) => {
        setNewNote({ title: note.title, content: note.content, platform: note.platform });
        setEditingId(note.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            await deleteNoteFromDb(id);
            deleteNote(id);
            toast.success("Note deleted.");
        } catch (error) {
            toast.error("Error deleting.");
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-16 pt-6 text-[#fafafa]">
            <header className="space-y-6">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35">Archive</div>
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <h1 className="text-7xl font-light text-white uppercase tracking-tighter leading-none">
                        Your <br /><span className="text-white/35 font-normal">Notes.</span>
                    </h1>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-3 bg-[#121215] border border-white/5 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest text-white outline-none focus:border-white/25"
                            />
                        </div>
                        <button onClick={() => setIsAdding(true)} className="px-6 py-3 bg-white hover:bg-white/85 text-black font-semibold rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg shadow-white/5">
                            <Plus size={16} /> New.
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#121215] border border-white/5 p-12 space-y-10 rounded-[3rem] shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Title</label>
                                <input value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} className="w-full px-8 py-5 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] focus:border-white/20 outline-none transition-all placeholder:text-white/20 text-white" placeholder="Tip: Binary Search" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Label</label>
                                <div className="relative">
                                    <select value={newNote.platform} onChange={(e) => setNewNote({ ...newNote, platform: e.target.value })} className="w-full px-8 py-5 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] appearance-none cursor-pointer outline-none hover:border-white/20 transition-all text-white">
                                        <option className="bg-[#09090b]">General</option>
                                        <option className="bg-[#09090b]">Codeforces</option>
                                        <option className="bg-[#09090b]">LeetCode</option>
                                        <option className="bg-[#09090b]">AtCoder</option>
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Content</label>
                            <textarea value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} className="w-full px-8 py-6 bg-[#09090b] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] focus:border-white/20 outline-none transition-all placeholder:text-white/20 text-white h-48 resize-none" placeholder="Details..." />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleAdd} className="px-8 py-4 bg-white hover:bg-white/85 text-black font-semibold rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg shadow-white/5">{editingId ? 'Update' : 'Save'}</button>
                            <button onClick={() => { setIsAdding(false); setEditingId(null); setNewNote({ title: '', content: '', platform: 'General' }); }} className="text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-4 text-white/30 hover:text-white/60 transition-colors">Discard</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-24">
                {filteredNotes.length > 0 ? filteredNotes.map((note, idx) => (
                    <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-[#121215] border border-white/5 p-10 group relative rounded-[2.5rem] shadow-sm hover:border-white/15 transition-all">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-white/5 text-white rounded-lg group-hover:bg-white group-hover:text-black transition-colors duration-500">
                                    <FileText size={16} strokeWidth={1.5} />
                                </span>
                                <div>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-white mb-0.5">{note.platform}</div>
                                    <div className="text-[10px] text-white/30 font-semibold uppercase tracking-widest">{note.date}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(note)} className="p-2 text-white/20 hover:text-white transition-colors"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(note.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h3 className="text-2xl font-light mb-6 leading-tight group-hover:text-white transition-colors text-white uppercase tracking-tight">{note.title}</h3>
                        <div className={`overflow-hidden relative transition-all duration-700 ${expandedNote === note.id ? 'max-h-[1000px]' : 'max-h-24'}`}>
                            <p className="text-white/50 text-sm leading-relaxed font-light whitespace-pre-wrap">{note.content}</p>
                            {expandedNote !== note.id && <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent" />}
                        </div>
                        <button onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)} className="mt-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white">
                            {expandedNote === note.id ? <><ChevronUp size={12} /> Hide</> : <><ChevronDown size={12} /> Show More</>}
                        </button>
                    </motion.div>
                )) : !isAdding && (
                    <div className="lg:col-span-2 border border-dashed border-white/10 rounded-[40px] p-32 text-center bg-[#121215] shadow-sm">
                        <div className="text-8xl font-light text-white/10 mb-6 font-bold">Empty Archive.</div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">No records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
