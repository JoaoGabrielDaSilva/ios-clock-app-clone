import { memo, useEffect, useMemo, useState } from "react";
import {
  Box,
  HStack,
  IStackProps,
  Icon,
  IconButton,
  Pressable,
  Switch,
  Text,
  VStack,
} from "native-base";
import { AlarmModel } from "../models/alarm-model";
import { format } from "date-fns";
import Animated, {
  Extrapolation,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Alert, Dimensions, Vibration } from "react-native";
import haptics from "../utils/haptics";
import { Ionicons } from "@expo/vector-icons";

export type AlarmProps = AlarmModel &
  IStackProps & {
    borderTop?: boolean;
    borderBottom?: boolean;
    onChange?: (data: { id: string; isActive: boolean }) => void;
    onDelete?: (id: string) => void;
    onSwipeStart: () => void;
    onSwipeEnd: (translateX: number) => void;
    showLeftIcon?: boolean;
  };

const { width } = Dimensions.get("screen");

export const Alarm = ({
  id,
  date,
  isActive,
  tag,
  borderBottom,
  borderTop,
  onChange,
  onSwipeStart,
  onSwipeEnd,
  onDelete,
  showLeftIcon,
  ...props
}: AlarmProps) => {
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true);
  const translateX = useSharedValue(0);
  const hasVibratedFirstTreshold = useSharedValue(false);
  const hasVibratedDeleteTreshold = useSharedValue(false);
  const isAnimatingText = useSharedValue(false);
  const textTranslateX = useSharedValue(0);
  const contextX = useSharedValue(0);

  const shouldHideSwitch = useDerivedValue(() => {
    const shouldHide = translateX.value < -5;

    runOnJS(setIsSwitchEnabled)(!shouldHide);
    return shouldHide;
  });

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const panHandler = Gesture.Pan()
    .onStart(() => {
      if (onSwipeStart) {
        runOnJS(onSwipeStart)();
      }
    })
    .onUpdate((e) => {
      if (isAnimatingText.value || showLeftIcon || e.translationX > 0) return;

      translateX.value = e.translationX + contextX.value;

      if (!hasVibratedFirstTreshold.value && translateX.value < -80) {
        runOnJS(haptics.vibrateLight)();
        hasVibratedFirstTreshold.value = true;
      }
      if (hasVibratedFirstTreshold.value && translateX.value > -80) {
        hasVibratedFirstTreshold.value = false;
      }
      if (
        !showLeftIcon &&
        !hasVibratedDeleteTreshold.value &&
        translateX.value < -width * 0.5
      ) {
        runOnJS(haptics.vibrateLight)();
        isAnimatingText.value = true;
        translateX.value = withTiming(-width * 0.9);
        textTranslateX.value = withTiming(-width * 0.9 + 70, { duration: 200 });
        hasVibratedDeleteTreshold.value = true;
      }

      if (
        !showLeftIcon &&
        hasVibratedDeleteTreshold.value &&
        translateX.value > -width * 0.5
      ) {
        hasVibratedDeleteTreshold.value = false;
        textTranslateX.value = withTiming(0);
      }
    })
    .onEnd((e) => {
      hasVibratedFirstTreshold.value = false;
      contextX.value = translateX.value;

      if (onSwipeEnd) {
        runOnJS(onSwipeEnd)(e.translationX);
      }

      if (translateX.value < -width * 0.8) {
        return runOnJS(handleDelete)();
      }
      if (translateX.value < -80) {
        return (translateX.value = withTiming(-80));
      }

      if (translateX.value > -80) {
        return (translateX.value = withSpring(0, { overshootClamping: true }));
      }
    });

  const animatedValues = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: textTranslateX.value,
      },
    ],
  }));

  const switchAnimatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(shouldHideSwitch.value ? 0 : 1),
  }));

  useEffect(() => {
    if (!showLeftIcon && translateX.value < 0) {
      translateX.value = withTiming(0);
    }
  }, [showLeftIcon]);

  return (
    <HStack flex="1" bg="black">
      <Pressable
        onPress={handleDelete}
        disabled={!onDelete}
        w="full"
        h="full"
        flex="1"
        position="absolute"
        bg="red.500"
        pr="4"
        justifyContent="center"
        alignItems="flex-end"
      >
        <Animated.View style={[{ flex: 1 }, textAnimatedStyle]}>
          <Text color="white" bold>
            Apagar
          </Text>
        </Animated.View>
      </Pressable>
      <Box bg="black" justifyContent="center" pl="4">
        {showLeftIcon ? (
          <IconButton
            p="0"
            _pressed={{
              bg: "transparent",
            }}
            onPress={() => (translateX.value = withTiming(-80))}
            mr="2"
            icon={
              <Icon
                as={<Ionicons name="ios-remove-circle" />}
                color="red.500"
                size="xl"
              />
            }
          />
        ) : null}
      </Box>

      <GestureDetector gesture={panHandler}>
        <Animated.View style={animatedValues}>
          <HStack
            bg="black"
            borderBottomWidth={borderBottom ? "0.5" : "0"}
            borderTopWidth={borderTop ? "0.5" : "0"}
            alignItems="center"
            justifyContent="space-between"
            borderColor="gray.700"
            py="2"
            {...props}
          >
            <VStack space="0">
              <Text color="gray.400" fontSize="6xl" fontWeight="light">
                {format(new Date(date), "HH:mm")}
              </Text>
              <Text color="gray.400">{tag}</Text>
            </VStack>
            <Animated.View style={switchAnimatedStyles}>
              <HStack alignItems="center">
                {showLeftIcon ? (
                  <Icon
                    as={<Ionicons name="chevron-forward" />}
                    size="lg"
                    mr="4"
                  />
                ) : (
                  <Switch
                    mr="4"
                    isDisabled={!isSwitchEnabled}
                    onTrackColor="green.500"
                    onToggle={
                      onChange
                        ? (state) => onChange({ id, isActive: state })
                        : undefined
                    }
                    value={isActive}
                    isChecked={isActive}
                    offTrackColor="gray.800"
                    size="md"
                  />
                )}
              </HStack>
            </Animated.View>
          </HStack>
        </Animated.View>
      </GestureDetector>
    </HStack>
  );
};
