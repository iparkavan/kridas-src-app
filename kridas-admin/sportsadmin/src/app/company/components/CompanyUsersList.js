import { makeStyles } from "@material-ui/core/styles";
import BodyText from "../../common/ui/components/BodyText";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
}));

const CompanyUsersList = (props) => {
  const classes = useStyles();
  const { userList } = props;

  return (
    <div className={classes.root}>
      {userList.map((user) => {
        return (
          <div style={{ width: "300px" }}>
            <BodyText>
              {user.firstName} {user.lastName}{" "}
              {user.status === "AC" ? (
                <span style={{ color: "green" }}>{"(Active)"}</span>
              ) : (
                <span style={{ color: "red" }}>{"(Inactive)"}</span>
              )}
            </BodyText>
            <BodyText>{user.userEmail}</BodyText>
            <BodyText>{user.userPhone}</BodyText>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyUsersList;
