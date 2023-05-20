import { extendTheme } from "native-base";

export const theme = extendTheme({
  colors: {
    emphasis: "#ffa201",
    backgroundPrimary: "black",
    backgroundSecondary: "#1c1c1e",
    backgroundTertiary: "#2c2c2e",
  },
});

type CustomThemeType = typeof theme;

declare module "native-base" {
  interface ICustomTheme extends CustomThemeType {}
}
