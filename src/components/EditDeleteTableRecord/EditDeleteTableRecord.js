import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";

function EditDeleteTableRecord(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form
          id="myform"
          onSubmit={(event) => props.DeleteData(event)}
          autoComplete="off"
        >
          <DialogTitle id="form-dialog-title">Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please provide the reason to delete the record.
            </DialogContentText>
            <input type="hidden" value={props.recordId} name="id"></input>
            <TextField
              autoFocus
              fullWidth
              required
              //margin="dense"
              id="logReason"
              name="logReason"
              label="Reason"
              type="text"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Tooltip title="Delete">
        <IconButton
          onClick={handleClickOpen}
          //aonClick={(event) => DeleteData(props)}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          onClick={() => (window.location = `${props.onEditURL}`)}
          //`#/dashboard/F06Form/${props.recordId}`
        >
          <EditIcon fontSize="small" style={{ color: "#ff9800" }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default EditDeleteTableRecord;
