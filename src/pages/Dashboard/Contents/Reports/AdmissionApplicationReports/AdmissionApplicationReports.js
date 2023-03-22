import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import ExcelIcon from '../../../../../assets/Images/excel.png';
import AdmissionApplicationReportsFilter from './Chunks/AdmissionApplicationReportsFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { format } from 'date-fns';


function isEmpty(obj) {
    if (obj == null) return true;

    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    if (typeof obj !== "object") return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

class AdmissionApplicationReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDownloadExcel: false,
            applicationStatusId: 1,
            admissionData: [],
            genderData: [],
            degreeData: [],
            studentName: "",
            genderId: 0,
            degreeId: 0,
            applicationId: "",
            isLoginMenu: false,
            isReload: false,
            eventDate: null,
            academicSessionMenuItems: [],
            academicSessionId: 0,
            academicSessionIdError: ""

        }
    }

    componentDidMount() {
        this.loadAcademicSessions();
        this.getGenderData();
        this.getDegreesData();
        
       
    }

    getGenderData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonGendersView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                (json) => {
                    this.setState({
                        genderData: json.DATA,
                    });
                },
                (error) => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                }
            );
    };
    loadAcademicSessions = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonAcademicsSessionsView`;
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
                let array = json.DATA || [];
                // let arrayLength = array.length;
                let res = array.find( (obj) => obj.isAdmissionActive === 1 );
                console.log(res);
                if(res){
                  this.setState({academicSessionId:res.ID});
                }
                this.setState({ academicSessionMenuItems: array });
                this.getData(this.state.applicationStatusId);
              } else {
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
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

    getDegreesData = async () => {
        let data = [];
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonAcademicsDegreeProgramsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                (json) => {
                    const resData = json.DATA || [];
                    if (resData.length > 0) {
                        for (let i = 0; i < resData.length; i++) {
                            if (!isEmpty(resData[i])) {
                                data.push({ id: "", label: resData[i].department });
                            }
                            for (let j = 0; j < resData[i].degrees.length; j++) {
                                if (!isEmpty(resData[i].degrees[j])) {
                                    data.push({
                                        id: resData[i].degrees[j].id,
                                        label: resData[i].degrees[j].label,
                                    });
                                }
                            }
                        }
                    }
                },
                (error) => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                }
            );
        this.setState({
            degreeData: data,
        });
    };


    onClearFilters = () => {
        this.setState({
            studentName: "",
            genderId: 0,
            degreeId: 0,
            applicationId: "",
            eventDate: null
        })
    }

    handleDateChange = (date) => {
        this.setState({
            eventDate: date
        });
    };


    onHandleFormClose = () => {
        this.setState({
            isOpenForm: false
        })
    };

    getAddmissionForm = async id => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationSubmittedApplicationsStudentProfileView?applicationId=${id}`;
        this.setState({
            isLoading: true
        })
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.CODE === 1) {
                        if (json.DATA) {
                            if (json.DATA.length > 0) {
                                this.setState({
                                    addmissionForm: json.DATA[0] || {},
                                    isOpenForm: true
                                });
                            } else {
                                alert('Geting Data empty, Please try again later.')
                            }
                        } else {
                            alert('Geting Data empty, Please try again later.')
                        }
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                    }
                    console.log(json);
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                });

        const url2 = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationDocumentsView?applicationId=${id}`;
        await fetch(url2, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.DATA) {
                        this.setState({
                            documentsData: json.DATA || []
                        })
                    }
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                }
            );

        this.setState({
            isLoading: false,
        })

    }

    downloadExcelData = async () => {
        if (this.state.isDownloadExcel === false) {
            this.setState({
                isDownloadExcel: true
            })
            const type = this.state.applicationStatusId === 2 ? 'Submitted' : 'Pending';
            const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplication${type}ApplicationsExcelDownload?applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
            await fetch(url, {
                method: "GET",
                headers: new Headers({
                    Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
                })
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.blob();
                    }
                    return false;
                })
                .then(
                    json => {
                        if (json) {
                            var csvURL = window.URL.createObjectURL(json);
                            var tempLink = document.createElement("a");
                            tempLink.setAttribute("download", `Applications${type}.xlsx`);
                            tempLink.href = csvURL;
                            tempLink.click();
                            console.log(json);
                        }
                    },
                    error => {
                        if (error.status === 401) {
                            this.setState({
                                isLoginMenu: true,
                                isReload: false
                            })
                        } else {
                            alert('Failed to fetch, Please try again later.');
                            console.log(error);
                        }
                    });
            this.setState({
                isDownloadExcel: false
            })
        }
    }

    getData = async status => {
        this.setState({
            isLoading: true,
            admissionData: []
        })
        const reload = status === 1 && this.state.applicationId === "" && this.state.academicSessionId === "" && this.state.genderId === 0 && this.state.degreeId === 0 && this.state.studentName === "";
        const type = status === 1 ? "Pending" : status === 2 ? "Submitted" : "Pending";
        const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplication${type}ApplicationsView?applicationId=${this.state.applicationId}&academicSessionId=${this.state.academicSessionId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.CODE === 1) {
                        this.setState({
                            admissionData: json.DATA || []
                        })
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                    }
                    console.log(json);
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: reload
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })


    }

    DownloadFile = (fileName) => { 
        const data = new FormData();
        data.append("fileName", fileName);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;
        fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }),
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.blob();
                } else if (res.status === 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: false
                    })
                    return {}
                } else {
                    alert('Operation Failed, Please try again later.');
                    return {}
                }
            })
            .then((result) => {
                var csvURL = window.URL.createObjectURL(result);
                var tempLink = document.createElement("a");
                tempLink.href = csvURL;
                tempLink.setAttribute("download", fileName);
                tempLink.click();
                console.log(csvURL);
                if (result.CODE === 1) {
                    //Code
                } else if (result.CODE === 2) {
                    alert(
                        "SQL Error (" +
                        result.CODE +
                        "): " +
                        result.USER_MESSAGE +
                        "\n" +
                        result.SYSTEM_MESSAGE
                    );
                } else if (result.CODE === 3) {
                    alert(
                        "Other Error (" +
                        result.CODE +
                        "): " +
                        result.USER_MESSAGE +
                        "\n" +
                        result.SYSTEM_MESSAGE
                    );
                } else if (result.error === 1) {
                    alert(result.error_message);
                } else if (result.success === 0 && result.redirect_url !== "") {
                    window.location = result.redirect_url;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    render() {
        const columnsSubmitted = [
            { name: "Student Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '12%', textAlign: 'center' } },
            { name: "Application Id", dataIndex: "applicationId", sortable: false, customStyleHeader: { width: '13%' } },
            {
                name: "Name", dataIndex: "displayName", sortable: false, customStyleHeader: { width: '10%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '12%' } },
            { name: "Date of Birth", dataIndex: "dateOfBirth", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '17%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Submission Date", dataIndex: "submittedOn", sortIndex: "submittedOnMillis", sortable: true, customStyleHeader: { width: '15%' } },
            { name: "Payment Status", dataIndex: "paymentStatusLabel", sortIndex: "paymentStatusLabel", sortable: true, customStyleHeader: { width: '15%' } },
            {
                name: "Profile", renderer: rowData => {
                    return (
                        <Button style={{
                            fontSize: 12,
                            textTransform: 'capitalize'
                        }} variant="outlined" onClick={() => window.open(`#/view-application/${rowData.applicationId}`, "_blank")} >View</Button>
                    )
                }, sortable: false, customStyleHeader: { width: '15%' }
            },
        ]

        const columnsPending = [
            { name: "Student Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '12%', textAlign: 'center' } },
            { name: "Application Id", dataIndex: "applicationId", sortable: false, customStyleHeader: { width: '12%' } },
            { name: "Applicant Name", dataIndex: "displayName", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '10%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '17%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Reg Date", dataIndex: "createdOn", sortIndex: "createdOnMillis", sortable: true, customStyleHeader: { width: '12%' } },
            { name: "Stage", dataIndex: "stage", sortIndex: "stage", sortable: true, customStyleHeader: { width: '15%' } },
            {
                name: "Since", dataIndex: "since", sortIndex: "since", sortable: true, customStyleHeader: { width: '7%' }
            }
        ]

        return (
            <Fragment>
                {/* <DisplayAdmissionApplications documentData={this.state.documentsData} onDownload={fileName => this.DownloadFile(fileName)} data={this.state.addmissionForm} open={false} handleClose={() => this.onHandleFormClose()} /> */}

                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Admission Application Reports
            </Typography>
                        <img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                            height: 30, width: 32,
                            cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
                        }}
                        />
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <AdmissionApplicationReportsFilter isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={status => this.getData(status)} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>{
                            this.state.applicationStatusId === 1 && <Fragment>Applicants who have not submitted the &rdquo;Admission Application&rdquo; till date.</Fragment>
                        }{
                            this.state.applicationStatusId === 2 && <Fragment>Applicants who have successfully submitted &rdquo;Admission Application&rdquo;.</Fragment>
                        }
                    </div>
                    {this.state.applicationStatusId === 1 &&
                        <TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columnsPending} />
                    }
                    {this.state.applicationStatusId === 2 &&
                        <TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columnsSubmitted} />
                    }

                </div>
            </Fragment>
        );
    }
}
export default AdmissionApplicationReports;