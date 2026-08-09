import clsx from "clsx";
import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface AuthSecondaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

const AuthSecondaryButton = ({
  label,
  onPress,
  loading,
  disabled,
  icon,
}: AuthSecondaryButtonProps) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={clsx(
        "auth-secondary-button",
        isDisabled && "opacity-60",
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#e53935" />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon}
          <Text className="auth-secondary-button-text">{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default AuthSecondaryButton;
