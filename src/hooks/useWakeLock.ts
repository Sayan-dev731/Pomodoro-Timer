import { useEffect, useRef } from 'react';

export function useWakeLock(enabled: boolean) {
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            if (!enabled || !('wakeLock' in navigator)) {
                return;
            }

            try {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                console.log('Wake lock acquired');
            } catch (err) {
                console.error('Failed to acquire wake lock:', err);
            }
        };

        const releaseWakeLock = async () => {
            if (wakeLockRef.current) {
                try {
                    await wakeLockRef.current.release();
                    wakeLockRef.current = null;
                    console.log('Wake lock released');
                } catch (err) {
                    console.error('Failed to release wake lock:', err);
                }
            }
        };

        if (enabled) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }

        // Handle visibility change
        const handleVisibilityChange = () => {
            if (enabled && document.visibilityState === 'visible' && !wakeLockRef.current) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            releaseWakeLock();
        };
    }, [enabled]);

    return wakeLockRef.current;
}
