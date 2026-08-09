import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

interface AuthBackButtonProps {
  onPress: () => void;
  label?: string;
}

const AuthBackButton = ({ onPress, label = "Go back" }: AuthBackButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="auth-back"
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name="arrow-back" size={22} color="#081126" />
    </Pressable>
  );
};

export default AuthBackButton;
