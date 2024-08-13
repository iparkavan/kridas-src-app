import { FormControl, FormErrorMessage, Textarea } from "@chakra-ui/react";
import { useField } from "formik";
import CustomFormLabel from "../form/form-label";

const TextAreaWithValidation = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      {label && <CustomFormLabel mb={1}>{label}</CustomFormLabel>}
      <Textarea fontSize="sm" borderColor="gray.300" {...field} {...props} />
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default TextAreaWithValidation;
