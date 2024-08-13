import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useField } from "formik";

const CheckboxesWithValidation = ({ children, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl as="fieldset" isInvalid={meta.touched && meta.error}>
      {children}
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default CheckboxesWithValidation;
