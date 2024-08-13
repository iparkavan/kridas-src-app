import {
  FormControl,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import CustomFormLabel from "../form/form-label";

const NumberWithValidation = ({
  label,
  labelProps,
  validate,
  stepper = true,
  inputProps,
  precision,
  ...props
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField({ validate, ...props });

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      {label && <CustomFormLabel {...labelProps}>{label}</CustomFormLabel>}
      <NumberInput
        borderColor="gray.300"
        {...field}
        onChange={(value, numValue) => {
          if (precision) {
            setFieldValue(field.name, value);
          } else {
            setFieldValue(field.name, isNaN(numValue) ? value : numValue);
          }
        }}
        precision={precision}
        {...props}
      >
        <NumberInputField {...inputProps} />
        {stepper && (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
      </NumberInput>
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default NumberWithValidation;
