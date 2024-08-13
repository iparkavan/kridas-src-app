import {
  Alert,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

const IconTextField = (props) => {
  const {
    isRequired,
    isInvalid,
    placeholder,
    id,
    name,
    type,
    label,
    variant,
    value,
    onChange,
    errorMessage,
    requiredfield,
    iconStart,
    iconEnd,
    error,
  } = props;

  // let rightIconElement = "";
  // if (rightIcon !== undefined) {
  //   rightIconElement = (
  //     <InputRightElement color="gray.400">{rightIcon}</InputRightElement>
  //   );
  // }

  // let leftIconElement = "";
  // if (leftIcon !== undefined) {
  //   leftIconElement = (
  //     <InputLeftElement color="gray.400">{leftIcon}</InputLeftElement>
  //   );
  // }

  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      <div>
        {/* {leftIconElement} */}
        {/* <Input
          placeholder={placeholder}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          isInvalid={isInvalid}
        /> */}
        <TextField
          margin="dense"
          id={id}
          type={type}
          variant={variant}
          required={requiredfield}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputlabelprops={{ shrink: true }}
          error={error}
          InputProps={{
            startAdornment: iconStart ? (
              <InputAdornment position="start">{iconStart}</InputAdornment>
            ) : null,
            endAdornment: iconEnd ? (
              <InputAdornment position="end">{iconEnd}</InputAdornment>
            ) : null,
          }}
          {...props}
        />

        {/* {rightIconElement} */}
      </div>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </FormControl>
  );
};

export default IconTextField;
