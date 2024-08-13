import { useEffect, useState } from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import Button from "../../../common/ui/components/Button";
import CategoryConfig from "../config/CategoryConfig";
import useHttp from "../../../../hooks/useHttp";
import ErrorLabel from "../../../common/ui/components/ErrorLabel";
import * as yup from "yup";
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar';
import { useHistory } from "react-router-dom";
import InputField from '../../../common/ui/components/InputField';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons//Cancel';

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "20px",
    paddingLeft: "2%"
  },
  textBoxSpacing: {
    maxWidth: '35%',
    margin: '4px'
  },
  textBoxSpacing1: {
    maxWidth: '35%',
    margin: '4px',
    marginLeft: "17px"
  },
  button: {
    alignSelf: "flex-end",
  },
  DescField: {
    width: '35vw',
  },
  DescInput: {
    height: '100px',
    textAlign: 'Top'
  },

  selectCategory: {
    width: '35vw',
    height: '46px'
  },

  selectBorder: {
    height: '43px'
  },
}));

/* AddCategory Function */

const AddCategory = () => {
  let history = useHistory();

  const classes = useStyles();
  const [categoryInfo, setCategoryInfo] = useState({
    category_type: "",
    category_name: "",
    category_desc: "",
    parent_category_id: null,
  });

  const [parentcategories, setParentcategories] = useState([]);
  const { error, sendRequest } = useHttp();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackError, setSnackError] = useState("success");
  const [errors, setErrors] = useState({});
  const [, setState] = useState({});

  useEffect(() => {
    const categoryConfig = CategoryConfig.fetchAllParentCategory();
    const transformCategoryData = (data) => {
      setParentcategories(data);
    };
    sendRequest(categoryConfig, transformCategoryData);
    return () => {
      setState({});
    };
  }, [sendRequest]);

  const handleChange = (e) => {
    setCategoryInfo({
      ...categoryInfo,
      [e.target.name]: e.target.value,
    });
  };

  /*  Save Categories with Validation */

  const handleSave = async (e) => {
    e.preventDefault();
    const scheme = yup.object().shape(
      {
        category_type: yup
          .string()
          .typeError("Please enter  Category Type")
          .min(1, "Minimum of 1 character")
          .max(3, "Maximum of 3 characters")
          .matches(/^[aA-zZ\s0-9]+$/, "Symbols are not allowed ")
          .required('Please enter  Category Type'),
        category_name: yup
          .string()
          .typeError("Please enter  Category Name")
          .max(50, "Maximum of 50 characters")
          .required("Please enter  Category Name"),
        category_desc: yup
          .string()
          .typeError("Please enter  Category Description")
          .max(500, "Maximum of 500 characters")
          .required("Please enter  Category Description"),
      }
    );

    await scheme
      .validate(categoryInfo, { abortEarly: false })
      .then(() => {
        const categoryConfig = CategoryConfig.addCategory(categoryInfo);
        const transformData = (data) => {
          setSnackError("success");
          setSnackMsg("Category Added Successfully");
          setSnackOpen(true);
          history.push(`/masters/category`);
          return () => {
            setState({});
          };

        };
        sendRequest(categoryConfig, transformData);
      })
      .catch((e) => {
        let errorObj = {};
        e.inner.map((error) => {
          return (
            errorObj[error.path] = error.message
          )

        });
        setErrors({
          ...errorObj,
        });
      });
  };


  /* For Cancel Button and Back Icon,Navigation to the Category Screen */

  const handleCancel = async (e) => {
    history.push(`/masters/category`);
  };

  return (
    <>
      <PageContainer heading="Add Category"></PageContainer>
      <div className={classes.root}>


        <div style={{ display: "flex" }}>

          <InputField className={classes.textBoxSpacing}
            required
            size="small"
            type="text"
            variant="outlined"
            label="Category Type"
            name="category_type"
            value={categoryInfo.category_type || ""}
            onChange={handleChange}
            error={Boolean(errors.category_type)}
            helperText={errors.category_type}
          />

          <InputField className={classes.textBoxSpacing1}
            required
            size="small"
            type="text"
            variant="outlined"
            label="Category Name"
            name="category_name"
            value={categoryInfo.category_name || ""}
            onChange={handleChange}
            error={Boolean(errors.category_name)}
            helperText={errors.category_name}
          />
        </div>

        <InputField
          className={classes.DescField}
          required
          size="small"
          type="text"
          variant="outlined"
          label="Category Description"
          name="category_desc"
          value={categoryInfo.category_desc || ""}
          onChange={handleChange}
          multiline={true}
          InputProps={{ classes: { input: classes.DescInput } }}
          rows={3}
          rowsMax={40}
          error={Boolean(errors.category_desc)}
          helperText={errors.category_desc}

        />
        <FormControl variant='outlined' style={{ width: '100%' }} margin={"normal"}>
          <InputLabel id="Category_id">Select Category</InputLabel>

          <Select
            className={classes.selectCategory}
            size="small"
            type="text"
            variant="outlined"
            label="Category Id"
            name="parent_category_id"
            value={categoryInfo.parent_category_id || ""}
            onChange={handleChange}
            defaultValue=""
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {parentcategories.map((category) => (
              <MenuItem key={category.category_id} value={category.category_id}>
                {category.category_name}
              </MenuItem>

            ))}
          </Select>
        </FormControl>

        <div style={{ display: "flex" }}>

          <Button style={{ marginRight: 20 }}
            className={classes.button}
            color="primary"
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>

          <Button
            className={classes.button}
            onClick={handleCancel}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>

        </div>

        {error && (
          <ErrorLabel>Unable to add category - {error}</ErrorLabel>
        )}

        <Snackbar open={snackOpen}
          autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
          <MuiAlert elevation={6} onClose={() => setSnackOpen(false)} variant='filled' severity={snackError}>
            {snackMsg}
          </MuiAlert>
        </Snackbar>
      </div>

    </>
  );
};

export default AddCategory;
