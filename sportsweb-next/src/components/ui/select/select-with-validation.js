import { FormControl, Select, FormErrorMessage } from "@chakra-ui/react";
import { useField } from "formik";
import CustomFormLabel from "../form/form-label";

const SelectWithValidation = ({ label, labelProps, validate, ...props }) => {
  const [field, meta] = useField({ validate, ...props });

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      {label && <CustomFormLabel {...labelProps}>{label}</CustomFormLabel>}
      <Select fontSize="sm" borderColor="gray.300" {...field} {...props} />
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default SelectWithValidation;
