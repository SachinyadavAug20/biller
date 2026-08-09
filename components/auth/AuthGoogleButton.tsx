import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface AuthGoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
  label?: string;
}

const AuthGoogleButton = ({
  onPress,
  loading,
  label = "Continue with Google",
}: AuthGoogleButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      className="auth-secondary-button"
    >
      {loading ? (
        <ActivityIndicator size="small" color="#e53935" />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
          <Text className="auth-secondary-button-text">{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default AuthGoogleButton;
