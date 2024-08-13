import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import LookupTableSearch from "./LookupTableSearch";
import LookupTableList from "./LookupTableList";
import LookupAddDialog from "./LookupAddDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

const LookupTableIndex = () => {
  const classes = useStyles();
  const [selectedLookupType, setSelectedLookupType] = useState("");
  const [addLookup, setAddLookup] = useState(false);
  const [mode, setMode] = useState();
  const [, setReturnObject] = useState({});
  const [editItem, setEditItem] = useState({});
  const [reload, setReload] = useState(false)

  const getSelectedLookupHandler = (lookup_type) => {
    setSelectedLookupType(lookup_type);
  };

  const getPageModeHandler = (mode) => {
    setMode(mode);
  };

  const getIsAddLookupHandler = (isAddMode) => {
    setAddLookup(isAddMode);
  };

  const lookupDialogCloseHandler = () => {
    setEditItem({});
    setAddLookup(false);
  };

  const handleReload = () => {
    setReload(!reload)
  }

  const postLookupSaveHandler = (returnValue) => {
    lookupDialogCloseHandler();
    setReturnObject(returnValue);
    handleReload()
    //getDataBasedOnType(selectedLookupType);
  };

  const getLookupDialogProps = (lookup_type) => {
    return {
      open: addLookup,
      close: lookupDialogCloseHandler,
      postSave: postLookupSaveHandler,
      // reload:handleReload,
      companyId: 0,
      lookup_type: lookup_type,
      mode: mode,
      editItem: editItem,
    };
  };

  return (
    <PageContainer heading="Lookup Table">
      <div className={classes.root}>
        <LookupTableSearch
          getSelectedLookup={getSelectedLookupHandler}
          getPageMode={getPageModeHandler}
          getIsAddLookup={getIsAddLookupHandler}
        ></LookupTableSearch>

        <LookupTableList
          lookup_type={selectedLookupType}
          getPageMode={getPageModeHandler}
          getIsAddLookup={getIsAddLookupHandler}
          lookupDialog={getLookupDialogProps}
          setEditItem={setEditItem}
          reload={reload}
        > </LookupTableList>
      </div>
      {selectedLookupType.length > 0 ? (
        <LookupAddDialog
          {...getLookupDialogProps(selectedLookupType)}
        ></LookupAddDialog>
      ) : (
        ""
      )}
    </PageContainer>
  );
};

export default LookupTableIndex;
