import { useEffect } from "react";
import { useRouter } from "expo-router";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useProfile } from "@/contexts/ProfileContext";

export default function Index() {
  const router = useRouter();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (!loading) {
      if (profile) {
        router.replace("/(main)/search");
      } else {
        router.replace("/(onboarding)/welcome");
      }
    }
  }, [profile, loading, router]);

  return <LoadingScreen />;
}
