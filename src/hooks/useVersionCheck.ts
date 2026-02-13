import { useEffect, useRef } from 'react';

const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const CURRENT_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export function useVersionCheck() {
    const notifiedRef = useRef(false);

    useEffect(() => {
        const checkVersion = async () => {
            try {
                // Fetch version.json with cache busting
                const response = await fetch(`/version.json?t=${Date.now()}`, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });

                if (!response.ok) return;

                const data = await response.json();
                const deployedVersion = data.version;

                // If versions don't match and we haven't notified yet
                if (deployedVersion !== CURRENT_VERSION && !notifiedRef.current) {
                    notifiedRef.current = true;

                    // Show a notification to the user
                    if (confirm('A new version of the app is available! Click OK to refresh and get the latest updates.')) {
                        // Clear all caches and reload
                        if ('caches' in window) {
                            const cacheNames = await caches.keys();
                            await Promise.all(cacheNames.map(name => caches.delete(name)));
                        }
                        window.location.reload();
                    }
                }
            } catch (error) {
                // Silently fail - don't interrupt user experience
                console.log('Version check failed:', error);
            }
        };

        // Check immediately on mount
        checkVersion();

        // Then check periodically
        const interval = setInterval(checkVersion, CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, []);
}
