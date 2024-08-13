import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useField } from "formik";
import CustomFormLabel from "../form/form-label";

const TextBoxWithValidation = ({
  label,
  labelProps,
  rightIcon,
  validate,
  ...props
}) => {
  const [field, meta] = useField({ validate, ...props });

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      {label && <CustomFormLabel {...labelProps}>{label}</CustomFormLabel>}
      {rightIcon ? (
        <InputGroup>
          <Input fontSize="sm" borderColor="gray.300" {...field} {...props} />
          <InputRightElement color="gray.400">{rightIcon}</InputRightElement>
        </InputGroup>
      ) : (
        <Input fontSize="sm" borderColor="gray.300" {...field} {...props} />
      )}
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default TextBoxWithValidation;
