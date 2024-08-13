import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CategoryConfig from "../config/CategoryConfig";
import useHttp from "../../../../hooks/useHttp";
import { useHistory } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import BodyText from "../../../common/ui/components/BodyText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PageContainer from "../../../common/layout/components/PageContainer";

const useStyles = makeStyles((theme) => ({
  sectionSpace: {
    margin: "20px 0 0px 0",
  },
  contentSpace: {
    margin: "5px 0 0 0",
  },
  totalMargin: {
    margin: "3%",
    marginLeft: "45px",
  },
  tableAlign: {
    width: "65%",
  },

  boldText: {
    fontWeight: "500",
  },
}));

/* For View Category */

function ViewCategory(props) {
  const classes = useStyles();
  let history = useHistory();
  const { categoryId } = props.match.params;
  let InitalState = {
    category_type: "",
    category_name: "",
    category_desc: "",
    parent_category_id: "",
  };
  const { sendRequest } = useHttp();
  const [categoryDetails, setCategoryDetails] = useState(InitalState);
  const { category_type, category_name, category_desc, parent_category_id } =
    categoryDetails;
  const [categories] = useState([]);
  const [parentName, setParentName] = useState("");
  const [, setState] = useState({});

  useEffect(() => {
    const config = CategoryConfig.getCategortyById(categoryId);
    const transformData = (data) => {
      setCategoryDetails(data.data);
    };
    sendRequest(config, transformData);

    const Parentconfig = CategoryConfig.getCategortyById(categoryId);
    const transformParentData = (data) => {
      setParentName(data.data.parent_name);
    };
    sendRequest(Parentconfig, transformParentData);

    return () => {
      setState({});
    };
  }, [sendRequest, categoryId]);

  /* For Back Icon ,Navigation to the Category Screen */

  const Backbtn = () => {
    history.push(`/masters/category`);
  };

  return (
    <>
      <PageContainer
        heading="Category Details"
        isBackButon={true}
        onAction={Backbtn}
      >
        <div className={classes.totalMargin}>
          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Category Name</div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>{category_name}</BodyText>
            </div>
          </div>
          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Category Type </div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>{category_type}</BodyText>
            </div>
          </div>
          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Category Description</div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>{category_desc}</BodyText>
            </div>
          </div>
          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Parent Category</div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>
                {parent_category_id === null ? "NA" : parentName}
              </BodyText>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.tableAlign}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.categoryId}>
                        <TableCell component="th" scope="row">
                          {category.categoryId}
                        </TableCell>
                        <TableCell>{category.category_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export default ViewCategory;
