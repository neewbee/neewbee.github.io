import * as React from "react";

type ColorMode = "dark" | "light";

export default function (): [
  ColorMode,
  React.Dispatch<React.SetStateAction<ColorMode>>,
] {
  const [colorMode, setColorMode] = React.useState<ColorMode>("light");
  React.useEffect(() => {
    const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    const onDetectSystemPreferColorSchemeChange = (
      event: MediaQueryListEvent,
    ) => {
      const colorMode = event.matches ? "dark" : "light";
      setColorMode(colorMode);
    };

    setColorMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", onDetectSystemPreferColorSchemeChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", onDetectSystemPreferColorSchemeChange);
    };
  }, []);

  return [colorMode, setColorMode];
}
