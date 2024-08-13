import { useState } from "react";
import Sport from './Sport'
import React from 'react';
import PageContainer from "../../../common/layout/components/PageContainer";

/* Add Sport Function For Adding New Sports */

const AddSport = () => {
    let defaultSportsDetails = {
        sports_name: "",
        sports_desc: "",
        sports_format: [],
        sports_category: [],
        sports_age_group: [],
        // sports_brand: [],
        sports_profile: [],
        sports_role: [],
        sports_code: ""
    }
    const [sportsDetails] = useState(defaultSportsDetails);

    return (
        <>
            <PageContainer heading="Add Sports">
                <Sport data={sportsDetails} action="Add" />
            </PageContainer>
        </>
    )

}

export default AddSport;