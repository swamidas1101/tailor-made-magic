import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Declare the global build time variable injected by Vite
declare const __BUILD_TIME__: string;

const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const IS_DEV = import.meta.env.DEV;

export function useVersionCheck() {
    const notifiedRef = useRef(false);

    useEffect(() => {
        // Skip version checks in development mode to avoid infinite loops
        if (IS_DEV) return;

        const checkVersion = async () => {
            try {
                // Fetch version.json with cache busting
                const response = await fetch(`/version.json?t=${Date.now()}`, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    }
                });

                if (!response.ok) return;

                const data = await response.json();
                const deployedTimestamp = data.timestamp;
                const currentBuildTime = __BUILD_TIME__;

                // Check if we already notified/handled this specific version in this session
                const lastNotified = sessionStorage.getItem('last_version_notified');

                // Compare timestamps to detect a newer deployment
                if (deployedTimestamp &&
                    deployedTimestamp !== currentBuildTime &&
                    deployedTimestamp !== lastNotified &&
                    !notifiedRef.current) {

                    notifiedRef.current = true;
                    sessionStorage.setItem('last_version_notified', deployedTimestamp);

                    toast.info("Update Available", {
                        description: "A new version of Tailo is ready with latest updates.",
                        action: {
                            label: "Update Now",
                            onClick: async () => {
                                // Clear all caches before reload
                                if ('caches' in window) {
                                    const cacheNames = await caches.keys();
                                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                                }
                                window.location.reload();
                            }
                        },
                        duration: Infinity,
                    });
                }
            } catch (error) {
                console.warn('Version check failed:', error);
            }
        };

        // Check immediately on mount
        checkVersion();

        // Then check periodically
        const interval = setInterval(checkVersion, CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, []);
}
