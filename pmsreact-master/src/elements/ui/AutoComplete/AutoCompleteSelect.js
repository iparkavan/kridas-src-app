/* eslint-disable no-use-before-define */
import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function AutoCompleteSelect(props) {
  const defaultProps = {
    options: props.data,
    getOptionLabel: (option) => option[props.keyLabel],
  };

  const [value, setValue] = React.useState(null);
  const { initialValue } = props;

  useEffect(() => {
    if (
      initialValue === null ||
      initialValue == null ||
      initialValue.toString().trim().length === 0
    ) {
      setValue(null);
    } else {
      const selectedObject = props.data.filter(
        (x) => x[props.keyValue] === initialValue
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
      selectedValue = valueSelected[props.keyValue];
    }

    //Index will be passed when this component is used in object array
    if (props.index == null) {
      props.callbackFunction(props.name, selectedValue);
    } else {
      props.callbackFunction(props.name, selectedValue, props.index);
    }
  };

  return (
    <div>
      <Autocomplete
        {...defaultProps}
        id={props.id}
        name={props.name}
        value={value}
        onChange={(event, newValue) => {
          setAutoCompleteValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            error={
              !(props.errorText == null) && props.errorText.length > 0
                ? true
                : false
            }
            helperText={props.errorText}
            variant={props.variant == null ? "standard" : props.variant}
            size="small"
            margin="dense"
          />
        )}
      />
    </div>
  );
}
