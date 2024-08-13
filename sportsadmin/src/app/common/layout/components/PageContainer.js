import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  pages: {
    width: "100%",
  },
  pageHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    display: "flex",
    alignItems: "baseline",
    "& > div": {
      marginRight: "1rem",
    },
  },
  pageContent: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(0),
  },
}));

const PageContainer = (props) => {
  const classes = useStyles();
  const { heading, isBackButon = false, onAction } = props;
  return (
    <div className={classes.pages}>
      <div className={classes.pageHeader}>
        {isBackButon && (
          <Tooltip title="Back">
            <IconButton aria-label="Back" size="medium" onClick={onAction}>
              <ArrowBackIosIcon style={{ fontSize: "large" }} />
            </IconButton>
          </Tooltip>
        )}
        <Typography variant="h5">{heading}</Typography>
      </div>
      <div className={classes.pageContent}>{props.children}</div>
    </div>
  );
};

export default PageContainer;
