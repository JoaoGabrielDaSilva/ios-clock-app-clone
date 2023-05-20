import {
  Box,
  Circle,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  ScrollView,
  Text,
  useToken,
} from "native-base";
import { AlarmModel } from "../models/alarm-model";
import { Alarm, AlarmProps } from "../components/alarm";
import { memo, useEffect, useState } from "react";
import { HEADER_HEIGHT_WITH_OFFSET, Header } from "../components/header";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { BOTTOM_TAB_HEIGHT } from "../components";
import { LayoutAnimation, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabsParamList } from "../routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../routes/main-stack-navigator";
import { useAlarms } from "../store/alarms-store";
import * as Notifications from "expo-notifications";
import { addSeconds } from "date-fns";
import { Alert } from "react-native";

type PageProps = StackScreenProps<BottomTabsParamList, "Alarms">;

export const Alarms = (props: PageProps) => {
  const { alarms, toggleAlarmState, removeAlarm } = useAlarms((state) => ({
    alarms: state.alarms,
    toggleAlarmState: state.toggleAlarmState,
    removeAlarm: state.removeAlarm,
  }));

  const [isOnEditMode, setIsOnEditMode] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const { navigate } = useNavigation<NavigationProp<MainStackParamList>>();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const toggleEditMode = () => {
    LayoutAnimation.easeInEaseOut();
    setIsOnEditMode((prevState) => !prevState);
  };

  const handleRemoveAlarm = async (id: string) => {
    LayoutAnimation.easeInEaseOut();
    const shouldExitEditMode = alarms.length === 1;
    await removeAlarm(id);
    if (shouldExitEditMode) {
      setIsOnEditMode(false);
      setShowDeleteIcon(false);
    }
  };

  return (
    <Box flex="1" bg="black">
      <Animated.FlatList
        nestedScrollEnabled
        data={alarms}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT_WITH_OFFSET,
          paddingBottom: BOTTOM_TAB_HEIGHT,
        }}
        ListHeaderComponent={
          <Box px="4">
            <Heading color="white" fontSize="4xl">
              Alarme
            </Heading>
            {alarms.length ? (
              <Text mb="4" bold color="white" fontSize="xl">
                Outros
              </Text>
            ) : null}
          </Box>
        }
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <MemoizedAlarm
            {...item}
            isOnEditMode={isOnEditMode}
            onChange={toggleAlarmState}
            onDelete={handleRemoveAlarm}
            onSwipeStart={() => setIsOnEditMode(true)}
            showLeftIcon={showDeleteIcon}
            onSwipeEnd={(translateX) => {
              if (translateX <= -80) {
                setIsOnEditMode(false);
              }
            }}
            borderBottom
            borderTop={!index}
          />
        )}
      />
      <Header
        title="Alarme"
        withTopOffset
        blur
        scrollOffset={scrollY}
        leftComponent={
          alarms.length ? (
            <TouchableOpacity
              onPress={() => {
                toggleEditMode();
                setShowDeleteIcon((prevState) => !prevState);
              }}
            >
              <Text fontSize="md" color="emphasis">
                {!isOnEditMode ? "Editar" : "OK"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
        pr="0"
        rightComponent={
          <Box p="2" alignSelf="flex-end">
            <TouchableOpacity onPress={() => navigate("CreateAlarm")}>
              <Icon as={<Ionicons name="add" />} color="emphasis" size="2xl" />
            </TouchableOpacity>
          </Box>
        }
      />
    </Box>
  );
};

type MemoizedAlarmProps = AlarmProps & {
  isOnEditMode: boolean;
};

const MemoizedAlarm = memo(
  ({ isOnEditMode, ...props }: MemoizedAlarmProps) => {
    return <Alarm {...props} flex="1" />;
  },
  (prevProps, nextProps) =>
    prevProps.date === nextProps.date &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.isOnEditMode === nextProps.isOnEditMode
);
