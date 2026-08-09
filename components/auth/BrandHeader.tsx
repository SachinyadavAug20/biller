import { Image, Text, View } from "react-native";
import logo from "@/assets/icons/logo.png";

const BrandHeader = () => {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Image source={logo} className="size-9" resizeMode="contain" />
        </View>
        <View>
          <Text className="auth-wordmark">Biller</Text>
          <Text className="auth-wordmark-sub">Subscriptions, simplified</Text>
        </View>
      </View>
    </View>
  );
};

export default BrandHeader;
