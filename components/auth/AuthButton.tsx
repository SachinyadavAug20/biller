import clsx from "clsx";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const AuthButton = ({ label, onPress, loading, disabled }: AuthButtonProps) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={clsx("auth-button", isDisabled && "auth-button-disabled")}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#081126" />
      ) : (
        <Text className="auth-button-text">{label}</Text>
      )}
    </Pressable>
  );
};

export default AuthButton;
