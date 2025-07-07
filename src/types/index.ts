export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    pomodoroCount: number;
    estimatedPomodoros: number;
    createdAt: Date;
    completedAt?: Date;
}

export interface PomodoroSession {
    id: string;
    type: 'focus' | 'shortBreak' | 'longBreak';
    duration: number;
    startTime: Date;
    endTime?: Date;
    taskId?: string;
    completed: boolean;
}

export interface Stats {
    totalPomodoros: number;
    todayPomodoros: number;
    weekPomodoros: number;
    monthPomodoros: number;
    totalFocusTime: number;
    averageSessionTime: number;
    completedTasks: number;
    currentStreak: number;
    longestStreak: number;
}

export interface Settings {
    focusDuration: number; // in minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    tickSoundEnabled: boolean;
    volume: number;
    selectedTheme: 'home' | 'focus' | 'ambient';
    preventSleep: boolean;
    clearMode: boolean;
    backgroundImages: boolean;
    customWallpaperEnabled: boolean;
    animatedWallpaperEnabled: boolean;
    selectedCustomWallpaper?: string;
    imageQuality: '1080p' | '4k';
    cacheImages: boolean;
    autoRefreshImages: boolean;
    dockVisible: boolean;
    dockPosition: 'bottom' | 'top' | 'left' | 'right';
}

export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
    backgroundImage?: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
}

export interface Quote {
    text: string;
    author: string;
    category: string;
}

export interface MusicTrack {
    id: string;
    name: string;
    url: string;
    category: 'nature' | 'ambient' | 'classical' | 'focus';
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface AppState {
    currentMode: TimerMode;
    timeRemaining: number;
    isRunning: boolean;
    isPaused: boolean;
    sessionsCompleted: number;
    currentTask?: Task;
    settings: Settings;
    stats: Stats;
}

export interface BackgroundImage {
    id: string;
    url: string;
    thumbnailUrl: string;
    type: 'static' | 'animated';
    title: string;
    theme: 'home' | 'focus' | 'ambient';
    source: 'unsplash' | 'user' | 'default';
    isCustom: boolean;
    uploadedAt?: Date;
    tags?: string[];
}

export interface ImageCache {
    theme: 'home' | 'focus' | 'ambient';
    images: BackgroundImage[];
    lastFetched: Date;
    expiresAt: Date;
}

export interface CustomWallpaper {
    id: string;
    file: File;
    url: string;
    thumbnailUrl: string;
    type: 'static' | 'animated';
    name: string;
    uploadedAt: Date;
}
