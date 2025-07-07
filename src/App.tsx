import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { usePomodoroStore } from './stores/pomodoroStore';
import { BingImagesService } from './services/bingImages';
import { AudioService } from './services/audioService';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import MacDock from './components/layout/MacDock';
import BackgroundManager from './components/layout/BackgroundManager';
import AnimatedRoutes from './components/layout/AnimatedRoutes';

// Hooks
import { useWakeLock } from './hooks/useWakeLock';
import { useTimerTick } from './hooks/useTimerTick';

function App() {
  const {
    settings,
    backgroundImages,
    setBackgroundImages,
    currentBackground,
    setCurrentBackground,
    nextBackground,
    tick,
    isRunning
  } = usePomodoroStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(settings.selectedTheme);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom hooks
  useWakeLock(settings.preventSleep && isRunning);
  useTimerTick(tick, isRunning);

  // Detect fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement;
      setIsFullscreen(isFullscreenNow);

      // Close sidebar when entering fullscreen
      if (isFullscreenNow) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Load background images on mount
  useEffect(() => {
    const loadBackgroundImages = async () => {
      if (settings.customWallpaperEnabled && settings.selectedCustomWallpaper) {
        // Load custom wallpaper
        const customWallpapers = BingImagesService.getCustomWallpapers();
        const selectedWallpaper = customWallpapers.find((w: any) => w.id === settings.selectedCustomWallpaper);
        if (selectedWallpaper) {
          const backgroundImage = {
            id: selectedWallpaper.id,
            url: selectedWallpaper.url,
            thumbnailUrl: selectedWallpaper.thumbnailUrl,
            type: selectedWallpaper.type,
            title: selectedWallpaper.name,
            theme: settings.selectedTheme,
            source: 'user' as const,
            isCustom: true,
          };
          setBackgroundImages([backgroundImage]);
          setCurrentBackground(backgroundImage);
        }
      } else if (settings.backgroundImages && !settings.customWallpaperEnabled) {
        try {
          const images = await BingImagesService.fetchBackgroundImages(
            settings.selectedTheme,
            20,
            settings.imageQuality
          );
          setBackgroundImages(images);

          // Set the current background to the first image if we have images
          if (images.length > 0) {
            setCurrentBackground(images[0]);
          }

          // Preload first few images for better performance
          const imageUrls = images.slice(0, 5).map((img: any) => img.url);
          BingImagesService.preloadImages(imageUrls);
        } catch (error) {
          console.error('Failed to load background images:', error);
        }
      }
    };

    loadBackgroundImages();
  }, [settings.selectedTheme, settings.backgroundImages, settings.customWallpaperEnabled, settings.selectedCustomWallpaper, settings.imageQuality, setBackgroundImages, setCurrentBackground]);

  // Update theme when settings change
  useEffect(() => {
    setCurrentTheme(settings.selectedTheme);
    document.documentElement.setAttribute('data-theme', settings.selectedTheme);
  }, [settings.selectedTheme]);

  // Initialize audio service
  useEffect(() => {
    if (AudioService.isAudioSupported()) {
      const audioService = AudioService.getInstance();
      audioService.setVolume(settings.volume / 100);
    }
  }, [settings.volume]);

  // Background rotation timer (every 30 minutes)
  useEffect(() => {
    if (!settings.backgroundImages || settings.customWallpaperEnabled || backgroundImages.length <= 1) {
      return;
    }

    const rotationInterval = setInterval(() => {
      nextBackground();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(rotationInterval);
  }, [settings.backgroundImages, settings.customWallpaperEnabled, backgroundImages.length, nextBackground]);

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-1000 ${settings.clearMode
        ? 'bg-black text-white'
        : `theme-${currentTheme}`
        }`}>
        {/* Background Manager */}
        <BackgroundManager
          backgroundImage={currentBackground?.url}
          backgroundType={currentBackground?.type}
          theme={currentTheme}
          clearMode={settings.clearMode}
          backgroundEnabled={settings.backgroundImages && !settings.customWallpaperEnabled ? true : settings.customWallpaperEnabled}
          isFullscreen={isFullscreen}
        />

        {/* Main Layout */}
        <div className="relative z-10 min-h-screen">
          {/* Main Content */}
          <main className="transition-all duration-300">
            {/* macOS-style Menu Button - Only show when not in fullscreen and on mobile */}
            {!isFullscreen && (
              <motion.div
                className="fixed left-4 top-4 z-30 lg:hidden"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                  }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        rotate: isSidebarOpen ? 90 : 0,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <Menu className="h-6 w-6 text-white drop-shadow-lg" />
                    </motion.div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* macOS-style reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-xl pointer-events-none" />
                </motion.button>
              </motion.div>
            )}

            {/* Mobile Sidebar */}
            <AnimatePresence>
              {!isFullscreen && isSidebarOpen && (
                <>
                  <motion.div
                    initial={{ x: -280 }}
                    animate={{ x: 0 }}
                    exit={{ x: -280 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed left-0 top-0 z-30 h-full lg:hidden"
                  >
                    <Sidebar
                      isOpen={isSidebarOpen}
                      onClose={() => setIsSidebarOpen(false)}
                      currentTheme={currentTheme}
                    />
                  </motion.div>

                  {/* Sidebar Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Routes with GSAP Animations */}
            <AnimatedRoutes />

            {/* macOS-style Dock - Hide in fullscreen and on mobile when sidebar is open */}
            <MacDock
              isVisible={settings.dockVisible && !isSidebarOpen && !isFullscreen}
              isFullscreen={isFullscreen}
              dockPosition={settings.dockPosition}
            />
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
