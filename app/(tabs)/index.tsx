import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import {styled} from 'nativewind';
const SafeAreaView =styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" asChild>
        <Pressable className="mt-4 rounded bg-primary px-6 py-3">
          <Text className="text-center text-base text-white">
            Go to onboarding
          </Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/sign-in" asChild>
        <Pressable className="mt-4 rounded bg-primary px-6 py-3">
          <Text className="text-center text-base text-white">Sign In</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/sign-up" asChild>
        <Pressable className="mt-4 rounded bg-primary px-6 py-3">
          <Text className="text-center text-base text-white">Sign Up</Text>
        </Pressable>
      </Link>

      <Link href="/subscriptions/spotify" asChild>
        <Pressable className="mt-4 rounded bg-primary px-6 py-3">
          <Text className="text-center text-base text-white">
            Spotify Subscriptions
          </Text>
        </Pressable>
      </Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "spotify" },
        }}
        asChild>
        <Pressable className="mt-4 rounded bg-primary px-6 py-3">
          <Text className="text-center text-base text-white">Sign Up</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
