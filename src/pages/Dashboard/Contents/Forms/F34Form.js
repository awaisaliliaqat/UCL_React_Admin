import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
//import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberExp } from "../../../../utils/regularExpression";
import { TextField, Grid, Button, CircularProgress, Card, CardContent } from "@material-ui/core";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import MenuItem from "@material-ui/core/MenuItem";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";
import { useDropzone } from "react-dropzone";

const styles = () => ({
  root: {
    padding: 20,
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
  },
  inputFileFocused: {
    width: '40%',
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    backgroundColor: "#00FF00",
  },
});

function MyDropzone(props) {

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

  const files = acceptedFiles.map((file, index) => {
      const size = file.size > 0 ? (file.size / 1000).toFixed(2) : file.size;
      return (
          <Typography key={index} variant="subtitle1" color="primary">
              {file.path} - {size} Kb
              <input type="hidden" name="file_name" value={file.path}></input>
          </Typography>
      )
  });

  let msg = files || [];
  if (msg.length <= 0 || props.files.length <= 0) {
      msg = <Typography variant="subtitle1">Please click here to  select and upload an file</Typography>;
  }
  
  return (
      <div 
        id="contained-button-file-div" 
        style={{ 
          textAlign: "center"
        }}
          {...getRootProps({ className: "dropzone", onChange: event => props.onChange(event) })}
      >
          <Card style={{ backgroundColor: "#c7c7c7" }}>
              <CardContent style={{
                  paddingBottom: 14,
                  paddingTop: 14,
                  cursor:"pointer"
              }}>
                  <input name="contained-button-file" {...getInputProps()} disabled={props.disabled} />
                  {msg}
              </CardContent>
          </Card>
      </div>
  );
}

class F34Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      files: [],
      filesError: "",
      uploadLoading:false,
      label:"",
      labelError:"",
      totalMarks: "",
      totalMarksError: "",
      instruction: "",
      instructionError: "",
      startDate: [],
      startDateError: "",
      dueDate: this.getTomorrowDate(),
      dueDateError:"",
      sectionId:"",
      sectionIdError:"",
      sectionIdMenuItems:[]
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

  getTomorrowDate = () => {
    let a = new Date();
    a.setDate(a.getDate() + 1);
    return a;
  }

  getDateInString = (todayDate) => {
    let today = todayDate;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = dd + "-" + mm + "-" + yyyy;
    return today;
  };

  getSectionsData = async() => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C34CommonAcademicsSectionsTeachersView`;
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
            let sectionIdMenuItems = json.DATA;
            this.setState({sectionIdMenuItems: json.DATA});
            console.log("getSectionsData", sectionIdMenuItems)
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C34CommonAcademicsAssignmentsView`;
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
            if(json.DATA.length){
              this.setState({
                sectionId:json.DATA[0].sectionId,
                label: json.DATA[0].label,
                startDate: json.DATA[0].startDate,
                dueDate: json.DATA[0].dueDate,
                totalMarks: json.DATA[0].totalMarks,
                instruction: json.DATA[0].instruction,
              });
            }else{
              window.location = "#/dashboard/F34Form/0";
            }
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
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isLabelValid = () => {
    let isValid = true;
    if (!this.state.label) {
      this.setState({ labelError: "Please enter Assignment Label." });
      document.getElementById("label").focus();
      isValid = false;
    } else {
      this.setState({ labelError: "" });
    }
    return isValid;
  };

  isTotalMarksValid = () => {
    let isValid = true;
    if (!this.state.totalMarks) {
      this.setState({ totalMarksError: "Please enter Total Marks." });
      document.getElementById("totalMarks").focus();
      isValid = false;
    } else {
      this.setState({ totalMarksError: "" });
    }
    return isValid;
  };

  isInstructionValid = () => {
    let isValid = true;
    if (!this.state.instruction) {
      this.setState({ instructionError: "Please enter instruction." });
      document.getElementById("instruction").focus();
      isValid = false;
    } else {
      this.setState({ instructionError: "" });
    }
    return isValid;
  };

  isStartDateValid = () => {
    let isValid = true;
    if (!this.state.startDate) {
      this.setState({ startDateError: "Please select start date." });
      document.getElementById("startDate").focus();
      isValid = false;
    } else {
      this.setState({ startDateError: "" });
    }
    return isValid;
  };

  isDueDateValid = () => {
    let isValid = true;
    if (!this.state.dueDate) {
      this.setState({ dueDateError: "Please select due date." });
      document.getElementById("dueDate").focus();
      isValid = false;
    } else {
      this.setState({ dueDateError: "" });
    }
    return isValid;
  };

  isSectionValid = () => {
    let isValid = true;
    if (!this.state.sectionId) {
      this.setState({ sectionIdError: "Please select section." });
      document.getElementById("sectionId").focus();
      isValid = false;
    } else {
      this.setState({ sectionIdError: "" });
    }
    return isValid;
  };

  isFileValid = () => {
    let isValid = true;
    if (this.state.files.length<1 && this.state.recordId==0) {
      this.setState({ filesError: "Please select file." });
      document.getElementById("contained-button-file-div").focus();
      isValid = false;
    } else {
      this.setState({ filesError: "" });
    }
    return isValid;
  };

  handleFileChange = event => {
    const { files = [] } = event.target;
    if (files.length > 0) {
        if ( (files[0].type === "application/pdf" || files[0].type === "application/msword" || files[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && files[0].size/1000<10000) {
            this.setState({
                files,
                filesError: ""
            })
        } else {
            this.setState({
                filesError: "Please select only pdf, doc or docx file with size less than 10 MBs."
            })
        }
    }
  }

  handleChangeStartDate = (date) => {
    this.setState({startDate: date});
  };

  handleChangeDueDate = (date) => {
    this.setState({dueDate: date});
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "totalMarks":
        regex = new RegExp(numberExp);
        if (value && !regex.test(value)) {
          return;
        }
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    //e.preventDefault();
    if (
      !this.isSectionValid() ||
      !this.isLabelValid() ||
      !this.isStartDateValid() ||
      !this.isDueDateValid() ||
      !this.isInstructionValid() ||      
      !this.isTotalMarksValid() ||
      !this.isFileValid()
    ) {
      return;
    }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C34CommonAcademicsAssignmentsSave`;
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
                window.location = "#/dashboard/F34Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  viewReport = () => {
    window.location = "#/dashboard/F34Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
    this.getSectionsData();
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

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.isFormValid}>
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
              Assignments
            </Typography>
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={12} md={6}>
                <TextField
                  id="sectionId"
                  name="sectionId"
                  variant="outlined"
                  label="Section"
                  onChange={this.onHandleChange}
                  value={this.state.sectionId}
                  error={!!this.state.sectionIdError}
                  helperText={this.state.sectionIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.sectionIdMenuItems ? 
                    this.state.sectionIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"sectionIdMenuItems"+dt.id}
                        value={dt.id}
                      >
                        {dt.label}
                      </MenuItem>
                    ))
                  :
                    this.state.isLoading && <Grid container justify="center"><CircularProgress /></Grid>
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
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
                <DatePicker
                  autoOk
                  name="startDate"
                  id="startDate"
                  label="Start Date"
                  invalidDateMessage=""
                  disablePast
                  //minDate={this.getTomorrowDate()}
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  //style={{ float: "right", width: 115 }}
                  value={this.state.startDate}
                  onChange={this.handleChangeStartDate}
                  error={!!this.state.preDateError}
                  helperText={this.state.startDateError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  autoOk
                  name="dueDate"
                  id="dueDate"
                  label="Due Date"
                  invalidDateMessage=""
                  disablePast
                  minDate={this.getTomorrowDate()}
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  //style={{ float: "right", width: 115 }}
                  value={this.state.dueDate}
                  onChange={this.handleChangeDueDate}
                  error={!!this.state.dueDateError}
                  helperText={this.state.dueDateError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="instruction"
                  name="instruction"
                  label="Instruction"
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  onChange={this.onHandleChange}
                  value={this.state.instruction}
                  error={!!this.state.instructionError}
                  helperText={this.state.instructionError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="totalMarks"
                      name="totalMarks"
                      label="Total Marks"
                      type="number"
                      required
                      fullWidth
                      variant="outlined"
                      onChange={this.onHandleChange}
                      value={this.state.totalMarks}
                      error={!!this.state.totalMarksError}
                      helperText={this.state.totalMarksError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MyDropzone files={this.state.files} onChange={event => this.handleFileChange(event)} disabled={this.state.uploadLoading} />
                    <div style={{textAlign:'left', marginTop:5, fontSize:"0.8rem"}}>
                        <span style={{color: '#f44336'}}>&emsp;{this.state.filesError}</span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br/>
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
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

export default withStyles(styles)(F34Form);
