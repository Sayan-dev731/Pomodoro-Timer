import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
}

export function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

export function getProgressPercentage(timeRemaining: number, totalDuration: number): number {
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
}

export function generateId(): string {
    return crypto.randomUUID();
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

export function isToday(date: Date | string | number | undefined | null): boolean {
    if (!date) return false;
    const today = new Date();
    const compareDate = new Date(date);

    // Check if the date is valid
    if (isNaN(compareDate.getTime())) return false;

    return compareDate.toDateString() === today.toDateString();
}

export function isThisWeek(date: Date | string | number | undefined | null): boolean {
    if (!date) return false;
    const today = new Date();
    const compareDate = new Date(date);

    // Check if the date is valid
    if (isNaN(compareDate.getTime())) return false;

    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    return compareDate >= weekStart;
}

export function isThisMonth(date: Date | string | number | undefined | null): boolean {
    if (!date) return false;
    const today = new Date();
    const compareDate = new Date(date);

    // Check if the date is valid
    if (isNaN(compareDate.getTime())) return false;

    return compareDate.getMonth() === today.getMonth() && compareDate.getFullYear() === today.getFullYear();
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
    switch (priority) {
        case 'high':
            return 'text-red-500 bg-red-50 border-red-200';
        case 'medium':
            return 'text-yellow-500 bg-yellow-50 border-yellow-200';
        case 'low':
            return 'text-green-500 bg-green-50 border-green-200';
    }
}

export function getThemeColors(theme: 'home' | 'focus' | 'ambient') {
    switch (theme) {
        case 'focus':
            return {
                primary: 'focus-500',
                secondary: 'focus-200',
                background: 'focus-50',
                accent: 'focus-600',
            };
        case 'ambient':
            return {
                primary: 'ambient-500',
                secondary: 'ambient-200',
                background: 'ambient-50',
                accent: 'ambient-600',
            };
        default:
            return {
                primary: 'primary-500',
                secondary: 'primary-200',
                background: 'primary-50',
                accent: 'primary-600',
            };
    }
}
