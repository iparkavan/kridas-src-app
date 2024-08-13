import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import DialogContentText from "@material-ui/core/DialogContentText";


export default function NotesDialog(props) {
  const { data, noteId } = props;
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState(false)
  const title = noteId ? "Update Notes" : "Add Notes";
  const buttonText = noteId ? "Update" : "Add";

  const saveNotes = () => {
    setError(false);
    if (noteId) props.saveNotes(notes, noteId, 'Update');
    else
      props.saveNotes(notes);
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
    setError(false)
    props.closeNotes(false);
  };
  const handleConfirmClose = () => { return };
  const setPatientNoteData = () => {
    const patientNote = data.find((notes) => notes?.id === noteId);
    if (patientNote) { setNotes(patientNote?.desc); }
  };

  const buttonHandler = () => (
    <>
      <Button onClick={handleClose} color="primary" className="  btn-secondary-cancel" > Cancel </Button>
      <Button onClick={saveNotes} className="btn-primary-add"> {buttonText} </Button>
    </>
  );

  useEffect(() => {
    if (data && noteId) {
      setPatientNoteData();
    }
  }, [data, noteId]);


  return (
    <div>
      <Dialog
        maxWidth={"md"}
        open={props.open}
        onClose={handleClose}
        fullWidth={true}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <div style={{ display: error === true ? 'block' : 'none', color: 'red', margin: 'auto' }}>
          Max Length 300.</div>
        <DialogContent>
          <TextareaAutosize
            aria-label="minimum height"
            style={{ width: "100%" }}
            minRows={4}
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength="300"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" className="  btn-secondary-cancel" > Cancel </Button>
          <Button onClick={saveNotes} className="btn-primary-add"> {buttonText} </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


/*
 <Button 
            <Dialog
              //open={confirmOpen}
              onClose={handleConfirmClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this patient?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleConfirmClose} color="primary" autoFocus>
                  No
                </Button>
                <Button onClick={saveNotes} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
 */
