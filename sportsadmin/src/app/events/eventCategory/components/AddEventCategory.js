import { useEffect, useState } from "react";
import { MenuItem, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import Button from "../../../common/ui/components/Button";
import EventCategoryConfig from "../config/EventCategoryConfig";
import useHttp from "../../../../hooks/useHttp";
import ErrorLabel from "../../../common/ui/components/ErrorLabel";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "30px",
  },
  button: {
    alignSelf: "flex-start",
  },
}));

const AddEventCategory = () => {
  const classes = useStyles();
  const [categoryInfo, setCategoryInfo] = useState({
    categoryType: "",
    categoryName: "",
    categoryDesc: "",
    parentCategoryId: "",
  });
  const [categories, setCategories] = useState([]);

  const { error, sendRequest } = useHttp();

  useEffect(() => {
    const categoryConfig = EventCategoryConfig.getAllCategories();

    const transformCategoryData = (data) => {
      setCategories(data);
    };


    sendRequest(categoryConfig, transformCategoryData);
  }, [sendRequest]);

  const handleChange = (e) => {
    setCategoryInfo({
      ...categoryInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();


    const categoryConfig = EventCategoryConfig.addNewCategory(categoryInfo);

    const transformData = (data) => { };

    await sendRequest(categoryConfig, transformData);
  };

  const handleCancel = async (e) => {
    e.preventDefault();




    const categoryConfig = EventCategoryConfig.addNewCategory(categoryInfo);

    const transformData = (data) => { };

    await sendRequest(categoryConfig, transformData);
  };

  return (
    <PageContainer heading="Add Category">
      <div className={classes.root}>
        <Typography> Category Details</Typography>
        <div style={{ display: "flex" }}>
          <TextField style={{ marginRight: 100 }}
            size="small"
            variant="outlined"
            label="Category Type"
            name="categoryType"
            value={categoryInfo.categoryType}
            onChange={handleChange}
          />
          <TextField
            size="small"
            variant="outlined"
            label="Category Name"
            name="categoryName"
            value={categoryInfo.categoryName}
            onChange={handleChange}
          />
        </div>
        <TextField
          size="small"
          variant="outlined"
          label="Category Description"
          name="categoryDesc"
          value={categoryInfo.categoryDesc}
          onChange={handleChange}
          multiline
          rows={2}

        />
        <TextField
          size="small"
          variant="outlined"
          label="Select Parent Category"
          name="parentCategoryId"
          value={categoryInfo.parentCategoryId}
          onChange={handleChange}
          select

        >
          {categories.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </MenuItem>
          ))}
        </TextField>
        <div style={{ display: "flex" }}>
          <Button style={{ marginRight: 20 }}
            className={classes.button}
            color="secondary"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
        {error && (
          <ErrorLabel>Unable to add category - {error}</ErrorLabel>
        )}
      </div>
    </PageContainer>
  );
};

export default AddEventCategory;
