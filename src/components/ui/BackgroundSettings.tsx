import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Image as ImageIcon,
    Trash2,
    RefreshCw,
    Monitor,
    Check,
    X,
    Info
} from 'lucide-react';
import { BingImagesService } from '../../services/bingImages';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import type { BackgroundImage, CustomWallpaper } from '../../types';
import toast from 'react-hot-toast';

interface BackgroundSettingsProps {
    onClose?: () => void;
}

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({ onClose }) => {
    const {
        settings,
        updateSettings,
        backgroundImages,
        setBackgroundImages,
        setCurrentBackground
    } = usePomodoroStore();

    const [activeTab, setActiveTab] = useState<'gallery' | 'custom' | 'cache'>('gallery');
    const [isLoading, setIsLoading] = useState(false);
    const [customWallpapers, setCustomWallpapers] = useState<CustomWallpaper[]>(
        BingImagesService.getCustomWallpapers()
    );
    const [cacheInfo, setCacheInfo] = useState(BingImagesService.getCacheInfo());
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsLoading(true);
        try {
            const file = files[0];

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a valid image or video file');
                return;
            }

            // Validate file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                toast.error('File size must be less than 50MB');
                return;
            }

            await BingImagesService.addCustomWallpaper(file);
            setCustomWallpapers(BingImagesService.getCustomWallpapers());

            toast.success('Custom wallpaper added successfully!');
        } catch (error) {
            console.error('Error uploading wallpaper:', error);
            toast.error('Failed to upload wallpaper');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveCustomWallpaper = (id: string) => {
        BingImagesService.removeCustomWallpaper(id);
        setCustomWallpapers(BingImagesService.getCustomWallpapers());

        // If this was the selected wallpaper, disable custom wallpaper
        if (settings.selectedCustomWallpaper === id) {
            updateSettings({
                ...settings,
                customWallpaperEnabled: false,
                selectedCustomWallpaper: undefined
            });
        }

        toast.success('Custom wallpaper removed');
    };

    const handleSelectCustomWallpaper = (wallpaper: CustomWallpaper) => {
        updateSettings({
            ...settings,
            customWallpaperEnabled: true,
            selectedCustomWallpaper: wallpaper.id
        });

        const backgroundImage: BackgroundImage = {
            id: wallpaper.id,
            url: wallpaper.url,
            thumbnailUrl: wallpaper.thumbnailUrl,
            type: wallpaper.type,
            title: wallpaper.name,
            theme: settings.selectedTheme,
            source: 'user',
            isCustom: true,
        };

        setCurrentBackground(backgroundImage);
        toast.success('Custom wallpaper selected');
    };

    const handleSelectApiImage = (image: BackgroundImage) => {
        updateSettings({
            ...settings,
            customWallpaperEnabled: false,
            selectedCustomWallpaper: undefined
        });
        setCurrentBackground(image);
        toast.success('Background image selected');
    };

    const handleRefreshImages = async () => {
        setIsLoading(true);
        try {
            const newImages = await BingImagesService.refreshThemeImages(
                settings.selectedTheme,
                settings.imageQuality
            );
            setBackgroundImages(newImages);
            setCacheInfo(BingImagesService.getCacheInfo());
            toast.success('Images refreshed successfully!');
        } catch (error) {
            console.error('Error refreshing images:', error);
            toast.error('Failed to refresh images');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearCache = () => {
        BingImagesService.clearCache();
        setCacheInfo(BingImagesService.getCacheInfo());
        toast.success('Cache cleared successfully!');
    };

    const tabs = [
        { id: 'gallery' as const, label: 'Image Gallery', icon: ImageIcon },
        { id: 'custom' as const, label: 'Custom Wallpapers', icon: Upload },
        { id: 'cache' as const, label: 'Cache Management', icon: Monitor }
    ];

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ImageIcon className="h-6 w-6" />
                        Background Settings
                    </h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'gallery' && (
                            <motion.div
                                key="gallery"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                {/* Controls */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <select
                                            value={settings.imageQuality}
                                            onChange={(e) => updateSettings({
                                                ...settings,
                                                imageQuality: e.target.value as '1080p' | '4k'
                                            })}
                                            className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20"
                                        >
                                            <option value="1080p">1080p Quality</option>
                                            <option value="4k">4K Quality</option>
                                        </select>

                                        <button
                                            onClick={handleRefreshImages}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </button>
                                    </div>

                                    <div className="text-white/70 text-sm">
                                        {backgroundImages.length} images available
                                    </div>
                                </div>

                                {/* Image Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {backgroundImages.map((image) => (
                                        <motion.div
                                            key={image.id}
                                            className="relative group cursor-pointer"
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleSelectApiImage(image)}
                                        >
                                            <div className="aspect-video rounded-lg overflow-hidden bg-white/10">
                                                <img
                                                    src={image.thumbnailUrl}
                                                    alt={image.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Check className="h-8 w-8 text-white" />
                                                </div>
                                            </div>

                                            <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {image.title}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'custom' && (
                            <motion.div
                                key="custom"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                {/* Upload Area */}
                                <div
                                    className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center cursor-pointer hover:border-white/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                                    <p className="text-white text-lg font-medium mb-2">
                                        Upload Custom Wallpaper
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        Supports images (JPG, PNG, GIF, WebP) and videos (MP4, WebM)
                                    </p>
                                    <p className="text-white/50 text-xs mt-2">
                                        Maximum file size: 50MB
                                    </p>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />

                                {/* Custom Wallpapers Grid */}
                                {customWallpapers.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {customWallpapers.map((wallpaper) => (
                                            <motion.div
                                                key={wallpaper.id}
                                                className="relative group"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <div className="aspect-video rounded-lg overflow-hidden bg-white/10">
                                                    {wallpaper.type === 'animated' ? (
                                                        <video
                                                            src={wallpaper.url}
                                                            className="w-full h-full object-cover"
                                                            muted
                                                            loop
                                                            autoPlay
                                                        />
                                                    ) : (
                                                        <img
                                                            src={wallpaper.url}
                                                            alt={wallpaper.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>

                                                {/* Controls */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                        <button
                                                            onClick={() => handleSelectCustomWallpaper(wallpaper)}
                                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveCustomWallpaper(wallpaper.id)}
                                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="font-medium truncate">{wallpaper.name}</div>
                                                    <div className="text-white/70">
                                                        {wallpaper.type === 'animated' ? 'Animated' : 'Static'}
                                                    </div>
                                                </div>

                                                {/* Selected indicator */}
                                                {settings.selectedCustomWallpaper === wallpaper.id && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-white/70 py-8">
                                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-white/30" />
                                        <p>No custom wallpapers uploaded yet</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'cache' && (
                            <motion.div
                                key="cache"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                {/* Cache Controls */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Cache Information</h3>
                                    <button
                                        onClick={handleClearCache}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Clear All Cache
                                    </button>
                                </div>

                                {/* Cache Info */}
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Info className="h-5 w-5 text-blue-400" />
                                        <span className="text-white font-medium">Cache Status</span>
                                    </div>

                                    {cacheInfo.length > 0 ? (
                                        <div className="space-y-3">
                                            {cacheInfo.map((info) => (
                                                <div key={info.theme} className="bg-white/5 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-medium text-white capitalize">
                                                            {info.theme} Theme
                                                        </h4>
                                                        <span className="text-sm text-white/70">
                                                            {info.count} images
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-white/60 space-y-1">
                                                        <div>Last fetched: {info.lastFetched}</div>
                                                        <div>Expires: {info.expiresAt}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-white/60 py-4">
                                            No cached images found
                                        </div>
                                    )}
                                </div>

                                {/* Settings */}
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-3">Cache Settings</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Enable Image Caching</span>
                                            <button
                                                onClick={() => updateSettings({
                                                    ...settings,
                                                    cacheImages: !settings.cacheImages
                                                })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.cacheImages ? 'bg-green-500' : 'bg-white/20'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.cacheImages ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Auto Refresh Images</span>
                                            <button
                                                onClick={() => updateSettings({
                                                    ...settings,
                                                    autoRefreshImages: !settings.autoRefreshImages
                                                })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoRefreshImages ? 'bg-green-500' : 'bg-white/20'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoRefreshImages ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BackgroundSettings;
