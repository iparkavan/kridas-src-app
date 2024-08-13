import { useEffect, useState } from "react";
import SportsConfig from '../config/SportsConfig';
import Sport from './Sport'
import React from 'react';
import useHttp from "../../../../hooks/useHttp";
import PageContainer from "../../../common/layout/components/PageContainer";


/* Edit Sports Function For Updating New Sports */

const EditSports = (props) => {
    const { sportsId } = props.match.params;
    const { sendRequest } = useHttp();
    const [, setClear] = useState({});
    let defaultSportsDetails = {
        sports_name: "",
        sports_desc: "",
        sports_code: "",
        sports_format: [],
        sports_category: [],
        sports_age_group: [],
        // sports_brand: [],
        sports_profile: [],
        sports_role: []
    }
    const [sportsDetails, SetSportsDetails] = useState(defaultSportsDetails);

    /* useEffect For Fetch Data Based On Sports Id For Updating */

    useEffect(() => {
        const sportsConfig = SportsConfig.getById(sportsId);
        const transformSportsData = (data) => {
            SetSportsDetails(data.data)
        };
        sendRequest(sportsConfig, transformSportsData);
        return () => {
            setClear({});
        };
    }, [sendRequest, sportsId]);

    return (
        <>
            <PageContainer heading="Edit Sports">
                <Sport data={sportsDetails} action="Edit" />
            </PageContainer>
        </>
    )

}

export default EditSports;