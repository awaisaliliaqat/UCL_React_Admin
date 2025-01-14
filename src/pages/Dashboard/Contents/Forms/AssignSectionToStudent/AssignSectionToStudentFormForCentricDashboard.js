import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import {
  Grid,
  Divider,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import AssignSectionToStudentFormTableComponentForCentric from "./Chunks/AssignSectionToStudentFormTableComponentForCentric";

const styles = () => ({
  root: {
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15
  },
  imageContainer: {
    height: 60,
    width: 60,
    border: "1px solid #ccc3c3",
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 17,
    marginRight: 15,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
});

class AssignSectionToStudentFormForCentricDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,

      studentId: "",
      studentsDetails: {},

      studentCoursesSectionsData: [],

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  componentDidMount() {
    const { id = 0 } = this.props.match.params;
    this.setState({
      studentId: id,
    });
    this.getStudentsData(id);
  }

  getStudentsData = async (id) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/common/C28CommonStudentsViewForCentricDashboard?studentId=${
      id || this.state.studentId
    }`;
    await fetch(url, {
      method: "GET",
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
            let studentDetails = data[0] || {};
            let sectionStudents =
              studentDetails.offeredCoursesSectionsList || [];
            this.setState({
              studentsDetails: studentDetails,
              studentCoursesSectionsData: sectionStudents,
            });
          } else {
            this.handleSnackbar(
              true,
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
              "error"
            );
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
            this.handleSnackbar(
              true,
              "Failed to Load Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
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

  isFormValid = () => {
    let isValid = true;

    const { studentsDetails = {}, studentCoursesSectionsData = [] } =
      this.state;

    if (!studentsDetails.id) {
      isValid = false;
    } else if (studentCoursesSectionsData.length <= 0) {
      isValid = false;
    }

    return isValid;
  };

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      this.onFormSubmit();
    } else {
      this.handleSnackbar(true, "Student's assignment data not found", "error");
    }
  };
  onFormSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!this.state.isLoading) {
      const { studentsDetails = {}, studentCoursesSectionsData = [] } =
        this.state;
      const data = new FormData();
      data.append("studentId", studentsDetails.id || 0);
      for (let i = 0; i < studentCoursesSectionsData.length; i++) {
        data.append(
          "lectureSectionId",
          studentCoursesSectionsData[i].lectureSectionId
        );
        data.append(
          "tutorialSectionId",
          studentCoursesSectionsData[i].tutorialSectionId
        );
        data.append("courseId", studentCoursesSectionsData[i].id);
      }
      this.setState({ isLoading: true });
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonAcademicsSectionsStudentsSaveForCentricDashboard`;
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
              this.handleSnackbar(true, json.USER_MESSAGE, "success");
            } else {
              this.handleSnackbar(
                true,
                json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
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
              this.handleSnackbar(
                true,
                "Failed to Save ! Please try Again later.",
                "error"
              );
            }
          }
        );
      this.setState({ isLoading: false });
    }
  };

  onSectionChange = (e, rowData = {}) => {
    const { name, value } = e.target;
    switch (name) {
      case "lectureSectionId":
        if (value) {
          let { studentCoursesSectionsData = [] } = this.state;
          const myIndex = studentCoursesSectionsData.findIndex(
            (item) => item.id == rowData.id
          );
          if (myIndex >= 0) {
            rowData.lectureSectionId = value;
            studentCoursesSectionsData[myIndex] = rowData;
            this.setState({
              studentCoursesSectionsData,
            });
          }
        }
        break;
      case "tutorialSectionId":
        if (value) {
          let { studentCoursesSectionsData = [] } = this.state;
          const myIndex = studentCoursesSectionsData.findIndex(
            (item) => item.id == rowData.id
          );
          if (myIndex >= 0) {
            rowData.tutorialSectionId = value;
            studentCoursesSectionsData[myIndex] = rowData;
            this.setState({
              studentCoursesSectionsData,
            });
          }
        }
        break;
      default:
        break;
    }
  };

  render() {
    const { classes } = this.props;
    const columns = [
      { name: "serialNo", title: "Sr #" },
      { name: "courseLabel", title: "Course" },
      {
        name: "lectureSection",
        title: "Lecture Section",
        getCellValue: (rowData) => {
          return (
            <TextField
              id="lectureSectionId"
              name="lectureSectionId"
              label="Assign Lecture Section"
              required
              fullWidth
              variant="outlined"
              disabled={!this.state.studentId}
              onChange={(e) => this.onSectionChange(e, rowData)}
              value={rowData.lectureSectionId}
              select
            >
              {rowData.lectureSectionList?.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                );
              })}
            </TextField>
          );
        },
      },
      {
        name: "tutorialSection",
        title: "Tutorial Section",
        getCellValue: (rowData) => {
          return (
            <TextField
              id="tutorialSectionId"
              name="tutorialSectionId"
              label="Assign Tutorial Section"
              required
              fullWidth
              variant="outlined"
              disabled={!this.state.studentId}
              value={rowData.tutorialSectionId}
              onChange={(e) => this.onSectionChange(e, rowData)}
              select
            >
              {rowData.tutorialSectionList?.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                );
              })}
            </TextField>
          );
        },
      },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />

        <Grid container component="main" className={classes.root}>
          <Typography
            style={{
              color: "#1d5f98",
              fontWeight: 600,
              width: "98%",
              fontSize: 20,
              marginBottom: 5
            }}
            variant="h5"
          >
            Assign Section to Student
          </Typography>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginBottom: 10,
              width: "99%"
            }}
          />
          <Grid
            container
            spacing={2}
            style={{
              marginLeft: 5,
              marginRight: 15,
            }}
          >
            {/* <Grid
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              item
              xs={12}
            >
              <div
                className={classes.imageContainer}
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${
                    process.env.REACT_APP_SUB_API_NAME
                  }/common/C01AdmissionsProspectApplicationImageView?fileName=${"abc"})`,
                }}
              />
            </Grid> */}
            <Grid
              style={{
                marginBottom: 10,
                display: "flex",
                justifyContent: "center",
              }}
              item
              xs={12}
            >
              {/* <div
                className={classes.imageContainer}
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${this.state.studentsDetails.fileName})`,
                }}
              /> */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textTransform: "capitalize",
                  textAlign: "center",
                }}
              >
                <Typography component="h5" variant="h5">
                  {`${this.state.studentsDetails.studentId || "N/A"} - ${
                    this.state.studentsDetails.displayName || "N/A"
                  }`}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {`${
                    this.state.studentsDetails.academicSessionLabel || "N/A"
                  },  ${this.state.studentsDetails.programmeLabel || "N/A"}`}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Divider
            style={{
              marginTop: 10,
              opacity: "0.8",
              width: "99%",
            }}
          />
          <div
            style={{
              marginBottom: 40,
            }}
          >
            <AssignSectionToStudentFormTableComponentForCentric
              rows={this.state.studentCoursesSectionsData}
              columns={columns}
              showFilter={false}
            />
          </div>
        </Grid>

        <BottomBar
          leftButtonText="View"
          leftButtonHide={true}
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
          handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
        />
      </Fragment>
    );
  }
}

AssignSectionToStudentFormForCentricDashboard.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

AssignSectionToStudentFormForCentricDashboard.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withStyles(styles)(
  AssignSectionToStudentFormForCentricDashboard
);
