import clsx from "clsx";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface OtpFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  resendSecondsLeft: number;
  resending?: boolean;
  onResend: () => void;
  length?: number;
}

const OtpField = ({
  value,
  onChangeText,
  error,
  resendSecondsLeft,
  resending,
  onResend,
  length = 6,
}: OtpFieldProps) => {
  const canResend = resendSecondsLeft === 0 && !resending;
  return (
    <View className="auth-field">
      <TextInput
        className={clsx("auth-otp", error && "auth-input-error")}
        value={value}
        onChangeText={(text) =>
          onChangeText(text.replace(/\D/g, "").slice(0, length))
        }
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        textContentType="oneTimeCode"
        accessibilityLabel="Verification code"
        placeholder="000000"
        placeholderTextColor="rgba(0, 0, 0, 0.35)"
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="auth-helper">{"Didn't get it?"}</Text>
        <Pressable
          onPress={onResend}
          disabled={!canResend}
          hitSlop={8}
          accessibilityRole="button"
        >
          {resending ? (
            <ActivityIndicator size="small" color="#e53935" />
          ) : (
            <Text className={clsx("auth-link", !canResend && "opacity-40")}>
              {resendSecondsLeft > 0
                ? `Resend in ${resendSecondsLeft}s`
                : "Resend code"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default OtpField;
