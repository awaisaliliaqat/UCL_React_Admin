import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";

function EditDeleteTableComponent(props) {

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
        fullWidth={false}
        maxWidth={'md'}
      >
        <form
          id="myform"
          onSubmit={(event) => {
            props.deleteRecord(event);
            handleClose();
          }}
          autoComplete="off"
        >
          <DialogTitle style={{ color: "#174A84", fontWeight: 600 }} id="form-dialog-title">Delete</DialogTitle>
          <DialogContent style={{
            width: 450,
          }}>
            <DialogContentText style={{
              marginBottom: 10
            }}>
              Please provide the reason to delete the record.
              </DialogContentText>
            <input type="hidden" value={props.recordId} name="id"></input>
            <TextField
              autoFocus
              fullWidth
              required
              id="logReason"
              name="logReason"
              label="Reason"
              type="text"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions style={{
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10
          }}>
            <Button
              onClick={() => handleClose()}
              variant="contained"
              style={{
                textTransform: 'capitalize'
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={{
                textTransform: 'capitalize'
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {!props.hideEditAction &&
        <Tooltip title="Edit">
          <IconButton
            onClick={() => props.editRecord()}
            disabled={props.disabledEditAction}
          >
            <EditIcon
              style={{color:"#ff9800"}}
              fontSize="small"
            />
          </IconButton>
        </Tooltip>
      }
      {!props.hideDeleteAction &&
        <Tooltip title="Delete">
          <IconButton
            onClick={() => handleClickOpen()}
            disabled={props.disabledDeleteAction}
          >
            <DeleteIcon
              fontSize="small"
              color="error"
            />
          </IconButton>
        </Tooltip>
      }
    </div>
  );
}

EditDeleteTableComponent.propTypes = {
  hideDeleteAction: PropTypes.bool,
  hideEditAction: PropTypes.bool,
  disabledDeleteAction: PropTypes.bool,
  disabledEditAction: PropTypes.bool,
  editRecord: PropTypes.func,
  deleteRecord: PropTypes.func,
  recordId: PropTypes.number
}

EditDeleteTableComponent.defaultProps = {
  hideDeleteAction: false,
  hideEditAction: false,
  disabledDeleteAction: false,
  disabledEditAction: false,
  editRecord: fn => fn,
  deleteRecord: fn => fn,
  recordId: 0
}



export default EditDeleteTableComponent;