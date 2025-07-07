# Pomodoro Clock - Advanced Timer with Beautiful B## 🖼️ Background Image Features

### API Integration
- Uses Unsplash API for high-quality stock photos
- Fetches 4K resolution images by default
- Fallback to 1080p for faster loading
- Smart rate limiting and error handling
- Demo mode: 50 requests/hour without API key
- Full access: 5,000 requests/hour with free API keynds

A sophisticated Pomodoro Timer built with React, TypeScript, and featuring beautiful 4K background images, custom wallpaper support, and advanced caching.

## ✨ Features

### 🖼️ Background Image System
- **4K Quality Images**: High-resolution backgrounds from Unsplash API
- **Theme-Based Collections**: Different image sets for Home, Focus, and Ambient themes
- **Smart Caching**: 24-hour local caching to minimize API calls
- **Custom Wallpapers**: Upload your own static or animated wallpapers
- **Animated Support**: GIF, WebP, and video wallpapers
- **Automatic Rotation**: Background changes every 30 minutes

### ⏰ Pomodoro Features
- Customizable timer durations (15-60 minutes)
- Auto-start breaks and sessions
- Multiple themes with matching visuals
- Sound notifications and tick sounds
- Desktop notifications
- Session statistics and tracking

### 🎨 Advanced UI
- Glass morphism design
- Smooth animations with Framer Motion
- Responsive design for all devices
- Fullscreen mode support
- Clear mode for distraction-free focus

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Unsplash API (Optional but Recommended)
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account and new application
3. Copy your Access Key
2. Create a `.env` file in the project root:
```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### 3. Run the Development Server
```bash
npm run dev
```

## 🖼️ Background Image Features

### API Integration
- Uses Unsplash API for high-quality stock photos
- Fetches 4K resolution images by default
- Fallback to 1080p for faster loading
- Smart rate limiting and error handling
- Demo mode: 50 requests/hour without API key
- Full access: 5,000 requests/hour with free API key

### Caching System
- 24-hour local storage caching
- Reduces API calls and improves performance
- Configurable cache management in settings
- Automatic cache expiration and refresh

### Custom Wallpapers
- Upload your own images (JPG, PNG, GIF, WebP)
- Support for animated wallpapers (GIF, WebP, MP4, WebM)
- Maximum file size: 50MB
- Up to 20 custom wallpapers stored locally

### Theme Collections
- **Home**: Cozy, warm interior spaces
- **Focus**: Minimal workspaces and clean environments  
- **Ambient**: Nature landscapes and peaceful scenes

## ⚙️ Settings Management

Access the Background Settings through:
1. Settings Page → Appearance → Background Settings
2. Manage cached images and view usage statistics
3. Upload and organize custom wallpapers
4. Configure image quality and caching preferences

### Available Options
- **Image Quality**: Choose between 1080p and 4K
- **Cache Management**: Enable/disable caching and auto-refresh
- **Custom Wallpapers**: Upload, select, and manage personal images
- **Background Rotation**: Automatic image cycling every 30 minutes

## 🛠️ Technical Details

### Architecture
- React 19 with TypeScript
- Zustand for state management  
- Tailwind CSS for styling
- Framer Motion for animations
- Vite for fast development

### Performance Optimizations
- Image preloading for smooth transitions
- Lazy loading and progressive enhancement
- Efficient caching with expiration
- Background rotation without blocking UI

### Browser Support
- Modern browsers with ES2020+ support
- Progressive enhancement for older browsers
- Mobile-responsive design
- Wake Lock API for preventing sleep

## 📱 Usage Tips

1. **First Launch**: The app works without API key using fallback images
2. **API Setup**: Add Unsplash API key for unlimited high-quality images
3. **Custom Wallpapers**: Upload personal images through Settings
4. **Performance**: Enable caching for best experience
5. **Mobile**: Swipe gestures supported, responsive design

## 🎯 Advanced Features

- **Smart Caching**: Intelligent cache management with size limits
- **Error Handling**: Graceful fallbacks when API is unavailable
- **Accessibility**: Full keyboard navigation and screen reader support
- **PWA Ready**: Installable web app with offline capabilities
- **Analytics**: Session tracking and productivity insights

---

Built with ❤️ for productivity enthusiasts

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
---

Built with ❤️ for productivity enthusiasts

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
