import * as Haptics from "expo-haptics";

export default {
  vibrateLight: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
};
