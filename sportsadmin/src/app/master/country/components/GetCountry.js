import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CountryConfig from "../config/CountryConfig";
import useHttp from "../../../../hooks/useHttp";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory } from 'react-router-dom';
import Divider from "@material-ui/core/Divider";
import BodyText from "../../../common/ui/components/BodyText";
import PageContainer from "../../../common/layout/components/PageContainer";

const useStyles = makeStyles((theme) => ({
    sectionSpace: {
        margin: "20px 0 0px 0",
    },
    contentSpace: {
        margin: "5px 0 0 0",
    },
    totalMargin: {
        margin: "3%",
    },
    tableAlign: {
        width: "100%",
    },
    boldText: {
        fontWeight: "500",
    },

}));

function ViewCountry(props) {
    const classes = useStyles();
    let history = useHistory();
    const { countryId } = props.match.params;
    let InitalState = {
        country_name: "",
        country_code: "",
        country_currency: "",
        country_states: []
    }
    const { sendRequest } = useHttp();
    const [countryDetails, setCountryDetails] = useState(InitalState)
    const [ ,setClear] = useState({});
    const { country_name, country_code, country_currency, country_states } = countryDetails

    useEffect(() => {
        const config = CountryConfig.getCountryById(countryId)
        const transformDate = (data) => {
            setCountryDetails(data.data);
        };
        sendRequest(config, transformDate);
        return () => {
            setClear({});
        }

    }, [sendRequest,countryId])
    const Backbtn = () => {
        history.push(`/masters/country`);
    }
    return (
        <>
         <PageContainer heading = "Country Details" isBackButon={true} onAction={Backbtn}>
            
            <div className={classes.totalMargin}>
                <div className={classes.sectionSpace}>
                    <div className={classes.boldText}>Country Name </div>
                    <Divider></Divider>
                    <div className={classes.contentSpace}>
                        <BodyText>{country_name}</BodyText>
                    </div>
                </div>
                <div className={classes.sectionSpace}>
                    <div className={classes.boldText}>Country Code </div>
                    <Divider></Divider>
                    <div className={classes.contentSpace}>
                        <BodyText>{country_code}</BodyText>
                    </div>
                </div>
                <div className={classes.sectionSpace}>
                    <div className={classes.boldText}>Country Currency </div>
                    <Divider></Divider>
                    <div className={classes.contentSpace}>
                        <BodyText>{country_currency}</BodyText>
                    </div>
                </div>
                <div className={classes.sectionSpace}>
                <div className={classes.boldText}>State</div>
                    <Divider></Divider>
                    <div className={classes.tableAlign}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>State Name</TableCell>
                                        <TableCell>State Code</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {country_states.map(row => (
                                        <TableRow key={row.state_name}>
                                            <TableCell component="th" scope="row">
                                                {row.state_name}
                                            </TableCell>
                                            <TableCell>{row.state_code}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            </PageContainer>    
        </>
    )
}

export default ViewCountry;