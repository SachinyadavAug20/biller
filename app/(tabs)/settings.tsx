import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import clsx from "clsx";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
        <Text className="list-title">Settings</Text>
      </View>
      <View className="mt-6 rounded-2xl border border-border bg-card p-4">
        <Pressable
          onPress={handleSignOut}
          disabled={isSigningOut}
          accessibilityRole="button"
          className={clsx("sub-cancel", isSigningOut && "sub-cancel-disabled")}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="#fef9c3" />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="logout" size={20} color="#fef9c3" />
              <Text className="sub-cancel-text">Sign out</Text>
            </View>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
