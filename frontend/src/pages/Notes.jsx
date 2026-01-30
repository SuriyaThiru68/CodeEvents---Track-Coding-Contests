
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Edit3, ChevronDown, ChevronUp, FileText, Tag, MoreHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import { saveNote, fetchNotes, deleteNoteFromDb, updateNote } from '../services/api';
import { useEffect } from 'react';

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
                    toast.success('Note updated');
                } else {
                    const errorDate = await response.json();
                    toast.error(errorDate.msg || 'Failed to update note');
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
                    toast.success('Note added to library');
                } else {
                    const errorDate = await response.json();
                    toast.error(errorDate.msg || 'Failed to save note');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving note');
        }
    };

    const handleEdit = (note) => {
        setNewNote({ title: note.title, content: note.content, platform: note.platform });
        setEditingId(note.id);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteNoteFromDb(id);
            deleteNote(id);
            toast.success("Note deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete note");
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 max-w-7xl mx-auto px-6 py-12">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b border-gray-200 pb-8">
                <div>
                    <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-2 tracking-tight">Archives</h1>
                    <p className="text-sm md:text-base text-gray-500 font-light tracking-wide uppercase">Your personal knowledge base</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Type to search..."
                            className="w-full md:w-[320px] pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-sm transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-black text-white px-6 py-3 rounded-lg text-xs font-medium uppercase tracking-wider flex items-center gap-2 hover:bg-gray-800 transition-all hover-lift"
                    >
                        <Plus size={16} /> New Note
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
                            className="border border-gray-100 bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Contest Title</label>
                                        <input
                                            value={newNote.title}
                                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-sm transition-colors outline-none"
                                            placeholder="e.g. Codeforces Round 900 Analysis"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Platform</label>
                                        <div className="relative">
                                            <select
                                                value={newNote.platform}
                                                onChange={(e) => setNewNote({ ...newNote, platform: e.target.value })}
                                                className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                                            >
                                                <option>General</option>
                                                <option>Codeforces</option>
                                                <option>LeetCode</option>
                                                <option>AtCoder</option>
                                                <option>Google</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Your Findings</label>
                                    <textarea
                                        value={newNote.content}
                                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                        className="w-full h-40 p-6 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg text-base leading-relaxed transition-colors outline-none resize-none"
                                        placeholder="What did you learn? Key patterns, problem observations..."
                                    />
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button onClick={handleAdd} className="bg-black text-white px-8 py-3 rounded-lg text-xs font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors">
                                        {editingId ? 'Update Note' : 'Save Note'}
                                    </button>
                                    <button onClick={() => { setIsAdding(false); setEditingId(null); setNewNote({ title: '', content: '', platform: 'General' }); }} className="px-8 py-3 rounded-lg text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">Cancel</button>
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
                            className="bg-white rounded-xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider">{note.platform}</span>
                                    <span className="text-xs text-gray-400 font-medium">{note.date}</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(note)}
                                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-full transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-serif text-gray-900 mb-3 leading-tight">{note.title}</h3>

                            <div className={`mt-4 overflow-hidden relative ${expandedNote === note.id ? 'h-auto pb-4' : 'h-24'}`}>
                                <p className="text-gray-600 leading-relaxed font-light">{note.content}</p>
                                {expandedNote !== note.id && <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />}
                            </div>

                            <button
                                onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                                className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-gray-600 transition-colors"
                            >
                                {expandedNote === note.id ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> Read More</>}
                            </button>
                        </motion.div>
                    )) : !isAdding && (
                        <div className="lg:col-span-2 border border-dashed border-gray-300 rounded-xl p-32 text-center group hover:border-gray-400 transition-colors">
                            <FileText size={40} className="mx-auto mb-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                            <h3 className="text-xl font-serif text-gray-400 group-hover:text-gray-500 transition-colors">No notes found within archives.</h3>
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
