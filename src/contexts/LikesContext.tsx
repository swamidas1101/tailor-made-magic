import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { designService } from "@/services/designService";
import { toast } from "sonner";

interface LikesContextType {
    likedDesignIds: string[];
    toggleLike: (designId: string) => Promise<boolean>;
    isLiked: (designId: string) => boolean;
    isProcessing: (designId: string) => boolean;
    getLikesCount: (designId: string, initialCount: number) => number;
    loading: boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [likedDesignIds, setLikedDesignIds] = useState<string[]>([]);
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
    const [countOverrides, setCountOverrides] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserLikes = async () => {
            if (!user) {
                setLikedDesignIds([]);
                setCountOverrides({});
                return;
            }

            try {
                const likes = await designService.getUserLikes(user.uid);
                setLikedDesignIds(likes);
            } catch (error) {
                console.error("Error fetching user likes:", error);
            }
        };

        fetchUserLikes();
    }, [user]);

    const toggleLike = async (designId: string): Promise<boolean> => {
        if (!user) {
            toast.error("Please sign in to like designs", {
                description: "Your likes help us show you more of what you love.",
                action: {
                    label: "Sign In",
                    onClick: () => window.location.href = "/auth"
                }
            });
            throw new Error("User not authenticated");
        }

        const isCurrentlyLiked = likedDesignIds.includes(designId);
        if (processingIds.has(designId)) return isCurrentlyLiked;

        setProcessingIds(prev => new Set(prev).add(designId));

        // Optimistic UI update for liked state
        setLikedDesignIds(prev =>
            isCurrentlyLiked
                ? prev.filter(id => id !== designId)
                : [...prev, designId]
        );

        // Optimistic UI update for global count override
        setCountOverrides(prev => ({
            ...prev,
            [designId]: (prev[designId] || 0) + (isCurrentlyLiked ? -1 : 1)
        }));

        try {
            const result = await designService.toggleLike(designId, user.uid);
            return result.liked;
        } catch (error) {
            // Revert liked state on error
            setLikedDesignIds(prev =>
                isCurrentlyLiked
                    ? [...prev, designId]
                    : prev.filter(id => id !== designId)
            );

            // Revert count override on error
            setCountOverrides(prev => ({
                ...prev,
                [designId]: (prev[designId] || 0) - (isCurrentlyLiked ? -1 : 1)
            }));

            toast.error("Could not update like. Please try again.");
            throw error;
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(designId);
                return next;
            });
        }
    };

    const isLiked = (designId: string) => likedDesignIds.includes(designId);
    const isProcessing = (designId: string) => processingIds.has(designId);

    const getLikesCount = (designId: string, initialCount: number) => {
        return Math.max(0, initialCount + (countOverrides[designId] || 0));
    };

    return (
        <LikesContext.Provider value={{ likedDesignIds, toggleLike, isLiked, isProcessing, getLikesCount, loading }}>
            {children}
        </LikesContext.Provider>
    );
}

export function useLikes() {
    const context = useContext(LikesContext);
    if (context === undefined) {
        throw new Error("useLikes must be used within a LikesProvider");
    }
    return context;
}
