import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import CategoryList from "./CategoryList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

/* Category Index Function */

const CategoryIndex = () => {
  const classes = useStyles();
  return (
    <PageContainer heading="Category">
      <div className={classes.root}>
        <CategoryList />
      </div>
    </PageContainer>
  );
};

export default CategoryIndex;
