import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Timer,
    Volume2,
    Bell,
    Smartphone,
    Eye,
    Palette,
    Save,
    RotateCcw,
    Layout,
    Image as ImageIcon
} from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { BingImagesService } from '../../services/bingImages';
import BackgroundSettings from '../ui/BackgroundSettings';
import toast from 'react-hot-toast';

const defaultSettings = {
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
    selectedTheme: 'home' as const,
    preventSleep: false,
    clearMode: false,
    backgroundImages: true,
    customWallpaperEnabled: false,
    animatedWallpaperEnabled: false,
    selectedCustomWallpaper: undefined,
    imageQuality: '4k' as const,
    cacheImages: true,
    autoRefreshImages: true,
    dockVisible: true,
    dockPosition: 'bottom' as const,
};

const SettingsPage: React.FC = () => {
    const { settings, updateSettings, setBackgroundImages } = usePomodoroStore();
    const [tempSettings, setTempSettings] = useState(settings);
    const [isLoading, setIsLoading] = useState(false);
    const [showBackgroundSettings, setShowBackgroundSettings] = useState(false);

    const handleSave = () => {
        updateSettings(tempSettings);
        toast.success('Settings saved successfully!');
    };

    const handleReset = () => {
        setTempSettings(defaultSettings);
        toast.success('Settings reset to defaults');
    };

    const handleThemeChange = async (theme: 'home' | 'focus' | 'ambient') => {
        setTempSettings({ ...tempSettings, selectedTheme: theme });

        if (tempSettings.backgroundImages) {
            setIsLoading(true);
            try {
                const images = await BingImagesService.fetchBackgroundImages(theme, 10);
                setBackgroundImages(images);
            } catch (error) {
                console.error('Failed to load background images:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setTempSettings({ ...tempSettings, notificationsEnabled: true });
                toast.success('Notification permission granted!');
            } else {
                toast.error('Notification permission denied');
            }
        }
    };

    const settingSections = [
        {
            title: 'Timer Settings',
            icon: Timer,
            color: 'text-orange-400',
            settings: [
                {
                    label: 'Focus Duration',
                    description: 'Length of focus sessions in minutes',
                    type: 'range' as const,
                    key: 'focusDuration' as const,
                    min: 15,
                    max: 60,
                    step: 5,
                    unit: 'min'
                },
                {
                    label: 'Short Break Duration',
                    description: 'Length of short breaks in minutes',
                    type: 'range' as const,
                    key: 'shortBreakDuration' as const,
                    min: 1,
                    max: 15,
                    step: 1,
                    unit: 'min'
                },
                {
                    label: 'Long Break Duration',
                    description: 'Length of long breaks in minutes',
                    type: 'range' as const,
                    key: 'longBreakDuration' as const,
                    min: 10,
                    max: 45,
                    step: 5,
                    unit: 'min'
                },
                {
                    label: 'Long Break Interval',
                    description: 'Number of focus sessions before a long break',
                    type: 'range' as const,
                    key: 'longBreakInterval' as const,
                    min: 2,
                    max: 8,
                    step: 1,
                    unit: 'sessions'
                },
                {
                    label: 'Auto-start Breaks',
                    description: 'Automatically start break timers',
                    type: 'toggle' as const,
                    key: 'autoStartBreaks' as const
                },
                {
                    label: 'Auto-start Pomodoros',
                    description: 'Automatically start focus sessions after breaks',
                    type: 'toggle' as const,
                    key: 'autoStartPomodoros' as const
                }
            ]
        },
        {
            title: 'Audio Settings',
            icon: Volume2,
            color: 'text-green-400',
            settings: [
                {
                    label: 'Sound Effects',
                    description: 'Enable notification sounds',
                    type: 'toggle' as const,
                    key: 'soundEnabled' as const
                },
                {
                    label: 'Tick Sound',
                    description: 'Play tick sound every second',
                    type: 'toggle' as const,
                    key: 'tickSoundEnabled' as const
                },
                {
                    label: 'Volume',
                    description: 'Master volume level',
                    type: 'range' as const,
                    key: 'volume' as const,
                    min: 0,
                    max: 100,
                    step: 5,
                    unit: '%'
                }
            ]
        },
        {
            title: 'Notifications',
            icon: Bell,
            color: 'text-blue-400',
            settings: [
                {
                    label: 'Desktop Notifications',
                    description: 'Show notifications when sessions complete',
                    type: 'toggle' as const,
                    key: 'notificationsEnabled' as const,
                    action: requestNotificationPermission
                }
            ]
        },
        {
            title: 'Appearance',
            icon: Palette,
            color: 'text-purple-400',
            settings: [
                {
                    label: 'Theme',
                    description: 'Choose your visual theme',
                    type: 'theme' as const,
                    key: 'selectedTheme' as const
                },
                {
                    label: 'Background Images',
                    description: 'Enable dynamic background images',
                    type: 'toggle' as const,
                    key: 'backgroundImages' as const
                },
                {
                    label: 'Background Settings',
                    description: 'Manage background images and custom wallpapers',
                    type: 'button' as const,
                    key: 'backgroundSettings' as const,
                    action: () => setShowBackgroundSettings(true)
                },
                {
                    label: 'Clear Mode',
                    description: 'Minimal dark interface for better focus',
                    type: 'toggle' as const,
                    key: 'clearMode' as const
                },
                {
                    label: 'Image Quality',
                    description: 'Quality of background images (affects API usage)',
                    type: 'select' as const,
                    key: 'imageQuality' as const,
                    options: [
                        { value: '1080p', label: '1080p (Fast)' },
                        { value: '4k', label: '4K (High Quality)' }
                    ]
                },
                {
                    label: 'Cache Images',
                    description: 'Store images locally for 24 hours to reduce API calls',
                    type: 'toggle' as const,
                    key: 'cacheImages' as const
                },
                {
                    label: 'Auto Refresh Images',
                    description: 'Automatically refresh cached images daily',
                    type: 'toggle' as const,
                    key: 'autoRefreshImages' as const
                }
            ]
        },
        {
            title: 'Interface Settings',
            icon: Layout,
            color: 'text-indigo-400',
            settings: [
                {
                    label: 'Show Dock',
                    description: 'Display the navigation dock (hidden on mobile)',
                    type: 'toggle' as const,
                    key: 'dockVisible' as const
                },
                {
                    label: 'Dock Position',
                    description: 'Where to position the dock on screen',
                    type: 'select' as const,
                    key: 'dockPosition' as const,
                    options: [
                        { value: 'bottom', label: 'Bottom' },
                        // { value: 'top', label: 'Top' },
                        { value: 'left', label: 'Left' },
                        // { value: 'right', label: 'Right' }
                    ]
                }
            ]
        },
        {
            title: 'Device Settings',
            icon: Smartphone,
            color: 'text-cyan-400',
            settings: [
                {
                    label: 'Prevent Sleep',
                    description: 'Keep screen awake during focus sessions',
                    type: 'toggle' as const,
                    key: 'preventSleep' as const
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-white/70">Customize your Pomodoro experience</p>
                </motion.div>

                {/* Settings Sections */}
                <div className="space-y-8">
                    {settingSections.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            className="glass rounded-2xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIndex * 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <section.icon className={`h-6 w-6 ${section.color}`} />
                                {section.title}
                            </h3>

                            <div className="space-y-6">
                                {section.settings.map((setting, settingIndex) => (
                                    <motion.div
                                        key={setting.key}
                                        className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: sectionIndex * 0.1 + settingIndex * 0.05 }}
                                    >
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium mb-1">{setting.label}</h4>
                                            <p className="text-white/60 text-sm">{setting.description}</p>
                                        </div>

                                        <div className="ml-6">
                                            {setting.type === 'toggle' && (
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={tempSettings[setting.key] as boolean}
                                                        onChange={(e) => {
                                                            const newSettings = { ...tempSettings, [setting.key]: e.target.checked };
                                                            setTempSettings(newSettings);
                                                            if ('action' in setting && setting.action && e.target.checked) {
                                                                setting.action();
                                                            }
                                                        }}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                                </label>
                                            )}

                                            {setting.type === 'range' && (
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        min={setting.min}
                                                        max={setting.max}
                                                        step={setting.step}
                                                        value={tempSettings[setting.key] as number}
                                                        onChange={(e) => setTempSettings({
                                                            ...tempSettings,
                                                            [setting.key]: Number(e.target.value)
                                                        })}
                                                        className="w-32 accent-orange-500"
                                                    />
                                                    <span className="text-white font-medium min-w-[4rem]">
                                                        {tempSettings[setting.key]}{setting.unit}
                                                    </span>
                                                </div>
                                            )}

                                            {setting.type === 'select' && (
                                                <select
                                                    value={tempSettings[setting.key] as string}
                                                    onChange={(e) => setTempSettings({
                                                        ...tempSettings,
                                                        [setting.key]: e.target.value as any
                                                    })}
                                                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                                                >
                                                    {setting.options?.map((option) => (
                                                        <option key={option.value} value={option.value} className="bg-gray-800">
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}

                                            {setting.type === 'theme' && (
                                                <div className="flex gap-2">
                                                    {(['home', 'focus', 'ambient'] as const).map((theme) => (
                                                        <motion.button
                                                            key={theme}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleThemeChange(theme)}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tempSettings.selectedTheme === theme
                                                                ? theme === 'home'
                                                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                                                    : theme === 'focus'
                                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                                                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                                }`}
                                                            disabled={isLoading}
                                                        >
                                                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            )}

                                            {setting.type === 'button' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        if ('action' in setting && setting.action) {
                                                            setting.action();
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                                                >
                                                    <ImageIcon className="h-4 w-4" />
                                                    Open
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons */}
                <motion.div
                    className="flex items-center justify-between mt-8 glass rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                    >
                        <RotateCcw className="h-5 w-5" />
                        Reset to Defaults
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                        <Save className="h-5 w-5" />
                        Save Settings
                    </motion.button>
                </motion.div>

                {/* Info Panel */}
                <motion.div
                    className="mt-8 glass rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-gray-400" />
                        About These Settings
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 text-sm">
                        <div className="space-y-2">
                            <p><strong>Timer Settings:</strong> Follow the traditional Pomodoro Technique with customizable durations.</p>
                            <p><strong>Auto-start:</strong> Reduces manual intervention for better flow state maintenance.</p>
                            <p><strong>Themes:</strong> Each theme provides different background images and color schemes optimized for different types of work.</p>
                        </div>
                        <div className="space-y-2">
                            <p><strong>Clear Mode:</strong> Minimalist interface that reduces visual distractions during focus sessions.</p>
                            <p><strong>Prevent Sleep:</strong> Uses the Wake Lock API to keep your device awake during active sessions.</p>
                            <p><strong>Background Images:</strong> Automatically fetches beautiful 4K images that match your selected theme. Images are cached for 24 hours to reduce API usage.</p>
                            <p><strong>Custom Wallpapers:</strong> Upload your own static or animated wallpapers for a personalized experience.</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Settings Modal */}
            {showBackgroundSettings && (
                <BackgroundSettings onClose={() => setShowBackgroundSettings(false)} />
            )}
        </div>
    );
};

export default SettingsPage;
