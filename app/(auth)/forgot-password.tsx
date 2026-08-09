import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import AuthBackButton from "@/components/auth/AuthBackButton";
import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthShell from "@/components/auth/AuthShell";
import InlineErrorBanner from "@/components/auth/InlineErrorBanner";
import OtpField from "@/components/auth/OtpField";
import PasswordStrength from "@/components/auth/PasswordStrength";
import {
  getPasswordStrength,
  validateCode,
  validateEmail,
  validatePassword,
} from "@/lib/auth-validation";
import { useCountdown } from "@/lib/use-countdown";

type Step = "email" | "code" | "new-password";

const ForgotPassword = () => {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [localErrors, setLocalErrors] = useState<{
    email?: string;
    code?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { secondsLeft, start: startResend } = useCountdown(30);

  const isSubmitting = fetchStatus === "fetching";

  const fieldError = {
    email:
      localErrors.email ??
      errors.fields.identifier?.message ??
      errors.fields.emailAddress?.message ??
      undefined,
    code: localErrors.code ?? errors.fields.code?.message ?? undefined,
    password: localErrors.password ?? errors.fields.password?.message ?? undefined,
    confirmPassword: localErrors.confirmPassword,
  };

  const bannerMessage =
    globalError ??
    errors.global?.[0]?.longMessage ??
    errors.global?.[0]?.message ??
    undefined;

  const handleSendCode = async () => {
    setGlobalError(null);
    const emailError = validateEmail(emailAddress);
    if (emailError) {
      setLocalErrors({ email: emailError });
      return;
    }
    setLocalErrors({});

    const { error } = await signIn.create({ identifier: emailAddress.trim() });
    if (error) return;

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendError) return;

    setCode("");
    setStep("code");
    startResend();
  };

  const handleVerifyCode = async () => {
    setGlobalError(null);
    const codeError = validateCode(code);
    if (codeError) {
      setLocalErrors({ code: codeError });
      return;
    }
    setLocalErrors({});

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (error) return;

    if (signIn.status === "needs_new_password") {
      setStep("new-password");
    }
  };

  const handleResend = async () => {
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) return;
    startResend();
  };

  const handleSubmitPassword = async () => {
    setGlobalError(null);
    const nextErrors: { password?: string; confirmPassword?: string } = {};
    const passwordError = validatePassword(password);
    if (passwordError) nextErrors.password = passwordError;
    else if (getPasswordStrength(password) < 2)
      nextErrors.password = "Make your password stronger.";
    if (confirmPassword !== password)
      nextErrors.confirmPassword = "Passwords don't match.";
    setLocalErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize();
    }
  };

  const headerLeft = (
    <AuthBackButton
      onPress={() =>
        router.canGoBack()
          ? router.back()
          : router.replace("/(auth)/sign-in")
      }
    />
  );

  const footer = (
    <View className="auth-link-row">
      <Text className="auth-link-copy">Remembered it?</Text>
      <Link href="/(auth)/sign-in" asChild>
        <Pressable hitSlop={8}>
          <Text className="auth-link">Back to sign in</Text>
        </Pressable>
      </Link>
    </View>
  );

  if (step === "code") {
    return (
      <AuthShell
        headerLeft={headerLeft}
        title="Enter the code"
        subtitle={`We sent a 6-digit code to ${emailAddress.trim()}.`}
        footer={footer}
      >
        <InlineErrorBanner message={bannerMessage} />
        <OtpField
          value={code}
          onChangeText={setCode}
          error={fieldError.code}
          resendSecondsLeft={secondsLeft}
          resending={isSubmitting}
          onResend={handleResend}
        />
        <AuthButton
          label="Verify code"
          onPress={handleVerifyCode}
          loading={isSubmitting}
        />
      </AuthShell>
    );
  }

  if (step === "new-password") {
    return (
      <AuthShell
        headerLeft={headerLeft}
        title="Set a new password"
        subtitle="Choose a strong password you don't use anywhere else."
        footer={footer}
      >
        <InlineErrorBanner message={bannerMessage} />
        <View className="gap-2">
          <AuthField
            label="New password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setLocalErrors((current) => ({ ...current, password: undefined }));
            }}
            error={fieldError.password}
            secure
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            placeholder="Create a new password"
            disabled={isSubmitting}
          />
          {password ? <PasswordStrength password={password} /> : null}
        </View>
        <AuthField
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
            setLocalErrors((current) => ({
              ...current,
              confirmPassword: undefined,
            }));
          }}
          error={fieldError.confirmPassword}
          secure
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          placeholder="Repeat your new password"
          disabled={isSubmitting}
        />
        <AuthButton
          label="Set new password"
          onPress={handleSubmitPassword}
          loading={isSubmitting}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      headerLeft={headerLeft}
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset code."
      footer={footer}
    >
      <InlineErrorBanner message={bannerMessage} />
      <AuthField
        label="Email"
        value={emailAddress}
        onChangeText={(value) => {
          setEmailAddress(value);
          setLocalErrors((current) => ({ ...current, email: undefined }));
        }}
        error={fieldError.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="done"
        placeholder="you@example.com"
        disabled={isSubmitting}
      />
      <AuthButton
        label="Send reset code"
        onPress={handleSendCode}
        loading={isSubmitting}
      />
    </AuthShell>
  );
};

export default ForgotPassword;
