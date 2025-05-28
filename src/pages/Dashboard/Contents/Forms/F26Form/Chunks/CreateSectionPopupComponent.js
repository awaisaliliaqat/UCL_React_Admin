import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tooltip,
  TextField,
  Grid,
  Divider,
  MenuItem,
} from "@material-ui/core";

const styles = {
  dialogTitle: {
    paddingBottom: 0,
  },
  divider: {
    backgroundColor: "rgb(58, 127, 187)",
    opacity: "0.3",
  },
};

class CreateSectionPopupComponent extends Component {
  constructor(props) {
    super(props);
    console.log(props, "props are coming");
    this.state = {
      popupBoxOpen: false,
      fromsessionData: [...props.fromSessionData],
      toSessionData: [...props.toSessionData],
      fromSessionId: "",
      toSessionId: "",
    };
  }

  handleClickOpen = () => {
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.setState({ popupBoxOpen: false });
  };

  onHandleFromChange = (event) => {
    this.setState({ fromSessionId: event.target.value });
  };

  onHandleToChange = (event) => {
    this.setState({ toSessionId: event.target.value });
  };
  triggerSnackbar = (msg, str) => {
    const { handleOpenSnackbar } = this.props;
    handleOpenSnackbar(msg, str);
  };

  saveCopyToNext = async () => {
    console.log("data is coming", this.state);
    const data = new FormData();
    data.append("fromSessionId", this.state.fromSessionId);
    data.append("toSessionId", this.state.toSessionId);

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSectionsCopyToNextSession`;
    await fetch(url, {
      method: "POST",
      body: data,
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (json) => {
          if (json.CODE === 1) {
            this.triggerSnackbar("Saved", "success");
            this.handleClose();
          } else if (json.CODE === 3) {
            this.triggerSnackbar(json.USER_MESSAGE, "error");
            this.handleClose();
          }
        },
        (error) => {
          if (error.status == 401) {
          } else {
            this.triggerSnackbar(
              "Failed to Load Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
  };

  render() {
    const { classes, dialogTitle, isReadOnly } = this.props;

    return (
      <Fragment>
        <Tooltip title={isReadOnly ? "View Details" : "Add or Edit Details"}>
          <Button
            variant="contained"
            onClick={this.handleClickOpen}
            style={{
              background: "#1565c0",
              color: "white",
              marginBottom: "5px",
            }}
          >
            Copy To Next Session
          </Button>
        </Tooltip>
        <Dialog
          maxWidth="md"
          open={this.state.popupBoxOpen}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            className={classes.dialogTitle}
            id="responsive-dialog-title"
            style={{
              color: "#1565c0",
            }}
          >
            Copy Sections
          </DialogTitle>
          <Divider className={classes.divider} />
          <DialogContent>
            <Grid item xs={4} style={{ marginBottom: "10px" }}>
              <TextField
                style={{ width: "300px" }}
                id="fromSessionId"
                name="fromSessionId"
                label="From"
                required
                fullWidth
                variant="outlined"
                onChange={this.onHandleFromChange}
                value={this.state.fromSessionId}
                select
              >
                {this.state.fromsessionData.map((item) => (
                  <MenuItem key={item.ID} value={item.ID}>
                    {item.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                style={{ width: "300px" }}
                id="toSessionId"
                name="toSessionId"
                label="To"
                required
                fullWidth
                variant="outlined"
                onChange={this.onHandleToChange}
                value={this.state.toSessionId}
                select
              >
                {this.state.toSessionData.map((item) => (
                  <MenuItem key={item.ID} value={item.ID}>
                    {item.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </DialogContent>
          <Divider className={classes.divider} />
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Close
            </Button>
            <Button
              onClick={this.saveCopyToNext}
              color="primary"
              disabled={
                this.state.fromSessionId === "" || this.state.toSessionId === ""
              }
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

CreateSectionPopupComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogTitle: PropTypes.string,
  isReadOnly: PropTypes.bool,
  data: PropTypes.array.isRequired,
};

CreateSectionPopupComponent.defaultProps = {
  dialogTitle: "",
  isReadOnly: true,
};

export default withStyles(styles)(CreateSectionPopupComponent);
