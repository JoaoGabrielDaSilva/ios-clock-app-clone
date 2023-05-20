import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Box, Icon, Text, VStack, useToken } from "native-base";

export const BOTTOM_TAB_HEIGHT = 90;

export const TabBar = ({ state, descriptors, ...props }: BottomTabBarProps) => {
  const { routes, index } = state;

  return (
    <Box
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      height={`${BOTTOM_TAB_HEIGHT}px`}
    >
      <BlurView
        style={{
          width: "100%",
          height: "100%",
          paddingTop: 4,
          paddingBottom: 20,
        }}
        tint="dark"
        intensity={100}
      >
        {routes.map((route, tabIndex) => {
          const descriptor = descriptors[route.key];
          const options = descriptor.options;

          const isFocused = tabIndex === index;

          return (
            <VStack alignItems="center" key={tabIndex}>
              <Icon
                key={route.key}
                as={<Ionicons name="ios-alarm-sharp" />}
                size="xl"
                color={isFocused ? "emphasis" : "gray.500"}
              />
              <Text
                fontWeight="semibold"
                fontSize="xs"
                color={isFocused ? "emphasis" : "gray.500"}
              >
                {options.title}
              </Text>
            </VStack>
          );
        })}
      </BlurView>
    </Box>
  );
};
