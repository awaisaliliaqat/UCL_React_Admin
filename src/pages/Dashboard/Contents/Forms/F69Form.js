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

class F69Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      label:"",
      labelError:"",
      programmeGroupMenuItems: [],
      programmeGroupId: [],
      programmeGroupIds: "",
      programmeGroupIdError: "",
      preDate: this.getTomorrowDate(),
      preDateError: "",
      noOfDays:"",
      noOfDaysError:""
    };
  }

  getTomorrowDate = () => {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return tomorrowDate;
  }

  getDateInString = (todayDate) => {
    let today = todayDate;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) { dd = "0" + dd; }
    if (mm < 10) { mm = "0" + mm; }
    today = dd + "-" + mm + "-" + yyyy;
    return today;
  };

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

  loadProgrammeGroups = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C69CommonAcademicsSessionsOfferedProgrammesGroupsView`;
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
            this.setState({ programmeGroupMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammeGroups", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C69CommonHolidaysView`;
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
            let data = json.DATA[0] || [];
            if(data.label){
              this.setState({
                label: data.label,
                preDate: data.effectiveDateFrom,
                noOfDays:data.noOfDays
              });
              this.handleSetprogrammeGroupId([data.programmeGroup]);
            }else{
              window.location = "#/dashboard/F69Form/0";
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
  
  isLabelValid = () => {
    let isValid = true;
    if (!this.state.label) {
      this.setState({ labelError: "Please enter label." });
      document.getElementById("label").focus();
      isValid = false;
    } else {
      this.setState({ labelError: "" });
    }
    return isValid;
  };

  isProgrammeGroupIdValid = () => {
    let programmeGroupId = this.state.programmeGroupId;
    let isValid = true;
    if (programmeGroupId.length == 0 ) {
      this.setState({ programmeGroupIdError: "Please select programme group." });
      document.getElementById("programmeGroupId").focus();
      isValid = false;
    }else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
  };

  isPreDateValid = () => {
    let isValid = true;
    if (!this.state.preDate) {
      this.setState({ preDateError: "Please select date." });
      document.getElementById("preDate").focus();
      isValid = false;
    } else {
      this.setState({ preDateError: "" });
    }
    return isValid;
  };

  isDaysValid = () => {
    let isValid = true;
    if (!this.state.noOfDays || this.state.noOfDays<1) {
      this.setState({ noOfDaysError: "Please enter number of days." });
      document.getElementById("days").focus();
      isValid = false;
    } else {
      this.setState({ noOfDaysError: "" });
    }
    return isValid;
  };
  
  handleChangePreDate = (date) => {
    this.setState({preDate: date});
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

  handleSetprogrammeGroupId = (value) => {
    this.setState({
      programmeGroupId: value,
      programmeGroupIdError: "",
    });

    let programmeGroupIds = "";
    if(value){
      let programmeGroup = value || []; 
      let arrLength = value.length || 0;
      for(let i=0; i<arrLength; i++){
        if(i==0){
          programmeGroupIds = programmeGroup[i].ID;
        }else{
          programmeGroupIds+= ","+programmeGroup[i].ID;
        }    
      }
      this.setState({programmeGroupIds:programmeGroupIds});
    }

  };

  clickOnFormSubmit = () => {

    if(
      !this.isLabelValid()
      || !this.isProgrammeGroupIdValid()
      //|| !this.isDaysValid()
    ){ return; }

    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    let myForm = document.getElementById("myForm");
    let data = new FormData(myForm);
    data.append("noOfDays", 1);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C69CommonHolidaysSave`;
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
                window.location = "#/dashboard/F69Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
    window.location = "#/dashboard/F69Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadProgrammeGroups();
    if(this.state.recordId != 0) {
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
              Holidays
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
              <Grid item xs={12} md={12}>
                <TextField
                  id="label"
                  name="label"
                  label="Label"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  error={!!this.state.labelError}
                  helperText={this.state.labelError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  fullWidth
                  id="programmeGroupId"
                  options={this.state.programmeGroupMenuItems}
                  value={this.state.programmeGroupId}
                  onChange={(event, value) =>
                    this.handleSetprogrammeGroupId(value)
                  }
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.Label}
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
                      error={!!this.state.programmeGroupIdError}
                      helperText={this.state.programmeGroupIdError}
                    />
                  )}
                />
                <TextField type="hidden" name="programmeGroupId" value={this.state.programmeGroupIds}/>
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  autoOk
                  name="effectiveDate"
                  id="effectiveDate"
                  label="Effective Date"
                  invalidDateMessage=""
                  disablePast
                  minDate={Date.parse(this.getTomorrowDate())}
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  value={this.state.preDate}
                  onChange={this.handleChangePreDate}
                  error={!!this.state.preDateError}
                  helperText={this.state.preDateError ? this.state.preDateError : " "}
                />
              </Grid>
              {/* 
              <Grid item xs={12} md={6}>
                <TextField
                  id="days"
                  name="noOfDays"
                  label="Days"
                  type="number"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.noOfDays}
                  error={!!this.state.noOfDaysError}
                  helperText={this.state.noOfDaysError}
                />
              </Grid> 
              */}
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
export default withStyles(styles)(F69Form);
