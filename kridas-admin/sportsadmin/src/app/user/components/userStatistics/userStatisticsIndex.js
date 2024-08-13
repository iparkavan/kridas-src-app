import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useHttp from "../../../../hooks/useHttp";
import userConfig from "../../config/userConfig";
import { makeStyles } from "@material-ui/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Divider } from "@material-ui/core";
import BodyText from "../../../common/ui/components/BodyText";
import Button from "../../../common/ui/components/Button";



const useStyles = makeStyles((theme) => ({
    sectionSpace: {
        margin: "20px 0 0px 0",
    },
    contentSpace: {
        margin: "8px 0 0 0",

    },
    totalMargin: {
        margin: "3%",
        marginLeft: "45px",
    },
    tableAlign: {
        width: "100%",
        margin: "10px 0 0 0",
    },
    heading: {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "23px",
        marginBottom: "10px",
        marginTop: "5px"
    },
    boldText: {
        fontWeight: "500",
    }
}));



const UserStatisticsIndex = (props) => {
    const classes = useStyles();
    let history = useHistory();
    const UserStatisticsId = props.match.params.userStatisticsId;
    const { sendRequest } = useHttp();
    const [, setClear] = useState("");
    const mode = "View";
    const [userStatisticsInfo, setUserStatisticsInfo] = useState({
        sports_name: "",
        category_name: "",
        playing_status: "",
        statistics_desc: "",
        sports_role: "",
        sports_profile: "",
        sport_career: [],
        sportwise_statistics: "",
        statistics_links: [],
        statistics_docs: [],
        first_name: "",
        user_id: "",
        skill_level: "",
        sports_id: "",
        sports_code: "",

    })
    const { sport_career } = userStatisticsInfo;
    const UserId = userStatisticsInfo.user_id


    useEffect(() => {
        const UserStatisticsConfig = userConfig.getUserStatisticsById(UserStatisticsId);
        const transformCategoryData = (data) => {
            const actualData = data.data;
            setUserStatisticsInfo({
                user_id: actualData.user_id,
                skill_level: actualData.skill_level,
                sports_id: actualData.sports_id,
                sports_name: actualData.sports_name,
                category_name: actualData.category_name,
                playing_status: actualData.playing_status,
                statistics_desc: actualData.statistics_desc,
                sports_role: actualData.sports_role,
                sports_profile: actualData.sports_profile,
                sport_career: actualData.sport_career,
                sportwise_statistics: actualData.sportwise_statistics,
                statistics_links: actualData.statistics_links,
                statistics_docs: actualData.statistics_docs,
                first_name: actualData.first_name,
                sports_code: actualData.sports_code,

            });
        };
        sendRequest(UserStatisticsConfig, transformCategoryData);
        return () => {
            setClear({});
        };
    }, [sendRequest, UserStatisticsId]);

    const handleView = async (e, user_statistics_id, sports_code, mode) => {
        e.preventDefault();
        history.push(`/masters/sportsStatistics/${user_statistics_id}/${sports_code}/${mode}`)
    }

    const Backbtn = () => {
        history.push(`/user/${UserId}`);
    }

    return (
        <>
            <PageContainer heading="View User Statistics" isBackButon={true} onAction={Backbtn}>
                <div className={classes.root}>
                    <div className={classes.totalMargin}>
                        <div className={classes.sectionSpace}>
                            <div className={classes.boldText}>Sport Name </div>
                            <Divider></Divider>
                            <div className={classes.contentSpace}>
                                <BodyText>{userStatisticsInfo.sports_name}</BodyText>
                            </div>
                        </div>

                        <div className={classes.sectionSpace}>
                            <div className={classes.boldText}>Category Name </div>
                            <Divider></Divider>
                            <div className={classes.contentSpace}>
                                <BodyText>{userStatisticsInfo.category_name}</BodyText>
                            </div>
                        </div>

                        <div className={classes.sectionSpace}>
                            <div className={classes.boldText}>Playing Status </div>
                            <Divider></Divider>
                            <div className={classes.contentSpace}>
                                <BodyText>{userStatisticsInfo.playing_status === "AC" ? "Active" : "InActive"}</BodyText>
                            </div>
                        </div>

                        <div className={classes.sectionSpace}>
                            <div className={classes.boldText}>Statistics Description </div>
                            <Divider></Divider>
                            <div className={classes.contentSpace}>
                                <BodyText>{userStatisticsInfo.statistics_desc !== null ? userStatisticsInfo.statistics_desc : "No Data Available"}</BodyText>
                            </div>
                        </div>

                        <div className={classes.sectionSpace}>
                            <div className={classes.boldText}>Statistics Links </div>
                            <Divider></Divider>
                            <div className={classes.contentSpace}>
                                <BodyText>{userStatisticsInfo?.statistics_links.length > 0 ? userStatisticsInfo?.statistics_links?.map((e) => { return (<p ><a href={e}>{e}</a></p>) }) : "No Data Available"}</BodyText>
                            </div>
                        </div>

                        <div className={classes.sectionSpace}>
                            <div className={classes.boldText}>Statistics Documents</div>
                            <Divider></Divider>
                            <div className={classes.contentSpace}>
                                <BodyText>{userStatisticsInfo?.statistics_docs.length > 0 ? userStatisticsInfo?.statistics_docs?.map((e) => { return (<p ><a href={e.url}>{e.url}</a></p>) }) : "No Data Available"}</BodyText>
                            </div>
                        </div>

                        <div>
                            <div className={classes.sectionSpace}>
                                <div className={classes.boldText}>Sports Career </div>
                                <Divider></Divider>
                                <div style={{ display: "flex" }}>
                                    <div className={classes.tableAlign}>
                                        <TableContainer component={Paper}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>From</TableCell>
                                                        <TableCell>To</TableCell>
                                                        <TableCell>URL</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Role</TableCell>
                                                        <TableCell>Profile</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>{sport_career?.length > 0 ?
                                                    sport_career?.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell component="th" scope="row">
                                                                {row.from}
                                                            </TableCell>
                                                            <TableCell>{row.to}</TableCell>
                                                            <TableCell>{row.url}</TableCell>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.roles.join(",")}</TableCell>
                                                            <TableCell>{row.profiles.join(",")}</TableCell>
                                                        </TableRow>
                                                    )) : <div className={classes.center}>No Data Available</div>}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={classes.sectionSpace}>
                            <div className={classes.boldText}>Sportwise Statistics</div>
                            <Divider></Divider>
                            <div className={classes.contentSpace}>
                                {userStatisticsInfo.sportwise_statistics !== null ? <Button
                                    onClick={(e) => handleView(e, UserStatisticsId, userStatisticsInfo.sports_code, mode)}
                                >
                                    View Sportwise Statistics
                                </Button> : "No Data Available"}
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </>
    );
}

export default UserStatisticsIndex;