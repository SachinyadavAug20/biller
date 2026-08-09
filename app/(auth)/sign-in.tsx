import { useAuth, useSignIn } from "@clerk/expo";
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
import { validateCode, validateEmail, validatePassword } from "@/lib/auth-validation";
import { useCountdown } from "@/lib/use-countdown";

type Step = "credentials" | "code";

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isLoaded } = useAuth();
  const { secondsLeft, start: startResend } = useCountdown(30);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("credentials");
  const [localErrors, setLocalErrors] = useState<{
    email?: string;
    password?: string;
    code?: string;
  }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const isSubmitting = fetchStatus === "fetching";

  const fieldError = {
    email: localErrors.email ?? errors.fields.identifier?.message ?? undefined,
    password: localErrors.password ?? errors.fields.password?.message ?? undefined,
    code: localErrors.code ?? errors.fields.code?.message ?? undefined,
  };

  const bannerMessage =
    globalError ??
    errors.global?.[0]?.longMessage ??
    errors.global?.[0]?.message ??
    undefined;

  const handleSignIn = async () => {
    setGlobalError(null);
    const nextErrors: { email?: string; password?: string } = {};
    const emailError = validateEmail(emailAddress);
    if (emailError) nextErrors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) nextErrors.password = passwordError;
    setLocalErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize();
      return;
    }

    if (signIn.status === "needs_client_trust") {
      await signIn.mfa.sendEmailCode();
      setStep("code");
      setCode("");
      startResend();
      return;
    }

    if (signIn.status === "needs_second_factor") {
      const emailCodeFactor = signIn.supportedSecondFactors?.some(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        setStep("code");
        setCode("");
        startResend();
        return;
      }
    }

    setGlobalError("We couldn't finish the sign-in. Please try again.");
  };

  const handleVerifyCode = async () => {
    setGlobalError(null);
    const codeError = validateCode(code);
    if (codeError) {
      setLocalErrors({ code: codeError });
      return;
    }
    setLocalErrors({});

    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize();
    }
  };

  const handleResend = async () => {
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) return;
    startResend();
  };

  const goBackToCredentials = async () => {
    setCode("");
    setStep("credentials");
  };

  if (!isLoaded || !signIn) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#081126" />
      </View>
    );
  }

  if (step === "code") {
    return (
      <AuthShell
        headerLeft={<AuthBackButton onPress={goBackToCredentials} />}
        title="Check your inbox"
        subtitle={`Enter the 6-digit code we sent to ${emailAddress.trim()}.`}
        footer={
          <View className="auth-link-row">
            <Text className="auth-link-copy">{"Didn't mean to do this?"}</Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable hitSlop={8}>
                <Text className="auth-link">Create an account</Text>
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
          label="Verify & sign in"
          onPress={handleVerifyCode}
          loading={isSubmitting}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep an eye on your subscriptions."
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">New to Biller?</Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable hitSlop={8}>
              <Text className="auth-link">Create an account</Text>
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
        autoComplete="password"
        textContentType="password"
        returnKeyType="done"
        placeholder="Enter your password"
        disabled={isSubmitting}
        labelRight={
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable hitSlop={8}>
              <Text className="auth-link">Forgot password?</Text>
            </Pressable>
          </Link>
        }
      />
      <AuthButton
        label="Sign in"
        onPress={handleSignIn}
        loading={isSubmitting}
      />
      <AuthDivider />
      <GoogleSignInButton />
    </AuthShell>
  );
};

export default SignIn;
