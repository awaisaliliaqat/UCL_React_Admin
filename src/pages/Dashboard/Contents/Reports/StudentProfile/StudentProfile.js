import React, { Component, Fragment } from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import StudentProfileFilter from "./Chunks/StudentProfileFilter";
import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import Button from "@material-ui/core/Button";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";

class EditStudentInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      admissionData: [],
      studentId: "",
      isLoginMenu: false,
      isReload: false,
      eventDate: null,
      totalStudents:[]
    };
  }

  componentDidMount() {
    //this.getData();
  }

  onClearFilters = () => {
    this.setState({
      studentId: "",
    });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const reload = this.state.studentId === "";
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonStudentsView?studentId=${this.state.studentId}`;
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
            this.setState({ admissionData: json.DATA || [] });
            let totalStudents = this.state.admissionData.length;
            this.setState({totalStudents: totalStudents});
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
          console.log(json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: reload,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const columnsSubmitted = [
      {
        name: "Nucleus Id",
        dataIndex: "studentId",
        sortable: false,
        customStyleHeader: { width: "13%", textAlign: "center" },
      },
      {
        name: "Name",
        renderer: (rowData) => {
          return (
            <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
          );
        },
        sortable: false,
        customStyleHeader: { width: "15%" },
      },
      {
        name: "Gender",
        dataIndex: "genderLabel",
        sortIndex: "genderLabel",
        sortable: true,
        customStyleHeader: { width: "13%" },
      },
      {
        name: "Degree Programme",
        dataIndex: "degreeLabel",
        sortIndex: "degreeLabel",
        sortable: true,
        customStyleHeader: { width: "20%", textAlign: "center" },
        align: "center",
      },
      {
        name: "Mobile No",
        dataIndex: "mobileNo",
        sortable: false,
        customStyleHeader: { width: "15%" },
      },
      {
        name: "Email",
        dataIndex: "email",
        sortable: false,
        customStyleHeader: { width: "20%" },
      },
      {
        name: "Action",
        renderer: (rowData) => {
          console.log(rowData);
          return (
            <Button
              style={{
                fontSize: 12,
                textTransform: "capitalize",
              }}
              variant="outlined"
              onClick={() =>
                window.open(
                  `#/view-student-profile/${rowData.studentId}`,
                  "_blank"
                )
              }
            >
              View Profile
            </Button>
          );
        },
        sortable: false,
        customStyleHeader: { width: "21%" },
      },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              Student Profile
            </Typography>
            {this.state.totalStudents>1? 
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
                textAlign: "right"
              }}
              variant="h6"
            >
              Total Students: {this.state.totalStudents}
            </Typography>
            :
            ""
            }
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <StudentProfileFilter
            isLoading={this.state.isLoading}
            onClearFilters={this.onClearFilters}
            values={this.state}
            getDataByStatus={() => this.getData()}
            onHandleChange={(e) => this.onHandleChange(e)}
          />
          <div
            style={{
              marginTop: 15,
              marginBottom: 15,
              color: "#174A84",
              font: "Bold 16px Lato",
              letterSpacing: "1.8px",
            }}
          ></div>
          <TablePanel
            isShowIndexColumn
            data={this.state.admissionData}
            isLoading={this.state.isLoading}
            sortingEnabled
            columns={columnsSubmitted}
          />
        </div>
      </Fragment>
    );
  }
}
export default EditStudentInformation;
