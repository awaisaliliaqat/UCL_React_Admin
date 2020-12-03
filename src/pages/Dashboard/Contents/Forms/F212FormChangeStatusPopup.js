import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography, Button,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, useMediaQuery} from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const styles = (theme) => ({
  
});

class F212FormChangeStatusPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      popupBoxOpen: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.props.handleClose();
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  componentDidMount() {
    this.setState({
      popupBoxOpen: this.props.isOpen
    });
  }

  componentDidUpdate(prevProps){
    // Typical usage (don't forget to compare props):
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setState({
        popupBoxOpen: this.props.isOpen
      });
    }
  }

  render() {

    const { 
      classes, 
      data, 
      applicationStatusMenuItems=[], 
      renewalStatusMenuItems=[], 
      examEntryStatusMenuItems=[],
      pathwayMenuItems=[],
      isLoading,
      onFormSubmit
    } = this.props;

    return (
        <Dialog
          fullScreen={false}
          maxWidth="md"
          open={this.state.popupBoxOpen}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <span style={{ color: "#ffffff" }}>
            ______________________________________________________________________________________________________________________
          </span>
          <DialogTitle id="responsive-dialog-title">
            <IconButton
              aria-label="close"
              onClick={this.handleClose}
              style={{
                position: "relative",
                top: "-35px",
                right: "-24px",
                float: "right",
              }}
            >
              <CloseOutlinedIcon color="secondary" />
            </IconButton>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                fontSize: 20,
              }}
            >
              {data.studentNucleusId+" - "+data.studentName}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form id="changeStatusForm" name="changeStatusForm">
              <Grid
                container
                justify="flex-start"
                alignItems="center"
                spacing={2}
              >
                <TextField
                  type="hidden"
                  id="studentId"
                  name="studentId"
                  defaultValue={data.studentId}
                />
                <Grid item xs={12} md={4}>
                  <TextField
                    name="applicationStatusId"
                    variant="outlined"
                    label="Application Status"
                    defaultValue={data.applicationStatusId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"applicationStatusId"
                    }}
                  >
                    {applicationStatusMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"applicationStatusMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="renewalStatusId"
                    variant="outlined"
                    label="Renewal Status"
                    defaultValue={data.renewalStatusId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"renewalStatusId"
                    }}
                  >
                    {renewalStatusMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"renewalStatusId"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="examEntryStatusId"
                    variant="outlined"
                    label="Exam Entry Status"
                    defaultValue={data.examEntryStatusId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"examEntryStatusId"
                    }}
                  >
                    {examEntryStatusMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"examEntryStatusMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="pathwayId"
                    variant="outlined"
                    label="Pathway"
                    defaultValue={data.pathwayId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"pathwayId"
                    }}
                  >
                    {pathwayMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"pathwayMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="UOLNo"
                    name="UOLNo"
                    variant="outlined"
                    label="UOL#"
                    defaultValue={data.uolNumber || ""}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <br />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <DialogActions>
            <Button 
              autoFocus 
              onClick={this.handleClose} 
              color="secondary"
            >
              Close
            </Button>
            <Button
              onClick={onFormSubmit()}
              color="primary"
              disabled={isLoading}
              autoFocus
            >
              {isLoading ? <CircularProgress style={{color:'#174A84'}} size={24}/> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}
export default withStyles(styles)(F212FormChangeStatusPopup);
