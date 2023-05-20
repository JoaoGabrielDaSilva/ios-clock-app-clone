import { Box, IBoxProps, IStackProps, Switch } from "native-base";
import { HStack, Text } from "native-base";
import { Control, Controller } from "react-hook-form";

export type SwitchInputProps = IBoxProps & {
  label: string;
  name: string;
  control: Control<any, any>;
  borderBottom?: boolean;
  defaultValue?: boolean;
};

export const SwitchInput = ({
  label,
  name,
  borderBottom,
  control,
  defaultValue,
  ...props
}: SwitchInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { ref, value, onChange } }) => (
        <Box px="4" {...props}>
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
            <Switch
              onTrackColor="green.500"
              onToggle={(value) => onChange(value)}
              value={value}
              isChecked={value}
              offTrackColor="gray.800"
              size="md"
            />
          </HStack>
        </Box>
      )}
    />
  );
};
