import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, Control } from "react-hook-form";

type TimePickerProps = {
  name: string;
  defaultValue?: Date;
  control: Control<any, any>;
};

export const TimePicker = ({
  name,
  control,
  defaultValue = new Date(),
}: TimePickerProps) => {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { value, onChange } }) => (
        <DateTimePicker
          value={value}
          onChange={(event) => {
            const value = event.nativeEvent?.timestamp;

            if (value) {
              onChange(new Date(value));
            }
          }}
          mode="time"
          display="spinner"
          textColor="white"
        />
      )}
    />
  );
};
