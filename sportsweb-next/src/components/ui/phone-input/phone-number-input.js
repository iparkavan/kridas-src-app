import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import CustomFormLabel from "../form/form-label";

const PhoneNumberInput = ({
  placeholder,
  label,
  style,
  disabled,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      {label && <CustomFormLabel>{label}</CustomFormLabel>}
      <PhoneInput
        style={{
          borderColor: "var(--chakra-colors-gray-300)",
          fontSize: "var(--chakra-fontSizes-sm)",
          ...style,
        }}
        placeholder={placeholder}
        {...field}
        onChange={(val) => setFieldValue(field.name, val)}
        inputComponent={Input}
        numberInputProps={{ fontSize: "sm" }}
        international
        disabled={disabled}
      />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default PhoneNumberInput;
