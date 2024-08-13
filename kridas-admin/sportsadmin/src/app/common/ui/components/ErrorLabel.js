import { Typography } from "@material-ui/core";

const ErrorLabel = (props) => {
  return (
    <Typography variant="subtitle1" color="error" {...props}>
      {props.children}
    </Typography>
  );
};

export default ErrorLabel;
