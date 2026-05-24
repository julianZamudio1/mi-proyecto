import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return null;
}