import {
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  FormErrorMessage,
  InputLeftElement,
} from "@chakra-ui/react";

const TextBoxWithIcon = (props) => {
  const {
    isRequired,
    isInvalid,
    placeholder,
    id,
    name,
    type,
    value,
    onChange,
    formErrorMessage,
    rightIcon,
    leftIcon,
  } = props;

  let rightIconElement = "";
  if (rightIcon !== undefined) {
    rightIconElement = (
      <InputRightElement color="gray.400">{rightIcon}</InputRightElement>
    );
  }

  let leftIconElement = "";
  if (leftIcon !== undefined) {
    leftIconElement = (
      <InputLeftElement color="gray.400">{leftIcon}</InputLeftElement>
    );
  }

  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      <InputGroup>
        {leftIconElement}
        <Input
          placeholder={placeholder}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          isInvalid={isInvalid}
        />

        {rightIconElement}
      </InputGroup>

      <FormErrorMessage>{formErrorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default TextBoxWithIcon;
