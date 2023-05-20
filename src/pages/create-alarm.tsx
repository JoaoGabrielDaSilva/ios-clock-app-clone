import { StackScreenProps } from "@react-navigation/stack";
import { Header } from "../components/header";
import { Box, Text } from "native-base";
import { MainStackParamList } from "../routes/main-stack-navigator";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "../components/text-input";
import { TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SwitchInput } from "../components/switch-input";
import { SelectInput } from "../components/select-input";
import { TimePicker } from "../components/time-picker";
import { useAlarms } from "../store/alarms-store";
import { faker } from "@faker-js/faker";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

type PageProps = StackScreenProps<MainStackParamList, "CreateAlarm">;

const schema = z.object({
  date: z.date(),
  tag: z.string().optional(),
  shouldDelay: z.boolean(),
  repeatFrequency: z.array(z.number()),
});

type FormData = z.infer<typeof schema>;

const isWeekDay = (dayIndex: number) => dayIndex >= 2 && dayIndex <= 6;

const DAY_INDEX_TO_WEEKDAY = new Map<number, string>([
  [1, "dom"],
  [2, "seg"],
  [3, "ter"],
  [4, "qua"],
  [5, "qui"],
  [6, "sex"],
  [7, "sab"],
]);

export const CreateAlarm = ({
  navigation: { goBack, navigate },
}: PageProps) => {
  const { control, handleSubmit, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const addAlarm = useAlarms((state) => state.addAlarm);

  const formatValueText = (dayIndexes: number[]) => {
    const hasOnlyWeekDays = dayIndexes.every((dayIndex) => isWeekDay(dayIndex));

    const isFullWeekend =
      !hasOnlyWeekDays && dayIndexes.includes(1) && dayIndexes.includes(7);

    if (!dayIndexes.length) {
      return "Nunca";
    }

    if (dayIndexes.length === 7) {
      return "Todos os dias";
    }

    if (isFullWeekend) {
      return "Finais de semana";
    }

    if (hasOnlyWeekDays && dayIndexes.length === 5) {
      return "Dias da semana";
    }

    return dayIndexes.reduce(
      (sentence, dayIndex) =>
        `${!sentence ? sentence : `${sentence} `}${DAY_INDEX_TO_WEEKDAY.get(
          dayIndex
        )}`,
      ""
    );
  };

  const handleSaveAlarm = async (data: FormData) => {
    const { date } = data;

    const tag = data?.tag || "Alarme";

    const notificationsPromises = data.repeatFrequency.map((day) =>
      Notifications.scheduleNotificationAsync({
        trigger: {
          hour: date.getHours(),
          minute: date.getMinutes(),
          weekday: day,
          repeats: true,
        },

        content: {
          title: "Relógio",
          body: tag,
        },
      })
    );

    const notificationIds = await Promise.all(notificationsPromises);

    addAlarm({
      id: faker.datatype.uuid(),
      ...data,
      notificationIds,
      tag,
      isActive: true,
    });

    goBack();
  };

  return (
    <Box flex="1" bg="backgroundSecondary">
      <Header
        title="Adicionar Alarme"
        bg="transparent"
        leftComponent={
          <TouchableOpacity onPress={goBack}>
            <Text fontSize="md" color="emphasis">
              Cancelar
            </Text>
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity onPress={handleSubmit(handleSaveAlarm)}>
            <Text fontSize="md" color="emphasis">
              Salvar
            </Text>
          </TouchableOpacity>
        }
      />
      <Box my="4">
        <TimePicker name="date" control={control} />
      </Box>
      <Box mx="4" bg="backgroundTertiary" rounded="md">
        <SelectInput<number[]>
          label="Repetir"
          name="repeatFrequency"
          control={control}
          formatValueText={formatValueText}
          defaultValue={[]}
          onPress={() =>
            navigate("SelectRepeatFrequency", {
              fieldValue: getValues("repeatFrequency")!,
            })
          }
          borderBottom
        />
        <TextInput
          label="Etiqueta"
          name="tag"
          control={control}
          inputProps={{ placeholder: "Alarme" }}
          borderBottom
        />
        <SwitchInput
          label="Adiar"
          name="shouldDelay"
          control={control}
          defaultValue={true}
        />
      </Box>
    </Box>
  );
};
