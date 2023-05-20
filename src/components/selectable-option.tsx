import { Ionicons } from "@expo/vector-icons";
import { HStack, IStackProps, Icon, Pressable, Text } from "native-base";
import { TouchableOpacity } from "react-native";

export type SelectableOptionModel<T> = {
  label: string;
  value: T;
};

type SelectableOptionProps<T> = IStackProps &
  SelectableOptionModel<T> & {
    isSelected?: boolean;
    onPress: (value: T) => void;
    borderBottom?: boolean;
  };

export const SelectableOption = <T,>({
  label,
  value,
  onPress,
  borderBottom,
  isSelected,
  ...props
}: SelectableOptionProps<T>) => {
  return (
    <Pressable
      _pressed={{ opacity: 0.7 }}
      onPress={() => onPress(value)}
      px="4"
    >
      <HStack
        py="4"
        bg="backgroundTertiary"
        rounded="md"
        alignItems="center"
        justifyContent="space-between"
        borderColor="gray.700"
        borderBottomWidth={borderBottom ? "1" : 0}
        {...props}
      >
        <Text color="white">{label}</Text>
        {isSelected ? (
          <Icon
            as={<Ionicons name="checkmark-sharp" />}
            color="emphasis"
            size="md"
          />
        ) : null}
      </HStack>
    </Pressable>
  );
};
