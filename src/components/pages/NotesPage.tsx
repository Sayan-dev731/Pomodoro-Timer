import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    FileText,
    Edit,
    Trash2,
    Search,
    Tag,
    Calendar,
    Save,
    X
} from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import type { Note } from '../../types';

const NotesPage: React.FC = () => {
    const { notes, addNote, updateNote, deleteNote } = usePomodoroStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [isCreating, setIsCreating] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        tags: [] as string[],
    });

    // Get all unique tags
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    // Filter notes
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const handleCreateNote = () => {
        if (newNote.title.trim() && newNote.content.trim()) {
            addNote(newNote);
            setNewNote({ title: '', content: '', tags: [] });
            setIsCreating(false);
        }
    };

    const handleUpdateNote = () => {
        if (editingNote && editingNote.title.trim() && editingNote.content.trim()) {
            updateNote(editingNote.id, {
                title: editingNote.title,
                content: editingNote.content,
                tags: editingNote.tags,
            });
            setEditingNote(null);
        }
    };

    const addTag = (noteId: string, tag: string) => {
        if (tag.trim()) {
            const note = notes.find(n => n.id === noteId);
            if (note && !note.tags.includes(tag.trim())) {
                updateNote(noteId, {
                    tags: [...note.tags, tag.trim()]
                });
            }
        }
    };

    const removeTag = (noteId: string, tagToRemove: string) => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            updateNote(noteId, {
                tags: note.tags.filter(tag => tag !== tagToRemove)
            });
        }
    };

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Notes</h1>
                            <p className="text-white/70">Capture your thoughts and ideas</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                        >
                            <Plus className="h-5 w-5" />
                            New Note
                        </motion.button>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    className="mb-6 flex flex-col lg:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                        />
                    </div>

                    {/* Tag Filter */}
                    <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-white/60" />
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                        >
                            <option value="all">All Tags</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Create Note Modal */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCreating(false)} />
                            <motion.div
                                className="relative w-full max-w-2xl glass rounded-2xl p-6"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-white">Create New Note</h3>
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="p-2 text-white/60 hover:text-white transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Note title"
                                        value={newNote.title}
                                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                                    />

                                    <textarea
                                        placeholder="Write your note here..."
                                        value={newNote.content}
                                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                        rows={10}
                                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm resize-none"
                                    />

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreateNote}
                                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note, index) => (
                        <motion.div
                            key={note.id}
                            className="glass rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setEditingNote(note)}
                        >
                            {/* Note Header */}
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white line-clamp-2">{note.title}</h3>
                                <div className="flex items-center gap-2 ml-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingNote(note);
                                        }}
                                        className="p-1 text-white/60 hover:text-white transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNote(note.id);
                                        }}
                                        className="p-1 text-white/60 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Note Content Preview */}
                            <p className="text-white/70 text-sm line-clamp-4 mb-4">
                                {note.content}
                            </p>

                            {/* Tags */}
                            {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {note.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Note Footer */}
                            <div className="flex items-center gap-2 text-white/50 text-xs">
                                <Calendar className="h-4 w-4" />
                                <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredNotes.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white/70 mb-2">No notes found</h3>
                        <p className="text-white/50 mb-6">
                            {searchTerm || selectedTag !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first note to get started'}
                        </p>
                        {!searchTerm && selectedTag === 'all' && (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                            >
                                <Plus className="h-5 w-5 inline mr-2" />
                                Create Your First Note
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Edit Note Modal */}
                <AnimatePresence>
                    {editingNote && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingNote(null)} />
                            <motion.div
                                className="relative w-full max-w-4xl glass rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-white">Edit Note</h3>
                                    <button
                                        onClick={() => setEditingNote(null)}
                                        className="p-2 text-white/60 hover:text-white transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Note title"
                                        value={editingNote.title}
                                        onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                                    />

                                    <textarea
                                        placeholder="Write your note here..."
                                        value={editingNote.content}
                                        onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                        rows={15}
                                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm resize-none"
                                    />

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-white/70 text-sm font-medium mb-2">Tags</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {editingNote.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium"
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() => removeTag(editingNote.id, tag)}
                                                        className="hover:text-red-400 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Add a tag and press Enter"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    addTag(editingNote.id, e.currentTarget.value);
                                                    e.currentTarget.value = '';
                                                }
                                            }}
                                            className="w-full px-3 py-2 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setEditingNote(null)}
                                            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateNote}
                                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotesPage;
