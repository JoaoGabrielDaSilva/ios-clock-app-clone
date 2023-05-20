import { createStackNavigator } from "@react-navigation/stack";
import { CreateAlarm } from "../pages/create-alarm";
import { BottomTabNavigator } from "./bottom-tab-navigator";
import { SelectRepeatFrequency } from "../pages/select-repeat-frequency";

export type MainStackParamList = {
  Tabs: undefined;
  CreateAlarm: undefined;
  SelectRepeatFrequency: {
    fieldValue: number[];
  };
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="CreateAlarm"
        component={CreateAlarm}
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="SelectRepeatFrequency"
        component={SelectRepeatFrequency}
        initialParams={{
          fieldValue: [],
        }}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};
