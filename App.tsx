import { StatusBar } from "expo-status-bar";
import { Box, NativeBaseProvider } from "native-base";
import { theme } from "./src/themes/theme";
import { Routes } from "./src/routes";

import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeBaseProvider theme={theme}>
          <Box flex="1" bg="black">
            <Routes />
          </Box>
        </NativeBaseProvider>
      </GestureHandlerRootView>
    </>
  );
}
