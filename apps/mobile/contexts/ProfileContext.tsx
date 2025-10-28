import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import type { ProfileDto, ProfileResponse } from "@ai-recipes/shared";
import * as profileAPI from "@/api/profile";

interface ProfileContextType {
  profile: ProfileResponse | null;
  loading: boolean;
  error: string | null;
  createProfile: (data: ProfileDto) => Promise<void>;
  updateProfile: (data: Partial<ProfileDto>) => Promise<void>;
  deleteProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    console.log("[Profile] Loading profile...");
    try {
      setLoading(true);
      setError(null);

      const data = await profileAPI.getProfile();
      console.log("[Profile] Profile loaded successfully");
      setProfile(data);
    } catch (err: any) {
      // Profile not found is expected for first-time users
      if (err.message === "Profile does not exist") {
        setProfile(null);
      } else {
        console.error("[Profile] Failed to load profile:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: ProfileDto) => {
    console.log("[Profile] Creating new profile...");
    try {
      setLoading(true);
      setError(null);

      const newProfile = await profileAPI.createProfile(data);
      console.log("[Profile] Profile created successfully");
      setProfile(newProfile);
    } catch (err: any) {
      console.error("[Profile] Failed to create profile:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileDto>) => {
    console.log("[Profile] Updating profile...");
    try {
      setLoading(true);
      setError(null);

      const updatedProfile = await profileAPI.updateProfile(data);
      console.log("[Profile] Profile updated successfully");
      setProfile(updatedProfile);
    } catch (err: any) {
      console.error("[Profile] Failed to update profile:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    console.log("[Profile] Deleting profile...");
    try {
      setLoading(true);
      setError(null);

      await profileAPI.deleteProfile();
      console.log("[Profile] Profile deleted successfully");
      setProfile(null);
    } catch (err: any) {
      console.error("[Profile] Failed to delete profile:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      createProfile,
      updateProfile,
      deleteProfile,
      refreshProfile,
    }),
    [profile, loading, error],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

// Custom hook
export function useProfile() {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}
