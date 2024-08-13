import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ImagePreview(props) {
  return (
    <React.Fragment>
      <Dialog
       fullWidth={true}
        maxWidth={'md'}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Document preview</DialogTitle>
        <DialogContent style={{textAlign:'center'}}>
        <img style={{width: '400px', height: 'auto'}} src={props.img}  alt="Document" />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}