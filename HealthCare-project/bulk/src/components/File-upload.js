import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";

const useStylesss = makeStyles(theme => ({
  formControl: {
    marginBottom: "5px",
    marginTop: "5px",
    width: "200px",
  },

  select: {
    height: "40px"
  },
  inputLabel: {
    alignSelf: "center"
  }
}));

export default function NotesDialog(props) {
  const [error, setError] = React.useState(false);
    const [typOfReport, setTypeOfReport] = React.useState(" ");
    const classes = useStylesss();

  
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    paper: {
      padding: theme.spacing(0),
      color: theme.palette.text.secondary,
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {},
  })
)(InputBase);
  

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        open={props.open}
        onClose={props.onClose}
        fullWidth={ true }
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Please upload report and add brief description about this report</DialogTitle>
        <div style={{display:error===true?'block':'none', color:'red',margin:'auto'}}>
        Max Length 300.</div>
        <DialogContent>
        <Grid item xs={12} sm={12} md={6} className="pd20">
                                   <Grid item xs={12}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                               Type of Report
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value typeofreports" >
                                               {/*  <BootstrapInput
                                                polyfill="false"
                                                className="primary-input mb20 width100p"
                                                placeholder=""
                                                value={props.labClinician}
                                                onChange={(e) => {
                                                  props.setLabClinician(e.target.value)
                                                }}
                                                 ></BootstrapInput> */}

                                                  <FormControl variant="outlined" label="outlined" className={classes.formControl} >
                                                      <InputLabel id="myprofile-speciality-label" className={classes.inputLabel}>
                                                        {typOfReport}
                                                      </InputLabel>
                                                      <Select
                                                        className={classes.select}
                                                        labelId="myprofile-speciality-label"
                                                        id="myprofileSpecialty"
                                                        value={typOfReport}
                                                        onChange={(e) => {
                                                          props.setLabClinician(e.target.value);
                                                          setTypeOfReport(e.target.value)
                                                        }}
                                                        
                                                        fullWidth
                                                       
                                                      >
                                                        {
                                                          ["Blood Test", "Imaging Test", "Cardiology Test", "Microbiology", "Other Tests"].map((item, index) => {
                                                            return (<MenuItem value={item} > {item} </MenuItem>);
                                                          })
                                                        }
                                                      </Select>
                                                    </FormControl>

                                               
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                             
                                        <input type="file" id="upload1" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                          props.setReport(e)
                                        }}
                                        />
                                        <label for="upload1" class="custom-file-input1"></label>
            <div>{Object.keys(props.report).length == 0 ?  "" : props.report.target.files[0].name}</div>
                                      </Grid>
          <TextareaAutosize
            aria-label="minimum height"
            style={{ width: "100%" }}
            minRows={4}
            placeholder = "Short Description about the report  (Example, Blood report, Urine Analysis, etc.)"
            onChange={(e)=>props.setDesc(e.target.value)}
            maxLength="300"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick = {
            props.onClose
          }
          color = "primary"
          className = "  btn-secondary-cancel" >
            Cancel
          </Button>
          <Button
            onClick={props.onUploadReport}
            className="btn-primary-add" >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
