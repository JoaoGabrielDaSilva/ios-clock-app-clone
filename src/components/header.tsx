import { BlurView } from "expo-blur";
import {
  Box,
  HStack,
  IStackProps,
  Icon,
  IconButton,
  Text,
  useToken,
} from "native-base";
import { TouchableOpacity } from "react-native";
import Constants from "expo-constants";

import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  interpolateColors,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";

export type HeaderProps = IStackProps & {
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  title?: string;
  withTopOffset?: boolean;
  scrollOffset?: SharedValue<number>;
  blur?: boolean;
};

const HEADER_HEIGHT = 50;

export const HEADER_HEIGHT_WITH_OFFSET =
  HEADER_HEIGHT + Constants.statusBarHeight;
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const AnimatedHStack = Animated.createAnimatedComponent(HStack);

export const Header = ({
  rightComponent,
  leftComponent,
  scrollOffset,
  withTopOffset,
  title,
  blur,
  ...props
}: HeaderProps) => {
  const animatedTitleStyles = useAnimatedStyle(() => {
    return {
      opacity:
        scrollOffset !== undefined
          ? interpolate(
              scrollOffset.value,
              [0, HEADER_HEIGHT, HEADER_HEIGHT + 10],
              [0, 0, 1]
            )
          : 1,
    };
  });
  const animatedBackground = useAnimatedStyle(() => {
    return {
      backgroundColor:
        scrollOffset !== undefined
          ? interpolateColor(
              scrollOffset.value,
              [0, HEADER_HEIGHT, HEADER_HEIGHT + 10],
              ["black", "black", "transparent"]
            )
          : 1,
    };
  });

  const blurViewProps = useAnimatedProps(() => ({
    insensity:
      blur && scrollOffset?.value !== undefined
        ? interpolate(
            scrollOffset.value,
            [0, HEADER_HEIGHT, HEADER_HEIGHT + 10],
            [0, 0, 100]
          )
        : 0,
  }));

  return (
    <AnimatedBlurView
      intensity={!blur ? 0 : blurViewProps.insensity}
      style={{
        height: withTopOffset ? HEADER_HEIGHT_WITH_OFFSET : HEADER_HEIGHT,
        position: blur ? "absolute" : "relative",
        width: "100%",
        zIndex: 2,
      }}
      tint="dark"
    >
      <AnimatedHStack
        flex="1"
        pt={withTopOffset ? `${Constants.statusBarHeight}px` : "0"}
        alignItems="center"
        justifyContent="center"
        style={animatedBackground}
        {...props}
      >
        <Box flex="1" pl="4">
          {leftComponent}
        </Box>
        <Animated.View style={animatedTitleStyles}>
          <Text color="white" fontSize="md" bold>
            {title}
          </Text>
        </Animated.View>
        <Box flex="1" alignItems="flex-end" pr="4">
          {rightComponent}
        </Box>
      </AnimatedHStack>
    </AnimatedBlurView>
  );
};
