import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin : "20px"
  },
}));

const LinkButton = (props) => {
  const classes = useStyles();

  return (
    <Link
      component="button"
      variant="body2"
      underline="none"
      className={classes.root}
      {...props}
    >
      {props.children}
    </Link>
  );
};

export default LinkButton;
