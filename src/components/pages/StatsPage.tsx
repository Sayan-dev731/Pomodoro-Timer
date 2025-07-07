import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Target,
    Clock,
    Award,
    Flame,
    CheckSquare,
    Timer,
    Coffee
} from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { formatDuration, isToday } from '../../utils/helpers';

const StatsPage: React.FC = () => {
    const { stats, sessions, tasks, settings } = usePomodoroStore();

    // Calculate additional stats
    const todaySessions = sessions.filter(s => s.completed && isToday(s.startTime));

    const completedTasks = tasks.filter(t => t.completed);
    const todayCompletedTasks = completedTasks.filter(t => t.completedAt && isToday(t.completedAt));

    const totalFocusMinutes = sessions
        .filter(s => s.completed && s.type === 'focus')
        .reduce((total, session) => total + session.duration, 0);

    const averageSessionLength = sessions.length > 0
        ? totalFocusMinutes / sessions.filter(s => s.type === 'focus').length
        : 0;

    const productivity = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    const statCards = [
        {
            title: 'Total Pomodoros',
            value: stats.totalPomodoros,
            icon: Timer,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            change: `+${stats.todayPomodoros} today`,
        },
        {
            title: 'Total Focus Time',
            value: formatDuration(totalFocusMinutes),
            icon: Clock,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            change: `${formatDuration(todaySessions.reduce((t, s) => t + s.duration, 0))} today`,
        },
        {
            title: 'Tasks Completed',
            value: completedTasks.length,
            icon: CheckSquare,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            change: `+${todayCompletedTasks.length} today`,
        },
        {
            title: 'Current Streak',
            value: `${stats.currentStreak} days`,
            icon: Flame,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            change: `Best: ${stats.longestStreak} days`,
        },
        {
            title: 'Productivity Rate',
            value: `${productivity.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-500/10',
            change: `${completedTasks.length}/${tasks.length} tasks`,
        },
        {
            title: 'Avg Session',
            value: formatDuration(averageSessionLength),
            icon: Target,
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-500/10',
            change: `Goal: ${settings.focusDuration}m`,
        },
    ];

    // Generate weekly data for chart
    const getWeeklyData = () => {
        const weekDays = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const daySessions = sessions.filter(s =>
                s.completed &&
                s.type === 'focus' &&
                s.startTime.toDateString() === date.toDateString()
            );

            weekDays.push({
                day: date.toLocaleDateString('en', { weekday: 'short' }),
                pomodoros: daySessions.length,
                date: date.toLocaleDateString(),
            });
        }

        return weekDays;
    };

    const weeklyData = getWeeklyData();
    const maxPomodoros = Math.max(...weeklyData.map(d => d.pomodoros)) || 1;

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Statistics</h1>
                    <p className="text-white/70">Track your productivity and progress</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            className="glass rounded-2xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white text-xs font-medium`}>
                                    <TrendingUp className="h-3 w-3 inline mr-1" />
                                    +12%
                                </div>
                            </div>

                            <h3 className="text-white/70 text-sm font-medium mb-1">{stat.title}</h3>
                            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                            <p className="text-white/50 text-sm">{stat.change}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Weekly Progress Chart */}
                    <motion.div
                        className="glass rounded-2xl p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-400" />
                            Weekly Progress
                        </h3>

                        <div className="space-y-4">
                            {weeklyData.map((day, index) => (
                                <div key={day.day} className="flex items-center gap-4">
                                    <div className="w-12 text-white/70 text-sm font-medium">{day.day}</div>
                                    <div className="flex-1 relative">
                                        <div className="w-full bg-white/10 rounded-full h-3">
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                                                style={{ width: `${(day.pomodoros / maxPomodoros) * 100}%` }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(day.pomodoros / maxPomodoros) * 100}%` }}
                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-8 text-white text-sm font-medium text-right">
                                        {day.pomodoros}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Session Distribution */}
                    <motion.div
                        className="glass rounded-2xl p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Coffee className="h-5 w-5 text-green-400" />
                            Session Distribution
                        </h3>

                        <div className="space-y-6">
                            {/* Focus Sessions */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/70">Focus Sessions</span>
                                    <span className="text-white font-semibold">
                                        {sessions.filter(s => s.type === 'focus' && s.completed).length}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                                        style={{ width: '70%' }}
                                    />
                                </div>
                            </div>

                            {/* Short Breaks */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/70">Short Breaks</span>
                                    <span className="text-white font-semibold">
                                        {sessions.filter(s => s.type === 'shortBreak' && s.completed).length}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                        style={{ width: '25%' }}
                                    />
                                </div>
                            </div>

                            {/* Long Breaks */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/70">Long Breaks</span>
                                    <span className="text-white font-semibold">
                                        {sessions.filter(s => s.type === 'longBreak' && s.completed).length}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                        style={{ width: '5%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Achievement Badges */}
                <motion.div
                    className="glass rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-400" />
                        Achievements
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                title: 'First Steps',
                                description: 'Complete your first pomodoro',
                                achieved: stats.totalPomodoros >= 1,
                                icon: '🚀'
                            },
                            {
                                title: 'Consistent',
                                description: 'Complete 10 pomodoros',
                                achieved: stats.totalPomodoros >= 10,
                                icon: '⚡'
                            },
                            {
                                title: 'Productive',
                                description: 'Complete 50 pomodoros',
                                achieved: stats.totalPomodoros >= 50,
                                icon: '🎯'
                            },
                            {
                                title: 'Master',
                                description: 'Complete 100 pomodoros',
                                achieved: stats.totalPomodoros >= 100,
                                icon: '👑'
                            },
                        ].map((achievement, index) => (
                            <motion.div
                                key={achievement.title}
                                className={`p-4 rounded-lg text-center border ${achievement.achieved
                                    ? 'bg-yellow-500/10 border-yellow-500/30'
                                    : 'bg-white/5 border-white/10'
                                    }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <div className="text-3xl mb-2">{achievement.icon}</div>
                                <h4 className={`font-semibold mb-1 ${achievement.achieved ? 'text-yellow-400' : 'text-white/50'
                                    }`}>
                                    {achievement.title}
                                </h4>
                                <p className={`text-xs ${achievement.achieved ? 'text-white/70' : 'text-white/40'
                                    }`}>
                                    {achievement.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StatsPage;
