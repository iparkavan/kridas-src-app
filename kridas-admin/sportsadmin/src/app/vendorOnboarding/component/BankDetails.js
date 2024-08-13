import { makeStyles } from "@material-ui/styles";
import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputField from "../../common/ui/components/InputField";

const useStyles = makeStyles((theme) => ({
  field: {
    width: "250px",
    margin: "16px",
  },

  fieldAlign: {
    marginTop: "20px",
  },
}));

const BankDetails = (props) => {
  let AddressDeclaration = "address";
  const classes = useStyles();
  const { setUserDetails, userDetails, country, errors } = props;
  const { address, countryData } = props.userDetails;

  let defaultData = {
    countryStates: [{ stateCode: "", stateName: "" }],
  };
  const { country_states } =
    countryData === undefined ? defaultData : JSON.parse(countryData);
  //HANDLER
  const handleAddress = (e) => {
    let addressName = { ...address, [e.target.name]: e.target.value };
    setUserDetails({ ...userDetails, [AddressDeclaration]: addressName });
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className={classes.fieldAlign}>
        <InputField
          className={classes.field}
          label="Address 1"
          name="line1"
          rowsMax={4}
          multiline={true}
          value={address?.line1 || ""}
          onChange={(e) => handleAddress(e)}
        />

        <InputField
          className={classes.field}
          label="Address 2"
          name="line2"
          rowsMax={4}
          multiline={true}
          value={address?.line2 || ""}
          onChange={(e) => handleAddress(e)}
        />

        <FormControl className={classes.field}>
          <InputLabel id="demo-simple-select-helper-label">Country</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={countryData ? countryData : "" || ""}
            name="countryData"
            label="Country "
            inputlabelprops={{ shrink: true }}
            onChange={(e) => handleChange(e)}
          >
            {country?.map((country1, index) => (
              <MenuItem value={JSON.stringify(country1)} key={index}>
                {country1.country_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.field}>
          <InputLabel id="demo-simple-select-helper-label">State</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={address?.state ? address?.state : "" || ""}
            name="state"
            label="State"
            multiline={true}
            inputlabelprops={{ shrink: true }}
            onChange={(e) => handleAddress(e)}
          >
            {country_states?.map((states, index) => (
              <MenuItem value={states?.state_code} key={index}>
                {states?.state_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <InputField
          className={classes.field}
          label="City"
          name="city"
          rowsMax={4}
          multiline={true}
          value={address?.city || ""}
          onChange={(e) => handleAddress(e)}
          error={Boolean(errors?.city)}
          helperText={errors?.city}
        />

        <InputField
          className={classes.field}
          label="Pincode"
          name="pincode"
          rowsMax={4}
          multiline={true}
          value={address?.pincode || ""}
          onChange={(e) => handleAddress(e)}
          error={Boolean(errors?.pincode)}
          helperText={errors?.pincode}
        />
      </div>
    </>
  );
};

export default BankDetails;
