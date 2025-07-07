import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    CheckSquare,
    Edit,
    Trash2,
    Target,
    Calendar,
    Clock,
    Flag,
    Search,
    Filter
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { getPriorityColor } from '../../utils/helpers';
import type { Task } from '../../types';

const TasksPage: React.FC = () => {
    const {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        setCurrentTask,
        currentTask
    } = usePomodoroStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [showCompleted, setShowCompleted] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        estimatedPomodoros: 1,
    });

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        const matchesCompletion = showCompleted ? true : !task.completed;

        return matchesSearch && matchesPriority && matchesCompletion;
    });

    const handleAddTask = () => {
        if (newTask.title.trim()) {
            addTask({
                ...newTask,
                completed: false,
                pomodoroCount: 0,
            });
            setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                estimatedPomodoros: 1,
            });
            setIsAddingTask(false);
        }
    };

    const handleToggleComplete = (task: Task) => {
        updateTask(task.id, {
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined,
        });

        if (currentTask?.id === task.id && !task.completed) {
            setCurrentTask(undefined);
        }
    };

    const handleSetCurrentTask = (task: Task) => {
        if (!task.completed) {
            setCurrentTask(currentTask?.id === task.id ? undefined : task);
        }
    };

    const onDragEnd = (result: any) => {
        // Handle drag and drop reordering if needed
        console.log('Drag ended:', result);
    };

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Task Management</h1>
                    <p className="text-white/70">Organize your tasks and boost productivity</p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    className="mb-6 flex flex-col gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-white/60" />
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value as any)}
                                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm text-sm"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-2 text-white/70">
                                <input
                                    type="checkbox"
                                    checked={showCompleted}
                                    onChange={(e) => setShowCompleted(e.target.checked)}
                                    className="rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-sm">Show completed</span>
                            </label>
                        </div>
                    </div>

                    {/* Add Task Button */}
                    <div className="flex justify-center sm:justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAddingTask(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow w-full sm:w-auto justify-center"
                        >
                            <Plus className="h-5 w-5" />
                            Add Task
                        </motion.button>
                    </div>
                </motion.div>

                {/* Add Task Form */}
                <AnimatePresence>
                    {isAddingTask && (
                        <motion.div
                            className="mb-6 glass rounded-2xl p-4 sm:p-6"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Add New Task</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Task title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                                    />
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                        className="px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Task description (optional)"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm resize-none"
                                />
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-white/60" />
                                        <span className="text-white/70">Estimated Pomodoros:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={newTask.estimatedPomodoros}
                                            onChange={(e) => setNewTask({ ...newTask, estimatedPomodoros: parseInt(e.target.value) || 1 })}
                                            className="w-20 px-3 py-2 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => setIsAddingTask(false)}
                                            className="flex-1 sm:flex-none px-4 py-2 text-white/70 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddTask}
                                            className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tasks Grid */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tasks">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                            >
                                {filteredTasks.map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`glass rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200 ${currentTask?.id === task.id
                                                    ? 'ring-2 ring-orange-500 bg-orange-500/10'
                                                    : 'hover:bg-white/15'
                                                    } ${task.completed ? 'opacity-60' : ''} ${snapshot.isDragging ? 'scale-105 shadow-2xl' : ''
                                                    }`}
                                                onClick={() => handleSetCurrentTask(task)}
                                                style={{
                                                    transform: snapshot.isDragging ? 'scale(1.05)' : 'scale(1)',
                                                    transition: 'transform 0.2s ease',
                                                }}
                                            >
                                                {/* Task Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleComplete(task);
                                                            }}
                                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                                                                ? 'bg-green-500 border-green-500 text-white'
                                                                : 'border-white/30 hover:border-green-400'
                                                                }`}
                                                        >
                                                            {task.completed && <CheckSquare className="h-4 w-4" />}
                                                        </button>
                                                        <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                            <Flag className="h-3 w-3 inline mr-1" />
                                                            {task.priority}
                                                        </div>
                                                    </div>

                                                    {currentTask?.id === task.id && (
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full">
                                                            <Target className="h-3 w-3 text-orange-400" />
                                                            <span className="text-xs text-orange-400 font-medium">Active</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Task Content */}
                                                <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'line-through text-white/50' : 'text-white'
                                                    }`}>
                                                    {task.title}
                                                </h3>

                                                {task.description && (
                                                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}

                                                {/* Progress */}
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm text-white/70 mb-1">
                                                        <span>Progress</span>
                                                        <span>{task.pomodoroCount}/{task.estimatedPomodoros}</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${(task.pomodoroCount / task.estimatedPomodoros) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Task Footer */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-white/50 text-xs">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(task.createdAt).toLocaleDateString()}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Edit functionality can be added later
                                                            }}
                                                            className="p-1 text-white/60 hover:text-white transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteTask(task.id);
                                                            }}
                                                            className="p-1 text-white/60 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {/* Empty State */}
                {filteredTasks.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <CheckSquare className="h-16 w-16 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white/70 mb-2">No tasks found</h3>
                        <p className="text-white/50 mb-6">
                            {searchTerm || filterPriority !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first task to get started'}
                        </p>
                        {!searchTerm && filterPriority === 'all' && (
                            <button
                                onClick={() => setIsAddingTask(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                            >
                                <Plus className="h-5 w-5 inline mr-2" />
                                Add Your First Task
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TasksPage;
