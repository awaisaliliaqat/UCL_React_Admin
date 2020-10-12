import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberFreeExp, numberExp } from "../../../../utils/regularExpression";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography, Chip,
  Select, IconButton, Tooltip, Checkbox} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker } from "@material-ui/pickers";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = () => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
  },
  formControl: {
    minWidth: "100%",
  },
  sectionTitle: {
    fontSize: 19,
    color: "#174a84",
  },
  checkboxDividerLabel: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 16,
    fontWeight: 600,
  },
  rootProgress: {
    width: "100%",
    textAlign: "center",
  }
});

class F70Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      userMenuItems: [],
      userId: [],
      userIds: "",
      userIdError: "",
      featureMenuItems: [],
      featureId: [],
      featureIds: "",
      featureIdError: "",
      isEditMode: false
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      isOpenSnackbar: false,
    });
  };

  loadUsers = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationAllUsersView`;
    await fetch(url, {
      method: "POST",
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
            this.setState({ userMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadUsers", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadFeatures = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonFeaturesViews`;
    await fetch(url, {
      method: "POST",
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
            this.setState({ featureMenuItems: json.DATA || []});
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadFeatures", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadData = async (recordId) => {
    const data = new FormData();
    data.append("id", recordId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationViews`;
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
            let data = json.DATA || [];
            let dataLength = data.length;
            if(dataLength>0){
              if(data[0].userId){
                this.handleSetUserId([{id:data[0].userId, label:data[0].userLabel}]);
                let features = data[0].features || [];
                this.handleSetFeatureId(features);
                this.setState({isEditMode:true});
              }else{
                window.location = "#/dashboard/F70Form/0";
              }
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isUsersValid = () => {
    let userId = this.state.userId;
    let isValid = true;
    if (userId.length == 0 ) {
      this.setState({ userIdError: "Please select at least one user." });
      document.getElementById("userId").focus();
      isValid = false;
    }else {
      this.setState({ userIdError: "" });
    }
    return isValid;
  };

  isFeatureValid = () => {
    let featureId = this.state.featureId;
    let isValid = true;
    if (featureId.length == 0 ) {
      this.setState({ featureIdError: "Please select at least one feature." });
      document.getElementById("featureId").focus();
      isValid = false;
    }else {
      this.setState({ featureIdError: "" });
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "":
        break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  userSelected = (option) => {
    return this.state.userId.some((selectedOption) => selectedOption.id == option.id);
  };

  handleSetUserId = (value) => {
    this.setState({
      userId: value,
      userIdError: "",
    });

    let userIds = "";
    if(value){
      let users = value || []; 
      let arrLength = value.length || 0;
      for(let i=0; i<arrLength; i++){
        if(i==0){
          userIds = users[i].id;
        }else{
          userIds+= ","+users[i].id;
        }    
      }
      this.setState({userIds:userIds});
    }
  };

  featureSelected = (option) => {
    return this.state.featureId.some((selectedOption) => selectedOption.id == option.id);
  };

  handleSetFeatureId = (value) => {
    this.setState({
      featureId: value,
      featureIdError: "",
    });

    let featureIds = "";
    if(value){
      let features = value || []; 
      let arrLength = value.length || 0;
      for(let i=0; i<arrLength; i++){
        if(i==0){
          featureIds = features[i].id;
        }else{
          featureIds+= ","+features[i].id;
        }    
      }
      this.setState({featureIds:featureIds});
    }

  };

  clickOnFormSubmit = () => {
     if(
      !this.isUsersValid()
      || !this.isFeatureValid()
    ){ return; }
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/FormRightsAllocationAllProgrammeGroupsSave`;
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
            this.handleOpenSnackbar(json.USER_MESSAGE, "success");
            setTimeout(() => {
              if (this.state.recordId != 0) {
                window.location = "#/dashboard/F70Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  viewReport = () => {
    window.location = "#/dashboard/F70Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadUsers();
    this.loadFeatures();
    if(this.state.recordId!=0) {
      this.loadData(this.state.recordId); 
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.loadData(nextProps.match.params.recordId);
      } else {
        window.location.reload();
      }
    }
  }

  render() {
    const { classes } = this.props;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
              }}
              variant="h5"
            >
              User Rights
            </Typography>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  fullWidth
                  id="userId"
                  options={this.state.userMenuItems}
                  value={this.state.userId}
                  onChange={(event, value) =>
                    this.handleSetUserId(value)
                  }
                  disabled={this.state.isEditMode}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  getOptionSelected={(option) => this.userSelected(option)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderOption={(option, {selected}) => (
                    <Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                        color="primary"
                      />
                      {option.label}
                    </Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Users"
                      placeholder="Search and Select"
                      error={!!this.state.userIdError}
                      helperText={this.state.userIdError}
                    />
                  )}
                />
                <TextField type="hidden" name="userId" value={this.state.userIds}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  fullWidth
                  id="featureId"
                  options={this.state.featureMenuItems}
                  value={this.state.featureId}
                  onChange={(event, value) =>
                    this.handleSetFeatureId(value)
                  }
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  getOptionSelected={(option) => this.featureSelected(option)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderOption={(option, {selected}) => (
                    <Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                        color="primary"
                      />
                      {option.label}
                    </Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Features"
                      placeholder="Search and Select"
                      error={!!this.state.featureIdError}
                      helperText={this.state.featureIdError}
                    />
                  )}
                />
                <TextField type="hidden" name="featureId" value={this.state.featureIds}/>
              </Grid>
            </Grid>
            <br />
            <br />
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
          loading={this.state.isLoading || this.state.rowEditMode}
          isDrawerOpen={this.props.isDrawerOpen}
        />
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
      </Fragment>
    );
  }
}
export default withStyles(styles)(F70Form);
