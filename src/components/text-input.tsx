import { Ionicons } from "@expo/vector-icons";
import { Box, IInputProps, IStackProps, Icon, IconButton } from "native-base";
import { HStack, Input, Text } from "native-base";
import { Control, Controller } from "react-hook-form";

export type TextInputProps = IStackProps & {
  label: string;
  inputProps?: IInputProps;
  name: string;
  control: Control<any, any>;
  borderBottom?: boolean;
};

export const TextInput = ({
  label,
  inputProps,
  name,
  control,
  borderBottom,
  ...props
}: TextInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, value, onChange } }) => (
        <Box px="4">
          <HStack
            py="2"
            alignItems="center"
            borderColor="gray.700"
            borderBottomWidth={borderBottom ? "1" : "0"}
          >
            <Text color="white" fontSize="md">
              {label}
            </Text>
            <HStack flex="1" alignItems="center" {...props}>
              <Input
                ref={ref}
                value={value}
                color="white"
                {...inputProps}
                flex="1"
                px="2"
                borderWidth="0"
                fontSize="md"
                textAlign="right"
                _focus={{
                  bg: "transparent",
                }}
                _input={{
                  selectionColor: "#ffa201",
                }}
                onChangeText={onChange}
              />
              <IconButton
                variant="unstyled"
                p="0"
                onPress={() => onChange("")}
                icon={
                  <Icon
                    as={<Ionicons name="close-circle" />}
                    color="gray.700"
                  />
                }
              />
            </HStack>
          </HStack>
        </Box>
      )}
    />
  );
};
