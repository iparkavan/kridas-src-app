import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import AuthService from "../../../service/AuthService";
import MasterService from "../../../service/MasterService";
import classes from "../master.module.css";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: "15px",
  },
}));

const ItemMasterSearch = (props) => {
  let history = useHistory();
  const classesLocal = useStyles();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchInventoryItems();
  }, []);

  /*  const searchProcedures = () => {
    MasterService.fetchAllItemsByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        props.onSearch(data);
        console.log(data);
      })
      .catch((ex) => {
        console.log(ex);
      });
  }; */

  const addItem = () => {
    history.push("/item/add");
  };

  const searchInventoryItems = () => {
    const searchParameters = {
      companyId: AuthService.getLoggedInUserCompanyId(),
      itemName: searchText.trim().length > 0 ? searchText : null,
    };
    setLoading(true);
    MasterService.fetchAllItemsByCompanyIdWithSearch(searchParameters)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        props.onSearch(data);
        setLoading(false);
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  return (
    <>
      <div className={classes.ItemSearch}>
        <div>
          <TextField
            label="Item Name / Code"
            id="searchString"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon></SearchIcon>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classesLocal.button}
            onClick={searchInventoryItems}
            startIcon={<SearchIcon />}
            disabled={loading}
          >
            Search
          </Button>
        </div>
        <div>{loading ? "Loading..." : ""}</div>
        <div className={classes.RightAlign}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classesLocal.button}
            onClick={addItem}
            startIcon={<AddIcon />}
          >
            Add Item
          </Button>
        </div>
      </div>
    </>
  );
};

export default ItemMasterSearch;
