import React, { Component, Fragment } from "react";
import { createStyles, makeStyles, withStyles } from "@material-ui/styles";
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

const styles = (theem) => ({
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
    textAlign:"center",
    "&:hover": {
      color: theem.palette.primary.main,
    }
  },
});

function MyDropzone(props) {

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document', multiple:props.multiple});
  
  const files = acceptedFiles.map((file, index) => {
      const size = file.size > 0 ? (file.size / 1000).toFixed(2) : file.size;
      return (
          <Typography key={index} variant="subtitle1" color="primary">
              {file.path} - {size} Kb
              <input type="hidden" name={props.name+"-file-name"} value={file.path}></input>
          </Typography>
      );
  });

  let msg = files || [];
  if (msg.length <= 0 || props.files.length <= 0) {
    msg = <Typography variant="subtitle1">{props.label}</Typography>;
  }

  return (
      <div 
        id="contained-button-file-div"
        {...getRootProps({ className: "dropzone "+`${props.className}` , onChange: event => props.onChange(event) })}
      >
          <Card style={{ backgroundColor: "#c7c7c7" }} className={props.className}>
              <CardContent style={{
                  paddingBottom: 14,
                  paddingTop: 14,
                  cursor:"pointer"
              }}>
                  <input name={props.name+"-file"} {...getInputProps()} disabled={props.disabled} />
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
      files2: [],
      files2Error: "",
      files3: [],
      files3Error: "",
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
      courseId:"",
      courseIdError:"",
      courseIdMenuItems:[],
      sectionId:"",
      sectionIdError:"",
      sectionIdMenuItems:[],
      timeSlotMenuItems:[
        // {id:"00:00:00",label:"12:00 AM"},
        // {id:"01:00:00",label:"01:00 AM"},
        // {id:"02:00:00",label:"02:00 AM"},
        // {id:"03:00:00",label:"03:00 AM"},
        // {id:"04:00:00",label:"04:00 AM"},
        // {id:"05:00:00",label:"05:00 AM"},
        {id:"06:00:00",label:"06:00 AM"},
        {id:"06:15:00",label:"06:15 AM"},
        {id:"06:30:00",label:"06:30 AM"},
        {id:"06:45:00",label:"06:45 AM"},
        {id:"07:00:00",label:"07:00 AM"},
        {id:"07:15:00",label:"07:15 AM"},
        {id:"07:30:00",label:"07:30 AM"},
        {id:"07:45:00",label:"07:45 AM"},
        {id:"08:00:00",label:"08:00 AM"},
        {id:"08:15:00",label:"08:15 AM"},
        {id:"08:30:00",label:"08:30 AM"},
        {id:"08:45:00",label:"08:45 AM"},
        {id:"09:00:00",label:"09:00 AM"},
        {id:"09:15:00",label:"09:15 AM"},
        {id:"09:30:00",label:"09:30 AM"},
        {id:"09:45:00",label:"09:45 AM"},
        {id:"10:00:00",label:"10:00 AM"},
        {id:"10:15:00",label:"10:15 AM"},
        {id:"10:30:00",label:"10:30 AM"},
        {id:"10:45:00",label:"10:45 AM"},
        {id:"11:00:00",label:"11:00 AM"},
        {id:"11:15:00",label:"11:15 AM"},
        {id:"11:30:00",label:"11:30 AM"},
        {id:"11:45:00",label:"11:45 AM"},
        {id:"12:00:00",label:"12:00 PM"},
        {id:"12:15:00",label:"12:15 PM"},
        {id:"12:30:00",label:"12:30 PM"},
        {id:"12:45:00",label:"12:45 PM"},
        {id:"13:00:00",label:"01:00 PM"},
        {id:"13:15:00",label:"01:15 PM"},
        {id:"13:30:00",label:"01:30 PM"},
        {id:"13:45:00",label:"01:45 PM"},
        {id:"14:00:00",label:"02:00 PM"},
        {id:"14:15:00",label:"02:15 PM"},
        {id:"14:30:00",label:"02:30 PM"},
        {id:"14:45:00",label:"02:45 PM"},
        {id:"15:00:00",label:"03:00 PM"},
        {id:"15:15:00",label:"03:15 PM"},
        {id:"15:30:00",label:"03:30 PM"},
        {id:"15:45:00",label:"03:45 PM"},
        {id:"16:00:00",label:"04:00 PM"},
        {id:"16:15:00",label:"04:15 PM"},
        {id:"16:30:00",label:"04:30 PM"},
        {id:"16:45:00",label:"04:45 PM"},
        {id:"17:00:00",label:"05:00 PM"},
        {id:"17:15:00",label:"05:15 PM"},
        {id:"17:30:00",label:"05:30 PM"},
        {id:"17:45:00",label:"05:45 PM"},
        {id:"18:00:00",label:"06:00 PM"},
        {id:"18:15:00",label:"06:15 PM"},
        {id:"18:30:00",label:"06:30 PM"},
        {id:"18:45:00",label:"06:45 PM"},
        {id:"19:00:00",label:"07:00 PM"},
        {id:"19:15:00",label:"07:15 PM"},
        {id:"19:30:00",label:"07:30 PM"},
        {id:"19:45:00",label:"07:45 PM"},
        {id:"20:00:00",label:"08:00 PM"},
        {id:"20:15:00",label:"08:15 PM"},
        {id:"20:30:00",label:"08:30 PM"},
        {id:"20:45:00",label:"08:45 PM"},
        {id:"21:00:00",label:"09:00 PM"}
      ],
      startTime:"",
      startTimeError:"",
      endTime:"",
      endTimeError:"",
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

  getCoursesData = async() => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C34CommonAcademicsAssignmentsCoursesView`;
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
            let courseIdMenuItems = json.DATA;
            this.setState({courseIdMenuItems: json.DATA});
            console.log("getCoursesData", courseIdMenuItems)
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
            this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getSectionsData = async(courseId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("courseId", courseId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C34CommonAcademicsSectionsTeachersView`;
    await fetch(url, {
      method: "POST",
      body:data,
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
            this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
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
              this.getSectionsData(json.DATA[0].courseId);
              this.setState({
                courseId:json.DATA[0].courseId,
                sectionId:json.DATA[0].sectionId,
                label: json.DATA[0].label,
                startDate: json.DATA[0].startDate,
                startTime: json.DATA[0].startTimeReport,
                dueDate: json.DATA[0].dueDate,
                endTime: json.DATA[0].endTimeReport,
                totalMarks: json.DATA[0].totalMarks,
                instruction: json.DATA[0].instruction,
              });
            }else{
              window.location = "#/dashboard/F34Form/0";
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


  isStartTimeValid = () => {
    let isValid = true;
    if (!this.state.startTime) {
      this.setState({ startTimeError: "Please select start time." });
      document.getElementById("startTime").focus();
      isValid = false;
    } else {
      this.setState({ startTimeError: "" });
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

  isEndTimeValid = () => {
    let isValid = true;
    if (!this.state.endTime) {
      this.setState({ endTimeError: "Please select end time." });
      document.getElementById("endTime").focus();
      isValid = false;
    } else {
      this.setState({ endTimeError: "" });
    }
    return isValid;
  };
  isCourseValid = () => {
    let isValid = true;
    if (!this.state.courseId) {
      this.setState({ courseIdError: "Please select course." });
      document.getElementById("courseId").focus();
      isValid = false;
    } else {
      this.setState({ courseIdError: "" });
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
    const fileElement = event.target;
    console.log("fileElement", fileElement)
    if (files.length > 0) {
      for(let i=0; i<files.length; i++) {
        if ( (files[i].type === "application/pdf" || files[i].type === "application/msword" || files[i].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && files[i].size/1000<10000) {
          if(fileElement.getAttribute("name")=="contained-button-file") {
            this.setState({files, filesError: ""});
          } else if (fileElement.getAttribute("name")=="contained-button-solution-file") {
            this.setState({files2:files, files2Error: ""});
          }else if (fileElement.getAttribute("name")=="contained-button-helping-material-file") {
            this.setState({files3:files, files3Error: ""});
          }
        } else {
          if(fileElement.getAttribute("name")=="contained-button-file"){
            this.setState({filesError: "Please select only pdf, doc or docx file with size less than 10 MBs."});
          } else if(fileElement.getAttribute("name")=="contained-button-solution-file"){
            this.setState({files2Error: "Please select only pdf, doc or docx file with size less than 10 MBs."});
          } else if(fileElement.getAttribute("name")=="contained-button-helping-material-file"){
            this.setState({files3Error: "Please select only pdf, doc or docx file with size less than 10 MBs."});
          }
          break;
        }
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
      case "courseId":
        this.setState({sectionId:""});
        this.getSectionsData(value);
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
      !this.isCourseValid() ||
      !this.isSectionValid() ||
      !this.isLabelValid() ||
      !this.isStartDateValid() ||
      !this.isStartTimeValid() ||
      !this.isDueDateValid() ||
      !this.isEndTimeValid() ||
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
    window.location = "#/dashboard/F34Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
    this.getCoursesData();
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
                  id="courseId"
                  name="courseId"
                  variant="outlined"
                  label="Course"
                  onChange={this.onHandleChange}
                  value={this.state.courseId}
                  error={!!this.state.courseIdError}
                  helperText={this.state.courseIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.courseIdMenuItems ? 
                    this.state.courseIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"courseIdMenuItems"+dt.id}
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
                  id="sectionId"
                  name="sectionId"
                  variant="outlined"
                  label="Section"
                  required
                  fullWidth
                  select
                  onChange={this.onHandleChange}
                  value={this.state.sectionId}
                  error={!!this.state.sectionIdError}
                  helperText={this.state.sectionIdError}
                  disabled={!this.state.courseId}
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={2}>
                <TextField
                  id="startTime"
                  name="startTime"
                  variant="outlined"
                  label="Start Time"
                  required
                  fullWidth
                  select
                  onChange={this.onHandleChange}
                  value={this.state.startTime}
                  error={!!this.state.startTimeError}
                  helperText={this.state.startTimeError}
                >
                  {this.state.timeSlotMenuItems ? 
                    this.state.timeSlotMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"startTimeMenuItems"+dt.id}
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
              <Grid container spacing={2}>
                  <Grid item xs={8}>
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
              <Grid item xs={12} md={4}>
                  <TextField
                    id="endTime"
                    name="endTime"
                    variant="outlined"
                    label="End Time"
                    required
                    fullWidth
                    select
                    onChange={this.onHandleChange}
                    value={this.state.endTime}
                    error={!!this.state.endTimeError}
                    helperText={this.state.endTimeError}
                  >
                    {this.state.timeSlotMenuItems ? 
                      this.state.timeSlotMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"endTimeMenuItems"+dt.id}
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
              </Grid>
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
                  <MyDropzone
                    name="contained-button"
                    label="Upload assignment file *"
                    files={this.state.files} 
                    onChange={event => this.handleFileChange(event)} 
                    disabled={this.state.uploadLoading} 
                    className={classes.inputFileFocused}
                    multiple={false}
                  />
                  <div 
                    style={{
                      textAlign:'left', 
                      marginTop:5, 
                      fontSize:"0.8rem"
                    }}
                  >
                      <span 
                        style={{
                          color: '#f44336'
                        }}
                      >
                          &emsp;{this.state.filesError}
                      </span>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <MyDropzone
                      name="contained-button-solution"
                      label="Upload solution file"
                      files={this.state.files2}
                      onChange={event => this.handleFileChange(event)} 
                      disabled={this.state.uploadLoading} 
                      className={classes.inputFileFocused}
                      multiple={false}
                    />
                    <div 
                      style={{
                        textAlign:'left', 
                        marginTop:5, 
                        fontSize:"0.8rem"
                      }}>
                        <span 
                          style={{
                            color: '#f44336'
                          }}
                        >
                          &emsp;{this.state.files2Error}
                        </span>
                    </div>
                </Grid>
                <Grid item xs={12}>
                  <MyDropzone
                    name="contained-button-helping-material"
                    label="Upload helping file"
                    files={this.state.files3}
                    onChange={event => this.handleFileChange(event)} 
                    disabled={this.state.uploadLoading} 
                    className={classes.inputFileFocused}
                    multiple={true}
                  />
                    <div 
                      style={{
                        textAlign:'left', 
                        marginTop:5, 
                        fontSize:"0.8rem"
                      }}>
                        <span 
                          style={{
                            color: '#f44336'
                          }}
                        >
                          &emsp;{this.state.files3Error}
                        </span>
                    </div>
                </Grid>
              </Grid>
            </Grid>
            <br/>
            <br/>
        </form>
        <BottomBar
          leftButtonText="View"
          leftButtonHide={false}
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
