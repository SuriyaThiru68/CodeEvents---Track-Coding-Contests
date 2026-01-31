
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
            toast.error('Note needs a title and content');
            return;
        }

        try {
            if (editingId) {
                const response = await updateNote(editingId, newNote);
                if (response.ok) {
                    const updated = await response.json();
                    updateNoteInStore(editingId, {
                        ...updated,
                        id: updated._id,
                        date: updated.createdAt ? updated.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
                    });
                    setNewNote({ title: '', content: '', platform: 'General' });
                    setEditingId(null);
                    setIsAdding(false);
                    toast.success('Note synchronized successfully.');
                }
            } else {
                const response = await saveNote(newNote);
                if (response.ok) {
                    const savedNote = await response.json();
                    addNote({
                        ...savedNote,
                        id: savedNote._id,
                        date: savedNote.createdAt.split('T')[0],
                    });
                    setNewNote({ title: '', content: '', platform: 'General' });
                    setIsAdding(false);
                    toast.success('Note stored in archives.');
                }
            }
        } catch (error) {
            toast.error('Synchronization failed.');
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
            toast.success("Note removed from archives.");
        } catch (error) {
            toast.error("Deletion failed.");
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-16 pt-12 text-gray-900">
            <header className="space-y-6">
                <div className="editorial-subtitle">Personal Knowledge Repository</div>
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <h1 className="editorial-title uppercase">Archives <br /><span className="italic opacity-30">Knowledge.</span></h1>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search archives..."
                                className="input-minimal pl-10 !py-2.5 !text-xs"
                            />
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="btn-black !py-2.5 !text-[10px] !tracking-[0.2em]"
                        >
                            <Plus size={16} /> Create New
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card-minimal p-12 space-y-10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="editorial-subtitle !text-[10px] !text-black">Event Title</label>
                                <input
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                    className="input-minimal"
                                    placeholder="e.g. Codeforces Round 950"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="editorial-subtitle !text-[10px] !text-black">Category</label>
                                <select
                                    value={newNote.platform}
                                    onChange={(e) => setNewNote({ ...newNote, platform: e.target.value })}
                                    className="input-minimal appearance-none cursor-pointer"
                                >
                                    <option>General</option>
                                    <option>Codeforces</option>
                                    <option>LeetCode</option>
                                    <option>AtCoder</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="editorial-subtitle !text-[10px] !text-black">Analysis & Observations</label>
                            <textarea
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                className="input-minimal h-48 resize-none"
                                placeholder="Problem insights, complexity analysis, key takeaways..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleAdd} className="btn-black">
                                {editingId ? 'Update Record' : 'Commit to Archive'}
                            </button>
                            <button
                                onClick={() => { setIsAdding(false); setEditingId(null); setNewNote({ title: '', content: '', platform: 'General' }); }}
                                className="editorial-subtitle !text-[10px] p-4 text-black hover:opacity-50 transition-opacity"
                            >
                                Terminate
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-24">
                {filteredNotes.length > 0 ? filteredNotes.map((note, idx) => (
                    <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="card-minimal p-10 group relative"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    <FileText size={16} strokeWidth={1.5} />
                                </span>
                                <div>
                                    <div className="editorial-subtitle !text-[9px] mb-0.5">{note.platform}</div>
                                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{note.date}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(note)}
                                    className="p-2 text-gray-300 hover:text-black transition-colors"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-2xl font-serif mb-6 leading-tight group-hover:opacity-70 transition-opacity">{note.title}</h3>

                        <div className={`overflow-hidden relative transition-all duration-700 ${expandedNote === note.id ? 'max-h-[1000px]' : 'max-h-24'}`}>
                            <p className="text-gray-500 text-sm leading-relaxed font-light whitespace-pre-wrap">{note.content}</p>
                            {expandedNote !== note.id && <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />}
                        </div>

                        <button
                            onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                            className="mt-6 flex items-center gap-2 editorial-subtitle !text-[9px] !text-black group-hover:opacity-60 transition-opacity"
                        >
                            {expandedNote === note.id ? <><ChevronUp size={12} /> Collapse</> : <><ChevronDown size={12} /> Expand Insights</>}
                        </button>
                    </motion.div>
                )) : !isAdding && (
                    <div className="lg:col-span-2 border border-dashed border-gray-100 rounded-3xl p-32 text-center group">
                        <div className="editorial-title italic opacity-10 mb-6">Silent_</div>
                        <p className="editorial-subtitle !text-[10px]">Your knowledge repository is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
