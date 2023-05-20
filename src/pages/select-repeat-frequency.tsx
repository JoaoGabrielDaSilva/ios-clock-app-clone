import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "../routes/main-stack-navigator";
import { Box, ScrollView, Text } from "native-base";
import {
  SelectableOption,
  SelectableOptionModel,
} from "../components/selectable-option";
import { Header } from "../components/header";
import { DeviceEventEmitter, TouchableOpacity } from "react-native";
import { useState } from "react";

type PageProps = StackScreenProps<MainStackParamList, "SelectRepeatFrequency">;

const options: SelectableOptionModel<number>[] = [
  {
    label: "Toda Segunda-Feira",
    value: 2,
  },
  {
    label: "Toda Terça-Feira",
    value: 3,
  },
  {
    label: "Toda Quarta-Feira",
    value: 4,
  },
  {
    label: "Toda Quinta-Feira",
    value: 5,
  },
  {
    label: "Toda Sexta-Feira",
    value: 6,
  },
  {
    label: "Todo Sábado",
    value: 7,
  },
  {
    label: "Todo Domingo",
    value: 1,
  },
];

export const SelectRepeatFrequency = ({
  route: {
    params: { fieldValue },
  },
  navigation: { goBack },
}: PageProps) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    fieldValue || []
  );

  const handleGoBack = () => {
    DeviceEventEmitter.emit(
      "repeatFrequency-select-input",
      selectedOptions.sort()
    );
    goBack();
  };

  const handleToggleOption = (value: number) => {
    setSelectedOptions((options) => {
      if (options.includes(value)) {
        return options.filter((item) => item !== value);
      }
      return [...options, value];
    });
  };

  return (
    <Box flex="1" bg="backgroundSecondary">
      <Header
        title="Adicionar Alarme"
        bg="transparent"
        leftComponent={
          <TouchableOpacity onPress={handleGoBack}>
            <Text fontSize="md" color="emphasis">
              Voltar
            </Text>
          </TouchableOpacity>
        }
      />
      <ScrollView padding="4" showsVerticalScrollIndicator={false}>
        <Box bg="backgroundTertiary" rounded="md">
          {options.map((item, index) => (
            <SelectableOption
              key={item.value}
              {...item}
              onPress={handleToggleOption}
              borderBottom={index !== options.length - 1}
              isSelected={selectedOptions.includes(item.value)}
            />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
};
