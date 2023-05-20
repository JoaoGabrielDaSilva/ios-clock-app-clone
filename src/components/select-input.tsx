import { Ionicons } from "@expo/vector-icons";
import { Box, IInputProps, IStackProps, Icon, IconButton } from "native-base";
import { HStack, Input, Text } from "native-base";
import { useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { DeviceEventEmitter, TouchableOpacity } from "react-native";

export type SelectInputProps<T = string> = IStackProps & {
  label: string;
  inputProps?: IInputProps;
  name: string;
  formatValueText?: (value: T) => string;
  onPress?: () => void;
  control: Control<any, any>;
  defaultValue?: T;
  borderBottom?: boolean;
};

export const SelectInput = <T,>({
  label,
  inputProps,
  name,
  control,
  onPress,
  borderBottom,
  defaultValue,
  formatValueText,
  ...props
}: SelectInputProps<T>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control, defaultValue });

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "repeatFrequency-select-input",
      (value: string) => {
        onChange(value);
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <Box px="4">
        <HStack
          py="3"
          alignItems="center"
          justifyContent="space-between"
          borderColor="gray.700"
          borderBottomWidth={borderBottom ? "1" : "0"}
        >
          <Text color="white" fontSize="md">
            {label}
          </Text>
          <HStack alignItems="center" {...props}>
            <Text color="white" fontSize="md">
              {formatValueText ? formatValueText(value) : value}
            </Text>
            <Icon as={<Ionicons name="chevron-forward" />} color="gray.400" />
          </HStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};
