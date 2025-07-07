import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, ChevronDown, Plus, Target } from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import type { Task } from '../../types';

const TaskSelector: React.FC = () => {
    const { tasks, currentTask, setCurrentTask } = usePomodoroStore();
    const [isOpen, setIsOpen] = useState(false);

    const incompleteTasks = tasks.filter(task => !task.completed);

    const handleTaskSelect = (task: Task | undefined) => {
        setCurrentTask(task);
        setIsOpen(false);
    };

    return (
        <div className="relative max-w-md mx-auto w-full">
            {/* Current Task Display */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white hover:bg-white/15 transition-colors"
            >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {currentTask ? (
                        <>
                            <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                            <div className="text-left min-w-0 flex-1">
                                <div className="font-medium text-sm sm:text-base truncate">{currentTask.title}</div>
                                <div className="text-xs sm:text-sm text-white/60">
                                    {currentTask.pomodoroCount}/{currentTask.estimatedPomodoros} pomodoros
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                            <span className="text-white/70 text-sm sm:text-base">Select a task to focus on</span>
                        </>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
                </motion.div>
            </motion.button>

            {/* Task Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden z-50"
                    >
                        {/* No Task Option */}
                        <motion.button
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            onClick={() => handleTaskSelect(undefined)}
                            className="w-full flex items-center gap-3 p-3 text-left text-white hover:bg-white/10 transition-colors"
                        >
                            <Target className="h-4 w-4 text-gray-400" />
                            <span className="text-white/70">No specific task</span>
                        </motion.button>

                        {/* Divider */}
                        <div className="border-t border-white/10" />

                        {/* Task List */}
                        <div className="max-h-64 overflow-y-auto">
                            {incompleteTasks.length === 0 ? (
                                <div className="p-4 text-center text-white/50">
                                    <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No tasks available</p>
                                    <p className="text-xs">Create tasks to get started</p>
                                </div>
                            ) : (
                                incompleteTasks.map((task) => (
                                    <motion.button
                                        key={task.id}
                                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                        onClick={() => handleTaskSelect(task)}
                                        className={`w-full flex items-start gap-3 p-3 text-left transition-colors ${currentTask?.id === task.id
                                            ? 'bg-white/15 border-l-2 border-orange-400'
                                            : 'hover:bg-white/10'
                                            }`}
                                    >
                                        <CheckSquare className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-white truncate">{task.title}</div>
                                            <div className="text-sm text-white/60 line-clamp-1">{task.description}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`px-2 py-0.5 rounded text-xs font-medium ${task.priority === 'high' ? 'bg-red-400/20 text-red-400' :
                                                    task.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                                                        'bg-green-400/20 text-green-400'
                                                    }`}>
                                                    {task.priority}
                                                </div>
                                                <span className="text-xs text-white/50">
                                                    {task.pomodoroCount}/{task.estimatedPomodoros}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskSelector;
