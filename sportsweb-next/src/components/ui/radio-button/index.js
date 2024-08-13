import { useRadio } from "@chakra-ui/react";
import Button from "../button";

const RadioButton = (props) => {
  const { children, ...radioProps } = props;
  const { state, getInputProps, getCheckboxProps, getLabelProps } =
    useRadio(radioProps);

  return (
    <Button
      size="sm"
      variant={state.isChecked ? "solid" : "outline"}
      as="label"
      cursor="pointer"
      {...getCheckboxProps()}
      {...getLabelProps()}
    >
      {children}
      <input {...getInputProps()} />
    </Button>
  );
};

export default RadioButton;
