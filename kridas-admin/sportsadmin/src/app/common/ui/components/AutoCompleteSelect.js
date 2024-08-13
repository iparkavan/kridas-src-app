/* eslint-disable no-use-before-define */
import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function AutoCompleteSelect(props) {
  const { data, keyValue, initialValue, name, index, id, label, variant, errorText, keyLabel, callbackFunction } = props
  const defaultProps = {
    options: data,
    getOptionLabel: (option) => option[keyLabel],
  };

  const [value, setValue] = React.useState(null);

  useEffect(() => {
    if (
      initialValue === null ||
      initialValue == null ||
      initialValue.toString().trim().length === 0
    ) {
      setValue(null);
    } else {
      const selectedObject = data.filter(
        (x) => x[keyValue] === initialValue
      )[0];

      //if its already the selected value, no need to set again
      if (selectedObject !== value) {
        setAutoCompleteValue(selectedObject);
      }
    }
  }, [initialValue]);

  const setAutoCompleteValue = (valueSelected) => {
    setValue(valueSelected);
    let selectedValue = null;
    if (valueSelected !== null && !(valueSelected == null)) {
      selectedValue = valueSelected[keyValue];
    }

    //Index will be passed when this component is used in object array
    if (index == null) {
      callbackFunction(name, selectedValue);
    } else {
      callbackFunction(name, selectedValue, index);
    }
  };

  return (
    <div>
      <Autocomplete
        {...defaultProps}
        id={id}
        name={name}
        value={value}
        onChange={(event, newValue) => {
          setAutoCompleteValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={
              !(errorText == null) && errorText.length > 0
                ? true
                : false
            }
            helperText={errorText}
            variant={variant == null ? "outlined" : variant}
            size="small"
            margin="dense"
          />
        )}
      />
    </div>
  );
}
