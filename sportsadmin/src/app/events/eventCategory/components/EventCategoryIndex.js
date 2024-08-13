import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import PageContainer from "../../../common/layout/components/PageContainer";
import EventCategoryList from "./EventCategoryList";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "10px",
  },
  align: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
}));

const EventCategoryIndex = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <PageContainer heading="Event Category Table">
      <div className={classes.root}>
        <div className={classes.align}>
          <Button style={{ width: 100, textAlign: "right" }}
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => history.push("/category/add")}
          >
            Add
          </Button>
        </div>
        <EventCategoryList />
      </div >
      {/* {selectedLookupType.length > 0 ? (
        <EventCategoryAddDialog
          {...getLookupDialogProps(selectedLookupType)}
        ></EventCategoryAddDialog>
      ) : (
        ""
      )} */}
    </PageContainer>
  );
};

export default EventCategoryIndex;
