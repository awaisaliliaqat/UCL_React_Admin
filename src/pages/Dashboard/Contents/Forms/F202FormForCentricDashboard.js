import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {
  Grid,
  Divider,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import F202FormTableComponentForCentric from "./F202FormTableComponentForCentric";

const styles = () => ({
  root: {
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
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

class F202FormForCentricDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,

      letterGradeMenuItems: [],

      studentId: "",
      studentsDetails: {},

      studentCoursesSectionsData: [],

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  componentDidMount() {
    this.onLoadAllData();
  }

  onLoadAllData = async () => {
    this.getLetterGrades();
    const { id = 0 } = this.props.match.params;
    this.setState({
      studentId: id,
    });
    this.getStudentsData(id);
  };

  getLetterGrades = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C202CommonAcademicsLetterGradesView`;
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
            this.setState({ letterGradeMenuItems: json.DATA || [] });
          } else {
            this.handleSnackbar(
              true,
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("getLetterGrades", json);
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
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getStudentsData = async (id) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/common/C202CommonStudentsViewForCentricDashboard?studentId=${
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
            let sectionStudents = studentDetails.sectionsList || [];
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
      data.append("academicSessionId", studentsDetails.academicSessionId || 0);
      data.append("programmeGroupId", studentsDetails.programmeGroupId || 0);
      data.append("evaluationTypeId", 2);
      let saveDataFilter = studentCoursesSectionsData.filter(item => item.isAssessmentCompleted == false && item.letterGradeId);
      for (let i = 0; i < saveDataFilter.length; i++) {
        data.append(
          "sectionId",
          saveDataFilter[i].sectionId
        );
        data.append(
          "sessionTermId",
          saveDataFilter[i].sessionTermId
        );
        data.append("assessmentNo", saveDataFilter[i].maxAssessmentNo);
        data.append("letterGradeId", saveDataFilter[i].letterGradeId);
      }
      this.setState({ isLoading: true });
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C202CommonAcademicsSessionsEvaluationsSaveForCentricDashboard`;
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

  onLetterGradeChange = (e, rowData = {}) => {
    const { value } = e.target;
    if (value) {
      let { studentCoursesSectionsData = [] } = this.state;
      const myIndex = studentCoursesSectionsData.findIndex(
        (item) => item.id == rowData.id
      );
      if (myIndex >= 0) {
        rowData.letterGradeId = value;
        studentCoursesSectionsData[myIndex] = rowData;
        this.setState({
          studentCoursesSectionsData,
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    const columns = [
      { name: "serialNo", title: "Sr #" },
      { name: "sectionLabel", title: "Section" },
      { name: "sessionTermLabel", title: "Term" },
      { name: "noOfAssessmentLabel", title: "No. of Assessment" },
      {
        name: "letterGrade",
        title: "Letter Grade",
        getCellValue: (rowData) => {
          return (
            <>
              {rowData.isAssessmentCompleted ? (
                <div
                  style={{
                    border: "1px solid green",
                    textAlign: "center",
                    padding: 5,
                    width: "fit-content",
                    color: "green",
                  }}
                >
                  All Assessment Completed
                </div>
              ) : (
                <TextField
                  id="letterGradeId"
                  name="letterGradeId"
                  label="Letter Grade"
                  size="small"
                  required
                  fullWidth
                  InputProps={{ classes: { input: classes.resize } }}
                  variant="outlined"
                  disabled={!this.state.studentId}
                  onChange={(e) => this.onLetterGradeChange(e, rowData)}
                  value={rowData.letterGradeId}
                  select
                >
                  {this.state.letterGradeMenuItems?.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </TextField>
              )}
            </>
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
              marginBottom: 5,
            }}
            variant="h5"
          >
            Subject Evaluation
          </Typography>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginBottom: 10,
              width: "99%",
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
            <F202FormTableComponentForCentric
              rows={this.state.studentCoursesSectionsData}
              columns={columns}
              showFilter={false}
            />
          </div>
        </Grid>

        <BottomBar
          left_button_text="View"
          left_button_hide={true}
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

F202FormForCentricDashboard.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

F202FormForCentricDashboard.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withStyles(styles)(F202FormForCentricDashboard);
