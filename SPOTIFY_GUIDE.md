# Spotify Integration Guide

## Overview
The Pomodoro Clock now features a complete Spotify integration with a Dynamic Island-style interface that appears at the top of the screen when music is playing, similar to iOS's Dynamic Island feature.

## Features

### 🎵 Spotify Authentication
- Secure OAuth 2.0 authentication with Spotify
- Persistent login (stays logged in across sessions)
- Easy logout functionality

### 🎮 Dynamic Island Interface
- **Compact View**: Shows currently playing track with album art
- **Expanded View**: Full controls with progress bar, skip buttons, and volume
- **Real-time Updates**: Track information updates every 5 seconds
- **Smooth Animations**: Framer Motion animations for a polished experience

### 🎯 Playback Control
- Play/Pause current track
- Skip to next/previous track
- View current playback progress
- See album artwork and track information
- Works with any active Spotify device

## Setup Instructions

### 1. Spotify App Configuration
You'll need to configure your Spotify app settings:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use existing one
3. Add the following redirect URI: `http://localhost:5173/callback`
4. Note down your `Client ID` and `Client Secret`

### 2. Environment Variables
The app uses these environment variables (already configured in `.env`):
```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
VITE_SPOTIFY_CALLBACK_URL=http://localhost:5173/callback
```

### 3. CORS Handling
The Vite development server is configured with proxy settings to handle CORS issues:
- Spotify API calls: `/api/spotify/*` → `https://api.spotify.com/*`
- Spotify Auth calls: `/api/spotify-accounts/*` → `https://accounts.spotify.com/*`

## How to Use

### 1. Connect Spotify
1. Click the music icon (🎵) in the dock or navigate to the Music page
2. Click on the "Spotify" tab
3. Click "Connect with Spotify"
4. You'll be redirected to Spotify for authorization
5. After authorization, you'll be redirected back to the app

### 2. Dynamic Island
Once authenticated and music is playing:
- The Dynamic Island appears at the top center of the screen
- **Click** the compact view to expand it
- Use the controls to play/pause, skip tracks
- The island automatically hides when no music is playing

### 3. Cross-Device Control
- Control music playing on any Spotify device (phone, computer, smart speakers)
- The app will show what's currently playing regardless of where you started it
- Works with Spotify Free and Premium accounts

## Technical Implementation

### Architecture
- **Context API**: Global Spotify authentication state
- **Service Layer**: Centralized Spotify API communication
- **Component Isolation**: Reusable Spotify components
- **Real-time Updates**: Periodic polling for playback state

### Key Components
- `SpotifyService`: Handles all API communication
- `SpotifyContext`: Global authentication state
- `SpotifyAuth`: Authentication component
- `SpotifyDynamicIsland`: The main Dynamic Island interface

### Security
- Tokens are stored securely in localStorage
- Automatic token refresh when expired
- Secure OAuth 2.0 implementation

## Troubleshooting

### "Login doesn't work"
- Check that your Spotify app has the correct redirect URI
- Ensure environment variables are set correctly
- Try clearing localStorage and logging in again

### "No music showing"
- Make sure you have Spotify open and music playing on some device
- Check that you're using the same Spotify account
- The Dynamic Island only appears when music is actively playing

### "CORS errors"
- Make sure you're running the development server (`npm run dev`)
- The proxy configuration should handle CORS automatically

## Spotify API Scopes
The app requests these permissions:
- `user-read-playback-state`: See what's currently playing
- `user-modify-playback-state`: Control playback
- `user-read-currently-playing`: Get current track info
- `user-read-private`: Get user profile
- `user-read-email`: Get user email

## Future Enhancements
- Playlist browsing and selection
- Search and queue management
- Collaborative playlists for study sessions
- Integration with Pomodoro timer (auto-pause during breaks)
- Offline mode with cached playlists
