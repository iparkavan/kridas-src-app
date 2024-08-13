import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import VerifiedIcon from "@mui/icons-material/Verified";
import useHttp from "../../../hooks/useHttp";
import companyConfig from "../config/CompanyConfig";
import BodyText from "../../common/ui/components/BodyText";
import Address from "../../common/ui/components/Address";
import ExternalLink from "../../common/ui/components/ExternalLink";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, IconButton } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  sectionSpace: {
    margin: "10px 0 0px 0",
  },
  contentSpace: {
    margin: "1px 0 0 0",
  },
  totalMargin: {
    margin: "1%",
    marginLeft: "10px",
  },
  tableAlign: {
    width: "100%",
    margin: "10px 0 0 0",
  },
  boldText: {
    fontWeight: "500",
  },
  logoPreview: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    width: "47vh",
    height: "26vh",
    marginLeft: "40px",
    marginTop: "10px",
  },
  coverImage: {
    marginBottom: "20px",
    width: "full",
    height: "250px",
    objectFit: "conver",
  },
  profilePic: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
  },
  doubleGrid: {
    display: "flex",
    columnGap: "20px",
  },
  userDetails: {
    // lineHeight: "5px",
    borderRight: "solid rgba(0, 0, 0, 0.12)",
    paddingRight: "20px",
  },
  companyTitle: {
    fontFamily: "bold",
  },
  flexStatus: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  heading: {
    color: "#97BFB4",
    // marginTop: "auto"
    // lineHeight: "1px",
    // paddingTop: "10px",
  },
  status: {
    margin: 0,
    // lineHeight: "5px",
    // marginLeft: "10px",
  },
  verifiedIcon: {
    color: "green",
    // paddingTop: "10px",
    // alignItems: "center",
    marginLeft: "4px",
  },
  unverified: {
    // paddingTop: "5px",
  },
  mailAndContactIcons: {
    color: "#97BFB4",
    marginRight: "12px",
  },
}));

const CompanyProfile = (props) => {
  const classes = useStyles();
  const { companyId } = props;
  const [companyDetails, setCompanyDetails] = useState({});
  const { isLoading, sendRequest } = useHttp();
  console.log(companyDetails);

  useEffect(() => {
    const config = companyConfig.getCompanyById(companyId);

    const transformDate = (data) => {
      setCompanyDetails(data.data);
    };

    sendRequest(config, transformDate);
  }, [sendRequest, companyId]);

  const getSocialIcon = (type) => {
    switch (type) {
      case "FBK":
        return FacebookRoundedIcon;
      case "INS":
        return InstagramIcon;
      case "LIN":
        return LinkedInIcon;
      case "TWI":
        return TwitterIcon;
      default:
        return null;
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        {companyDetails.company_img && (
          <img
            className={classes.coverImage}
            src={companyDetails.company_img}
            alt="coverImage"
          />
        )}
      </div>
      <div className={classes.doubleGrid}>
        <div className={classes.userDetails}>
          {companyDetails.company_profile_img && (
            <img
              className={classes.profilePic}
              src={companyDetails.company_profile_img}
              alt="profilePic"
            />
          )}
          <h2 className={classes.companyTitle}>
            {companyDetails.company_name}
          </h2>
          {companyDetails.company_email && (
            <Box display="flex" alignItems="center">
              <EmailOutlinedIcon className={classes.mailAndContactIcons} />{" "}
              {companyDetails.company_email}
            </Box>
          )}
          {companyDetails.company_contact_no && (
            <Box
              display="flex"
              alignItems="center"
              marginTop={2}
              marginBottom={1}
            >
              <CallOutlinedIcon className={classes.mailAndContactIcons} />{" "}
              {companyDetails.company_contact_no}
            </Box>
          )}
          <div className={classes.flexStatus}>
            <h3 className={classes.heading}>Profile Status: </h3>
            <p className={classes.status}>
              {companyDetails.company_profile_verified ? (
                <Box display="flex" alignItems="center">
                  <p>Verified</p>
                  <VerifiedIcon className={classes.verifiedIcon} />
                </Box>
              ) : (
                <p className={classes.unverified}>Unverified</p>
              )}
            </p>
          </div>

          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Social Media Links</h3>
            <div className={classes.sectionSpace}>
              {companyDetails?.social?.map((soc) => {
                if (soc.link) {
                  const Icon = getSocialIcon(soc.type);
                  return (
                    <IconButton onClick={() => window.open(soc.link)}>
                      <Icon />
                    </IconButton>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>

        <div>
          <h2>Details</h2>
          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>About</h3>
            <div className={classes.sectionSpace}>
              <BodyText>
                {companyDetails.company_desc === null
                  ? "No data available on file."
                  : companyDetails.company_desc}
              </BodyText>
            </div>
          </div>
          <h3 className={classes.heading}>Website</h3>
          <ExternalLink url={companyDetails.company_website}>
            {companyDetails.company_website}
          </ExternalLink>
          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Address</h3>
            <div className={classes.sectionSpace}>
              <Address address={companyDetails.address} />
            </div>
          </div>
          {/* <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Referral Code</h3>
          </div> */}
          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Type</h3>
            <p>{companyDetails.company_type_name.company_type}</p>
          </div>
          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Parent Category</h3>
            <p>{companyDetails.parent_category_name}</p>
          </div>
          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Sub Category</h3>
            <p>
              {companyDetails?.category_arr?.map((subCat, index) => {
                let str = subCat.category_name;
                if (index !== companyDetails.category_arr.length - 1) {
                  str += ", ";
                }
                return str;
              })}
            </p>
          </div>
          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Sports Associated</h3>
            <p>{companyDetails.sports_interested_name.join(", ")}</p>
          </div>
          {/* <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Documents</h3>
            <div className={classes.sectionSpace}>
              <LinkListWithObject
                listItems={companyDetails.company_identity_docs}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
