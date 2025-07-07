import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Music,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Volume2,
    Shuffle,
    Repeat,
    TreePine,
    Waves,
    Wind
} from 'lucide-react';
import { AudioService } from '../../services/audioService';
import { usePomodoroStore } from '../../stores/pomodoroStore';

const MusicPage: React.FC = () => {
    const { settings } = usePomodoroStore();
    const [audioService] = useState(() => AudioService.getInstance());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<'nature' | 'ambient' | 'classical' | 'focus'>('nature');
    const [volume, setVolume] = useState(settings.volume);

    const musicCategories = [
        {
            id: 'nature' as const,
            name: 'Nature Sounds',
            icon: TreePine,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            tracks: [
                { name: 'Forest Rain', duration: '∞', description: 'Gentle rain in a peaceful forest' },
                { name: 'Ocean Waves', duration: '∞', description: 'Relaxing sound of ocean waves' },
                { name: 'Birds Chirping', duration: '∞', description: 'Morning birds in nature' },
                { name: 'Crackling Fire', duration: '∞', description: 'Warm fireplace sounds' },
            ]
        },
        {
            id: 'ambient' as const,
            name: 'Ambient',
            icon: Waves,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            tracks: [
                { name: 'Space Ambient', duration: '∞', description: 'Ethereal space sounds' },
                { name: 'Meditation Bells', duration: '∞', description: 'Calming meditation tones' },
                { name: 'White Noise', duration: '∞', description: 'Pure white noise for focus' },
                { name: 'Brown Noise', duration: '∞', description: 'Deep, soothing brown noise' },
            ]
        },
        {
            id: 'classical' as const,
            name: 'Classical',
            icon: Music,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            tracks: [
                { name: 'Piano Instrumentals', duration: '∞', description: 'Peaceful piano melodies' },
                { name: 'String Quartet', duration: '∞', description: 'Classical string arrangements' },
                { name: 'Baroque Study', duration: '∞', description: 'Bach and baroque classics' },
                { name: 'Ambient Classical', duration: '∞', description: 'Modern classical ambient' },
            ]
        },
        {
            id: 'focus' as const,
            name: 'Focus Beats',
            icon: Wind,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            tracks: [
                { name: 'Binaural Beats', duration: '∞', description: 'Focus-enhancing frequencies' },
                { name: 'Lo-Fi Study', duration: '∞', description: 'Chill lo-fi beats for studying' },
                { name: 'Productivity Flow', duration: '∞', description: 'Rhythmic productivity sounds' },
                { name: 'Deep Focus', duration: '∞', description: 'Minimal beats for concentration' },
            ]
        },
    ];

    const currentCategoryData = musicCategories.find(cat => cat.id === currentCategory)!;

    const handlePlay = () => {
        if (isPlaying) {
            audioService.pauseMusic();
            setIsPlaying(false);
        } else {
            audioService.playMusic(currentCategory);
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        audioService.setMusicVolume(newVolume / 100);
    };

    const handleCategoryChange = (category: typeof currentCategory) => {
        setCurrentCategory(category);
        if (isPlaying) {
            audioService.playMusic(category);
        }
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
                    <h1 className="text-4xl font-bold text-white mb-2">Focus Music</h1>
                    <p className="text-white/70">Enhance your focus with carefully curated soundscapes</p>
                </motion.div>

                {/* Music Player */}
                <motion.div
                    className="glass rounded-2xl p-8 mb-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="text-center mb-8">
                        {/* Category Icon */}
                        <motion.div
                            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${currentCategoryData.bgColor} mb-4`}
                            animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <currentCategoryData.icon className="h-10 w-10 text-white" />
                        </motion.div>

                        {/* Now Playing */}
                        <h2 className="text-2xl font-bold text-white mb-2">{currentCategoryData.name}</h2>
                        <p className="text-white/60 mb-6">
                            {isPlaying ? 'Now Playing' : 'Ready to play'} • {currentCategoryData.tracks[0].name}
                        </p>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6 mb-8">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 text-white/60 hover:text-white transition-colors"
                            >
                                <SkipBack className="h-6 w-6" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePlay}
                                className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentCategoryData.color} text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
                            >
                                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 text-white/60 hover:text-white transition-colors"
                            >
                                <SkipForward className="h-6 w-6" />
                            </motion.button>
                        </div>

                        {/* Additional Controls */}
                        <div className="flex items-center justify-center gap-8">
                            <button className="p-2 text-white/60 hover:text-white transition-colors">
                                <Shuffle className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <Volume2 className="h-5 w-5 text-white/60" />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                    className="w-24 accent-orange-500"
                                />
                                <span className="text-white/60 text-sm w-8">{volume}%</span>
                            </div>

                            <button className="p-2 text-white/60 hover:text-white transition-colors">
                                <Repeat className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Category Selection */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {musicCategories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`p-6 rounded-xl text-left transition-all duration-200 ${currentCategory === category.id
                                        ? `bg-gradient-to-br ${category.color} text-white shadow-lg`
                                        : 'glass hover:bg-white/15'
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <category.icon className={`h-8 w-8 mb-3 ${currentCategory === category.id ? 'text-white' : 'text-white/70'
                                    }`} />
                                <h4 className={`font-semibold mb-1 ${currentCategory === category.id ? 'text-white' : 'text-white'
                                    }`}>
                                    {category.name}
                                </h4>
                                <p className={`text-sm ${currentCategory === category.id ? 'text-white/80' : 'text-white/60'
                                    }`}>
                                    {category.tracks.length} tracks
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Track List */}
                <motion.div
                    className="glass rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <currentCategoryData.icon className="h-5 w-5" />
                        {currentCategoryData.name} Tracks
                    </h3>

                    <div className="space-y-3">
                        {currentCategoryData.tracks.map((track, index) => (
                            <motion.div
                                key={track.name}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                                    <Music className="h-6 w-6 text-white/70" />
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-white font-medium">{track.name}</h4>
                                    <p className="text-white/60 text-sm">{track.description}</p>
                                </div>

                                <div className="text-white/50 text-sm">
                                    {track.duration}
                                </div>

                                <button className="p-2 text-white/60 hover:text-white transition-colors">
                                    <Play className="h-5 w-5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tips */}
                <motion.div
                    className="mt-8 glass rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="text-xl font-bold text-white mb-4">Focus Music Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h4 className="text-white font-medium mb-2">🎵 Nature Sounds</h4>
                            <p className="text-white/60 text-sm">Best for reading, writing, and deep thinking. The natural rhythms help maintain calm focus.</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h4 className="text-white font-medium mb-2">🌊 Ambient</h4>
                            <p className="text-white/60 text-sm">Perfect for creative work and brainstorming. Creates an immersive atmosphere without distraction.</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h4 className="text-white font-medium mb-2">🎼 Classical</h4>
                            <p className="text-white/60 text-sm">Ideal for studying and analytical tasks. Classical music can enhance cognitive performance.</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h4 className="text-white font-medium mb-2">🔥 Focus Beats</h4>
                            <p className="text-white/60 text-sm">Great for repetitive tasks and coding. The rhythmic patterns help maintain steady concentration.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MusicPage;
