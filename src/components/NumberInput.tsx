import React from "react";

const NumberInput = ({
  value,
  setValue,
  ...props
}: {
  value: string | number | readonly string[];
  setValue: (value: number) => void;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <input
      value={value}
      onChange={(e) => {
        const val = parseInt(e.target.value.replace(/\D/g, ""));

        if (!isNaN(val)) {
          setValue(val);
        } else {
          setValue(0);
        }
      }}
      {...props}
    />
  );
};

export default NumberInput;
