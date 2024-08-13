import React from "react";
import NumberFormat from "react-number-format";

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;
  return (
    <NumberFormat
      {...other}
      name={name}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
            name: name,
          },
        });
      }}
      isNumericString
    />
  );
}

export default NumberFormatCustom;
