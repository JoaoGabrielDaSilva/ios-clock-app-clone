import { NavigationContainer } from "@react-navigation/native";
import { MainStackNavigator } from "./main-stack-navigator";

export const Routes = () => {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
};
