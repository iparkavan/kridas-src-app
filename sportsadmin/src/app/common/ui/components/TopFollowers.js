import React from "react";
import Badge from '@material-ui/core/Badge';
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const TopFollowers = (props) => {

  const useStyles = makeStyles((theme) => ({

    companyImg: {
      width: "40px",
      height: "40px",
      padding: "7%",
      borderRadius: "50%"
    },
    Name: {
      paddingLeft: "20px",
      marginTop: "7px"
    },
    count: {

      padding: "13px",
      color: "red",

    }

  }));
  const { topList,  type } = props;
  const classes = useStyles();
  return (
    <>
      {type === "company" ? topList?.company.map((topLists) => {
        return (
          <>
            <img alt="Profile" className={classes.companyImg} src={topLists.company_profile_img === undefined ? topLists.company_profile_img : topLists.company_profile_img || "https://res.cloudinary.com/sanjayaalam/image/upload/v1642773557/download_6_bx1wsa.png"} ></img>

            <div className={classes.Name}>
              {topLists.company_name}
            </div>
            <div className={classes.count}>
            <Tooltip title="Follower" >
              <Badge color="secondary" badgeContent={topLists.following_count}></Badge>
              </Tooltip>
            </div>
          </>
        )
      }
      ) :
        topList?.users?.map((topLists) => {
          return (
            <>
              <img alt="Profile" className={classes.companyImg} src={topLists.user_profile_img === undefined ? topLists.user_profile_img : topLists.user_profile_img || "https://res.cloudinary.com/sanjayaalam/image/upload/v1642773557/download_6_bx1wsa.png"} ></img>

              <div className={classes.Name}>
                {topLists.first_name}
              </div>
              <div className={classes.count}>
              <Tooltip title="Follower" >
                <Badge color="secondary" badgeContent={topLists.following_count}></Badge>
                </Tooltip>
              </div>
            </>
          )
        }
        )}
    </>
  )
}

export default TopFollowers;