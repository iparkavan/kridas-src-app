import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./date-picker.module.css";
import CustomFormLabel from "../form/form-label";

const DatePicker = ({ placeholderText, label, labelProps, ...props }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);
  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      {label && <CustomFormLabel {...labelProps}>{label}</CustomFormLabel>}
      <ReactDatePicker
        popperClassName={styles.datePicker}
        dateFormat="dd/MM/yyyy"
        customInput={<Input borderColor="gray.300" fontSize="sm" />}
        {...props}
        {...field}
        placeholderText={placeholderText}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
          // setFieldTouched(field.name, true);
          if (props.onChange) {
            props.onChange(val);
          }
        }}
        onChangeRaw={() => setFieldTouched(field.name, true)}
        // onChangeRaw={() => setFieldTouched(field.name, true, true)}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default DatePicker;
