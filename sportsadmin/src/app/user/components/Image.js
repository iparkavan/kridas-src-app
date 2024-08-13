import { makeStyles } from "@material-ui/styles";
import { React, useState } from "react";
import { Box, Grid, Typography, Card } from "@material-ui/core";
import Button from "../../common/ui/components/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  bannerSpacing: {
    width: '100%',
  },

  imagePreviewBox: {
    display: "flex",
    width: '95%',
    height: '150px',
    marginTop: '10px',
    marginLeft: '20px',
    position: 'relative',
  },

  imagePreview: {
    display: "flex",
    width: '47vh',
    height: '26vh',
    marginLeft: '-10px',
    marginTop: '10px',
  },


  logoPreview: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    width: '47vh',
    height: '26vh',
    marginLeft: '40px',
    marginTop: '10px',
  },

  boxalign: {
    padding: '2--px',
    margin: '10px',
    marginTop: '40px',
    marginBottom: '20px'
  },

  imageHeading: {
    fontFamily: "Arial, Helvetica, sans-serif",
    paddingTop: "6%",
    fontSize: "23px",
    paddingLeft: "7%",
  },

  input: {
    display: "none",
  },

  btn: {
    padding: '2--px',
    margin: '25px',
  },


  fileItem1: {
    width: '70%',
    marginRight: '40px'
  },

  fileItem2: {
    width: '40%',
    float: 'left',

  },

  errorMsg: {
    color: "red",
    fontSize: "13px"
  },

  totalPage: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    padding: "6%",
    paddingBottom: "10px",

  },
  head: {
    fontSize: "20px"
  },
  TotalGrid: {
    display: "grid",
    gridTemplateColumns: "auto auto",

  }

}))

const Image = (props) => {

  const classes = useStyles();
  const { setUserDetails, userDetails, component } = props;
  const { user_profile_img, user_img, user_profile_imgName, user_imgName } = props.userDetails;
  const { company_img, company_profile_img, company_profile_imgName, company_imgName, errors } = props.userDetails;

  const [fileSize, setFileSize] = useState(false);
  const [imgTypeError, setImgTypeError] = useState('');

  const onInputClick = (event) => {
    event.target.value = ''
  }

  const handleFile = (e, type, ImageType) => {
    if (e.target.files[0]?.size > 1000000) {
      setFileSize(true);
      setImgTypeError(ImageType);
    }
    else {
      setFileSize(false);
      setImgTypeError('');
      if (e.target.files) {
        setUserDetails({
          ...userDetails,
          [type]: e.target.files[0],
          [`${type}Name`]: e.target.files[0] ? e.target.files[0].name : null
        })
      }
    }



  };

  return (
    <>
      <Grid className={classes.bannerSpacing}>
        <div>
          {component === "User" ?
            <div className={classes.TotalGrid}>
              <div>
                <img className={classes.logoPreview} alt="Profile" src={user_profile_img?.name !== undefined ? URL.createObjectURL(user_profile_img) : user_profile_img || "https://res.cloudinary.com/sanjayaalam/image/upload/v1642773557/download_6_bx1wsa.png"}></img>
              </div>
              <div>
                <img className={classes.imagePreview} alt="Banner" src={user_img?.name !== undefined ? URL.createObjectURL(user_img) : user_img || "https://res.cloudinary.com/sanjayaalam/image/upload/v1642774004/download_7_yef5am.jpg"}></img>
              </div>

            </div> :

            <div className={classes.TotalGrid}>

              <div>
                <img className={classes.logoPreview} alt="Profile" src={company_profile_img?.name !== undefined ? URL.createObjectURL(company_profile_img) : company_profile_img || "https://res.cloudinary.com/sanjayaalam/image/upload/v1642773557/download_6_bx1wsa.png"}  ></img>
              </div>
              <div>
                <img className={classes.imagePreview} alt="Banner" src={company_img?.name !== undefined ? URL.createObjectURL(company_img) : company_img || "https://res.cloudinary.com/sanjayaalam/image/upload/v1642774004/download_7_yef5am.jpg"}></img>
              </div>

            </div>
          }
        </div>
      </Grid >


      <div className={classes.totalPage}>


        <div className={classes.fileItem1}>
          <div className={classes.head} >Profile Image</div>
          <Box className={classes.fields} display="flex" justifyContent="space-between" alignItems="center">

            <TextField
              className={classes.fileUpload}
              placeholder="Select file...*"
              value={component === "User" ? user_profile_imgName || "" : company_profile_imgName || ""}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />

            <input
              accept="image/*"
              className={classes.input}
              id="profileImg-button"
              type="file"
              name={component === "User" ? "userProfieImg" : "image"}
              onChange={component === "User" ? (e) => handleFile(e, "user_profile_img", "Banner") : (e) => handleFile(e, "company_profile_img", "Banner")}
              onClick={onInputClick}
            />

            <label htmlFor="profileImg-button"
            >
              <Button className={classes.btn} variant="contained" color="primary" component="span">
                Browse
              </Button>
            </label>
          </Box>
          {(imgTypeError === "Banner" && fileSize) ? <span className={classes.errorMsg} > Profile Image size must be below 1MB.</span> : ""}
          <Typography className={classes.fields}>JPG or PNG file. Max 1 MB.</Typography>

        </div>


        <div className={classes.fileItem1} >

          <div className={classes.head} > Banner Image</div>
          <Box className={classes.fields} display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              className={classes.fileUpload}
              placeholder="Select file...*"
              value={component === "User" ? user_imgName || "" : company_imgName || ""}
              InputProps={{
                readOnly: true,
              }}
              fullWidth

            />

            <input
              accept="image/*"
              className={classes.input}
              id="userImg-button"
              type="file"
              name={component === "User" ? "user_img" : "companyProfileImage"}
              onChange={component === "User" ? (e) => handleFile(e, "user_img", "Profile") : (e) => handleFile(e, "company_img", "Profile")}
              onClick={onInputClick}
            />

            <label htmlFor="userImg-button" >
              <Button className={classes.btn} variant="contained" color="primary" component="span">
                Browse
              </Button>
            </label>

          </Box>
          {(imgTypeError === "Profile" && fileSize) ? <span className={classes.errorMsg} >Banner Image size must be below 1MB.</span> : ""}

          <Typography className={classes.fields}>JPG or PNG file. Max 1 MB.</Typography>
        </div>


      </div>


    </>

  )
}

export default Image;