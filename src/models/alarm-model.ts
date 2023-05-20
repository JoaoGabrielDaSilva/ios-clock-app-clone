export type AlarmModel = {
  id: string;
  date: Date;
  repeatFrequency: number[];
  notificationIds: string[];
  tag: string;
  shouldDelay: boolean;
  isActive: boolean;
};
