import { toast } from "sonner";

/**
 * Custom error handler to remove Firebase branding and show user-friendly messages
 */
export const handleCustomError = (error: any, fallbackMessage: string) => {
    console.error("Error detected:", error);

    let message = fallbackMessage;

    if (error && error.code) {
        // Map common Firebase error codes to friendly messages
        switch (error.code) {
            case "auth/user-not-found":
            case "auth/wrong-password":
                message = "Invalid email or password. Please try again.";
                break;
            case "auth/email-already-in-use":
                message = "This email is already registered. Try logging in.";
                break;
            case "auth/network-request-failed":
                message = "Network error. Please check your internet connection.";
                break;
            case "permission-denied":
                message = "You don't have permission to perform this action.";
                break;
            case "unavailable":
                message = "Service is temporarily unavailable. Please try again later.";
                break;
            default:
                // For other errors, use the provided fallback but clean up if it contains "Firebase"
                if (error.message && error.message.includes("Firebase")) {
                    message = fallbackMessage;
                } else {
                    message = error.message || fallbackMessage;
                }
        }
    }

    toast.error(message, {
        className: "bg-red-50 border-red-200 text-red-800",
    });
};

export const showSuccess = (message: string) => {
    toast.success(message, {
        className: "bg-green-50 border-green-200 text-green-800",
    });
};

export const showInfo = (message: string) => {
    toast.info(message, {
        className: "bg-blue-50 border-blue-200 text-blue-800",
    });
};
