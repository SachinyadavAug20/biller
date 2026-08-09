import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { ReactNode, RefObject, useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface AuthFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: () => void;
  inputRef?: RefObject<TextInput | null>;
  placeholder?: string;
  labelRight?: ReactNode;
  hint?: string;
  disabled?: boolean;
}

const AuthField = ({
  label,
  value,
  onChangeText,
  error,
  secure = false,
  keyboardType = "default",
  autoComplete,
  textContentType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
  inputRef,
  placeholder,
  labelRight,
  hint,
  disabled,
}: AuthFieldProps) => {
  const [hidden, setHidden] = useState(secure);

  return (
    <View className="auth-field">
      <View className="flex-row items-center justify-between">
        <Text className="auth-label">{label}</Text>
        {labelRight}
      </View>
      <View>
        <TextInput
          ref={inputRef}
          className={clsx(
            "auth-input",
            secure && "pr-12",
            error && "auth-input-error",
          )}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure ? hidden : false}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          textContentType={textContentType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="rgba(0, 0, 0, 0.35)"
          editable={!disabled}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden((current) => !current)}
            className="absolute inset-y-0 right-4 items-center justify-center"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="rgba(0, 0, 0, 0.5)"
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="auth-error">{error}</Text> : null}
      {hint ? <Text className="auth-helper">{hint}</Text> : null}
    </View>
  );
};

export default AuthField;
