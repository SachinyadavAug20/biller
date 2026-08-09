import { useAuth, useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import AuthBackButton from "@/components/auth/AuthBackButton";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthField from "@/components/auth/AuthField";
import AuthShell from "@/components/auth/AuthShell";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
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

type Step = "details" | "code";

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isLoaded } = useAuth();
  const { secondsLeft, start: startResend } = useCountdown(30);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("details");
  const [localErrors, setLocalErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    code?: string;
  }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const isSubmitting = fetchStatus === "fetching";

  const fieldError = {
    email: localErrors.email ?? errors.fields.emailAddress?.message ?? undefined,
    password: localErrors.password ?? errors.fields.password?.message ?? undefined,
    confirmPassword: localErrors.confirmPassword,
    code: localErrors.code ?? errors.fields.code?.message ?? undefined,
  };

  const bannerMessage =
    globalError ??
    errors.global?.[0]?.longMessage ??
    errors.global?.[0]?.message ??
    undefined;

  const handleSignUp = async () => {
    setGlobalError(null);
    const nextErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    const emailError = validateEmail(emailAddress);
    if (emailError) nextErrors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) nextErrors.password = passwordError;
    else if (getPasswordStrength(password) < 2)
      nextErrors.password = "Make your password stronger.";
    if (confirmPassword !== password)
      nextErrors.confirmPassword = "Passwords don't match.";
    setLocalErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });
    if (error) return;

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) return;

    setStep("code");
    setCode("");
    startResend();
  };

  const handleVerify = async () => {
    setGlobalError(null);
    const codeError = validateCode(code);
    if (codeError) {
      setLocalErrors({ code: codeError });
      return;
    }
    setLocalErrors({});

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;

    if (signUp.status === "complete") {
      await signUp.finalize();
    }
  };

  const handleResend = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) return;
    startResend();
  };

  const goBackToDetails = async () => {
    setCode("");
    setStep("details");
  };

  if (!isLoaded || !signUp) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#081126" />
      </View>
    );
  }

  if (step === "code") {
    return (
      <AuthShell
        headerLeft={<AuthBackButton onPress={goBackToDetails} />}
        title="Verify your email"
        subtitle={`Enter the 6-digit code we sent to ${emailAddress.trim()}.`}
        footer={
          <View className="auth-link-row">
            <Text className="auth-link-copy">Already have an account?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable hitSlop={8}>
                <Text className="auth-link">Sign in</Text>
              </Pressable>
            </Link>
          </View>
        }
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
          label="Create my account"
          onPress={handleVerify}
          loading={isSubmitting}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your subscriptions in under a minute."
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account?</Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable hitSlop={8}>
              <Text className="auth-link">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      }
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
        returnKeyType="next"
        placeholder="you@example.com"
        disabled={isSubmitting}
      />
      <View className="gap-2">
        <AuthField
          label="Password"
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
          placeholder="Create a password"
          disabled={isSubmitting}
        />
        {password ? <PasswordStrength password={password} /> : null}
      </View>
      <AuthField
        label="Confirm password"
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
        placeholder="Repeat your password"
        disabled={isSubmitting}
      />
      <AuthButton
        label="Create account"
        onPress={handleSignUp}
        loading={isSubmitting}
      />
      <AuthDivider label="or continue with" />
      <GoogleSignInButton />
      <View nativeID="clerk-captcha" />
    </AuthShell>
  );
};

export default SignUp;
