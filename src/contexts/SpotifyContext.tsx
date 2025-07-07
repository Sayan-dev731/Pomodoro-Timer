import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { SpotifyService } from '../services/spotifyService';

interface SpotifyContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (authenticated: boolean) => void;
    refreshAuthStatus: () => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

interface SpotifyProviderProps {
    children: ReactNode;
}

export const SpotifyProvider: React.FC<SpotifyProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshAuthStatus = () => {
        const spotifyService = SpotifyService.getInstance();
        const authenticated = spotifyService.isAuthenticated();
        setIsAuthenticated(authenticated);
    };

    useEffect(() => {
        // Check authentication status on mount
        refreshAuthStatus();

        // Set up an interval to periodically check auth status
        const interval = setInterval(refreshAuthStatus, 5000);

        return () => clearInterval(interval);
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        refreshAuthStatus,
    };

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotify = (): SpotifyContextType => {
    const context = useContext(SpotifyContext);
    if (context === undefined) {
        throw new Error('useSpotify must be used within a SpotifyProvider');
    }
    return context;
};
