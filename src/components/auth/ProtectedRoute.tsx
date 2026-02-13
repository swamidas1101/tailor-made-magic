import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, userRoles, activeRole, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        // Redirect to auth page with current path to allow redirection after login
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    // If roles are specified, check if user has the required role
    // We check both the active role AND if they possess the role at all
    // If they posess the role but it's not active, we could:
    // 1. Auto-switch them? (Aggressive)
    // 2. Show a "Wrong Role" page?
    // 3. Just let them in if we consider "possession" enough? 
    //    -> Better to enforce activeRole for context consistency.

    if (allowedRoles) {
        if (activeRole && allowedRoles.includes(activeRole)) {
            return <>{children}</>;
        }

        // If they have the role but it's not active, maybe prompt to switch?
        // For now, simpler to redirect to their active dashboard or 403
        // But let's check if they HAVE the role in their list
        const hasRole = userRoles?.some(r => allowedRoles.includes(r));

        if (hasRole) {
            // They have the role, but it's not active.
            // Ideally, we might auto-switch?
            // For now, let's redirect to Auth with a message?
            // Or just Redirect to the dashboard of their CURRENT active role
            return <Navigate to="/auth" replace />;
        }

        // They don't have the role at all
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
