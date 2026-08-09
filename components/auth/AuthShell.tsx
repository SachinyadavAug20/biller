import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BrandHeader from "./BrandHeader";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerLeft?: ReactNode;
}

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
  headerLeft,
}: AuthShellProps) => {
  return (
    <SafeAreaView className="auth-safe-area" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {headerLeft ? <View className="mb-4">{headerLeft}</View> : null}
          <BrandHeader />
          <Text className="auth-title text-center">{title}</Text>
          {subtitle ? (
            <Text className="auth-subtitle">{subtitle}</Text>
          ) : null}
          <View className="auth-card">
            <View className="auth-form">{children}</View>
          </View>
          {footer ? <View>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthShell;
