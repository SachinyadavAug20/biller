import { Text, View } from "react-native";

const AuthDivider = ({ label = "or continue with" }: { label?: string }) => {
  return (
    <View className="auth-divider-row">
      <View className="auth-divider-line" />
      <Text className="auth-divider-text">{label}</Text>
      <View className="auth-divider-line" />
    </View>
  );
};

export default AuthDivider;
