import type { BackgroundImage, ImageCache, CustomWallpaper } from '../types';

interface UnsplashImage {
    id: string;
    urls: {
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    user: {
        name: string;
        username: string;
    };
    description?: string;
    alt_description?: string;
}

interface UnsplashResponse {
    results: UnsplashImage[];
    total: number;
    total_pages: number;
}

export class BingImagesService {
    private static readonly UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'demo_key';
    private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    private static readonly CACHE_PREFIX = 'bg_cache_';
    private static readonly CUSTOM_WALLPAPERS_KEY = 'custom_wallpapers';
    private static readonly MAX_CACHE_SIZE = 50; // Maximum number of images per theme to cache

    private static getThemeQueries(theme: 'home' | 'focus' | 'ambient'): string[] {
        switch (theme) {
            case 'focus':
                return [
                    'minimal workspace',
                    'clean desk',
                    'modern office',
                    'productivity setup',
                    'minimal aesthetic',
                    'clean architecture',
                    'modern minimal',
                    'workspace inspiration'
                ];
            case 'ambient':
                return [
                    'nature landscape',
                    'peaceful forest',
                    'calm ocean',
                    'mountain view',
                    'sunset sky',
                    'zen garden',
                    'peaceful nature',
                    'serene landscape'
                ];
            default: // home
                return [
                    'cozy home',
                    'warm interior',
                    'comfortable space',
                    'modern living',
                    'home aesthetic',
                    'cozy atmosphere',
                    'beautiful interior',
                    'home inspiration'
                ];
        }
    }

    static async fetchBackgroundImages(
        theme: 'home' | 'focus' | 'ambient',
        count: number = 20,
        quality: '1080p' | '4k' = '4k'
    ): Promise<BackgroundImage[]> {
        try {
            // Check cache first
            const cachedImages = this.getCachedImages(theme);
            if (cachedImages && cachedImages.length >= count) {
                console.log(`Using cached images for theme: ${theme}`);
                return cachedImages.slice(0, count);
            }

            console.log(`Fetching new images for theme: ${theme} with quality: ${quality}`);

            const queries = this.getThemeQueries(theme);
            const allImages: BackgroundImage[] = [];
            const imagesPerQuery = Math.ceil(count / queries.length);

            // Fetch images from multiple queries to get variety
            for (const query of queries) {
                try {
                    const images = await this.fetchFromUnsplash(query, imagesPerQuery, quality, theme);
                    allImages.push(...images);

                    // Break if we have enough images
                    if (allImages.length >= count) break;

                    // Add delay between requests to respect rate limits
                    await this.delay(200);
                } catch (error) {
                    console.warn(`Failed to fetch images for query "${query}":`, error);
                }
            }

            // Remove duplicates and limit to requested count
            const uniqueImages = this.removeDuplicates(allImages).slice(0, count);

            // Cache the results
            this.cacheImages(theme, uniqueImages);

            return uniqueImages;
        } catch (error) {
            console.error('Error fetching background images:', error);
            return this.getFallbackImages(theme, count);
        }
    } private static async fetchFromUnsplash(
        query: string,
        count: number,
        quality: '1080p' | '4k',
        theme: 'home' | 'focus' | 'ambient'
    ): Promise<BackgroundImage[]> {
        // Use Unsplash's public API which supports CORS
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&order_by=relevant`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Client-ID ${this.UNSPLASH_ACCESS_KEY}`
                }
            });

            if (!response.ok) {
                // If unauthorized, try without API key (uses demo mode with limited requests)
                if (response.status === 401) {
                    const demoResponse = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${Math.min(count, 10)}&orientation=landscape`);
                    if (demoResponse.ok) {
                        const demoData: UnsplashResponse = await demoResponse.json();
                        return this.mapUnsplashResults(demoData, theme, quality);
                    }
                }
                throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
            }

            const data: UnsplashResponse = await response.json();
            return this.mapUnsplashResults(data, theme, quality);
        } catch (error) {
            console.warn('Unsplash API failed, using fallback images:', error);
            return this.getFallbackImages(theme, count);
        }
    }

    private static mapUnsplashResults(
        data: UnsplashResponse,
        theme: 'home' | 'focus' | 'ambient',
        quality: '1080p' | '4k'
    ): BackgroundImage[] {
        return data.results.map(photo => ({
            id: `unsplash_${photo.id}`,
            url: quality === '4k' ? photo.urls.full : photo.urls.regular,
            thumbnailUrl: photo.urls.small,
            type: 'static' as const,
            title: photo.description || photo.alt_description || `Photo by ${photo.user.name}`,
            theme,
            source: 'unsplash' as const,
            isCustom: false,
            tags: [theme]
        }));
    }

    private static getCachedImages(theme: 'home' | 'focus' | 'ambient'): BackgroundImage[] | null {
        try {
            const cacheKey = `${this.CACHE_PREFIX}${theme}`;
            const cached = localStorage.getItem(cacheKey);

            if (!cached) return null;

            const cache: ImageCache = JSON.parse(cached);
            const now = new Date();

            // Check if cache is expired
            if (new Date(cache.expiresAt) < now) {
                localStorage.removeItem(cacheKey);
                return null;
            }

            return cache.images;
        } catch (error) {
            console.error('Error reading image cache:', error);
            return null;
        }
    }

    private static cacheImages(theme: 'home' | 'focus' | 'ambient', images: BackgroundImage[]): void {
        try {
            const cacheKey = `${this.CACHE_PREFIX}${theme}`;
            const now = new Date();
            const expiresAt = new Date(now.getTime() + this.CACHE_DURATION);

            const cache: ImageCache = {
                theme,
                images: images.slice(0, this.MAX_CACHE_SIZE),
                lastFetched: now,
                expiresAt
            };

            localStorage.setItem(cacheKey, JSON.stringify(cache));
            console.log(`Cached ${images.length} images for theme: ${theme}`);
        } catch (error) {
            console.error('Error caching images:', error);
        }
    }

    private static removeDuplicates(images: BackgroundImage[]): BackgroundImage[] {
        const seen = new Set<string>();
        return images.filter(image => {
            if (seen.has(image.url)) {
                return false;
            }
            seen.add(image.url);
            return true;
        });
    }

    private static getFallbackImages(theme: 'home' | 'focus' | 'ambient', count: number): BackgroundImage[] {
        // Fallback images in case API fails
        const fallbackUrls = [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&h=2160&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&h=2160&fit=crop',
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=3840&h=2160&fit=crop'
        ];

        return fallbackUrls.slice(0, count).map((url, index) => ({
            id: `fallback_${theme}_${index}`,
            url,
            thumbnailUrl: url + '&w=400&h=300',
            type: 'static' as const,
            title: `${theme} background ${index + 1}`,
            theme,
            source: 'default' as const,
            isCustom: false
        }));
    }

    private static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Custom wallpaper management
    static getCustomWallpapers(): CustomWallpaper[] {
        try {
            const stored = localStorage.getItem(this.CUSTOM_WALLPAPERS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading custom wallpapers:', error);
            return [];
        }
    }

    static async addCustomWallpaper(file: File): Promise<CustomWallpaper> {
        try {
            const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const url = URL.createObjectURL(file);

            // Determine if it's animated
            const isAnimated = file.type.includes('gif') || file.type.includes('webp') || file.type.includes('video');

            // Create thumbnail (for now, use the same URL - could be enhanced with canvas)
            const thumbnailUrl = url;

            const wallpaper: CustomWallpaper = {
                id,
                file,
                url,
                thumbnailUrl,
                type: isAnimated ? 'animated' : 'static',
                name: file.name,
                uploadedAt: new Date()
            };

            const wallpapers = this.getCustomWallpapers();
            wallpapers.push(wallpaper);

            // Limit to 20 custom wallpapers to prevent storage issues
            if (wallpapers.length > 20) {
                const removed = wallpapers.shift();
                if (removed) {
                    URL.revokeObjectURL(removed.url);
                }
            }

            localStorage.setItem(this.CUSTOM_WALLPAPERS_KEY, JSON.stringify(wallpapers));

            return wallpaper;
        } catch (error) {
            console.error('Error adding custom wallpaper:', error);
            throw error;
        }
    }

    static removeCustomWallpaper(id: string): void {
        try {
            const wallpapers = this.getCustomWallpapers();
            const index = wallpapers.findIndex(w => w.id === id);

            if (index !== -1) {
                const removed = wallpapers.splice(index, 1)[0];
                URL.revokeObjectURL(removed.url);
                localStorage.setItem(this.CUSTOM_WALLPAPERS_KEY, JSON.stringify(wallpapers));
            }
        } catch (error) {
            console.error('Error removing custom wallpaper:', error);
        }
    }

    // Image preloading for better performance
    static preloadImages(urls: string[]): void {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // Clear all caches
    static clearCache(): void {
        try {
            const themes: Array<'home' | 'focus' | 'ambient'> = ['home', 'focus', 'ambient'];
            themes.forEach(theme => {
                const cacheKey = `${this.CACHE_PREFIX}${theme}`;
                localStorage.removeItem(cacheKey);
            });
            console.log('All image caches cleared');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    // Get cache info for debugging/settings
    static getCacheInfo(): { theme: string; count: number; lastFetched: string; expiresAt: string }[] {
        const themes: Array<'home' | 'focus' | 'ambient'> = ['home', 'focus', 'ambient'];
        const info: { theme: string; count: number; lastFetched: string; expiresAt: string }[] = [];

        themes.forEach(theme => {
            const cacheKey = `${this.CACHE_PREFIX}${theme}`;
            const cached = localStorage.getItem(cacheKey);

            if (cached) {
                try {
                    const cache: ImageCache = JSON.parse(cached);
                    info.push({
                        theme,
                        count: cache.images.length,
                        lastFetched: new Date(cache.lastFetched).toLocaleString(),
                        expiresAt: new Date(cache.expiresAt).toLocaleString()
                    });
                } catch (error) {
                    console.error(`Error parsing cache for theme ${theme}:`, error);
                }
            }
        });

        return info;
    }

    // Force refresh images for a theme
    static async refreshThemeImages(theme: 'home' | 'focus' | 'ambient', quality: '1080p' | '4k' = '4k'): Promise<BackgroundImage[]> {
        // Clear existing cache
        const cacheKey = `${this.CACHE_PREFIX}${theme}`;
        localStorage.removeItem(cacheKey);

        // Fetch fresh images
        return this.fetchBackgroundImages(theme, 20, quality);
    }
}
