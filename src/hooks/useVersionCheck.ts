import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Declare the global build time variable injected by Vite
declare const __BUILD_TIME__: string;

const CHECK_INTERVAL = 3 * 60 * 1000; // Check every 3 minutes

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
                const deployedTimestamp = data.timestamp;
                const currentBuildTime = __BUILD_TIME__;

                // Compare timestamps to detect a newer deployment
                if (deployedTimestamp && deployedTimestamp !== currentBuildTime && !notifiedRef.current) {
                    notifiedRef.current = true;

                    toast.info("Update Available", {
                        description: "A new version of Tailo is ready with latest updates.",
                        action: {
                            label: "Update Now",
                            onClick: async () => {
                                // Clear all caches before reload for a clean start
                                if ('caches' in window) {
                                    const cacheNames = await caches.keys();
                                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                                }
                                window.location.reload();
                            }
                        },
                        duration: Infinity, // Keep until user acts or dismisses
                    });
                }
            } catch (error) {
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
