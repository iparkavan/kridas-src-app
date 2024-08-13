import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useField } from "formik";
import ReactSelect from "react-select";
import CustomFormLabel from "../form/form-label";

const MultiSelect = ({ label, customOnChange, ...props }) => {
  const [field, meta, helpers] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      {label && <CustomFormLabel mb={1}>{label}</CustomFormLabel>}
      <ReactSelect
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 999 }),
          control: (styles) => ({
            ...styles,
            border:
              meta.touched && meta.error
                ? "2px solid var(--chakra-colors-red-500)"
                : "1px solid var(--chakra-colors-gray-300)",

            ":hover": {
              border:
                meta.touched && meta.error
                  ? "2px solid var(--chakra-colors-red-500)"
                  : "1px solid var(--chakra-colors-gray-300)",
            },
            ":focus": {
              border:
                meta.touched && meta.error
                  ? "2px solid var(--chakra-colors-red-500)"
                  : "1px solid var(--chakra-colors-gray-300)",
            },
            fontSize: "var(--chakra-fontSizes-sm)",
          }),
        }}
        {...field}
        {...props}
        onChange={(values) => {
          helpers.setValue(values);
          if (customOnChange) customOnChange(values);
        }}
        onBlur={() => helpers.setTouched(true)}
      />
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default MultiSelect;
