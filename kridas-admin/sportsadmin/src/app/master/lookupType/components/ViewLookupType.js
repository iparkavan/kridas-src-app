import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useHttp from "../../../../hooks/useHttp";
import { useHistory } from 'react-router-dom';
import Divider from "@material-ui/core/Divider";
import BodyText from "../../../common/ui/components/BodyText";
import LookupTypeConfig from "../config/LookupTypeConfig";
import PageContainer from "../../../common/layout/components/PageContainer";

const useStyles = makeStyles((theme) => ({
    sectionSpace: {
        margin: "20px 0 0px 0",
    },
    contentSpace: {
        margin: "5px 0 0 0",
        marginLeft: "5px"
    },
    totalMargin: {
        margin: "3%",
    },
    heading: {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "23px",
        marginBottom: "10px",
        marginTop: "5px"
    },
    boldText: {
        fontWeight: "500",
        padding: "5px"
    },

}));

function ViewLookupType(props) {
    const classes = useStyles();
    let history = useHistory();
    const { lookupType } = props.match.params;
    let InitalState = {
        lookup_type: "",
        lookup_desc: "",
    }
    const {sendRequest } = useHttp();
    const [lookupDetails, setLookupDetails] = useState(InitalState)
    const { lookup_type, lookup_desc } = lookupDetails

    useEffect(() => {
        const config = LookupTypeConfig.getLookupByType(lookupType)
        const transformDate = (data) => {
            setLookupDetails(data);
        };
        sendRequest(config, transformDate);
    }, [sendRequest, lookupType])

    const Backbtn = () => {
        history.push(`/masters/lookupType`);
    }
    return (
        <>
          
          <PageContainer heading = "LookUp Type Details" isBackButon={true} onAction={Backbtn}>
            <div className={classes.totalMargin}>
                <div className={classes.sectionSpace}>
                    <div className={classes.boldText}> Type </div>
                    <Divider></Divider>
                    <div className={classes.contentSpace}>
                        <BodyText>{lookup_type}</BodyText>
                    </div>
                </div>
                <div className={classes.sectionSpace}>
                    <div className={classes.boldText}>Description </div>
                    <Divider></Divider>
                    <div className={classes.contentSpace}>
                        <BodyText>{lookup_desc}</BodyText>
                    </div>
                </div>

            </div>
            </PageContainer>
        </>
    )
}

export default ViewLookupType;