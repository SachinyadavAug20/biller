import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Text, View } from "react-native";
import AuthSecondaryButton from "./AuthSecondaryButton";

const GoogleSignInButton = () => {
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { createdSessionId, setActive, authSessionResult } =
        await startSSOFlow({ strategy: "oauth_google" });

      if (authSessionResult?.type === "cancel") return;

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        setError(
          "Google sign-in didn't finish. Please try again or use your email.",
        );
      }
    } catch {
      setError("Google sign-in is unavailable right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="gap-2">
      <AuthSecondaryButton
        label="Continue with Google"
        onPress={handleGoogle}
        loading={loading}
        icon={<MaterialCommunityIcons name="google" size={20} color="#4285F4" />}
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
};

export default GoogleSignInButton;
