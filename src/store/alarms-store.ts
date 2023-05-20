import { create } from "zustand";
import { persist, combine, createJSONStorage } from "zustand/middleware";
import { AlarmModel } from "../models/alarm-model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const initialState = {
  alarms: [] as AlarmModel[],
};

export const useAlarms = create(
  persist(
    combine(initialState, (set, get) => ({
      set,
      addAlarm: (data: AlarmModel) => {
        const alarms = get().alarms;

        const newAlarms = [...alarms, data];

        set({ alarms: newAlarms });
      },
      toggleAlarmState: ({
        id,
        isActive,
      }: {
        id: string;
        isActive: boolean;
      }) => {
        const alarms = get().alarms;

        const newAlarms = alarms.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isActive,
            };
          }
          return item;
        });

        set({ alarms: newAlarms });
      },
      removeAlarm: async (id: string) => {
        const alarms = get().alarms;

        const scheduleCancelPromise = alarms
          .find((item) => item.id === id)
          ?.notificationIds.map((id) =>
            Notifications.cancelScheduledNotificationAsync(id)
          );

        if (scheduleCancelPromise) {
          await Promise.all(scheduleCancelPromise);
        }

        const newAlarms = alarms.filter((item) => item.id !== id);

        set({ alarms: newAlarms });
      },
    })),
    {
      name: "alarms",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
