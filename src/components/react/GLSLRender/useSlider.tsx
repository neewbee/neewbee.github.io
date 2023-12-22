import * as React from "react";

export function useSlider(p: {
  onChange: (value: string) => void;
}): [string, React.ReactElement] {
  const { onChange } = p;
  const [value, setValue] = React.useState("0");

  const component = (
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      onChange={(e) => {
        setValue(e.target.value);
        console.log("onChange");
        onChange(e.target.value);
      }}
    ></input>
  );

  return [value, component];
}
