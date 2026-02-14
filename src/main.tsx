import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
            .then(registration => {
                console.log('SW registered:', registration);
                // Check for updates immediately on load
                registration.update();
            })
            .catch(error => console.log('SW registration failed:', error));
    });
}
