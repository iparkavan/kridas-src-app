import { useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttp";
import SportsConfig from "../../master/sports/config/SportsConfig";
import { Box, Typography } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

/* Function for Choosing Sports Interested */

const useStyles = makeStyles((theme) => ({
    field: {
        width: "250px",
        margin: "16px",
    },
    fieldAlign: {
        marginTop: '20px'
    },
    columnGrid: {
        display: "grid",
        gridTemplateColumns: "auto auto auto auto",
        marginLeft: "20px"
    },
    Linkheading: {
        margin: "20px",
        marginBottom: "30px",
        fontSize: "20px"
    },
}))


const SportsInterested = (props) => {
    const classes = useStyles();
    const [sportsName, setSportsName] = useState([]);
    const { isLoading, sendRequest } = useHttp();
    const [, setClear] = useState({});
    const { setUserDetails, userDetails } = props;
    const { sports_interested } = props.userDetails;
    const [interest, setInterest] = useState(sports_interested)


    useEffect(() => {
        const config = SportsConfig.getAllSports()
        const transformDate = (data) => {
            setSportsName(data);
        };
        sendRequest(config, transformDate);

        return () => {
            setClear({});
        };

    }, [sendRequest])


    const handleChange = (e, isCheckbox) => {
        let arr = [...interest]
        if (interest.includes(Number(e.target.value)))
            arr = remove(arr, Number(e.target.value))
        else
            arr.push(Number(e.target.value))

        let uniqueChars = [...new Set(arr)];
        setInterest(uniqueChars)
        setUserDetails({
            ...userDetails,
            [e.target.name]: [...uniqueChars]
        })
    }

    const remove = (arr, value) => {
        return arr.filter((ele) => {
            return ele !== value;
        });
    }

    return (
        <div >
            <Box>
                <Typography className={classes.Linkheading}>Select Your Interested Sports </Typography>
            </Box>
            {isLoading ? "Loading..." :
                <Box sx={{ display: 'grid' }}>
                    <FormControl sx={9} component="fieldset" variant="standard" className={classes.columnGrid}>
                        {sportsName.map((sport, index) => (
                            <div>
                                <FormControlLabel
                                    key={sport["sports_id"]}
                                    name="sports_interested"
                                    control={
                                        <Checkbox
                                            key={index}
                                            name="sports_interested"
                                            borderColor="primary.600"
                                            value={sport["sports_id"]}
                                            checked={sport["sports_id"] !== undefined ? interest.includes(Number(sport["sports_id"])) : false}
                                            onChange={(e) => handleChange(e, true)}
                                        />
                                    }
                                    label={sport["sports_name"]}
                                />
                            </div>
                        ))}
                    </FormControl>

                </Box>
            }
        </div >
    )
}

export default SportsInterested;