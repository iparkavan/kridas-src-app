import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import AutoCompleteSelect from "../../elements/ui/AutoComplete/AutoCompleteSelect";
import Select from "react-select";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Link from "@material-ui/core/Link";
import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import AuthService from "../../service/AuthService";
import PatientService from "../../service/PatientService";
import MasterData from "../helper/masterdata";
import classes from "./patient.module.css";
import Helper from "../helper/helper";
import * as PatientConstants from "./PatientConstants";
import * as moment from "moment";

import BackdropLoader from "../../elements/ui/BackdropLoader/BackdropLoader";
import NotificationDialog from "../../elements/ui/Dialog/NotificationDialog";
import MasterService from "../../service/MasterService";
import LookupAddDialog from "../master/lookup/LookupAddDialog";

const initialState = PatientConstants.patientObject;
const errorState = PatientConstants.patientErrorObject;
const addressInitialState = PatientConstants.addressObject;
const initialPatientMasterDataState = PatientConstants.patientMasterDataObject;
const initialPageState = PatientConstants.patientPageStateObject;

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

const PatientAddEdit = (props) => {
  let history = useHistory();
  const { id } = useParams();
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState([]);
  const [selectedMedicalGroup, setSelectedMedicalGroup] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});
  const [address, setAddress] = useState(null);
  const [addLookup, setAddLookup] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [returnObject, setReturnObject] = useState({});

  const [patientState, dispatch] = useReducer(reducer, initialState);
  const [errState, errDispatch] = useReducer(reducer, errorState);
  const [addressState, addressDispatch] = useReducer(
    reducer,
    addressInitialState
  );
  const [patientMasterDataState, masterDataDispatch] = useReducer(
    reducer,
    initialPatientMasterDataState
  );
  const [pageState, pageDispatch] = useReducer(reducer, initialPageState);

  const onChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };

  const onChangeNameValue = (name, value) => {
    dispatch({ field: name, value: value });
  };

  const onChangeAddress = (e) => {
    addressDispatch({ field: e.target.name, value: e.target.value });
  };

  const onChangeAddressNameValue = (name, value) => {
    if (name === "country") {
      onChangeAddressNameValue("state", null);
    }

    addressDispatch({ field: name, value: value });
  };

  const onChangeMedicalHistory = (e) => {
    setSelectedMedicalHistory(e);
  };

  const onChangeMedicalGroup = (e) => {
    setSelectedMedicalGroup(e);
  };

  const handleDateChange = (date) => {
    dispatch({
      field: "dob",
      value: date,
    });
  };

  const handleDateError = (error, date) => {
    if (error !== dobError) {
      errDispatch({
        field: "dobError",
        value: error,
      });
    }
  };

  const lookups = [
    {
      type: MasterData.lookupTypes.PatientReferral,
      listName: "referralList",
      loadStatus: "isReferralListLoading",
      labels: {
        title: "Referral",
        contentText: "Add new referral",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
    {
      type: MasterData.lookupTypes.Occupation,
      listName: "occupationList",
      loadStatus: "isOccupationListLoading",
      labels: {
        title: "Occupation",
        contentText: "Add new occupation",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
    {
      type: MasterData.lookupTypes.Nationality,
      listName: "nationalityList",
      loadStatus: "isNationalityListLoading",
      labels: {
        title: "Nationality",
        contentText: "Add new nationality",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
    {
      type: MasterData.lookupTypes.Ethnicity,
      listName: "ethnicityList",
      loadStatus: "isEthnicityListLoading",
      labels: {
        title: "Ethnicity",
        contentText: "Add new ethnicity",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
  ];

  const {
    patientName,
    email,
    mobileNo,
    gender,
    idPassportNo,
    dob,
    alternateContactNo,
    relationshipCode,
    relationshipContactNo,
    relationshipName,
    bloodGroup,
    ethnicity,
    nationality,
    occupation,
    referredBy,
    otherMedicalHistory,
  } = patientState;

  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    country,
    postalCode,
    state,
  } = addressState;

  const {
    patientNameError,
    emailError,
    mobileNoError,
    addressLine1Error,
    cityError,
    countryError,
    stateError,
    postalCodeError,
    genderError,
    alternateContactNoError,
    emergencyContactNoError,
    dobError,
    idPassportNoError,
    addressNotFilledFullyError,
  } = errState;

  const {
    relationshipList,
    ethnicityList,
    nationalityList,
    occupationList,
    bloodGroupList,
    referralList,
    countryList,
    stateList,
    medicalGroupList,
    medicalHistoryList,
  } = patientMasterDataState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isRelationshipListLoading,
    isEthnicityListLoading,
    isNationalityListLoading,
    isOccupationListLoading,
    isBloodGroupListLoading,
    isReferralListLoading,
    isCountryListLoading,
    isStateListLoading,
    isMedicalGroupListLoading,
    isMedicalHistoryListLoading,
    isMainDataLoading,
    mode,
  } = pageState;

  useEffect(() => {
    if (
      !isMainDataLoading &&
      !isRelationshipListLoading &&
      !isEthnicityListLoading &&
      !isNationalityListLoading &&
      !isOccupationListLoading &&
      !isBloodGroupListLoading &&
      !isReferralListLoading &&
      !isCountryListLoading &&
      !isStateListLoading &&
      !isMedicalGroupListLoading &&
      !isMedicalHistoryListLoading
    ) {
      pageDispatch({ field: "isLoading", value: false });
    }
  }, [
    isMainDataLoading,
    isRelationshipListLoading,
    isEthnicityListLoading,
    isNationalityListLoading,
    isOccupationListLoading,
    isBloodGroupListLoading,
    isReferralListLoading,
    isCountryListLoading,
    isStateListLoading,
    isMedicalGroupListLoading,
    isMedicalHistoryListLoading,
  ]);

  //Set Mode to EDIT when id param is passed
  useEffect(() => {
    if (!(id == null) && id !== null) {
      pageDispatch({ field: "mode", value: MasterData.pageMode.Edit });
    }
  }, [id]);

  useEffect(() => {
    if (id == null && isMainDataLoading && mode === MasterData.pageMode.Add) {
      pageDispatch({ field: "isMainDataLoading", value: false });
      pageDispatch({ field: "isStateListLoading", value: false });
    }
  }, [isMainDataLoading, mode, id]);

  useEffect(() => {
    if (
      mode === MasterData.pageMode.Edit &&
      isMainDataLoading &&
      !isMedicalHistoryListLoading &&
      !isMedicalGroupListLoading
    ) {
      PatientService.fetchPatientById(id)
        .then((res) => {
          setPatientInfo(res.data);

          Object.entries(res.data).forEach(([key, val]) => {
            dispatch({
              field: `${key}`,
              value: val,
            });
          });

          //Check if address object is available
          if (res.data.addressId !== null && res.data.addressDTO !== null) {
            setAddress(res.data.addressDTO);
            Object.entries(res.data.addressDTO).forEach(([key, val]) => {
              addressDispatch({
                field: `${key}`,
                value: val,
              });
            });
          }

          dispatch({
            field: "dob",
            value: Helper.getFormattedDate(res.data.dob, "YYYY-MM-DD"),
          });

          if (Array.isArray(res.data.patientMedicalHistories)) {
            const medicalHistoryArray = [];
            res.data.patientMedicalHistories.map((item) => {
              /* const historyObject = MasterData.getLookupObjectFromKey(
                item.medicalHistory,
                MasterData.lookupTypes.MedicalHistory
              ); */
              const historyObject = medicalHistoryList.find(
                (x) => x.lookupKey === item.medicalHistory
              );

              medicalHistoryArray.push(historyObject);
            });
            setSelectedMedicalHistory(medicalHistoryArray);
          }

          if (Array.isArray(res.data.patientMedicalGroups)) {
            const medicalGroupArray = [];
            res.data.patientMedicalGroups.map((item) => {
              /* const groupObject = MasterData.getLookupObjectFromKey(
                item.groupCode,
                MasterData.lookupTypes.PatientGroup
              ); */
              const groupObject = medicalGroupList.find(
                (x) => x.lookupKey === item.groupCode
              );
              medicalGroupArray.push(groupObject);
            });
            setSelectedMedicalGroup(medicalGroupArray);
          }
        })
        .catch((ex) => {
          console.log(ex);
        })
        .finally(() => {
          pageDispatch({ field: "isMainDataLoading", value: false });
        });
    }
  }, [
    id,
    mode,
    isMainDataLoading,
    isMedicalGroupListLoading,
    isMedicalHistoryListLoading,
    medicalGroupList,
    medicalHistoryList,
  ]);

  const getStateListBasedOnCountry = (countryCode) => {
    MasterService.fetchLookupByType(
      countryCode,
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const resultArray = Array.isArray(response.data) ? response.data : [];

        masterDataDispatch({
          field: "stateList",
          value: resultArray,
        });
      })
      .catch((ex) => {
        console.log(ex);
      })
      .finally(() => {
        pageDispatch({ field: "isStateListLoading", value: false });
      });
  };

  useEffect(() => {
    if (
      isStateListLoading &&
      !isMainDataLoading &&
      mode === MasterData.pageMode.Edit
    ) {
      if (country !== null && country.trim().length > 0) {
        getStateListBasedOnCountry(country);
      } else {
        masterDataDispatch({ field: "stateList", value: [] });
        pageDispatch({ field: "isStateListLoading", value: false });
      }
    }
  }, [isStateListLoading, isMainDataLoading, country, mode]);

  useEffect(() => {
    if (country !== null && country.trim().length > 0) {
      getStateListBasedOnCountry(country);
    } else {
      masterDataDispatch({ field: "stateList", value: [] });
    }
  }, [country]);

  useEffect(() => {
    getMasterData(
      MasterData.lookupTypes.PatientRelationship,
      "relationshipList",
      "isRelationshipListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.Ethnicity,
      "ethnicityList",
      "isEthnicityListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.Nationality,
      "nationalityList",
      "isNationalityListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.Occupation,
      "occupationList",
      "isOccupationListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.PatientReferral,
      "referralList",
      "isReferralListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.BloodGroup,
      "bloodGroupList",
      "isBloodGroupListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.Country,
      "countryList",
      "isCountryListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.PatientGroup,
      "medicalGroupList",
      "isMedicalGroupListLoading"
    );
    getMasterData(
      MasterData.lookupTypes.MedicalHistory,
      "medicalHistoryList",
      "isMedicalHistoryListLoading"
    );
  }, []);

  const getMasterData = (lookupType, listName, loadStatus) => {
    MasterService.fetchLookupByType(
      lookupType,
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => lookupDataCallBack(response, listName, loadStatus))
      .catch((ex) => {
        console.log(ex);
      })
      .finally(() => {
        pageDispatch({ field: loadStatus, value: false });
      });
  };

  const lookupDataCallBack = (response, listName, loadStatus) => {
    const resultArray = Array.isArray(response.data) ? response.data : [];

    masterDataDispatch({
      field: listName,
      value: resultArray,
    });
  };

  /*  const getMasterData = (lookupType) => {
    const resultArray = MasterData.getLookupDataFromType(lookupType);

    switch (lookupType) {
      case MasterData.lookupTypes.PatientRelationship:
        // masterDataDispatch({
        //   field: "relationshipList",
        //   value: resultArray,
        // });
        MasterService.fetchLookupByType(
          MasterData.lookupTypes.PatientRelationship,
          AuthService.getLoggedInUserCompanyId
        )
          .then((response) => {
            const resultArray = Array.isArray(response.data)
              ? response.data
              : [];

            masterDataDispatch({
              field: "relationshipList",
              value: resultArray,
            });
          })
          .catch((ex) => {
            console.log(ex);
          }).finally(()=> {
            pageDispatch({field:"isRelationshipListLoading", value: false})
          });

        break;
      case MasterData.lookupTypes.Ethnicity:
        //masterDataDispatch({ field: "ethnicityList", value: resultArray });
        
        break;
      case MasterData.lookupTypes.Nationality:
         masterDataDispatch({
          field: "nationalityList",
          value: resultArray,
        }); 
        
        break;
      case MasterData.lookupTypes.Occupation:
        masterDataDispatch({ field: "occupationList", value: resultArray });
       break;
      case MasterData.lookupTypes.BloodGroup:
        masterDataDispatch({ field: "bloodGroupList", value: resultArray });
        break;
      case MasterData.lookupTypes.PatientReferral:
        masterDataDispatch({ field: "referralList", value: resultArray });
        break;
      case MasterData.lookupTypes.Country:
        masterDataDispatch({ field: "countryList", value: resultArray });
        break;
      case MasterData.lookupTypes.PatientGroup:
        masterDataDispatch({
          field: "medicalGroupList",
          value: resultArray,
        });
        break;
      case MasterData.lookupTypes.MedicalHistory:
        masterDataDispatch({
          field: "medicalHistoryList",
          value: resultArray,
        });
        break;
      default:
        console.log("Sorry");
    }
  }; */

  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    let isAddressFieldEntered = false;
    const validationState = { ...errState };
    validationState.patientNameError =
      patientName.trim().length === 0 ? "Please enter Patient Name" : "";

    validationState.genderError =
      gender === null || gender.trim().length === 0
        ? "Please select Patient Gender"
        : "";

    /*  if (validationState.emailError.trim().length === 0) {
      validationState.emailError =
        email.trim().length === 0 ? "Please enter Email" : "";
    } */

    //Commented by Mani on 22-Jun-2020 as per client request to make NRIC not mandatory
    /* validationState.idPassportNoError = "";
    if (idPassportNo === null || idPassportNo.trim().length === 0) {
      validationState.idPassportNoError = "Please enter NRIC/ID";
    } */

    validationState.mobileNoError = "";
    if (mobileNo.trim().length === 0) {
      validationState.mobileNoError = "Please enter Mobile No.";
    } else if (
      !Helper.validatePhoneNumber(
        AuthService.getUserInfo().companyDTO.companyDialCode,
        mobileNo
      )
    ) {
      validationState.mobileNoError = "Please enter valid Mobile No.";
    }

    //Removed country based phone validation for alternate contact no. on 24Jun20 as per client request.
    /* validationState.alternateContactNoError = "";
    if (
      alternateContactNo !== null &&
      alternateContactNo.trim().length > 0 &&
      !Helper.validatePhoneNumber(
        AuthService.getUserInfo().companyDTO.companyDialCode,
        alternateContactNo
      )
    ) {
      validationState.alternateContactNoError = "Please enter valid Mobile No.";
    } */

    validationState.emergencyContactNoError = "";
    if (
      relationshipContactNo !== null &&
      relationshipContactNo.trim().length > 0 &&
      !Helper.validatePhoneNumber(
        AuthService.getUserInfo().companyDTO.companyDialCode,
        relationshipContactNo
      )
    ) {
      validationState.emergencyContactNoError =
        "Please enter valid emergency Mobile No.";
    }

    Object.entries(addressState).forEach(([key, value]) => {
      if (value != null && value.length > 0) {
        isAddressFieldEntered = true;
      }
    });

    validationState.addressLine1Error = "";
    validationState.cityError = "";
    validationState.countryError = "";
    validationState.stateError = "";
    validationState.postalCodeError = "";
    validationState.addressNotFilledFullyError = "";

    if (isAddressFieldEntered) {
      validationState.addressLine1Error =
        addressLine1.trim().length === 0 ? "Please enter Address Line 1" : "";

      validationState.cityError =
        city.trim().length === 0 ? "Please enter City" : "";

      validationState.countryError =
        country === null || country.trim().length === 0
          ? "Please select Country"
          : "";

      validationState.stateError =
        state === null || state.trim().length === 0
          ? "Please select State"
          : "";

      validationState.postalCodeError =
        postalCode.trim().length === 0 ? "Please enter Postal Code" : "";

      if (
        validationState.addressLine1Error > 0 ||
        validationState.cityError > 0 ||
        validationState.countryError > 0 ||
        validationState.stateError > 0 ||
        validationState.postalCodeError.length > 0
      ) {
        validationState.addressNotFilledFullyError =
          "Please enter full address information (Address Line 1, City, State, Country & Postal Code)";
      } else {
        validationState.addressNotFilledFullyError = "";
      }
    }

    /* validationState.addressLine1Error =
      addressLine1.trim().length === 0 ? "Please enter Address Line 1" : "";

    validationState.cityError =
      city.trim().length === 0 ? "Please enter City" : "";

    validationState.countryError =
      country === null || country.trim().length === 0
        ? "Please select Country"
        : "";

    validationState.stateError =
      state === null || state.trim().length === 0 ? "Please select State" : "";

    validationState.postalCodeError =
      postalCode.trim().length === 0 ? "Please enter Postal Code" : ""; */

    //Check if there is any form errors
    Object.entries(validationState).forEach(([key, value]) => {
      if (value.length > 0) {
        submitForm = false;
        errDispatch({
          field: `${key}`,
          value: `${value}`,
        });
      } else {
        errDispatch({
          field: `${key}`,
          value: "",
        });
      }
    });

    //setErrorWarning(submitForm ? "" : "Highlighted fields must be corrected.");
    pageDispatch({
      field: "errorWarning",
      value: submitForm ? "" : "Highlighted fields must be corrected.",
    });

    return submitForm;
  };

  const handleClose = (event, reason) => {
    //setOpen(false);
    pageDispatch({
      field: "openSnackMessage",
      value: false,
    });
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleEmailBlur = (e) => {
    if (e.target.value !== null && e.target.value.length > 0) {
      errDispatch({
        field: "emailError",
        value: Helper.validateEmail(e.target.value)
          ? ""
          : "Please enter valid email addess",
      });
    } else {
      errDispatch({
        field: "emailError",
        value: "",
      });
    }
  };

  //Function to close the add lookup dialog
  const handleLookupDialogClose = () => {
    setAddLookup(false);
  };

  //Function called after lookup is added in dialog. List is refreshed.
  const handlePostLookupSave = (returnValue) => {
    const updatedType = lookups.find((x) => x.type === returnValue.lookupType);
    pageDispatch({ field: updatedType.loadStatus, value: true });
    setAddLookup(false);
    setReturnObject(returnValue);

    getMasterData(
      updatedType.type,
      updatedType.listName,
      updatedType.loadStatus
    );
  };

  //Props for the lookup dialog
  const getLookupDialogProps = (lookupType) => {
    return {
      open: addLookup,
      close: handleLookupDialogClose,
      postSave: handlePostLookupSave,
      labels: lookups.find((x) => x.type === lookupType).labels,
      companyId: AuthService.getLoggedInUserCompanyId(),
      lookupType: lookupType,
    };
  };

  //Method called when Add link is clicked for lookup
  const addLookupByType = (e, type) => {
    e.preventDefault();
    setSelectedType(type);
    setAddLookup(true);
  };

  const updateIdForDropdown = (
    loading,
    dropdownLoading,
    valueObject,
    key,
    idName
  ) => {
    if (
      !loading &&
      !dropdownLoading &&
      valueObject.hasOwnProperty("lookupKey") &&
      valueObject.lookupType === key
    ) {
      dispatch({
        field: idName,
        value: valueObject.lookupKey,
      });
    }
  };

  //UseEffect to select the newly added lookup automatically - Referral
  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isReferralListLoading,
      returnObject,
      MasterData.lookupTypes.PatientReferral,
      "referredBy"
    );
  }, [isLoading, referralList, returnObject, isReferralListLoading]);

  //UseEffect to select the newly added lookup automatically - Occupation
  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isOccupationListLoading,
      returnObject,
      MasterData.lookupTypes.Occupation,
      "occupation"
    );
  }, [isLoading, occupationList, returnObject, isOccupationListLoading]);

  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isNationalityListLoading,
      returnObject,
      MasterData.lookupTypes.Nationality,
      "nationality"
    );
  }, [isLoading, nationalityList, returnObject, isNationalityListLoading]);

  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isEthnicityListLoading,
      returnObject,
      MasterData.lookupTypes.Ethnicity,
      "ethnicity"
    );
  }, [isLoading, ethnicity, returnObject, isEthnicityListLoading]);

  const getPatientHistoryList = (stateObj) => {
    const historyList = [...stateObj.patientMedicalHistories];

    historyList.map((option) => {
      option.recordStatus = MasterData.recordStatus.delete;
    });

    if (selectedMedicalHistory !== null) {
      selectedMedicalHistory.map((option) => {
        //Check if already exists
        let objIndex = -1;

        if (Array.isArray(historyList)) {
          objIndex = historyList.findIndex(
            (x) => x.medicalHistory === option.lookupKey
          );
        }

        if (objIndex === -1) {
          const historyObject = {
            ...PatientConstants.patientMedicalHistoryObject,
          };
          historyObject.id = null;
          historyObject.medicalHistory = option.lookupKey;
          historyObject.patientId = null;
          historyObject.recordStatus = MasterData.recordStatus.insert;
          historyList.push(historyObject);
        } else {
          historyList[objIndex].recordStatus = MasterData.recordStatus.update;
        }
      });
    }

    return historyList;
  };

  const getPatientGroupList = (stateObj) => {
    const groupList = [...stateObj.patientMedicalGroups];

    groupList.map((option) => {
      option.recordStatus = MasterData.recordStatus.delete;
    });

    if (selectedMedicalGroup !== null) {
      selectedMedicalGroup.map((option) => {
        //Check if already exists
        let objIndex = -1;

        if (Array.isArray(groupList)) {
          objIndex = groupList.findIndex(
            (x) => x.groupCode === option.lookupKey
          );
        }

        if (objIndex === -1) {
          const groupObject = {
            ...PatientConstants.patientMedicalGroupObject,
          };
          groupObject.id = null;
          groupObject.groupCode = option.lookupKey;
          groupObject.patientId = null;
          groupObject.recordStatus = MasterData.recordStatus.insert;
          groupList.push(groupObject);
        } else {
          groupList[objIndex].recordStatus = MasterData.recordStatus.update;
        }
      });
    }

    return groupList;
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!isRequiredFieldsAvailable()) {
      return;
    }

    //disable the submit button
    //setDisableSubmit(true);
    pageDispatch({
      field: "disableSubmit",
      value: true,
    });

    const submitState = { ...patientState };

    if (mode === MasterData.pageMode.Add) {
      submitState.companyId = AuthService.getLoggedInUserCompanyId();
      submitState.loginId = AuthService.getLoggedInUserId();
      submitState.createdDate = moment(
        Helper.getCurrentDateTime(),
        "YYYY-MM-DD HH:mm"
      );
    }

    /* submitState.dob =
      submitState.dob !== null ? moment(submitState.dob, "YYYY-MM-DD") : null; */

    submitState.dob =
      submitState.dob !== null
        ? moment(submitState.dob).format("YYYY-MM-DD")
        : null;

    //console.log(submitState.dob.);

    submitState.addressDTO = addressState;
    submitState.patientMedicalHistories = getPatientHistoryList(submitState);
    submitState.patientMedicalGroups = getPatientGroupList(submitState);

    //console.log(submitState);

    if (mode === MasterData.pageMode.Add) {
      PatientService.addPatient(submitState)
        .then((response) => {
          //setOpen(true);
          pageDispatch({
            field: "openSnackMessage",
            value: true,
          });
        })
        .catch((ex) => {
          console.log(ex);
          pageDispatch({
            field: "disableSubmit",
            value: false,
          });
        });
    } else {
      PatientService.updatePatient(submitState)
        .then((response) => {
          pageDispatch({
            field: "openSnackMessage",
            value: true,
          });
        })
        .catch((ex) => {
          console.log(ex);
          pageDispatch({
            field: "disableSubmit",
            value: false,
          });
        });
    }
  };

  return (
    <>
      {isLoading === false ? (
        <div>
          <Typography variant="h5" gutterBottom>
            Patients
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please fill in patient information (fields with * are mandatory)
          </Typography>
          {errorWarning.length > 0 ? (
            <Typography variant="subtitle1" gutterBottom>
              <span className={`${classes.LeftMargin5} ${classes.ErrorText}`}>
                {errorWarning}
              </span>
            </Typography>
          ) : (
            ""
          )}
          <form onSubmit={submitForm} noValidate>
            <div className={classes.PatientAddEditLayout}>
              <div className={classes.PatientAddEditFormSection}>
                {/* Basic Information */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.HeadingColor}
                  >
                    Basic Information
                  </Typography>
                  <div className={classes.ThreeColumnGrid}>
                    <div>
                      <TextField
                        label="Patient Name"
                        id="patientName"
                        name="patientName"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        required
                        value={patientName}
                        onChange={onChange}
                        inputProps={{ maxLength: 255 }}
                        error={patientNameError.length > 0 ? true : false}
                        helperText={patientNameError}
                      />
                    </div>
                    <div>
                      <TextField
                        label="NRIC / ID"
                        id="idPassportNo"
                        name="idPassportNo"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 25 }}
                        value={idPassportNo !== null ? idPassportNo : ""}
                        onChange={onChange}
                        error={idPassportNoError.length > 0 ? true : false}
                        helperText={idPassportNoError}
                      />
                    </div>
                    <div className={classes.RadioAlign}>
                      <FormControl
                        component="fieldset"
                        required
                        error={genderError.length > 0 ? true : false}
                      >
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup
                          aria-label="position"
                          name="gender"
                          id="gender"
                          row
                          value={gender}
                          onChange={onChange}
                        >
                          <FormControlLabel
                            value="M"
                            control={<Radio color="primary" />}
                            label="Male"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="F"
                            control={<Radio color="primary" />}
                            label="Female"
                            labelPlacement="end"
                          />
                        </RadioGroup>
                        <FormHelperText>{genderError}</FormHelperText>
                      </FormControl>
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableFuture
                          clearable
                          fullWidth
                          label={"Date of birth"}
                          invalidDateMessage={
                            "Enter date in format " +
                            Helper.getInputDateFormat().toLowerCase()
                          }
                          maxDateMessage={"Date should not be in future"}
                          minDateMessage={
                            "Date should not be before minimal date (01-01-1900)"
                          }
                          id="dob"
                          name="dob"
                          value={dob}
                          onChange={(date) => handleDateChange(date)}
                          format={Helper.getInputDateFormat()}
                          onError={handleDateError}
                          helperText={
                            dobError.length > 0
                              ? dobError
                              : Helper.getInputDateFormat().toLowerCase()
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div>
                      <TextField
                        label="Mobile"
                        id="mobileNo"
                        name="mobileNo"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        required
                        value={mobileNo}
                        onChange={onChange}
                        inputProps={{ maxLength: 50 }}
                        error={mobileNoError.length > 0 ? true : false}
                        helperText={mobileNoError}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {"+" +
                                AuthService.getUserInfo().companyDTO
                                  .companyDialCode}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Email"
                        id="email"
                        name="email"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 300 }}
                        type="email"
                        value={email}
                        onChange={onChange}
                        error={emailError.length > 0 ? true : false}
                        helperText={emailError}
                        onBlur={handleEmailBlur}
                      />
                    </div>

                    <div>
                      <TextField
                        label="Alternate Contact No."
                        id="alternateContactNo"
                        name="alternateContactNo"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={
                          alternateContactNo !== null ? alternateContactNo : ""
                        }
                        onChange={onChange}
                        inputProps={{ maxLength: 50 }}
                        /* InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {"+" +
                                AuthService.getUserInfo().companyDTO
                                  .companyDialCode}
                            </InputAdornment>
                          ),
                        }} */
                        error={
                          alternateContactNoError.length > 0 ? true : false
                        }
                        helperText={alternateContactNoError}
                      />
                    </div>
                  </div>
                </Paper>
                {/* End Basic Information */}
                {/* Contact Information */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.HeadingColor}
                  >
                    Address Information
                  </Typography>
                  {addressNotFilledFullyError.length > 0 ? (
                    <Typography variant="subtitle1" gutterBottom>
                      <span
                        className={`${classes.LeftMargin5} ${classes.ErrorText}`}
                      >
                        {addressNotFilledFullyError}
                      </span>
                    </Typography>
                  ) : (
                    ""
                  )}
                  <div className={classes.ThreeColumnGrid}>
                    <div>
                      <TextField
                        label="Address 1"
                        id="addressLine1"
                        name="addressLine1"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={addressLine1}
                        onChange={onChangeAddress}
                        inputProps={{ maxLength: 255 }}
                        error={addressLine1Error.length > 0 ? true : false}
                        helperText={addressLine1Error}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Address 2"
                        id="addressLine2"
                        name="addressLine2"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={addressLine2 !== null ? addressLine2 : ""}
                        onChange={onChangeAddress}
                        inputProps={{ maxLength: 255 }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Address 3"
                        id="addressLine3"
                        name="addressLine3"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={addressLine3 !== null ? addressLine3 : ""}
                        onChange={onChangeAddress}
                        inputProps={{ maxLength: 255 }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="City"
                        id="city"
                        name="city"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={city}
                        onChange={onChangeAddress}
                        inputProps={{ maxLength: 100 }}
                        error={cityError.length > 0 ? true : false}
                        helperText={cityError}
                      />
                    </div>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={countryList}
                        label="Country"
                        id="country"
                        name="country"
                        keyValue="lookupKey"
                        keyLabel="lookupValue"
                        initialValue={country}
                        callbackFunction={onChangeAddressNameValue}
                        errorText={countryError}
                      ></AutoCompleteSelect>
                    </div>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={stateList}
                        label="State"
                        id="state"
                        name="state"
                        keyValue="lookupKey"
                        keyLabel="lookupValue"
                        initialValue={state}
                        callbackFunction={onChangeAddressNameValue}
                        errorText={stateError}
                      ></AutoCompleteSelect>
                    </div>
                    <div>
                      <TextField
                        label="Potal Code"
                        id="postalCode"
                        name="postalCode"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={postalCode}
                        onChange={onChangeAddress}
                        inputProps={{ maxLength: 10 }}
                        error={postalCodeError.length > 0 ? true : false}
                        helperText={postalCodeError}
                      />
                    </div>
                  </div>
                </Paper>
                {/* End Contact Information */}
                {/* Emergency Information */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.HeadingColor}
                  >
                    Emergency Contact Information
                  </Typography>
                  <div className={classes.ThreeColumnGrid}>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={relationshipList}
                        label="Relation"
                        id="relationshipCode"
                        name="relationshipCode"
                        keyValue="lookupKey"
                        keyLabel="lookupValue"
                        initialValue={relationshipCode}
                        callbackFunction={onChangeNameValue}
                      ></AutoCompleteSelect>
                    </div>
                    <div>
                      <TextField
                        label="Relation Name"
                        id="relationshipName"
                        name="relationshipName"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 100 }}
                        value={
                          relationshipName !== null ? relationshipName : ""
                        }
                        onChange={onChange}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Relation Contact No"
                        id="relationshipContactNo"
                        name="relationshipContactNo"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 100 }}
                        value={
                          relationshipContactNo !== null
                            ? relationshipContactNo
                            : ""
                        }
                        onChange={onChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {"+" +
                                AuthService.getUserInfo().companyDTO
                                  .companyDialCode}
                            </InputAdornment>
                          ),
                        }}
                        error={
                          emergencyContactNoError.length > 0 ? true : false
                        }
                        helperText={emergencyContactNoError}
                      />
                    </div>
                  </div>
                </Paper>
                {/* End Emergency Information */}
                {/* Additional Information */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.HeadingColor}
                  >
                    Additional Information
                  </Typography>
                  <div className={classes.ThreeColumnGrid}>
                    <div>
                      <span>
                        <AutoCompleteSelect
                          fullWidth
                          data={referralList}
                          label="Referred By"
                          id="referredBy"
                          name="referredBy"
                          keyValue="lookupKey"
                          keyLabel="lookupValue"
                          initialValue={referredBy}
                          callbackFunction={onChangeNameValue}
                        ></AutoCompleteSelect>
                      </span>

                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) =>
                            addLookupByType(
                              e,
                              MasterData.lookupTypes.PatientReferral
                            )
                          }
                        >
                          Add Referral
                        </Link>
                      </span>
                    </div>
                    <div>
                      <span>
                        <AutoCompleteSelect
                          fullWidth
                          data={ethnicityList}
                          label="Ethnicity"
                          id="ethnicity"
                          name="ethnicity"
                          keyValue="lookupKey"
                          keyLabel="lookupValue"
                          initialValue={ethnicity}
                          callbackFunction={onChangeNameValue}
                        ></AutoCompleteSelect>
                      </span>

                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) =>
                            addLookupByType(e, MasterData.lookupTypes.Ethnicity)
                          }
                        >
                          Add Ethnicity
                        </Link>
                      </span>
                    </div>
                    <div>
                      <span>
                        <AutoCompleteSelect
                          fullWidth
                          data={nationalityList}
                          label="Nationality"
                          id="nationality"
                          name="nationality"
                          keyValue="lookupKey"
                          keyLabel="lookupValue"
                          initialValue={nationality}
                          callbackFunction={onChangeNameValue}
                        ></AutoCompleteSelect>
                      </span>

                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) =>
                            addLookupByType(
                              e,
                              MasterData.lookupTypes.Nationality
                            )
                          }
                        >
                          Add Nationality
                        </Link>
                      </span>
                    </div>
                    <div>
                      <span>
                        <AutoCompleteSelect
                          fullWidth
                          data={occupationList}
                          label="Occupation"
                          id="occupation"
                          name="occupation"
                          keyValue="lookupKey"
                          keyLabel="lookupValue"
                          initialValue={occupation}
                          callbackFunction={onChangeNameValue}
                        ></AutoCompleteSelect>
                      </span>

                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) =>
                            addLookupByType(
                              e,
                              MasterData.lookupTypes.Occupation
                            )
                          }
                        >
                          Add Occupation
                        </Link>
                      </span>
                    </div>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={bloodGroupList}
                        label="Blood Group"
                        id="bloodGroup"
                        name="bloodGroup"
                        keyValue="lookupKey"
                        keyLabel="lookupValue"
                        initialValue={bloodGroup}
                        callbackFunction={onChangeNameValue}
                      ></AutoCompleteSelect>
                    </div>
                  </div>
                </Paper>
                {/* End - Additional Information */}
                {/* Medical History */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.HeadingColor}
                  >
                    Medical History Information
                  </Typography>
                  <div className={classes.ThreeColumnGrid}>
                    <div
                      className={classes.TwoColumnOverride}
                      style={{ marginTop: "15px" }}
                    >
                      <Select
                        options={medicalHistoryList}
                        id="medicalHistoryList"
                        menuPlacement="auto"
                        isMulti="true"
                        getOptionLabel={(option) => option.lookupValue}
                        getOptionValue={(option) => option.lookupKey}
                        onChange={onChangeMedicalHistory}
                        value={selectedMedicalHistory}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Other Medical History"
                        id="otherMedicalHistory"
                        name="otherMedicalHistory"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 500 }}
                        value={
                          otherMedicalHistory !== null
                            ? otherMedicalHistory
                            : ""
                        }
                        onChange={onChange}
                        multiline
                      />
                    </div>
                  </div>
                </Paper>
                {/* End Medical History */}
                {/* Medical Group */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.HeadingColor}
                  >
                    Medical Group Information
                  </Typography>
                  <div className={classes.ThreeColumnGrid}>
                    <div className={classes.TwoColumnOverride}>
                      <Select
                        options={medicalGroupList}
                        id="medicalGroupList"
                        menuPlacement="auto"
                        isMulti="true"
                        getOptionLabel={(option) => option.lookupValue}
                        getOptionValue={(option) => option.lookupKey}
                        onChange={onChangeMedicalGroup}
                        value={selectedMedicalGroup}
                      />
                    </div>
                  </div>
                </Paper>
                {/* End Medical Group */}
              </div>
              <div className={classes.PatientAddEditButtonSection}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    disabled={disableSubmit ? true : false}
                    fullWidth
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    fullWidth
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <BackdropLoader open={true}></BackdropLoader>
      )}

      <NotificationDialog
        open={openSnackMessage}
        handleClose={handleClose}
        title="Patients"
      >
        <span>
          {mode === "ADD"
            ? "Patient details added successfully!!"
            : "Patient details updated successfully!!"}
        </span>
      </NotificationDialog>

      {selectedType.length > 0 ? (
        <LookupAddDialog
          {...getLookupDialogProps(selectedType)}
        ></LookupAddDialog>
      ) : (
        ""
      )}
    </>
  );
};

export default PatientAddEdit;
