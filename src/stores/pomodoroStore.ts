import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Task, Settings, Stats, TimerMode, PomodoroSession, Note, BackgroundImage } from '../types';

interface PomodoroStore extends AppState {
    // Timer actions
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    switchMode: (mode: TimerMode) => void;
    tick: () => void;

    // Task actions
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    setCurrentTask: (task: Task | undefined) => void;

    // Settings actions
    updateSettings: (settings: Partial<Settings>) => void;

    // Notes actions
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;

    // Sessions
    sessions: PomodoroSession[];
    addSession: (session: Omit<PomodoroSession, 'id'>) => void;

    // Stats actions
    updateStats: () => void;

    // Background images - Updated for new system
    backgroundImages: BackgroundImage[];
    setBackgroundImages: (images: BackgroundImage[]) => void;
    currentBackgroundIndex: number;
    nextBackground: () => void;
    currentBackground?: BackgroundImage;
    setCurrentBackground: (image: BackgroundImage) => void;
}

const defaultSettings: Settings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    notificationsEnabled: true,
    soundEnabled: true,
    tickSoundEnabled: false,
    volume: 50,
    selectedTheme: 'home',
    preventSleep: false,
    clearMode: false,
    backgroundImages: true,
    customWallpaperEnabled: false,
    animatedWallpaperEnabled: false,
    selectedCustomWallpaper: undefined,
    imageQuality: '4k',
    cacheImages: true,
    autoRefreshImages: true,
    dockVisible: true,
    dockPosition: 'bottom',
};

const defaultStats: Stats = {
    totalPomodoros: 0,
    todayPomodoros: 0,
    weekPomodoros: 0,
    monthPomodoros: 0,
    totalFocusTime: 0,
    averageSessionTime: 0,
    completedTasks: 0,
    currentStreak: 0,
    longestStreak: 0,
};

export const usePomodoroStore = create<PomodoroStore>()(
    persist(
        (set, get) => ({
            // Initial state
            currentMode: 'focus',
            timeRemaining: 25 * 60, // 25 minutes in seconds
            isRunning: false,
            isPaused: false,
            sessionsCompleted: 0,
            currentTask: undefined,
            settings: defaultSettings,
            stats: defaultStats,
            tasks: [],
            notes: [],
            sessions: [],
            backgroundImages: [],
            currentBackgroundIndex: 0,
            currentBackground: undefined,

            // Timer actions
            startTimer: () => {
                set({ isRunning: true, isPaused: false });
            },

            pauseTimer: () => {
                set({ isPaused: true, isRunning: false });
            },

            resetTimer: () => {
                const { settings, currentMode } = get();
                const duration = currentMode === 'focus'
                    ? settings.focusDuration
                    : currentMode === 'shortBreak'
                        ? settings.shortBreakDuration
                        : settings.longBreakDuration;

                set({
                    isRunning: false,
                    isPaused: false,
                    timeRemaining: duration * 60
                });
            },

            switchMode: (mode: TimerMode) => {
                const { settings } = get();
                const duration = mode === 'focus'
                    ? settings.focusDuration
                    : mode === 'shortBreak'
                        ? settings.shortBreakDuration
                        : settings.longBreakDuration;

                set({
                    currentMode: mode,
                    timeRemaining: duration * 60,
                    isRunning: false,
                    isPaused: false
                });
            },

            tick: () => {
                const state = get();
                if (!state.isRunning || state.isPaused) return;

                if (state.timeRemaining <= 1) {
                    // Session completed
                    const session: Omit<PomodoroSession, 'id'> = {
                        type: state.currentMode,
                        duration: state.currentMode === 'focus'
                            ? state.settings.focusDuration
                            : state.currentMode === 'shortBreak'
                                ? state.settings.shortBreakDuration
                                : state.settings.longBreakDuration,
                        startTime: new Date(Date.now() - (state.settings.focusDuration * 60 * 1000 - state.timeRemaining * 1000)),
                        endTime: new Date(),
                        taskId: state.currentTask?.id,
                        completed: true,
                    };

                    get().addSession(session);

                    let nextMode: TimerMode;
                    let newSessionsCompleted = state.sessionsCompleted;

                    if (state.currentMode === 'focus') {
                        newSessionsCompleted += 1;
                        nextMode = (newSessionsCompleted % state.settings.longBreakInterval === 0)
                            ? 'longBreak'
                            : 'shortBreak';
                    } else {
                        nextMode = 'focus';
                    }

                    const nextDuration = nextMode === 'focus'
                        ? state.settings.focusDuration
                        : nextMode === 'shortBreak'
                            ? state.settings.shortBreakDuration
                            : state.settings.longBreakDuration;

                    set({
                        currentMode: nextMode,
                        timeRemaining: nextDuration * 60,
                        isRunning: state.settings.autoStartBreaks || (nextMode === 'focus' && state.settings.autoStartPomodoros),
                        sessionsCompleted: newSessionsCompleted,
                    });

                    get().updateStats();
                } else {
                    set({ timeRemaining: state.timeRemaining - 1 });
                }
            },

            // Task actions
            addTask: (task) => {
                const newTask: Task = {
                    ...task,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                };
                set((state) => ({ tasks: [...state.tasks, newTask] }));
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, ...updates } : task
                    ),
                }));
            },

            deleteTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                    currentTask: state.currentTask?.id === id ? undefined : state.currentTask,
                }));
            },

            setCurrentTask: (task) => {
                set({ currentTask: task });
            },

            // Settings actions
            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: { ...state.settings, ...newSettings }
                }));
            },

            // Notes actions
            addNote: (note) => {
                const newNote: Note = {
                    ...note,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                set((state) => ({ notes: [...state.notes, newNote] }));
            },

            updateNote: (id, updates) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
                    ),
                }));
            },

            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                }));
            },

            // Sessions
            addSession: (session) => {
                const newSession: PomodoroSession = {
                    ...session,
                    id: crypto.randomUUID(),
                };
                set((state) => ({ sessions: [...state.sessions, newSession] }));
            },

            // Stats actions
            updateStats: () => {
                const { sessions, tasks } = get();
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

                const completedSessions = sessions.filter(s => s.completed && s.type === 'focus');
                const todaySessions = completedSessions.filter(s => s.startTime >= today);
                const weekSessions = completedSessions.filter(s => s.startTime >= weekStart);
                const monthSessions = completedSessions.filter(s => s.startTime >= monthStart);

                const totalFocusTime = completedSessions.reduce((total, session) => total + session.duration * 60, 0);
                const averageSessionTime = completedSessions.length > 0 ? totalFocusTime / completedSessions.length : 0;

                set((state) => ({
                    stats: {
                        ...state.stats,
                        totalPomodoros: completedSessions.length,
                        todayPomodoros: todaySessions.length,
                        weekPomodoros: weekSessions.length,
                        monthPomodoros: monthSessions.length,
                        totalFocusTime,
                        averageSessionTime,
                        completedTasks: tasks.filter(t => t.completed).length,
                    }
                }));
            },

            // Background images
            setBackgroundImages: (images) => {
                set({ backgroundImages: images });
            },

            nextBackground: () => {
                const { backgroundImages, currentBackgroundIndex } = get();
                if (backgroundImages.length > 0) {
                    const newIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
                    set({
                        currentBackgroundIndex: newIndex,
                        currentBackground: backgroundImages[newIndex]
                    });
                }
            },

            setCurrentBackground: (image) => {
                set({ currentBackground: image });
            },
        }),
        {
            name: 'pomodoro-storage',
            partialize: (state) => ({
                settings: state.settings,
                tasks: state.tasks,
                notes: state.notes,
                sessions: state.sessions,
                stats: state.stats,
                backgroundImages: state.backgroundImages,
                currentBackgroundIndex: state.currentBackgroundIndex,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Convert date strings back to Date objects
                    if (state.tasks) {
                        state.tasks = state.tasks.map(task => ({
                            ...task,
                            createdAt: new Date(task.createdAt),
                            completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
                        }));
                    }
                    if (state.sessions) {
                        state.sessions = state.sessions.map(session => ({
                            ...session,
                            startTime: new Date(session.startTime),
                            endTime: session.endTime ? new Date(session.endTime) : undefined,
                        }));
                    }
                }
            },
        }
    )
);
