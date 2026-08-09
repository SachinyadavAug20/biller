import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const InlineErrorBanner = ({ message }: { message?: string | null }) => {
  if (!message) return null;
  return (
    <View className="auth-error-banner">
      <Ionicons name="alert-circle" size={18} color="#dc2626" />
      <Text className="auth-error-banner-text">{message}</Text>
    </View>
  );
};

export default InlineErrorBanner;
