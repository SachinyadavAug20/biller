import { Text, View } from "react-native";
import { getPasswordStrength } from "@/lib/auth-validation";

const LEVELS = [
  { label: "Weak", color: "#dc2626" },
  { label: "Fair", color: "#f59e0b" },
  { label: "Good", color: "#84cc16" },
  { label: "Strong", color: "#16a34a" },
] as const;

const PasswordStrength = ({ password }: { password: string }) => {
  const level = getPasswordStrength(password);
  if (level === 0) return null;
  const active = LEVELS[level - 1];
  return (
    <View className="gap-1">
      <View className="auth-strength-track">
        {LEVELS.map((item, index) => (
          <View
            key={item.label}
            className="auth-strength-segment"
            style={index < level ? { backgroundColor: active.color } : undefined}
          />
        ))}
      </View>
      <Text className="text-xs font-sans-semibold" style={{ color: active.color }}>
        {active.label} password
      </Text>
    </View>
  );
};

export default PasswordStrength;
