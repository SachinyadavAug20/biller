import "@/global.css";

import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { SafeAreaView } from "react-native-safe-area-context";
import { publishableKey } from "@/lib/clerk";
import logo from "@/assets/icons/logo.png";

function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <View className="items-center gap-4">
        <View className="size-16 items-center justify-center rounded-2xl bg-accent">
          <Image source={logo} className="size-10" resizeMode="contain" />
        </View>
        <Text className="font-sans-bold text-lg text-primary">Biller</Text>
        <ActivityIndicator size="small" color="#081126" />
      </View>
    </SafeAreaView>
  );
}

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  );
}
