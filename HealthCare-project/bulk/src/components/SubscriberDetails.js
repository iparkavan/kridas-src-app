/* eslint-disable no-useless-escape */
import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Axios from "axios";
import logo from "../img/beats-health.png";
import { ToastError } from "../service/toast/Toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Select from 'react-select';

const BootstrapInput = withStyles((theme) =>
    createStyles({
        root: {
            "label + &": {
                marginTop: theme.spacing(3),
            },
        },
        input: {},
    })
)(InputBase);

const entityTypes = [
    { value: 'LLC', label: 'LLC' },
    { value: 'S Corp', label: 'S Corp' },
    { value: 'C Corp', label: 'C Corp' },
    { value: 'Partnership Organization', label: 'Partnership Organization' },
    { value: 'Other', label: 'Other' }
];

const COUNTRY_LIST = [
    { value:'United States of America', label: 'United States of America' },
    { value:'India', label: 'India' }
]

function SubscriberDetails(props) {
    const defaultFormData = {
        isRegisterdInUs: true,
        ein: '',
        entityType: '',
        registerdState: '',
        companyLegalName: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        workEmail: '',
        contactNumber: '',
        contactNumberHidden: '',
        isSameAddress: false,
        billingAddressLine1: '',
        billingAddressLine2: '',
        billingCountry: '',
        billingState: '',
        billingCity: '',
        billingzip: '',
        billingWorkEmail: '',
        billingContactNumber: '',
        billingContactNumberHidden: ''
    }

    const [formData, setFormData] = React.useState(defaultFormData);
    const [isButtonClicked, setIsButtonClicked] = React.useState(false);

    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const numberPattern = new RegExp(/^[0-9\b]+$/);

    const createPhoneNumber =(keyName, keyValue)=> {
        if(keyValue.length === 10){
            const data = { ...formData };
            let newNumber =  `${keyValue.substring(0, 3)}-${keyValue.substring(3, 6)}-${keyValue.substring(6)}`;
            data[keyName] = newNumber;
            setFormData(data);
        }
    }

    const onFormChange = (keyName, keyValue) => {
        const data = { ...formData };
        data[keyName] = keyValue;
        if((keyName === 'isSameAddress' && keyValue) || data.isSameAddress){
            data['billingAddressLine1'] = data.addressLine1;
            data['billingAddressLine2'] = data.addressLine2;
            data['billingCountry'] = data.country;
            data['billingState'] = data.state;
            data['billingCity'] = data.city;
            data['billingzip'] = data.zip;
            data['billingWorkEmail'] = data.workEmail;
            data['billingContactNumber'] = data.contactNumber;
        }else if(keyName === 'isSameAddress' && !keyValue){
            data['billingAddressLine1'] = '';
            data['billingAddressLine2'] = '';
            data['billingCountry'] = '';
            data['billingState'] = '';
            data['billingCity'] = '';
            data['billingzip'] = '';
            data['billingWorkEmail'] = '';
            data['billingContactNumber'] = '';
        }
        if(keyName === 'isRegisterdInUs'){
            data.ein = '';
            data.entityType = '';
            data.registerdState = '';
        }
        // eslint-disable-next-line eqeqeq
        if(keyName == 'contactNumber' || keyName == 'billingContactNumber'){
            data[keyName+'Hidden'] = keyValue;
        }
        setFormData(data);
    };

    const onClickContinue =async()=> {
        setIsButtonClicked(true);
        if((formData.isRegisterdInUs && !formData.ein.trim()) || (formData.isRegisterdInUs && !formData.entityType.trim()) || (formData.isRegisterdInUs && !formData.registerdState.trim()) || !formData.companyLegalName.trim() 
            || !formData.addressLine1.trim() || !formData.country.trim() || !formData.state.trim() || !formData.city.trim()
            || !formData.zip.trim() || !formData.workEmail.trim() || !formData.contactNumber.trim() || !formData.billingAddressLine1.trim() 
            || !formData.billingCountry.trim() || !formData.billingState.trim() || !formData.billingCity.trim()
            || !formData.billingzip.trim() || !formData.billingWorkEmail.trim() || !formData.billingContactNumber.trim()){
            ToastError("Please fill all required fields");
        }else{
            if((formData.billingWorkEmail && !emailPattern.test(formData.billingWorkEmail)) || (formData.workEmail && !emailPattern.test(formData.workEmail))){
                ToastError("Please enter a valid email address");
                return;
            }
            if((formData.contactNumberHidden && (!numberPattern.test(formData.contactNumberHidden) || formData.contactNumberHidden.length !== 10)) || (formData.billingContactNumberHidden && (!numberPattern.test(formData.billingContactNumberHidden)  || formData.billingContactNumberHidden.length !== 10))){
                ToastError("Please enter a valid contact number");
                return;
            }

            let payload = {
                "cmpnyRegInUs": formData.isRegisterdInUs ? 1 : 0,
                "ein": formData.ein,
                "entryType": formData.entryType,
                "registeredState": formData.registerdState,
                "cmpnyLegalNm": formData.companyLegalName,
                "physicalAddress": {
                  "addressLine1": formData.addressLine1,
                  "addressLine2": formData.addressLine2,
                  "country": formData.country,
                  "state": formData.state,
                  "city": formData.city,
                  "zip": formData.zip,
                  "workEmail": formData.workEmail,
                  "contactNmbr": formData.contactNumber
                },
                "blngInvcAddress": {
                  "addressLine1": formData.billingAddressLine1,
                  "addressLine2": formData.billingAddressLine2,
                  "country": formData.billingCountry,
                  "state": formData.billingState,
                  "city": formData.billingCity,
                  "zip": formData.billingzip,
                  "workEmail": formData.billingWorkEmail,
                  "contactNmbr": formData.billingContactNumber
                }
            }
            console.log('payload', payload)
            try {
               

                let config = {
                    method: "post",
                    url: process.env.REACT_APP_BEATS_SAVE_SUBSCRIBER_DETAILS,
                    headers: {
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                     Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                    },
                    data: payload
                  };
               let responseData = await Axios(config);
               console.log(" responseData ", responseData)
                if(responseData.status === 200){
                    props.history.push('/Mapping');
                }
              } catch (err) {
                console.log(err);
              }
        }
    }

    return (
        <div className='subscriber-details' justify="center" alignItems="center" >
            <ToastContainer />
            <Grid container className="h100" justify="center" alignItems="center">
                <Box component="div" className="signin h100" >
                    <Box component="div" className="mainlogo mr0">
                        <img src={logo} alt="Logo" />
                    </Box>
                    <Box component="div" boxShadow={3} className="signinbox" style={{maxWidth:'none', width:'1100px'}}>
                        <Grid container spacing={3} className="mr0">
                            <Grid item xs={12} sm={12}>
                                <h5 className="btitle">Subscriber Details</h5>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={4} className="pd0" style={{ paddingRight: '0' }}>
                                        <p class="txt-left mt12">
                                            Is the company registered in US?
                                        </p>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} className="pd0 txt-left">
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                aria-label="position"
                                                name="position"
                                                defaultValue="top"
                                            >
                                                <FormControlLabel
                                                    value="Yes"
                                                    control={
                                                        <Radio
                                                            onChange={(e) => onFormChange("isRegisterdInUs", true)}
                                                            checked={formData.isRegisterdInUs ? true : false}
                                                        />
                                                    }
                                                    label="Yes"
                                                />
                                                <FormControlLabel
                                                    value="No"
                                                    control={
                                                        <Radio
                                                            onChange={(e) => onFormChange("isRegisterdInUs", false)}
                                                            checked={!formData.isRegisterdInUs ? true : false}
                                                        />
                                                    }
                                                    label="No"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={1} className="pd0" style={{ paddingRight: '0' }}>
                                        <p class="txt-left mt12">EIN</p>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} className={`pd0 txt-left ${isButtonClicked && !formData.ein.trim() && formData.isRegisterdInUs ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className='primary-input mb20 width100p'
                                            value={formData.ein}
                                            disabled={!formData.isRegisterdInUs}
                                            onChange={(e) => onFormChange("ein", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2} className="pd0" style={{ paddingRight: '0' }}>
                                        <p class="txt-left mt12">Entity Type</p>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} className={`pd0 txt-left fgfd ${isButtonClicked && !formData.entityType && formData.isRegisterdInUs ? 'requird' : ''}`}>
                                        { !formData.isRegisterdInUs ? <BootstrapInput className='primary-input mb20 width100p' disabled={true} /> : 
                                        <Select className="selectbox1"
                                            onChange={(e) => onFormChange("entityType", e.value)}
                                            value={{value: formData.entityType, label: formData.entityType}}
                                            disabled={!formData.isRegisterdInUs}
                                            options={!formData.isRegisterdInUs ? '' : entityTypes}
                                        />}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={5} className="pd0" style={{ paddingRight: '0' }}>
                                        <p class="txt-left mt12">Company/entity registered state in the US</p>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={5} className={`pd0 txt-left ${isButtonClicked && !formData.registerdState.trim() &&  formData.isRegisterdInUs ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            value={formData.registerdState}
                                            disabled={!formData.isRegisterdInUs}
                                            onChange={(e) => onFormChange("registerdState", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={5} className="pd0" style={{ paddingRight: '0' }}>
                                        <p class="txt-left mt12">Full Legal Name of the Company</p>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={5} className={`pd0 txt-left ${isButtonClicked && !formData.companyLegalName.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            value={formData.companyLegalName}
                                            onChange={(e) => onFormChange("companyLegalName", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={12} className="pd0" style={{ paddingRight: '0' }}>
                                        <h6 class="txt-left"><strong>Physicial Address</strong></h6>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={6} className={`pd0 txt-left ${isButtonClicked && !formData.addressLine1.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Address Line 1"
                                            value={formData.addressLine1}
                                            onChange={(e) => onFormChange("addressLine1", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={6} className="pd0 txt-left">
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Address Line 2 (optional)"
                                            value={formData.addressLine2}
                                            onChange={(e) => onFormChange("addressLine2", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6} md={3} className={`pd0 txt-left ${isButtonClicked && !formData.city.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={(e) => onFormChange("city", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} className={`pd0 txt-left ${isButtonClicked && !formData.state.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={(e) => onFormChange("state", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} className={`pd0 txt-left ${isButtonClicked && !formData.country.trim() ? 'requird' : ''}`}>
                                        <Select className="selectbox1"
                                            onChange={(e) => onFormChange("country", e.value)}
                                            value={{value: formData.country, label: formData.country}}
                                            options={COUNTRY_LIST}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2} className={`pd0 txt-left ${isButtonClicked && !formData.zip.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="ZIP/PIN"
                                            value={formData.zip}
                                            onChange={(e) => onFormChange("zip", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={4} className={`pd0 txt-left ${isButtonClicked && (!formData.workEmail || !emailPattern.test(formData.workEmail)) ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Work Email"
                                            value={formData.workEmail}
                                            onChange={(e) => onFormChange("workEmail", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} className={`pd0 txt-left ${isButtonClicked && (!formData.contactNumberHidden || !numberPattern.test(formData.contactNumberHidden) || formData.contactNumberHidden.length !== 10) ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Contact Number"
                                            value={formData.contactNumber}
                                            onBlur={(e) => createPhoneNumber("contactNumber", e.target.value)}
                                            onChange={(e) => onFormChange("contactNumber", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={12} className="pd0" style={{ paddingRight: '0' }}>
                                        <h6 class="txt-left"><strong>Billing Address for Invoicing</strong></h6>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4} className="pd0" style={{ paddingRight: '0' }}>
                                        <p class="txt-left mt12">
                                            Is it same as Physical Address?
                                        </p>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} className="pd0 txt-left">
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            row
                                            aria-label="position"
                                            name="position"
                                            defaultValue="top"
                                        >
                                            <FormControlLabel
                                                value="Yes"
                                                control={
                                                    <Radio
                                                        onChange={(e) => onFormChange("isSameAddress", true)}
                                                        checked={formData.isSameAddress ? true : false}
                                                    />
                                                }
                                                label="Yes"
                                            />
                                            <FormControlLabel
                                                value="No"
                                                control={
                                                    <Radio
                                                        onChange={(e) => onFormChange("isSameAddress", false)}
                                                        checked={!formData.isSameAddress ? true : false}
                                                    />
                                                }
                                                label="No"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={6} className={`pd0 txt-left ${isButtonClicked && !formData.billingAddressLine1.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Address Line 1"
                                            value={formData.billingAddressLine1}
                                            onChange={(e) => onFormChange("billingAddressLine1", e.target.value)}
                                            disabled={formData.isSameAddress}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={6} className="pd0 txt-left">
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Address Line 2 (optional)"
                                            value={formData.billingAddressLine2}
                                            onChange={(e) => onFormChange("billingAddressLine2", e.target.value)}
                                            disabled={formData.isSameAddress}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6} md={3} className={`pd0 txt-left ${isButtonClicked && !formData.billingCity.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="City"
                                            value={formData.billingCity}
                                            onChange={(e) => onFormChange("billingCity", e.target.value)}
                                            disabled={formData.isSameAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} className={`pd0 txt-left ${isButtonClicked && !formData.billingState.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="State"
                                            value={formData.billingState}
                                            onChange={(e) => onFormChange("billingState", e.target.value)}
                                            disabled={formData.isSameAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} className={`pd0 txt-left ${isButtonClicked && !formData.billingCountry.trim() ? 'requird' : ''}`}>
                                        {formData.isSameAddress ? <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="billingCountry"
                                            value={formData.billingCountry}
                                            disabled={formData.isSameAddress}
                                        />
                                        : <Select className="selectbox1"
                                            onChange={(e) => onFormChange("billingCountry", e.value)}
                                            value={{value: formData.billingCountry, label: formData.billingCountry}}
                                            options={COUNTRY_LIST}
                                        />}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2} className={`pd0 txt-left ${isButtonClicked && !formData.billingzip.trim() ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="ZIP/PIN"
                                            value={formData.billingzip}
                                            onChange={(e) => onFormChange("billingzip", e.target.value)}
                                            disabled={formData.isSameAddress}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={4} className={`pd0 txt-left ${isButtonClicked && (!formData.billingWorkEmail || !emailPattern.test(formData.billingWorkEmail)) ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Work Email"
                                            value={formData.billingWorkEmail}
                                            onChange={(e) => onFormChange("billingWorkEmail", e.target.value)}
                                            disabled={formData.isSameAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} className={`pd0 txt-left ${isButtonClicked && (!formData.billingContactNumberHidden || !numberPattern.test(formData.billingContactNumberHidden) || formData.billingContactNumberHidden.length !== 10) ? 'requird' : ''}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="Contact Number"
                                            value={formData.billingContactNumber}
                                            onChange={(e) => onFormChange("billingContactNumber", e.target.value)}
                                            disabled={formData.isSameAddress}
                                            onBlur={(e) => createPhoneNumber("billingContactNumber", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container className="pb30 pt30">
                                    <Grid item xs={12} sm={12} md={12}>
                                        <button className="btn-primary" onClick={onClickContinue}>Continue</button>
                                    </Grid>
                                </Grid>
                                {/* <p className="termstxt">By signing up, I  agree to the <a href="https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_61edc289b5734e008f8dadd088b6dbf8.pdf" target="_blank" className="linkprim" rel="noreferrer">Privacy Policy</a>  and <a href="https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_23cc2539c189446e98b2eca2d7f2b1e1.pdf" target="_blank" className="linkprim" rel="noreferrer">Terms of Service.</a> </p> */}
                                <p className="termstxt">
                                    By signing in, I agree to Beats Health's {" "}
                                    <a href={process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_62f94f573a2b482ea01df13afccfa38d.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_61edc289b5734e008f8dadd088b6dbf8.pdf"} target="_blank" rel="noreferrer" className="linkprim">
                                        Privacy Policy
                                    </a>{" "}
                                    and{" "}
                                    <a href={
                                        process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_5eb62d82034544f8af76303559534897.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_23cc2539c189446e98b2eca2d7f2b1e1.pdf"
                                    }

                                        target="_blank"
                                        rel="noreferrer"
                                        className="linkprim"
                                    >
                                        Terms of Service.
                                    </a>{" "}
                                </p>
                            </Grid>
                        </Grid>
                    </Box>
                    <br /><br />
                </Box>
            </Grid>
        </div>
    );
}

export default SubscriberDetails;