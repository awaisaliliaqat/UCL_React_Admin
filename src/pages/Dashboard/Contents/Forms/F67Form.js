import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberExp } from "../../../../utils/regularExpression";
import { TextField, Grid, CircularProgress, Card, CardContent } from "@material-ui/core";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import MenuItem from "@material-ui/core/MenuItem";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
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
              <input type="hidden" name={props.name+"-file-name"} value={file.path}/>
          </Typography>
      );
  });

  let msg = files || [];
  if (msg.length <= 0 || props.files.length <= 0) {
    msg = <Typography variant="subtitle1">{props.label}</Typography>;
  }

  return (
      <div id="contained-button-file-div" {...getRootProps({ className:"dropzone "+`${props.className}`, onChange: event => props.onChange(event) })}>
          <Card style={{ backgroundColor: "#c7c7c7" }} className={props.className}>
              <CardContent style={{paddingBottom: 14, paddingTop: 14, cursor:"pointer"}}>
                  <input name={props.name+"-file"} {...getInputProps()} disabled={props.disabled} />
                  {msg}
              </CardContent>
          </Card>
      </div>
  );
}

class F67Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      files3: [],
      files3Error: "",
      label:"",
      labelError:"",
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

  getSections = async() => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C67CommonAcademicsSectionsTeachersView`;
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
            console.log("getSections", sectionIdMenuItems);
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
    let data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C67CommonAcademicsCourseContentView`;
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
              });
            }else{
              window.location = "#/dashboard/F67Form/0";
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
      this.setState({ labelError: "Please enter Label." });
      document.getElementById("label").focus();
      isValid = false;
    } else {
      this.setState({ labelError: "" });
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
    if (this.state.files3.length<1 && this.state.recordId==0) {
      this.setState({ files3Error: "Please select file." });
      document.getElementById("contained-button-file-div").focus();
      isValid = false;
    } else {
      this.setState({ files3Error: "" });
    }
    return isValid;
  };

  handleFileChange = event => {
    const { files = [] } = event.target;
    const fileElement = event.target;
    //console.log("fileElement", fileElement)
    if (files.length > 0) {
      for(let i=0; i<files.length; i++) {
        if ( (files[i].type === "application/pdf" || files[i].type === "application/msword" || files[i].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && files[i].size/1000<10000) {
            this.setState({files3:files, files3Error: ""});
        }else {
          this.setState({files3Error: "Please select only pdf, doc or docx file with size less than 10 MBs."});
        }
        break;
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
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleResetForm = () => {
    this.setState({  
      files3: [],
      files3Error: "",
      label:"",
      labelError:"",
      sectionId:"",
      sectionIdError:""
    });
  }

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    //e.preventDefault();
    if (
      !this.isSectionValid() ||
      !this.isLabelValid() ||
      !this.isFileValid()
    ) { return; }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C67CommonAcademicsCourseContentSave`;
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
            this.handleResetForm();
            setTimeout(() => {
              if (this.state.recordId != 0) {
                window.location = "#/dashboard/F67Reports";
              } else {
                //window.location.reload();
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
    window.location = "#/dashboard/F67Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
    this.getSections();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.recordId !== prevProps.match.params.recordId) {
      if (this.props.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.getSections();
        this.loadData(this.props.match.params.recordId);
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
              Section Content
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
                  required
                  fullWidth
                  select
                  onChange={this.onHandleChange}
                  value={this.state.sectionId}
                  error={!!this.state.sectionIdError}
                  helperText={this.state.sectionIdError}
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
              <Grid item xs={12}>
                <MyDropzone
                  name="contained-button-course-content"
                  label="Upload section content files"
                  files={this.state.files3}
                  onChange={event => this.handleFileChange(event)} 
                  disabled={this.state.isLoading} 
                  className={classes.inputFileFocused}
                  multiple={true}
                />
                <div style={{textAlign:'left', marginTop:5, fontSize:"0.8rem"}}>
                    <span style={{color: '#f44336'}}>&emsp;{this.state.files3Error}</span>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <br/>
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

export default withStyles(styles)(F67Form);
