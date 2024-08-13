import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../../../common/ui/components/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AutoCompleteSelect from "../../../common/ui/components/AutoCompleteSelect";
import useHttp from "../../../../hooks/useHttp";
import LookupTableConfig from "../config/LookupTableConfig";
import MasterData from "../../../../utils/masterdata";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  selectContainer: {
    minWidth: "300px",
    width: "25rem",
  },
  buttonContainer: {
    textAlign: "right",
    marginBottom: "4px",
  },
}));

const LookupTableSearch = (props) => {
  const classes = useStyles();
  const {getSelectedLookup,getPageMode,getIsAddLookup}=props
  const [lookupTypeList, setLookupTypeList] = useState([]);
  const [selectedLookupType, setSelectedLookupType] = useState("");
  const { sendRequest } = useHttp();
  const [, setCleanup] = useState({});

  useEffect(() => {
    const config = LookupTableConfig.getAllLookupTypes();
    const transformDate = (data) => {
      setLookupTypeList(data);
    };

    sendRequest(config, transformDate);
    return () => {
      setCleanup({});
    };
  }, [sendRequest]);

  useEffect(() => {
    getSelectedLookup(selectedLookupType);
  }, [getSelectedLookup,selectedLookupType]);

  const onChangeNameValue = (name, value) => {
    setSelectedLookupType(value === null ? "" : value);
  };

  const AddLookupHandler = () => {
    getPageMode(MasterData.pageMode.Add);
    getIsAddLookup(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.selectContainer}>
        <AutoCompleteSelect
          fullWidth
          data={lookupTypeList}
          label="Select Type *"
          id="lookupType"
          name="lookup_type"
          keyValue="lookup_type"
          keyLabel="lookup_desc"
          initialValue={selectedLookupType}
          callbackFunction={onChangeNameValue}
        ></AutoCompleteSelect>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={AddLookupHandler}
          disabled={selectedLookupType.length === 0 ? true : false}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default LookupTableSearch;
