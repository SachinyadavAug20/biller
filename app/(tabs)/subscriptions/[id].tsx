import { Link, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const subscriptionsDetails = () => {
  const {id}=useLocalSearchParams<{id:string}>();
  return (
    <View>
      <Text>subscriptionsDetails of {id}</Text>
      <Link href="/">Go Back</Link>
    </View>
  );
};

export default subscriptionsDetails;
