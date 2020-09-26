import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, MenuItem, FormControl, InputLabel, Select, Chip, checked, Checkbox, helperText, 
  FormControlLabel, FormLabel, FormGroup, FormHelperText} from "@material-ui/core";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const styles = (theme) => ({
  root: {
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0
  },
  title: {
    color: "#1d5f98",
    fontWeight: 600,
    borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
    width: "98%",
    marginBottom: 25,
    fontSize: 20,
  },
  formControl: {
    '& #programmeGroupId':{
      display:"inline-table",
      paddingRight:0,
      paddingLeft:0
    }
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    whiteSpace: "break-spaces",
    paddingRight:22,
    paddingLeft:5
  },
  chip: {
    margin: 2,
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class AnnouncementForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isLoginMenu: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      label: "",
      labelError: "",
      anouncementDetails: "",
      anouncementDetailsError: "",
      anouncementDate: null,
      anouncementDateError: "",
      programmeGroupId:[],
      programmeGroupIdError:"",
      programmeGroupsMenuItems:[],
      sectionId:[],
      sectionIdString:"",
      sectionIdError:"",
      sectionsMenuItems:[],
      isAnnouncementForTeachers: false,
      isAnnouncementForStudents: false,
      announcementForError:""
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

  getprogramGroups = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C58CommonActiveSessionProgrammeGroupView`;
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
            this.setState({ programmeGroupsMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getprogramGroups", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getSections = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C65CommonAcademicsSectionsView`;
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
            this.setState({sectionsMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getSections", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
            console.log(error);
          }
        }
      );
    this.setState({isLoading: false});
  };

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C65CommonAcademicsTeacherAnouncementsView`;
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
            const data = json.DATA || [];
            if (data.length > 0) {              
              this.setState({
                programmeGroupId: data[0].GroupAnouncementArray.map((item, index)=>item.Id),
                label: data[0].label,
                anouncementDetails: data[0].anouncementDetails,
                anouncementDate: data[0].anouncementDateSimple,
              });
              if(data[0].anouncementTypeId==1 || data[0].anouncementTypeId==2){
                this.setState({isAnnouncementForTeachers:true});
              }
              if(data[0].anouncementTypeId==1 || data[0].anouncementTypeId==3){
                this.setState({isAnnouncementForStudents:true});
              }
              this.handleSetSection(data[0].SectionAnouncementArray || []);
            } else {
              window.location = "#/dashboard/F65Form/0";
            }
          } else {
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to load announcements data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isFormValid = () => {
    let isValid = true;
    let { labelError, anouncementDateError, anouncementDetailsError, announcementForError, sectionIdError } = this.state;

    
    if (this.state.sectionId.length<=0) {
      sectionIdError = "Please select the section";
      isValid = false;
    } else {
      sectionIdError = "";
    }

    if (!this.state.anouncementDate) {
      anouncementDateError = "Please select the announcement date";
      isValid = false;
    } else {
      anouncementDateError = "";
    }

    if (!this.state.label) {
      labelError = "Please enter announcement title";
      isValid = false;
    } else {
      labelError = ""
    }

    if (!this.state.anouncementDetails) {
      anouncementDetailsError = "Please enter announcement details";
      isValid = false;
    } else {
      anouncementDetailsError = "";
    }

    // if (!this.state.isAnnouncementForTeachers && !this.state.isAnnouncementForStudents) {
    //   announcementForError = "Please select";
    //   isValid = false;
    // } else {
    //   announcementForError = "";
    // }

    this.setState({labelError, anouncementDateError, anouncementDetailsError, announcementForError, sectionIdError});

    return isValid;
  }

  resetForm = () => {
    this.setState({
      recordId: 0,
      label: "",
      labelError: "",
      anouncementDetails: "",
      anouncementDetailsError: "",
      anouncementDate: null,
      anouncementDateError: "",
      programmeGroupId:[],
      programmeGroupIdError:"",
      sectionId:[],
      sectionIdString:"",
      sectionIdError:"",
      isAnnouncementForStudents:false,
      isAnnouncementForTeachers:false,
      announcementForError:""
    })
  }

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      document.getElementById("announcementSubmit").click();
    }
  };


  onFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C65CommonAcademicsTeacherAnouncementsSave`;
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
            if (this.state.recordId == 0) {
              this.resetForm();
            }else{
              this.viewReport();
            }
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
    window.location = "#/dashboard/F65Reports";
  };

  getprogramGroupsLabelFromID = (id) => {
    let res = this.state.programmeGroupsMenuItems.find((obj)=>obj.Id===id);
    if(res){
      return res.Label;
    }
    return "";
  }

  isSectionSelected = (option) => {
    return this.state.sectionId.some((obj) => JSON.stringify(obj) == JSON.stringify(option));
  };

  handleDateChange = (name, date) => {
    const errorName = `${name}Error`;
    this.setState({
      [name]: date,
      [errorName]: ""
    });
  };

  handleSetSection = (value) => {
    let sectionIdString = "";
    for(let i=0;i<value.length;i++){
      if(i!=0){ sectionIdString+=","; }
      sectionIdString+=value[i].id;
    }
    this.setState({
      sectionId: value, 
      sectionIdString:sectionIdString,
      sectionIdError: ""
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleAnnouncementChange = (event) => {
    console.log(event.target);
    this.setState({[event.target.name]: event.target.checked });
  };

  componentDidMount() {
    //this.getprogramGroups();
    this.getSections();
    this.props.setDrawerOpen(false);
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.loadData(nextProps.match.params.recordId);
        this.setState({
          recordId: nextProps.match.params.recordId
        })
      } else {
        window.location.reload();
      }
    }
  }

  render() {

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const { classes } = this.props;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.onFormSubmit}>
          <TextField
            type="hidden"
            name="recordId"
            value={this.state.recordId}
          />
          <Grid
            container
            component="main"
            className={classes.root}
          >
            <Typography
              className={classes.title}
              variant="h5"
            >
              Announcement Form
            </Typography>
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              {/* 
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                  <InputLabel id="programmeGroupId-label">Programme Groups</InputLabel>
                  <Select
                    multiple
                    labelId="programmeGroupId-label"
                    id="programmeGroupId"
                    name="programmeGroupId"
                    label="Programme Groups"
                    value={this.state.programmeGroupId}
                    onChange={this.onHandleChange}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                            <Chip 
                              key={value} 
                              label={this.getprogramGroupsLabelFromID(value)} 
                              className={classes.chip} 
                              color="primary"
                              variant="outlined"
                            />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {this.state.programmeGroupsMenuItems.map((item) => (
                      <MenuItem key={item.Id} value={item.Id}>
                        {item.Label}
                      </MenuItem>
                    ))} 
                  </Select>
                </FormControl>
              </Grid> 
              */}
              <Grid item xs={12} md={4}>
                <Autocomplete
                  multiple
                  fullWidth
                  id="sectionId"
                  options={this.state.sectionsMenuItems}
                  value={this.state.sectionId}
                  onChange={(event, value) => this.handleSetSection(value)}
                  disableCloseOnSelect
                  getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                  getOptionSelected={(option) => this.isSectionSelected(option)}
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
                      label="Sections"
                      placeholder="Search and Select"
                      error={!!this.state.sectionIdError}
                      helperText={this.state.sectionIdError ? this.state.sectionIdError : "" }
                    />
                  )}
                />
                <TextField type="hidden" name="sectionId" value={this.state.sectionIdString}/>
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  autoOk
                  name="anouncementDate"
                  id="anouncementDate"
                  label="Announcement Date"
                  invalidDateMessage=""
                  disablePast
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  value={this.state.anouncementDate}
                  onChange={date => this.handleDateChange("anouncementDate", date)}
                  error={!!this.state.anouncementDateError}
                  helperText={this.state.anouncementDateError ? this.state.anouncementDateError : " "}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  id="label"
                  name="label"
                  label="Title"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  error={!!this.state.labelError}
                  helperText={this.state.labelError ? this.state.labelError : " "}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  id="anouncementDetails"
                  name="anouncementDetails"
                  label="Announcement Details"
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  onChange={this.onHandleChange}
                  value={this.state.anouncementDetails}
                  error={!!this.state.anouncementDetailsError}
                  helperText={this.state.anouncementDetailsError}
                />
              </Grid>
              {/* 
              <Grid item xs={4} md={2}>
                <FormControl required error={!!this.state.announcementForError} component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Announcement For</FormLabel>
                  <FormGroup style={{marginLeft:"1em"}}>
                    <br/>
                    <FormControlLabel
                      control={<Checkbox checked={this.state.isAnnouncementForTeachers} onChange={this.handleAnnouncementChange} name="isAnnouncementForTeachers" color="primary"  value={1}/>}
                      label="Teachers"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={this.state.isAnnouncementForStudents} onChange={this.handleAnnouncementChange} name="isAnnouncementForStudents" color="primary" value={1}/>}
                      label="Students"
                    />
                  </FormGroup>
                  <FormHelperText>{this.state.announcementForError}</FormHelperText>
                </FormControl>
              </Grid> 
              */}
            </Grid>
            <br />
          </Grid>
          <input type="submit" id="announcementSubmit" style={{ display: 'none' }} />
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={() => this.viewReport()}
          right_button_text="Save"
          bottomRightButtonAction={() => this.clickOnFormSubmit()}
          loading={this.state.isLoading}
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

AnnouncementForm.propTypes = {
  classes: PropTypes.object,
  isDrawerOpen: PropTypes.bool,
  setDrawerOpen: PropTypes.func,
  match: PropTypes.object
}

AnnouncementForm.defaultProps = {
  classes: {},
  isDrawerOpen: true,
  setDrawerOpen: fn => fn,
  match: {
    params: {
      recordId: 0
    }
  }
}

export default withStyles(styles)(AnnouncementForm);
