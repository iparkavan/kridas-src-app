import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import useHttp from "../../../hooks/useHttp";
import companyConfig from "../../company/config/CompanyConfig";
import BodyText from "../../common/ui/components/BodyText";
import BodyHeading from "../../common/ui/components/BodyHeading";
import Address from "../../common/ui/components/Address";
import ExternalLink from "../../common/ui/components/ExternalLink";
import LinkListWithObject from "../../common/ui/components/LinkListWithObject";
const useStyles = makeStyles(() => ({
  sectionSpace: {
    margin: "20px 0",
  },
}));

const CompanyProfile = (props) => {
  const classes = useStyles();
  const { companyId } = props;
  const [companyDetails, setCompanyDetails] = useState({});
  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    const config = companyConfig.getCompanyById(companyId);

    const transformDate = (data) => {
      setCompanyDetails(data.data);
    };

    sendRequest(config, transformDate);
  }, [sendRequest, companyId]);
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <BodyText>{companyDetails.company_name}</BodyText>
        <BodyText>{companyDetails.company_email}</BodyText>
        <BodyText>{companyDetails.company_contact_no}</BodyText>
        <ExternalLink url={companyDetails.company_website}>
          Website
        </ExternalLink>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>Address</BodyHeading>
        <Divider></Divider>
        <div className={classes.sectionSpace}>
          <Address address={companyDetails.address} />
        </div>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>Social Media Links</BodyHeading>
        <Divider></Divider>
        <div className={classes.sectionSpace}>
          <LinkListWithObject listItems={companyDetails.social} />
        </div>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>Documents</BodyHeading>
        <Divider></Divider>
        <div className={classes.sectionSpace}>
          <LinkListWithObject
            listItems={companyDetails.company_identity_docs}
          />
        </div>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>About</BodyHeading>
        <Divider></Divider>
        <div className={classes.sectionSpace}>
          <BodyText>
            {companyDetails.company_desc === null
              ? "No data available on file."
              : companyDetails.company_desc}
          </BodyText>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
