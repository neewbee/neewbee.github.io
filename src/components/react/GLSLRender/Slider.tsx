import * as React from "react";

export function Slider(p: {
  onChange: (value: string) => void;
  value: string;
}) {
  const { onChange, value } = p;

  return (
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    ></input>
  );
}
