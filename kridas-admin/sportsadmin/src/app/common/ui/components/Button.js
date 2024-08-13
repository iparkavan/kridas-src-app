import MuiButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  base: {
    textTransform: "none",
  },
}));

const Button = ({ className, ...props }) => {
  const classes = useStyles();

  return (
    <MuiButton variant="contained" className={`${classes.base} ${className}`} {...props}>
      {props.children}
    </MuiButton>
  );
};

export default Button;
