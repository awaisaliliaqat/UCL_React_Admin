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
import { Link } from "react-router-dom";
function ViewTableRecord(props) {
  const [open, setOpen] = React.useState(false);
  console.log(props, "data is coming");
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

      <Button
        style={{ fontSize: 12, textTransform: "capitalize" }}
        variant="outlined"
      >
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={props.onEditURL}
        >
          View Summary
        </Link>
      </Button>
    </div>
  );
}

export default ViewTableRecord;
