import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { React } from "react";
import InputField from "../../common/ui/components/InputField"
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup, FormControlLabel, FormControl, RadioGroup, Radio } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import CustomPhone from "../../../../src/app/common/ui/components/CustomPhone";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import sportslistConfig from '../../master/sports/config/SportsConfig';
import LookupTableConfig from "../../master/lookupTable/config/LookupTableConfig";
import useHttp from '../../../hooks/useHttp';

const useStyles = makeStyles((theme) => ({
    field: {
        width: "250px",
        margin: "16px",
    },
    fieldAlign: {
        marginTop: '20px'
    },
    statusGrid: {
        paddingLeft: "8px",
        display: "grid",
        gridTemplateColumns: "auto auto"

    },
    heading: {
        margin: "10px",
        fontSize: "20px"
    },
    headingBio: {
        fontSize: "20px",
        marginTop: "30px",
        marginLeft: "15px"
    },

    btnAlign: {
        display: "flex",
        marginLeft: "5px"
    },

    radioBtnAlign: {
        marginLeft: "80px"
    },
    fieldWebsite: {
        width: "810px",
        margin: "16px",
    },
    feildLable: {
        width: "250px",
        margin: "16px",
    },
    Lable: {
        marginLeft: "50px"
    },
    container: {
        display: "flex"
    },
    phoneDisplay: {
        float: "right"
    },
    nameDisplay: {
        float: "left"
    },
    fieldDesc: {
        width: "810px",
        margin: "16px",
    }

}))

const UserInformation = (props) => {
    const classes = useStyles();
    const { setUserDetails, userDetails, errors } = props;
    const { first_name, last_name, user_phone, user_desc, user_status, user_dob, user_gender, user_website, user_age_group, player_code, user_email, updated_date, created_date, user_profile_verified, bio_details } = props.userDetails
    let phone = "user_phone";
    const [sportList, setSportList] = useState([]);
    const [reload,] = useState(false);
    const [type, setType] = useState([]);
    const [, setState] = useState({});
    const { sendRequest } = useHttp();
    let Bio = "bio_details"


    useEffect(() => {
        const config = sportslistConfig.getAllSports();
        const transformData = (data) => {
            setSportList(data);
        };
        sendRequest(config, transformData);

        const lookupConfig = LookupTableConfig.getLookupTableByType('PRF');
        const transformLookUpData = (data) => {
            setType(data)
        };
        sendRequest(lookupConfig, transformLookUpData)

        return () => {
            setState({});
        };
    }, [sendRequest, reload]);

    /* Date Format */
    const formattedDate = moment(new Date(user_dob)).format("YYYY-MM-DD");
    const formatDate = (date) => {
        return moment(new Date(date)).format("YYYY-MM-DD h:mm a");
    }

    /* Handler */
    const handleBio = (e) => {
        let bioData = { ...bio_details, [e.target.name]: e.target.value }
        setUserDetails({ ...userDetails, [Bio]: bioData })
    }

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const handlePhone = (e) => {
        setUserDetails({ ...userDetails, [phone]: e, })
    }

    const handleStatus = (e) => {
        if (user_status === "AC")
            e.target.value = "IN"
        else
            e.target.value = "AC"
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className={classes.fieldAlign}>

                <div className={classes.container}>
                    <div className={classes.nameDisplay}>
                        <InputField className={classes.field}
                            requiredfield
                            label="First Name"
                            name="first_name"
                            value={first_name || ""}
                            onChange={e => handleChange(e)}
                            error={Boolean(errors?.first_name)}
                            helperText={errors?.first_name}
                        />

                        <InputField className={classes.field}
                            requiredfield
                            label="Last Name"
                            name="last_name"
                            value={last_name || ""}
                            onChange={e => handleChange(e)}
                            error={Boolean(errors?.last_name)}
                            helperText={errors?.last_name} />

                    </div>

                    <div className={classes.phoneDisplay}>
                        <PhoneInput
                            className={classes.field}
                            label="User Phone"
                            name="user_phone"
                            value={user_phone || ""}
                            onChange={e => handlePhone(e)}
                            inputComponent={CustomPhone}
                            error={Boolean(errors?.user_phone)}
                            helperText={errors?.user_phone}

                        />
                    </div>
                </div>



                <InputField className={classes.field}
                    label="Player Code"
                    name="player_code"
                    value={player_code || ""}
                    onChange={e => handleChange(e)}
                    error={Boolean(errors?.player_code)}
                    helperText={errors?.player_code} />


                <InputField className={classes.field}
                    label="Email Address"
                    name="user_email"
                    value={user_email || ""}
                    onChange={e => handleChange(e)}
                    error={Boolean(errors?.user_email)}
                    helperText={errors?.user_email}
                    disabled={true}
                />


                <InputField className={classes.field}
                    label="User AgeGroup"
                    name="user_age_group"
                    value={user_age_group || ""}
                    onChange={e => handleChange(e)}
                    error={Boolean(errors?.user_age_group)}
                    helperText={errors?.user_age_group}
                    disabled={true} />

                <InputField className={classes.field}
                    label="D.O.B"
                    type="Date"
                    format="dd/MM/yyyy"
                    name="user_dob"
                    value={formattedDate || ""}
                    InputProps={{ inputProps: { min: "1930-01-01", max: `${new Date().toISOString().slice(0, 10)}` } }}
                    onChange={e => handleChange(e)} />

                <InputField className={classes.field}
                    label="Created Date"
                    name="created_date"
                    format="dd/MM/yyyy"
                    value={formatDate(created_date) || ""}
                    onChange={e => handleChange(e)}
                    error={Boolean(errors?.created_date)}
                    helperText={errors?.created_date}
                    disabled={true}
                />

                <InputField className={classes.field}
                    label="Updated Date"
                    name="updated_date"
                    format="dd/MM/yyyy"
                    value={formatDate(updated_date) || ""}
                    onChange={e => handleChange(e)}
                    error={Boolean(errors?.updated_date)}
                    helperText={errors?.updated_date}
                    disabled={true}
                />

                <InputField className={classes.fieldDesc}
                    label="Description"
                    name="user_desc"
                    value={user_desc || ""}
                    InputProps={{ classes: { input: classes.input1 } }}
                    rows={3}
                    rowsMax={10}
                    multiline={true}
                    onChange={e => handleChange(e)}
                    error={Boolean(errors?.user_desc)}
                    helperText={errors?.user_desc} />

                <InputField className={classes.fieldWebsite}
                    label="Website"
                    name="user_website"
                    value={user_website || ""}
                    rowsMax={4}
                    onChange={e => handleChange(e)}
                    error={Boolean(errors?.user_website)}
                    helperText={errors?.user_website} />

                <div className={classes.btnAlign}>
                    <div>
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <Typography className={classes.heading}>Status </Typography>
                            <FormGroup>
                                <div className={classes.statusGrid}>
                                    <FormControlLabel
                                        label={user_status !== "AC" ? "Inactive" : "Active"}
                                        control={
                                            <Checkbox
                                                name="user_status"
                                                checked={user_status === "AC" ? true : false}
                                                onChange={(e) => handleStatus(e)}
                                            />
                                        }
                                    />
                                </div>
                            </FormGroup>
                        </FormControl>
                    </div>

                    <div className={classes.radioBtnAlign}>
                        <Typography className={classes.heading}>Gender </Typography>
                        <div className={classes.statusGrid}>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="user_gender"
                                value={user_gender || ""}
                                onChange={(e) => handleChange(e)}
                            >
                                <div>
                                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                                    <FormControlLabel value="O" control={<Radio />} label="Other" />
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <div className={classes.Lable}>
                        <Typography className={classes.heading}> Verification Status </Typography>
                        <div className={classes.feildLable}> {user_profile_verified === true ? "Verified" : "Not Verified"}
                        </div>
                    </div>
                </div>
                <div>
                    <Typography className={classes.headingBio}>User Bio </Typography>
                    <FormControl className={classes.field}>

                        <InputLabel id="sports">Sport Name</InputLabel>
                        <Select
                            labelId="sports"
                            id="sports"
                            value={bio_details?.sports_id || ""}
                            name="sports_id"
                            label="Select Sport"
                            multiline={true}
                            inputlabelprops={{ shrink: true }}
                            onChange={e => handleBio(e)}
                        >
                            {sportList?.map((sports, index) =>
                                <MenuItem value={sports?.sports_id} key={index}>{sports?.sports_name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.field}>
                        <InputLabel id="sports">Profession</InputLabel>
                        <Select
                            labelId="sports"
                            id="sports"
                            value={bio_details?.profession || ""}
                            name="profession"
                            label="Select Profession"
                            multiline={true}
                            inputlabelprops={{ shrink: true }}
                            onChange={e => handleBio(e)}
                        >
                            {type?.map((type, index) =>
                                <MenuItem value={type?.lookup_key} key={index}>{type?.lookup_value}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <InputField className={classes.fieldDesc}
                        label="Description"
                        name="description"
                        value={bio_details?.description || ""}
                        InputProps={{ classes: { input: classes.input1 } }}
                        rows={3}
                        rowsMax={10}
                        multiline={true}
                        onChange={e => handleBio(e)}
                        error={Boolean(errors?.bio_details?.description)}
                        helperText={errors?.bio_details?.description} />

                </div>


            </div>
        </>
    )
}

export default UserInformation