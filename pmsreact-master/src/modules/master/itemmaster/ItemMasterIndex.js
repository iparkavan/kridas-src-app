import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";

import ItemMasterSearch from "./ItemMasterSearch";
import ItemMasterList from "./ItemMasterList";

import classes from "../master.module.css";
import MasterData from "../../helper/masterdata";
import AuthService from "../../../service/AuthService";

const ItemMasterIndex = (props) => {
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stockingUnitList, setStockingUnitList] = useState([]);

  useEffect(() => {
    getDataBasedOnType(MasterData.lookupTypes.StockingUnit);
  }, []);

  const getDataBasedOnType = (type) => {
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      type,
      (res) => {
        setStockingUnitList(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      },
      () => {}
    );
  };

  const searchResultHandler = (resultSet) => {
    setItemList(resultSet);
  };

  return (
    <>
      <div>
        <Typography variant="h5" gutterBottom>
          Inventory
        </Typography>
        <ItemMasterSearch onSearch={searchResultHandler}></ItemMasterSearch>
        <div className={classes.TopMargin}>
          {!isLoading ? (
            <ItemMasterList
              dataList={itemList}
              editLink="/item/edit/"
              stockingUnitList={stockingUnitList}
            ></ItemMasterList>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ItemMasterIndex;
