import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../../common/layout/components/PageContainer";
import OrganizerList from "./OrganizerList";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

const OrganizersIndex = () => {
  const classes = useStyles();

  return (
    <PageContainer heading="Organizer Table">
      <div className={classes.root}>
        <OrganizerList />
      </div>
    </PageContainer>
  );
};

export default OrganizersIndex;
