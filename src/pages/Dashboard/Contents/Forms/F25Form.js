import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberFreeExp, numberExp } from "../../../../utils/regularExpression";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography, Chip,
  Select, IconButton, Tooltip, Checkbox, Fab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid '+theme.palette.common.white
  },
  body: {
    fontSize: 14,
    border: '1px solid '+theme.palette.primary.main,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

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
  },
  table: {
    minWidth: 750,
  }
});

function CourseRow(props) {

  const { rowIndex, rowData, onEdit, onDelete, moduleTypeMenuItems, ...rest} = props;

  const [coursesInputValue, setCoursesInputValue] = useState("");
  const [courseSelectionGroupInputValue, setCourseSelectionGroupInputValue] = useState("");

  const handleCourse = (value) => {
    let ObjArray = value;
    let selectedPCIdsString = "";
    for (let i = 0; i < ObjArray.length; i++) {
      if (i == 0) {
        selectedPCIdsString = ObjArray[i].ID;
      } else {
        selectedPCIdsString += "~" + ObjArray[i].ID;
      }
    }
    setCoursesInputValue(selectedPCIdsString);
    //console.log("handleCourse", selectedPCIdsString);
  };

  const handleCourseSelectionGroup = (value) => {
    let ObjArray = value;
    let selectedCSGIdsString = "";
    for (let i = 0; i < ObjArray.length; i++) {
      if (i == 0) {
        selectedCSGIdsString = ObjArray[i].ID;
      } else {
        selectedCSGIdsString += "~" + ObjArray[i].ID;
      }
    }
    setCourseSelectionGroupInputValue(selectedCSGIdsString);
    //console.log("handleCourse", selectedPCIdsString);
  };

  useEffect(() => {
    handleCourse(rowData.preCourses);
    handleCourseSelectionGroup(rowData.preCourseSelectionGroups)
  });

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
          <TextField type="hidden" name="moduleNumber" value={rowData.preModule}/>
          {rowData.preModule}
          </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.preModuleTypeId ? moduleTypeMenuItems.find((x) => x.ID == rowData.preModuleTypeId).Label : ""}
          <TextField type="hidden" name="moduleTypeId" value={rowData.preModuleTypeId}/>
        </StyledTableCell>
        <StyledTableCell align="center">
           <TextField type="hidden" name="moduleRemarks" value={rowData.preRemarks}/>
          {rowData.preRemarks}
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.preModuleTypeId == 1 || rowData.preModuleTypeId == 3 ? (
            <Fragment>
              {rowData.preCourses.map((option, index) => ( <span key={"pci"+index}> {index != 0 ? <br /> : ""} {option.Label} </span> ))}
              <TextField type="hidden" name="programmeCourseId" value={coursesInputValue}/>
              <TextField type="hidden" name="selectionGroupId" value="0" />
            </Fragment>
          ) : rowData.preModuleTypeId == 2 ? (
            <Fragment>
              {rowData.preCourseSelectionGroups.map((option, index) => (
                <span key={"csgi"+index}>{index != 0 ? <br /> : ""} {option.Label}</span>
              ))}
              <TextField type="hidden" name="programmeCourseId" value="0" />
              <TextField type="hidden" name="selectionGroupId"  value={courseSelectionGroupInputValue}
              />
            </Fragment>
          ) : (
            ""
          )}
        </StyledTableCell>
        <StyledTableCell align="center">
          <Tooltip title="Edit">
            <Fab 
              color="primary" 
              aria-label="Edit" 
              size="small"
              style={{
                height:36,
                width:36,
                backgroundColor:"rgb(255, 152, 0)"
              }}
              onClick={() => onEdit(rowIndex)}
            >
              <EditIcon fontSize="small" />
            </Fab>
          </Tooltip>
          &emsp;
          <Tooltip title="Delete">
            <Fab
              color="secondary"
              aria-label="Delete"
              size="small"
              style={{
                height: 36,
                width: 36,
                margin:4
              }}
              onClick={() => onDelete(rowIndex)}
            >
              <DeleteIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
  );
}

class F25Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      preModule: 1,
      preModuleError: "",
      preModuleTypeMenuItems: [],
      preModuleTypeId: "",
      preModuleTypeIdError: "",
      preRemarks: "",
      preRemarksError: "",
      preCourseMenuItems: [],
      preCourses: [],
      preCoursesError: "",
      preCourseSelectionGroupMenuItems: [],
      preCourseSelectionGroups: [],
      preCourseSelectionGroupsError: "",
      preCourseLabel: "",
      preChoiceGroupId: "",
      preChoiceGroupIdError: "",
      preChoiceGroupIdMenuItems: [],
      programmeCoursesListArray: [],
      programmeCoursesError: "",
      courseRowDataArray: [],
      prerequisiteCourseArray: [],
      rowEditMode: false
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

  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonAcademicSessionsView`;
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
            this.setState({ academicSessionIdMenuItems: json.DATA });
            for (
              var i = 0;
              i < this.state.academicSessionIdMenuItems.length;
              i++
            ) {
              if (this.state.academicSessionIdMenuItems[i].isActive == "1") {
                this.state.academicSessionId = this.state.academicSessionIdMenuItems[
                  i
                ].ID;
                this.loadProgrammes(this.state.academicSessionId);
              }
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadAcademicSession", json);
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

  loadProgrammes = async (academicsSessionId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C25CommonAcademicsSessionsOfferedProgrammesView`;
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
            this.setState({ programmeIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammes", json);
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

  loadModuleType = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C25CommonProgrammeModulesTypesView`;
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
            this.setState({ preModuleTypeMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadModuleType", json);
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

  loadProgrammeCourses = async (academicsSessionId, programmeId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeId", programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C25CommonProgrammeCoursesView`;
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
            this.setState({ preCourseMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammeCourses", json);
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

  loadCourseSelectionGroup = async (academicsSessionId, programmeId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeId", programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C25CommonCourseSelectionGroupProgrammeGroupsView`;
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
            this.setState({ preCourseSelectionGroupMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadCourseSelectionGroup", json);
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

  loadData = async (academicSessionId, programmeId) => {
    const data = new FormData();
    data.append("academicsSessionId", academicSessionId);
    data.append("programmeId", programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C25CommonProgrammeModulesView`;
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
            let courseRowDataArray = [];
            let preModule = 0;
            for (let i = 0; i < json.DATA.length; i++) {
              let courseRowDataObject = {
                preModule: json.DATA[i].moduleNumber,
                preModuleTypeId: json.DATA[i].moduleTypeId,
                preRemarks: json.DATA[i].moduleRemarks,
                preCourses: json.DATA[i].coursesArray || [],
                preCourseSelectionGroups: json.DATA[i].selectionGroupId || [],
              };
              courseRowDataArray.push(courseRowDataObject);
              if (json.DATA[i].moduleNumber > preModule) {
                preModule = json.DATA[i].moduleNumber;
              }
            }
            this.setState({
              courseRowDataArray: courseRowDataArray,
              preModule: ++preModule,
            });
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

  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicSessionId) {
      this.setState({
        academicSessionIdError: "Please select Academic Session.",
      });
      document.getElementById("academicSessionId").focus();
      isValid = false;
    } else {
      this.setState({ academicSessionIdError: "" });
    }
    return isValid;
  };

  isProgrammeValid = () => {
    let isValid = true;
    if (!this.state.programmeId) {
      this.setState({ programmeIdError: "Please select Programme." });
      document.getElementById("programmeId").focus();
      isValid = false;
    } else {
      this.setState({ programmeIdError: "" });
    }
    return isValid;
  };

  isPreModuleValid = () => {
    let isValid = true;
    if (!this.state.preModule) {
      this.setState({ preModuleError: "Please enter module." });
      document.getElementById("preModule").focus();
      isValid = false;
    } else {
      this.setState({ preModuleError: "" });
    }
    return isValid;
  };

  isPreModuleTypeIdValid = () => {
    let isValid = true;
    if (!this.state.preModuleTypeId) {
      this.setState({ preModuleTypeIdError: "Please enter module type." });
      document.getElementById("preModuleTypeId").focus();
      isValid = false;
    } else {
      this.setState({ preModuleTypeIdError: "" });
    }
    return isValid;
  };

  isPreRemarksValid = () => {
    let isValid = true;
    if (!this.state.preRemarks) {
      this.setState({ preRemarksError: "Please enter remarks." });
      document.getElementById("preRemarks").focus();
      isValid = false;
    } else {
      this.setState({ preRemarksError: "" });
    }
    return isValid;
  };

  // isPreCourseSelectionGroupIdValid = () => {
  //   let isValid = true;
  //   if (
  //     !this.state.preCourseSelectionGroupId &&
  //     this.state.preModuleTypeId == 2
  //   ) {
  //     this.setState({
  //       preCourseSelectionGroupIdError: "Please select choice group.",
  //     });
  //     document.getElementById("preCourseSelectionGroupId").focus();
  //     isValid = false;
  //   } else {
  //     this.setState({ preCourseSelectionGroupIdError: "" });
  //   }
  //   return isValid;
  // };

  isPreCourseSelectionGroupIdValid = () => {
    let preCourseSelectionGroups = this.state.preCourseSelectionGroups;
    let isValid = true;
    if (preCourseSelectionGroups.length == 0 && this.state.preModuleTypeId == 2 ) {
      this.setState({ preCourseSelectionGroupsError: "Please select choice group." });
      document.getElementById("preCourseSelectionGroups").focus();
      isValid = false;
    }else {
      this.setState({ preCourseSelectionGroupsError: "" });
    }
    return isValid;
  };

  ispPreCoursesValid = () => {
    let preCourses = this.state.preCourses;
    let isValid = true;
    if (preCourses.length == 0 && (this.state.preModuleTypeId == 3 || this.state.preModuleTypeId == 1)) {
      this.setState({ preCoursesError: "Please select course." });
      document.getElementById("preCourses").focus();
      isValid = false;
    } 
    else if (preCourses.length >= 1 && this.state.preModuleTypeId == 1) {
      let CourseCreditIdSum = 0;
      for(let i=0;i<preCourses.length;i++){
        CourseCreditIdSum += preCourses[i].courseCreditId;
      }
      if(CourseCreditIdSum!=2){
        this.setState({ preCoursesError: "Please select two half or one full credit course." });
        document.getElementById("preCourses").focus();
        isValid = false;
      }
    } else if (preCourses.length >= 1 && this.state.preModuleTypeId == 3) {
      let CourseCreditIdSum = 0;
      for(let i=0;i<preCourses.length;i++){
        CourseCreditIdSum += preCourses[i].courseCreditId;
      }
      if(CourseCreditIdSum<2){
        this.setState({ preCoursesError: "Please select minimum two half or one full credit course." });
        document.getElementById("preCourses").focus();
        isValid = false;
      }
    } 
    else {
      this.setState({ preCoursesError: "" });
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        this.setState({
          programmeId: "",
          courseRowDataArray: [],
          preModule: 1,
        });
        this.loadProgrammes(value);
        break;
      case "programmeId":
        this.setState({
          courseRowDataArray: [],
          preModule: 1,
          preModuleTypeId: "",
          preRemarks: "",
          preCourses: [],
          preCourseSelectionGroups: [],
          rowEditMode: false
        });
        this.loadProgrammeCourses(this.state.academicSessionId, value);
        this.loadCourseSelectionGroup(this.state.academicSessionId, value);
        this.loadData(this.state.academicSessionId, value);
        break;
      case "preModule":
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

  isCourseSelected = (option) => {
    return this.state.preCourses.some((selectedOption) => selectedOption.ID == option.ID);
  };

  handleSetPreCourses = (value) => {
    this.setState({
      preCourses: value,
      preCoursesError: "",
    });
  };

  isGroupSelected = (option) => {
    return this.state.preCourseSelectionGroups.some((selectedOption) => selectedOption.ID == option.ID);
  };

  handleSetPreGroups = (value) => {
    this.setState({
      preCourseSelectionGroups: value,
      preCourseSelectionGroupsError: "",
    });
  };

  handeAddCourseRow = () => {
    if (
      !this.isAcademicSessionValid() ||
      !this.isProgrammeValid() ||
      !this.isPreModuleValid() ||
      !this.isPreModuleTypeIdValid() ||
      //|| !this.isPreRemarksValid()
      !this.isPreCourseSelectionGroupIdValid() ||
      !this.ispPreCoursesValid()
    ) {
      return;
    }

    let courseRowDataArray = this.state.courseRowDataArray;
    let preModule = this.state.preModule;
    let preModuleTypeId = this.state.preModuleTypeId;
    let preRemarks = this.state.preRemarks;
    let preCourses = this.state.preCourses;
    let preCourseSelectionGroups = this.state.preCourseSelectionGroups;

    let moduleNumber = document.getElementsByName("moduleNumber");
    for (let i = 0; i < moduleNumber.length; i++) {
      if (moduleNumber[i].value == preModule && !this.state.rowEditMode) {
        this.setState({ preModuleError: "Module should be unique." });
        document.getElementById("preModule").focus();
        return;
      }
    }

    let courseRowDataObject = {
      preModule: preModule,
      preModuleTypeId: preModuleTypeId,
      preRemarks: preRemarks,
      preCourses: preCourses,
      preCourseSelectionGroups: preCourseSelectionGroups,
    };

    if(this.state.rowEditMode){ 
      for(let j=0; j<courseRowDataArray.length; j++){
        if(courseRowDataArray[j].preModule===preModule){
          courseRowDataArray[j].preCourses = preCourses;
          courseRowDataArray[j].preCourseSelectionGroups = preCourseSelectionGroups;
        }
      }
    }else{
      courseRowDataArray.push(courseRowDataObject);
    }

    let moduleNumberMax = 1;
    for (let i = 0; i < moduleNumber.length; i++) {
      if (parseInt(moduleNumber[i].value) >= moduleNumberMax) {
        moduleNumberMax = moduleNumber[i].value;
      }
    }

    let rowEditMode = this.state.rowEditMode;
    this.setState({
      courseRowDataArray: courseRowDataArray,
      preModule: rowEditMode ? ++moduleNumberMax : ++this.state.preModule,
      preModuleTypeId: "",
      preRemarks: "",
      preCourses: [],
      preCourseSelectionGroups: [],
      rowEditMode: false
    });
    //console.log("courseRowDataObject", courseRowDataObject);
  };

  onEditClick = (rowIndex) => {
    let preCourseMenuItems = this.state.preCourseMenuItems;
    let courseRowDataArray = this.state.courseRowDataArray;
    let courseRowData = courseRowDataArray[rowIndex];
    
    let preCoursesArr = courseRowData.preCourses;
    let preCoursesSelectedArr = [];
    for(let k=0; k<preCoursesArr.length; k++){
      let result = preCourseMenuItems.find((x)=>x.ID===preCoursesArr[k].ID);
      if(result){
        preCoursesSelectedArr.push(result);
      }
    }
    courseRowData.preCourses = preCoursesSelectedArr;
    this.setState({
      preModule: courseRowData.preModule,
      preModuleTypeId:courseRowData.preModuleTypeId,
      preRemarks: courseRowData.preRemarks,
      preCourses: courseRowData.preCourses || [],
      preCourseSelectionGroups: courseRowData.preCourseSelectionGroups || [],
      rowEditMode: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("courseRowData", courseRowData);
  }

  handeDeleteCourseRow = (index) => {
    let courseRowDataArray = this.state.courseRowDataArray;
    courseRowDataArray.splice(index, 1);
    this.setState({ courseRowDataArray: courseRowDataArray });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    if (!this.isAcademicSessionValid() || !this.isProgrammeValid()) {
      return;
    }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C25CommonProgrammeModulesSave`;
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
                window.location = "#/dashboard/F25Form";
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
    window.location = "#/dashboard/F09Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
    this.loadModuleType();
    if (this.state.recordId != 0) {
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
              Define Programme Modules
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
                <TextField
                  id="academicSessionId"
                  name="academicSessionId"
                  variant="outlined"
                  label="Academic Session"
                  onChange={this.onHandleChange}
                  value={this.state.academicSessionId}
                  error={!!this.state.academicSessionIdError}
                  helperText={this.state.academicSessionIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.academicSessionIdMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"academicSessionIdMenuItems" + dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="programmeId"
                  name="programmeId"
                  variant="outlined"
                  label="Programme"
                  value={this.state.programmeId}
                  onChange={this.onHandleChange}
                  error={!!this.state.programmeIdError}
                  helperText={this.state.programmeIdError}
                  disabled={!this.state.academicSessionId}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeIdMenuItems ? (
                    this.state.programmeIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeIdMenuItems" + dt.ID}
                        value={dt.ID}
                      >
                        {dt.Label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress size={24} />
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  id="preModule"
                  name="preModule"
                  label="Module"
                  type="number"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.preModule}
                  error={!!this.state.preModuleError}
                  helperText={this.state.preModuleError}
                  disabled={this.state.rowEditMode}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  id="preModuleTypeId"
                  name="preModuleTypeId"
                  variant="outlined"
                  label="Module Type"
                  onChange={this.onHandleChange}
                  value={this.state.preModuleTypeId}
                  error={!!this.state.preModuleTypeIdError}
                  helperText={this.state.preModuleTypeIdError}
                  required
                  fullWidth
                  select
                  disabled={this.state.rowEditMode}
                >
                  {this.state.preModuleTypeMenuItems ? (
                    this.state.preModuleTypeMenuItems.map((dt, i) => (
                      <MenuItem key={"PCGID" + dt.ID} value={dt.ID}>
                        {dt.Label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress size={24} />
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  id="preRemarks"
                  name="preRemarks"
                  label="Remarks"
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.preRemarks}
                  error={!!this.state.preRemarksError}
                  helperText={this.state.preRemarksError}
                  disabled={this.state.rowEditMode}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                {this.state.preModuleTypeId == 1 ||
                this.state.preModuleTypeId == 3 ? (
                  <Fragment>
                    <Autocomplete
                      multiple
                      fullWidth
                      id="preCourses"
                      options={this.state.preCourseMenuItems}
                      value={this.state.preCourses}
                      onChange={(event, value) =>
                        this.handleSetPreCourses(value)
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
                      renderOption={(option) => (
                        <Fragment>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={this.isCourseSelected(option)}
                            color="primary"
                          />
                          {option.Label}
                        </Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Courses"
                          placeholder="Search and Select"
                          error={!!this.state.preCoursesError}
                          helperText={this.state.preCoursesError}
                        />
                      )}
                    />
                  </Fragment>
                ) : this.state.preModuleTypeId == 2 ? (
                  <Fragment>
                    <Autocomplete
                      multiple
                      fullWidth
                      id="preCourseSelectionGroups"
                      options={this.state.preCourseSelectionGroupMenuItems}
                      value={this.state.preCourseSelectionGroups}
                      onChange={(event, value) =>
                        this.handleSetPreGroups(value)
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
                      renderOption={(option) => (
                        <Fragment>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={this.isGroupSelected(option)}
                            color="primary"
                          />
                          {option.Label}
                        </Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Course Selection Group"
                          placeholder="Search and Select"
                          error={!!this.state.preCourseSelectionGroupsError}
                          helperText={this.state.preCourseSelectionGroupsError}
                        />
                      )}
                    />
                  </Fragment>
                  // <TextField
                  //   id="preCourseSelectionGroupId"
                  //   name="preCourseSelectionGroupId"
                  //   variant="outlined"
                  //   label="Course Selection Group"
                  //   onChange={this.onHandleChange}
                  //   value={this.state.preCourseSelectionGroupId}
                  //   error={!!this.state.preCourseSelectionGroupIdError}
                  //   helperText={this.state.preCourseSelectionGroupIdError}
                  //   required
                  //   fullWidth
                  //   select
                  // >
                  //   {this.state.preCourseSelectionGroupMenuItems ? (
                  //     this.state.preCourseSelectionGroupMenuItems.map(
                  //       (dt, i) => (
                  //         <MenuItem key={"PCGID" + dt.ID} value={dt.ID}>
                  //           {dt.Label}
                  //         </MenuItem>
                  //       )
                  //     )
                  //   ) : (
                  //     <MenuItem>
                  //       <CircularProgress size={24} />
                  //     </MenuItem>
                  //   )}
                  // </TextField>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={1} style={{ textAlign: "center" }}>
                  <IconButton
                    color="primary"
                    aria-label="Add"
                    component="span"
                    onClick={this.handeAddCourseRow}
                  >
                    <Tooltip title="Add New">
                      <Fab 
                        color="primary" 
                        aria-label="add" 
                        size="small"
                      >
                        { this.state.rowEditMode ? <EditIcon/> : <AddIcon /> }
                      </Fab>
                    </Tooltip>
                  </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              <TableContainer component={Paper}>
                  <Table className={classes.table} size="small" aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)'}}>Module</StyledTableCell>
                        <StyledTableCell align="center">Course Type</StyledTableCell>
                        <StyledTableCell align="center">Remarks</StyledTableCell>
                        <StyledTableCell align="center">Courses</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:'1px solid rgb(29, 95, 152)', minWidth:100}}>Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.preModuleTypeMenuItems.length>0 &&
                    this.state.courseRowDataArray.length>0 ? (
                      this.state.courseRowDataArray.map((dt, i) => (
                        <CourseRow
                          key={"CRDA"+i}
                          rowIndex={i}
                          rowData={dt}
                          onDelete={(i) => this.handeDeleteCourseRow(i)}
                          onEdit={(i) => this.onEditClick(i)}
                          courseSelectionGroups={this.state.preCourseSelectionGroups}
                          moduleTypeMenuItems={this.state.preModuleTypeMenuItems}
                        />
                      ))
                    ) : 
                    this.state.isLoading ? 
                      <StyledTableRow key={1}>
                        <StyledTableCell component="th" scope="row" colSpan={5}><center><CircularProgress/></center></StyledTableCell>
                      </StyledTableRow>
                      :
                      <StyledTableRow key={1}>
                        <StyledTableCell component="th" scope="row" colSpan={5}><center><b>No Data</b></center></StyledTableCell>
                      </StyledTableRow>
                    }
                    </TableBody>
                  </Table>
                </TableContainer>
            </Grid>
            <br />
            <br />
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={true}
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
export default withStyles(styles)(F25Form);
