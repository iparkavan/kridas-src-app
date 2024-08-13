import { useEffect, useState } from "react";
import { MenuItem, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import Button from "../../../common/ui/components/Button";
import EventCategoryConfig from "../config/EventCategoryConfig";
import useHttp from "../../../../hooks/useHttp";
import ErrorLabel from "../../../common/ui/components/ErrorLabel";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

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

const EditEventCategory = () => {
  const classes = useStyles();
  const [categoryInfo, setCategoryInfo] = useState({
    categoryType: "",
    categoryName: "",
    categoryDesc: "",
    parentCategoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const { categoryId } = useParams();

  const {  error, sendRequest } = useHttp();

  useEffect(() => {
    const categoryConfig = EventCategoryConfig.getCategory(categoryId);

    const transformCategoryData = (data) => {
      const actualData = data.data;
      setCategoryInfo({
        categoryType: actualData.categoryType,
        categoryName: actualData.categoryName,
        categoryDesc: actualData.categoryDesc,
        parentCategoryId: actualData.parentCategoryId,
      });

    };

    sendRequest(categoryConfig, transformCategoryData);
  }, [sendRequest, categoryId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const categoryConfig = EventCategoryConfig.updateCategory({
      ...categoryInfo,
      categoryId,
    });

    const transformData = (data) => { };

    await sendRequest(categoryConfig, transformData);
  };

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

  const validateFields = () => {
    let submitForm = true;



    return submitForm;
  };



  const handleCancel = async (e) => {
    e.preventDefault();



    const categoryConfig = EventCategoryConfig.editNewCategory(categoryInfo);

    const transformData = (data) => { };

    await sendRequest(categoryConfig, transformData);
  };

  return (
    <PageContainer heading="Edit Category">
      <div className={classes.root}>
        <Typography> Category Details</Typography>
        <div style={{ display: "flex" }}>
          <TextField
            style={{ marginRight: 100 }}
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
          <Button
            style={{ marginRight: 20 }}
            className={classes.button}
            color="secondary"
            onClick={handleUpdate}
          >
            Edit
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
        {error && <ErrorLabel>Unable to edit category - {error}</ErrorLabel>}
      </div>
    </PageContainer>
  );
};

export default EditEventCategory;
