import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {TextField, Grid, Divider, Typography, Chip, Checkbox} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

class F72Form extends Component {
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
      userId: "",
      userIds: "",
      userIdError: "",
      featureMenuItems: [],
      featureId: [],
      featureIds: "",
      featureIdError: "",
      programmeGroupMenuItems: [],
      programmeGroupId: [],
      programmeGroupIds: "",
      programmeGroupIdError: "",
      isEditMode: false
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  }

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      isOpenSnackbar: false,
    });
  }

  loadUsers = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72FormProgrammeGroupRightsAllocationAllUsersView`;
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
  }

  loadFeatures = async (featureUserId) => {
    let data =  new FormData();
    data.append("featureUserId", featureUserId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72CommonFeaturesViews`;
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
  }

  loadProgrammeGroups = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72CommonProgrammeGroupsView`;
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
            this.setState({ programmeGroupMenuItems: json.DATA || []});
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammeGroups", json);
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
  }

  loadData = async (userId, featureId) => {
    const data = new FormData();
    data.append("userId", userId);
    data.append("featureId", featureId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72FormProgrammeGroupsRightsAllocationViewEdit`;
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
                let userId = {id:data[0].userId, label:data[0].userLabel} || null ;
                this.handleSetUserId(userId);
                let featureId = [{id:data[0].featureId, label:data[0].featureLabel}] || [];
                this.handleSetFeatureId(featureId);
                let programmeGroups = data[0].programmeGroups || [];
                this.handleSetProgrammeGroupId(programmeGroups);
                this.setState({isEditMode:true});
              }else{
                window.location = "#/dashboard/F72Form/0";
              }
            }else{
              window.location = "#/dashboard/F72Form/0";
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
  }

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
  }

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
  }

  isProgrammeValid = () => {
    let programmeGroupId = this.state.programmeGroupId;
    let isValid = true;
    if (programmeGroupId.length == 0 ) {
      this.setState({ programmeGroupIdError: "Please select at least one programme group." });
      document.getElementById("featureId").focus();
      isValid = false;
    }else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
  }

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
  }

  userSelected = (option) => {
    return this.state.userId.some((selectedOption) => selectedOption.id == option.id);
  }

  handleSetUserId = (value) => {
    this.setState({
      userId: value,
      userIdError: "",
    });
    let userIds = "";
    if(value){
      userIds = value.id;
      this.loadFeatures(value.id);
      this.setState({userIds:userIds});
    }else{
      this.setState({
        featureId: [],
        featureIds: "",
        programmeGroupId : [],
        programmeGroupIds: ""
      });
    }
  }

  featureSelected = (option) => {
    return this.state.featureId.some((selectedOption) => selectedOption.id == option.id);
  }

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
      if(arrLength===0){
        this.setState({
          programmeGroupId: [],
          programmeGroupIds: ""
        });
      }
    }
  }

  programmeGroupSelected = (option) => {
    return this.state.programmeGroupId.some((selectedOption) => selectedOption.Id == option.Id);
  }

  handleSetProgrammeGroupId = (value) => {
    this.setState({
      programmeGroupId: value,
      programmeGroupIdError: "",
    });

    let programmeGroupIds = "";
    if(value){
      let programmeGroup = value || []; 
      let arrLength = programmeGroup.length || 0;
      for(let i=0; i<arrLength; i++){
        if(i==0){
          programmeGroupIds = programmeGroup[i].Id;
        }else{
          programmeGroupIds+= ","+programmeGroup[i].Id;
        }    
      }
      this.setState({programmeGroupIds:programmeGroupIds});
    }
  }

  clickOnFormSubmit = () => {
     if(
      !this.isUsersValid()
      || !this.isFeatureValid()
      || !this.isProgrammeValid()
    ){ return; }
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C72FormProgrammeGroupsRightsAllocationSave`;
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
                window.location = "#/dashboard/F72Reports";
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
    window.location = "#/dashboard/F72Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadUsers();
    this.loadProgrammeGroups();
    if(this.state.recordId!=0) {
      let recordIdArray = this.state.recordId.split("&") || "0&0";
      let recordIdArrayLength = recordIdArray.length;
      if(recordIdArrayLength==2){
        this.loadData(recordIdArray[0], recordIdArray[1]); 
      }else{
        window.location = "#/dashboard/F72Form/0";
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        let recordIdArray = this.state.recordId.split("&") || "0&0";
        let recordIdArrayLength = recordIdArray.length;
        if(recordIdArrayLength==2){
          this.loadData(recordIdArray[0], recordIdArray[1]); 
        }else{
          window.location = "#/dashboard/F72Form/0";
        }
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
              User Feature Programme Groups
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
                  //multiple
                  fullWidth
                  id="userId"
                  options={this.state.userMenuItems}
                  value={this.state.userId}
                  onChange={(event, value) =>
                    this.handleSetUserId(value)
                  }
                  disabled={this.state.isEditMode}
                  //disableCloseOnSelect
                  getOptionLabel={(option) => typeof option.label === 'string' ? option.label : "" }
                  //getOptionSelected={(option) => this.userSelected(option)}
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
                      required
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
                  disabled={this.state.isEditMode || !this.state.userIds}
                  getOptionLabel={(option) => typeof option.label === 'string' ? option.label : "" }
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
                      required
                      error={!!this.state.featureIdError}
                      helperText={this.state.featureIdError}
                    />
                  )}
                />
                <TextField type="hidden" name="featureId" value={this.state.featureIds}/>
              </Grid>
              <Grid item xs={12} md={12}>
                <Autocomplete
                  multiple
                  fullWidth
                  id="programmeGroupId"
                  options={this.state.programmeGroupMenuItems}
                  value={this.state.programmeGroupId}
                  onChange={(event, value) =>
                    this.handleSetProgrammeGroupId(value)
                  }
                  disableCloseOnSelect
                  disabled={!this.state.featureIds}
                  getOptionLabel={(option) => typeof option.Label ? option.Label : ""}
                  getOptionSelected={(option) => this.programmeGroupSelected(option)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option.Label}
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
                      {option.Label}
                    </Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Programme Groups"
                      placeholder="Search and Select"
                      required
                      error={!!this.state.programmeGroupIdError}
                      helperText={this.state.programmeGroupIdError}
                    />
                  )}
                />
                <TextField type="hidden" name="programmeGroupId" value={this.state.programmeGroupIds}/>
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
export default withStyles(styles)(F72Form);
