import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import PatientTab from "./PatientTab";
import PatientService from "../../service/PatientService";
import BackdropLoader from "../../elements/ui/BackdropLoader/BackdropLoader";
import MasterData from "../helper/masterdata";
import AuthService from "../../service/AuthService";

const PatientDetail = (props) => {
  const [patientInfo, setPatientInfo] = useState({});
  const [referralList, setReferralList] = useState([]);
  const [occupationList, setOccupationList] = useState([]);
  const [nationalityList, setNationalityList] = useState([]);
  const [ethnicityList, setEthnicityList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isPatientLoading, setIsPatientLoading] = useState(true);
  const [isReferralListLoading, setIsReferralListLoading] = useState(true);
  const [isOccupationListLoading, setIsOccupationListLoading] = useState(true);
  const [isNationalityListLoading, setIsNationalityListLoading] = useState(
    true
  );
  const [isEthnicityListLoading, setIsEthnicityListLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (
      !isPatientLoading &&
      !isEthnicityListLoading &&
      !isNationalityListLoading &&
      !isOccupationListLoading &&
      !isReferralListLoading
    ) {
      setIsLoading(false);
    }
  }, [
    isPatientLoading,
    isEthnicityListLoading,
    isNationalityListLoading,
    isReferralListLoading,
    isOccupationListLoading,
  ]);

  useEffect(() => {
    if (isPatientLoading) {
      getPatientDetails(id);
    }
  }, [isPatientLoading, id]);

  useEffect(() => {
    //Referral
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      MasterData.lookupTypes.PatientReferral,
      (res) => {
        setReferralList(Array.isArray(res.data) ? res.data : []);
      },
      () => {
        setIsReferralListLoading(false);
      }
    );

    //Occupation
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      MasterData.lookupTypes.Occupation,
      (res) => {
        setOccupationList(Array.isArray(res.data) ? res.data : []);
      },
      () => {
        setIsOccupationListLoading(false);
      }
    );

    //Nationality
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      MasterData.lookupTypes.Nationality,
      (res) => {
        setNationalityList(Array.isArray(res.data) ? res.data : []);
      },
      () => {
        setIsNationalityListLoading(false);
      }
    );

    //Ethnicity
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      MasterData.lookupTypes.Ethnicity,
      (res) => {
        setEthnicityList(Array.isArray(res.data) ? res.data : []);
      },
      () => {
        setIsEthnicityListLoading(false);
      }
    );
  }, []);

  const getPatientDetails = (patient) => {
    PatientService.fetchPatientById(patient)
      .then((res) => {
        setPatientInfo(res.data);
      })
      .finally(() => {
        setIsPatientLoading(false);
      });
  };

  const patientTabProps = {
    patientInfo: patientInfo,
    referralList: referralList,
    occupationList: occupationList,
    ethnicityList: ethnicityList,
    nationalityList: nationalityList,
  };

  return (
    <>
      {isLoading === false ? (
        <div>
          <Typography variant="h5" gutterBottom>
            <span>{patientInfo.patientName}</span>
            <span style={{ fontSize: "1rem", marginLeft: "5px" }}>
              (#{patientInfo.id})
            </span>
          </Typography>
          <div>
            {/* <PatientTab patientInfo={patientInfo}></PatientTab> */}
            <PatientTab {...patientTabProps}></PatientTab>
          </div>
        </div>
      ) : (
        <BackdropLoader></BackdropLoader>
      )}
    </>
  );
};

export default PatientDetail;
