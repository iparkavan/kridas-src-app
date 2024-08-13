import React, { useState, useEffect } from "react";
import useHttp from "../../../../hooks/useHttp";
import PageContainer from "../../../common/layout/components/PageContainer";
import SportsStatistics from "../../../common/ui/components/SportsStatistics"
import sportsApiConfig from "../../sportsStatistics/config/sportsApiConfig"

export default function SportsStatsIndex(props) {
    const { user_statistics_id, sports_name, mode } = props.match.params
    let spname = sports_name.replace(" ", "-")
    const { sendRequest } = useHttp();
    const [, setClear] = useState();
    let defaultObj1 = { "role_type": "", "innings_type": "", "statsSubInfo": { "catches": "", "innings": "", "matches": "", "stumpings": "" } }
    let defaultObj2 = { "matches_type": "", "surfaces_type": "", "statsSubInfo": { "matches": "", "matches_won": "" } }
    let userStatistics = {
        sports_name: "",
        category_name: "",
        playing_status: "",
        statistics_desc: "",
        sports_role: "",
        sports_profile: "",
        sports_career: "",
        sportswise_statistics: { statsInfo: [] },
        statistics_links: "",
        statistics_docs: "",
        first_name: "",
        user_id: "",
        skill_level: "",
        sports_id: "",
    }
    const [userStatisticsInfo, setUserStatisticsInfo] = useState(userStatistics);
    const [, setDefaultObj] = useState(userStatistics.sportswise_statistics);
    const [statsInfo, setStatsInfo] = useState(userStatistics.sportswise_statistics);

    useEffect(() => {
        const config = sportsApiConfig.fetchUserStatistics(user_statistics_id);
        const transformUserData = (data) => {
            setUserStatisticsInfo(data.data);
            let testData = data.data?.sportwise_statistics
            setStatsInfo(testData?.statsInfo === undefined ? defaultObj2 : testData?.statsInfo)
        };
        sendRequest(config, transformUserData);
        return () => {
            setClear({});
        }
    }, [sendRequest, user_statistics_id, sports_name]);

    return (
        <>
            <PageContainer heading="Sports Statistics">
                <SportsStatistics name={spname} userStatistics={user_statistics_id} data={defaultObj1} statsInfo={statsInfo} setStatsInfo={setStatsInfo} userStaticInfo={userStatisticsInfo} mode={mode} />
            </PageContainer>
        </>
    )
}