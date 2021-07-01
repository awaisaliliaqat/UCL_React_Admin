import React, { Component, Fragment, useState, useEffect } from "react";
import { useTheme } from "@material-ui/styles";
import { numberExp } from "../../../../utils/regularExpression";
import {TextField, Grid, CircularProgress, Divider, Typography, Button, IconButton,
  Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, Card, 
  CardContent } from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { useDropzone } from "react-dropzone";
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';

function CheckPopupFullScreen (props){
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  if(props.isPopupFullScreen!=matches){
    props.setIsPopupFullScreen(matches);
  }
  return <Fragment/>;
}

function MyDropzone(props) {

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document', multiple:false });

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
      msg = <Typography variant="subtitle1">Upload graded file</Typography>;
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

class F36FormPopupComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      isPopupFullScreen: false,
      isLoginMenu: false,
      isReload: false,
      files: [],
      filesError: "",
      obtainedMarks: "",
      obtainedMarksError: "",
      remarks:"",
      remarksError:"",
      totalMarks:""
    };
  }

  setIsPopupFullScreen = (val) => {
    this.setState({isPopupFullScreen:val});
  }

  handlePopupClose = () => {
    this.props.handlePopupClose();
    this.setState({
      files: [],
      filesError: "",
      obtainedMarks: "",
      obtainedMarksError: "",
      remarks:"",
      remarksError:""
    });
  }

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

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "obtainedMarks":
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

  isRemarksValid = () => {
    let isValid = true;
    if (!this.state.remarks) {
      this.setState({ remarksError: "Please select module." });
      document.getElementById("remarks").focus();
      isValid = false;
    } else {
      this.setState({ remarksError: "" });
    }
    return isValid;
  };

  isobtainedMarksValid = () => {
    let isValid = true;
    if (!this.state.obtainedMarks) {
      this.setState({ obtainedMarksError: "Please enter marks." });
      document.getElementById("obtainedMarks").focus();
      isValid = false;
    } else {
      this.setState({ obtainedMarksError: "" });
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

  onFormSubmit = async (e) => {
    //e.preventDefault();
    if (
      // !this.isFileValid() ||
      !this.isobtainedMarksValid() ||
      !this.isRemarksValid()
    ) {
      return;
    }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C36CommonAcademicsStudentsAssignmentsResultSave`;
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
            this.props.handleOpenSnackbar(json.USER_MESSAGE, "success");
            this.handlePopupClose();
            this.props.getData();
          } else {
            this.props.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            this.props.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  componentDidUpdate(prevProps){
    if (this.props.recordId !== prevProps.recordId) {
      this.setState({
        obtainedMarks:this.props.assignmentGradedData.obtainedMarks,
        remarks:this.props.assignmentGradedData.remarks,
        totalMarks:this.props.assignmentGradedData.totalMarks
      });
    }
  }

  render() {

    const {popupBoxOpen, handlePopupClose, popupTitle, downloadFile, fileName, totalMarks, assignmentGradedData} = this.props;
    
    return (
      <Fragment>
        <CheckPopupFullScreen 
          isPopupFullScreen={this.state.isPopupFullScreen}
          setIsPopupFullScreen={this.setIsPopupFullScreen}
        />
        <Dialog
          fullScreen={this.state.isPopupFullScreen}
          maxWidth="md"
          open={popupBoxOpen}
          onClose={this.handlePopupClose}
          aria-labelledby="responsive-dialog-title"
        >
          <span style={{color:"#ffffff"}}>
           __________________________________________________________________________________________________________________________
          </span> 
          <DialogTitle id="responsive-dialog-title">
            <IconButton
              aria-label="close"
              onClick={this.handlePopupClose}
              style={{
                position: "relative",
                top: "-32px",
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
              {popupTitle}
              &nbsp;
              <Tooltip title="Download Assignment">
                <IconButton 
                  onClick={(e)=>downloadFile(e, fileName)} 
                  aria-label="download"
                  color="primary"
                >
                  <CloudDownloadOutlinedIcon/>
                </IconButton>
              </Tooltip>
              {assignmentGradedData.gradedAssignmentUrl && 
              <Tooltip title="Download Graded Assignment">
                <IconButton 
                  onClick={(e)=>downloadFile(e, assignmentGradedData.gradedAssignmentUrl)} 
                  aria-label="download"
                  style={{color:"rgb(76, 175, 80)"}}
                >
                  <CloudDownloadOutlinedIcon />
                </IconButton>
              </Tooltip>
              }
              <br/>
              <Typography component="span">
                Total Marks:&nbsp;{totalMarks}
              </Typography>
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form id="myForm" name="myForm">
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={2}
              >
                <TextField
                  type="hidden"
                  id="id"
                  name="id"
                  defaultValue={this.props.recordId}
                />
                <TextField
                  type="hidden"
                  id="assignmentId"
                  name="assignmentId"
                  defaultValue={this.props.assignmentId}
                />
                <TextField
                  type="hidden"
                  id="assignmentSectionId"
                  name="assignmentSectionId"
                  defaultValue={this.props.assignmentSectionId}
                />
                <TextField
                  type="hidden"
                  id="studentId"
                  name="studentId"
                  defaultValue={this.props.studentId}
                />
                <Grid item xs={12} md={6}>
                  <MyDropzone files={this.state.files} onChange={event => this.handleFileChange(event)} disabled={this.state.uploadLoading} />
                  <div style={{textAlign:'left', marginTop:5, fontSize:"0.8rem"}}>
                      <span style={{color: '#f44336'}}>&emsp;{this.state.filesError}</span>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="obtainedMarks"
                    name="obtainedMarks"
                    label="Obtained Marks"
                    type="number"
                    required
                    fullWidth
                    variant="outlined"
                    onChange={this.onHandleChange}
                    value={this.state.obtainedMarks}
                    error={!!this.state.obtainedMarksError}
                    helperText={
                      this.state.obtainedMarksError ? this.state.obtainedMarksError : " "
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="remarks"
                    name="remarks"
                    label="Remarks"
                    required
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    onChange={this.onHandleChange}
                    value={this.state.remarks}
                    error={!!this.state.remarksError}
                    helperText={
                      this.state.remarksError ? this.state.remarksError : " "
                    }
                  />
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
            <Button autoFocus onClick={this.handlePopupClose} color="secondary">
              Close
            </Button>
            <Button
              onClick={() => this.onFormSubmit()}
              color="primary"
              autoFocus
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
export default F36FormPopupComponent;
