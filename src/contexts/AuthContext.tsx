import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, query, where, collection, getDocs } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export type UserRole = "admin" | "tailor" | "customer";

export interface BusinessDetails {
  businessName?: string;
  address?: string;
  specialization?: string[];
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  userRoles: UserRole[] | null;
  activeRole: UserRole | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<User>;
  signupWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyPhoneOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<User>;
  completeProfile: (uid: string, data: { name: string; dob: string; role: UserRole; businessDetails?: BusinessDetails }) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  addRole: (role: UserRole, businessDetails?: BusinessDetails) => Promise<void>;
  checkExistingAccount: (email: string) => Promise<{ exists: boolean; roles?: UserRole[] }>;
  verifyAdminCode: (code: string) => Promise<boolean>;
  signupWithGoogle: () => Promise<User>;
  updateKYTData: (data: Partial<KYTData>, status?: KYTStatus) => Promise<void>;
  kytStatus: KYTStatus;
  kytData: KYTData | null;
  isEmailRegistered: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type KYTStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';

export interface KYTData {
  personal?: {
    fullName: string;
    profileImage?: string;
    phone: string;
    dob?: string;
    isMobileVerified?: boolean;
  };
  address?: {
    shopName: string;
    shopAddress: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: { lat: number; lng: number };
  };
  professional?: {
    experienceYears: string;
    specialization: string[];
  };
  documents?: {
    aadharNumber: string;
    panNumber: string;
    gstNumber?: string; // Optional
    aadharImage?: string;
    panImage?: string;
  };
  bank?: {
    accountNumber: string;
    confirmAccountNumber?: string;
    ifsc: string;
    holderName: string;
    bankName?: string;
  };
  currentStep: number; // For resuming progress
  rejectionReason?: string; // Reason for revision request
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[] | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [kytStatus, setKytStatus] = useState<KYTStatus>('pending');
  const [kytData, setKytData] = useState<KYTData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Don't set user immediately if we need role data
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();

            // Safer role extraction: Don't default to ["customer"] immediately if nothing exists
            // This prevents overwriting a new Tailor profile that is being created concurrently
            let roles = data.roles;
            if (!roles && data.role) {
              roles = [data.role]; // Migration support
            }

            // If still no roles, we might be in a middle of creation, or it's a broken doc.
            // But we should NOT write "customer" to DB yet.
            const derivedRoles = roles || ["customer"]; // Only for local state, do not persist yet

            // MULTI-TAB SUPPORT: Use sessionStorage for activeRole to allow different roles in different tabs
            // We ONLY use data.activeRole if sessionStorage is completely empty (first time in this tab)
            const sessionActiveRole = sessionStorage.getItem(`activeRole_${currentUser.uid}`) as UserRole | null;
            const currentActive = sessionActiveRole || data.activeRole || derivedRoles[0];

            // Set state only after data is ready
            setUser(currentUser);
            setUserRoles(derivedRoles);
            setActiveRole(currentActive);

            // Ensure sessionStorage is synced FOR THIS TAB
            if (currentActive) {
              sessionStorage.setItem(`activeRole_${currentUser.uid}`, currentActive);
            }

            // KYT Data handling remains same...
            if (currentActive === 'tailor') {
              setKytStatus(data.kytStatus || 'pending');
              setKytData(data.kytData || null);
            }

            // MIGRATION & REPAIR LOGIC
            // We only update the DB if roles are missing or if activeRole is literally null in DB
            const needsMigration = data.role && !data.roles;
            const missingActiveRoleInDB = data.roles && !data.activeRole;

            if (needsMigration || missingActiveRoleInDB) {
              await updateDoc(userDocRef, {
                roles: derivedRoles,
                activeRole: data.activeRole || currentActive,
                ...(currentActive === 'tailor' && !data.kytStatus ? { kytStatus: 'pending' } : {})
              });
            }
          } else {
            // New user via Google (account created but no doc yet)
            // Wait! If we came from signupWithGoogle, the doc might be created there.
            // But onAuthStateChanged fires potentially before that async function finishes writing?
            // Or maybe we should let signupWithGoogle handle the doc creation, and this listener essentially "reacts" to it.
            // However, if we rely on this listener for the INITIAL state, we might get a flash of "customer" before "tailor".
            // Let's assume for now this listener is safe, but we will handle the doc creation in signupWithGoogle explicitly.

            // For now, if no doc, we treat as a new user? Or wait? 
            // Better to NOT set user if we expect a doc but don't find it yet?
            // No, we must let them in as authenticated, but maybe with "customer" default for now?
            setUser(currentUser);
            // Verify if we should default to customer here or wait for signup
          }
        } catch (error) {
          console.error("Error fetching user roles:", error);
          setUser(currentUser);
          setUserRoles(["customer"]);
          setActiveRole("customer");
        }
      } else {
        setUser(null);
        setUserRoles(null);
        setActiveRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  };

  const signupWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      console.error("Google Signup Error:", error);
      throw error;
    }
  };

  const scrubUndefined = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(scrubUndefined);

    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, scrubUndefined(v)])
    );
  };

  const updateKYTData = async (data: Partial<KYTData>, status?: KYTStatus) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);

      // We merge the new data with the existing kytData in the state
      const newKytData = { ...kytData, ...data };

      // Scrub undefined values to prevent Firestore error
      const scrubbedData = scrubUndefined(newKytData);

      const updatePayload: any = {
        "kytData": scrubbedData
      };

      if (status) {
        updatePayload["kytStatus"] = status;
      }

      await updateDoc(userDocRef, updatePayload);

      // Update local state
      setKytData(newKytData as KYTData);
      if (status) setKytStatus(status);

    } catch (error) {
      console.error("Error updating KYT data:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email Login Error:", error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error("Email Signup Error:", error);
      throw error;
    }
  };

  const signupWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    try {
      return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    } catch (error) {
      console.error("Phone Signup Error:", error);
      throw error;
    }
  };

  const verifyPhoneOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
    try {
      const userCredential = await confirmationResult.confirm(otp);
      return userCredential.user;
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      throw error;
    }
  };

  const completeProfile = async (uid: string, data: { name: string; dob: string; role: UserRole; email?: string; phone?: string; businessDetails?: BusinessDetails }) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const { name, dob, role, businessDetails } = data;

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
      }

      const userData: any = {
        uid,
        name,
        dob,
        roles: [role],
        activeRole: role,
        email: data.email || auth.currentUser?.email || undefined,
        phone: data.phone || auth.currentUser?.phoneNumber || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mask synthetic emails for phone-based users
      if (userData.email?.endsWith("@tailor-made-magic.com")) {
        delete userData.email;
      }


      if (businessDetails && role === 'tailor') {
        userData.tailorProfile = {
          businessName: businessDetails.businessName,
          address: businessDetails.address,
          specialization: businessDetails.specialization,
          phone: businessDetails.phone || auth.currentUser?.phoneNumber || undefined
        };
      }

      await setDoc(userDocRef, userData);

      // Update local state
      setUserRoles([role]);
      setActiveRole(role);
      sessionStorage.setItem(`activeRole_${uid}`, role);

    } catch (error: any) {
      console.error("Complete Profile Error:", error);
      throw error;
    }
  };

  const switchRole = async (role: UserRole) => {
    if (!user) return;

    try {
      // 1. Update LOCAL TAB state immediately
      setActiveRole(role);
      sessionStorage.setItem(`activeRole_${user.uid}`, role);

      // 2. Update DB so it's the new default for future sessions/tabs
      // This is safe because onAuthStateChanged now PRIORITIZES sessionStorage.
      // Other already-open tabs will NOT be affected because they won't re-run onAuthStateChanged roles logic unless refreshed.
      // And if they are refreshed, they have their OWN sessionStorage.
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        activeRole: role
      });
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  const addRole = async (role: UserRole, businessDetails?: BusinessDetails) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const updateData: any = {
        roles: arrayUnion(role),
        activeRole: role
      };

      if (businessDetails && role === 'tailor') {
        updateData["tailorProfile"] = {
          businessName: businessDetails.businessName,
          address: businessDetails.address,
          specialization: businessDetails.specialization,
          phone: businessDetails.phone
        };
      }

      await updateDoc(userDocRef, updateData);

      // Update local state
      setUserRoles(prev => prev ? [...prev, role] : [role]);
      setActiveRole(role);
      sessionStorage.setItem(`activeRole_${user.uid}`, role);
    } catch (error) {
      console.error("Error adding role:", error);
      throw error;
    }
  };

  const isEmailRegistered = async (email: string): Promise<boolean> => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking email registration:", error);
      return false;
    }
  };

  const checkExistingAccount = async (email: string): Promise<{ exists: boolean; roles?: UserRole[] }> => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return { exists: false };

      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      return {
        exists: true,
        roles: data.roles || (data.role ? [data.role] : ["customer"])
      };
    } catch (error) {
      console.error("Error checking existing account:", error);
      return { exists: false };
    }
  };

  const verifyAdminCode = async (code: string): Promise<boolean> => {
    try {
      // Check if code exists in 'invites' collection
      // For MVP, we can also check a specific document in 'system' collection
      const inviteDoc = await getDoc(doc(db, "invites", code));
      return inviteDoc.exists() && !inviteDoc.data().used;
    } catch (error) {
      console.error("Error verifying admin code:", error);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRoles(null);
      setActiveRole(null);
      // We don't necessarily clear sessionStorage immediately as they might want roles back if they re-login in same tab
      // But for security, clearing active role key is safer
      if (user) {
        sessionStorage.removeItem(`activeRole_${user.uid}`);
      }
      setKytStatus('pending'); // Reset KYC status to prevent stale state
      setKytData(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRoles,
      activeRole,
      loading,
      loginWithGoogle,
      loginWithEmail,
      signupWithGoogle,
      signupWithEmail,
      signupWithPhone,
      verifyPhoneOTP,
      completeProfile,
      switchRole,
      addRole,
      checkExistingAccount,
      isEmailRegistered,
      verifyAdminCode,
      updateKYTData,
      kytStatus,
      kytData,
      resetPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
