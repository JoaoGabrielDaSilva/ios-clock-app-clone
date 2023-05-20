import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabBar } from "../components";
import { Alarms } from "../pages";

export type BottomTabsParamList = {
  Alarms: undefined;
};

const Tabs = createBottomTabNavigator<BottomTabsParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={TabBar}
    >
      <Tabs.Screen
        name="Alarms"
        component={Alarms}
        options={{
          title: "Alarme",
        }}
      />
    </Tabs.Navigator>
  );
};
