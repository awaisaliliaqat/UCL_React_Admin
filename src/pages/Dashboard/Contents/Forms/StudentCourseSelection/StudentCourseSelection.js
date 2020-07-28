import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import StudentCourseSelectionFilter from './Chunks/StudentCourseSelectionFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import StudentCourseSelectionAction from './Chunks/StudentCourseSelectionAction';

class StudentCourseSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            admissionData: [],
            coursesData: [],
            achivementsData:[],
            moduleData:[],
            isOpenActionMenu: false,
            selectedData: {},
            isLoginMenu: false,
            isReload: false,
            viewLoading: false,

            sessionId: "",
            sessionData: [],
            programmeId: "",
            programmeData: [],
            regStatusId: 1,
            studentId: "",
            studentName: "",

        }
    }

    componentDidMount() {
        this.getSessionData();
        // this.setState({
        //     achivementsData:[
        //         {
        //             "moduleNumber": "1",
        //             "courses": "CS123 - Computer Sciences, 02 - Introduction to Economics, 4a - Statistics 1",
        //             "marks": "30"
        //         },
        //         {
        //             "moduleNumber": "2",
        //             "courses": "5a - Mathematics1, CS123 - Computer Sciences, 66 - Microeconomics",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "3",
        //             "courses": "CS123 - Computer Sciences, 15 - Economics of Labour",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "4",
        //             "courses": "9626 - Information Technology, CS123 - Computer Sciences, L101 - Criminal Law",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "5",
        //             "courses": "L103 - Legal Systems and Method, CS123 - Computer Sciences",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "6",
        //             "courses": "CS123 - Computer Sciences",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "7",
        //             "courses": "L104 - Contract Law, AS11 - Awais Course, CS123 - Computer Sciences",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "8",
        //             "courses": "L104 - Contract Law, CS123 - Computer Sciences, 9704 - Art and Design",
        //             "marks": "30"
        //         },
        //         {
        //             "moduleNumber": "9",
        //             "courses": "CS123 - Computer Sciences, 02 - Introduction to Economics, 4a - Statistics 1",
        //             "marks": "30"
        //         },
        //         {
        //             "moduleNumber": "10",
        //             "courses": "5a - Mathematics1, CS123 - Computer Sciences, 66 - Microeconomics",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "11",
        //             "courses": "CS123 - Computer Sciences, 15 - Economics of Labour",
        //             "marks": "30"
        //         },
        //     ],
        //     moduleData:[
        //         {
        //             "moduleNumber": "1",
        //             "courses": "CS123 - Computer Sciences, 02 - Introduction to Economics, 4a - Statistics 1",
        //             "marks": "30"
        //         },
        //         {
        //             "moduleNumber": "2",
        //             "courses": "5a - Mathematics1, CS123 - Computer Sciences, 66 - Microeconomics",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "3",
        //             "courses": "CS123 - Computer Sciences, 15 - Economics of Labour",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "4",
        //             "courses": "9626 - Information Technology, CS123 - Computer Sciences, L101 - Criminal Law",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "5",
        //             "courses": "L103 - Legal Systems and Method, CS123 - Computer Sciences",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "6",
        //             "courses": "CS123 - Computer Sciences",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "7",
        //             "courses": "L104 - Contract Law, AS11 - Awais Course, CS123 - Computer Sciences",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "8",
        //             "courses": "L104 - Contract Law, CS123 - Computer Sciences, 9704 - Art and Design",
        //             "marks": "30"
        //         },
        //         {
        //             "moduleNumber": "9",
        //             "courses": "CS123 - Computer Sciences, 02 - Introduction to Economics, 4a - Statistics 1",
        //             "marks": "30"
        //         },
        //         {
        //             "moduleNumber": "10",
        //             "courses": "5a - Mathematics1, CS123 - Computer Sciences, 66 - Microeconomics",
        //             "marks": "30"
        //         }, {
        //             "moduleNumber": "11",
        //             "courses": "CS123 - Computer Sciences, 15 - Economics of Labour",
        //             "marks": "30"
        //         },
        //     ]
        // });

    }


    getSessionData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsView`;
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
                    if (json.CODE === 1) {
                        this.setState({
                            sessionData: json.DATA || [],
                        });
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
    };

    getCouresData = async (rowData) => {
        this.setState({
            viewLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsOfferedCoursesView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&studentId=${rowData.id}`;
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
                    if (json.CODE === 1) {
                        this.setState({
                            coursesData: json.DATA || [],
                            isOpenActionMenu: true,
                            selectedData: rowData,
                        });
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
            viewLoading: false
        })
    };



    getModulesData = async (rowData) => {
        this.setState({
            viewLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonProgrammeModulesView?academicsSessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}`;
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
                    if (json.CODE === 1) {
                        console.log("MODULES ==>> "+json.DATA );
                        this.setState({
                            moduleData: json.DATA || [],

                        });
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
            viewLoading: false
        })
    };


    getStudentAchivementsData = async (rowData) => {
        this.setState({
            viewLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsCoursesStudentsAchievementsView?academicsSessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&studentId=${rowData.id}`;
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
                    if (json.CODE === 1) {
                        this.setState({
                            achivementsData: json.DATA || [],

                        });
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
            viewLoading: false
        })
    };

    getProgrammeData = async (id) => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsOfferedProgrammesView?sessionId=${id}`;
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
                    if (json.CODE === 1) {
                        this.setState({
                            programmeData: json.DATA || [],
                        });
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
    };


    onClearFilters = () => {
        this.setState({
            regStatusId: 1,
            studentId: "",
            studentName: ""
        })
    }

    getData = async (isChangeCall = false, value = "") => {
        this.setState({
            isLoading: true
        })
        const programmeId = isChangeCall ? value : this.state.programmeId;
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonStudentsView?sessionId=${this.state.sessionId}&statusId=${this.state.regStatusId}&programmeGroupId=${programmeId}&studentId=${this.state.studentId}&studentName=${this.state.studentName}`;
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
                            isReload: false
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

    onSaveClick = () => {
        document.getElementById('courseSubmit').click();
    }

    onFormSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        const formData = new FormData(e.target);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsCoursesStudentsSave`;
        await fetch(url, {
            method: "POST",
            body: formData,
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
                        alert('Saved');
                        this.getData();
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
                        alert('Failed to Save, Please try again later.');
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })


    }

    onHandleChange = e => {
        const { name, value } = e.target;
        switch (name) {
            case "sessionId":
                this.setState({
                    programmeId: "",
                    admissionData: []
                })
                this.getProgrammeData(value);
                break;
            case "programmeId":
                this.getData(true, value);
                break;
            default:
                break;
        }
        this.setState({
            [name]: value
        })
    }

    handleCheckboxChange = (e, value = {}, type = 0) => {
        const { checked } = e.target;
        const { id } = value;
        const { coursesData } = this.state;
        const index = coursesData.findIndex(item => item.id === id);
        if (index >= 0) {
            if (type === 0) {
                coursesData[index].isRegistered = checked ? 1 : 0;
                coursesData[index].isRepeat = 0;
            } else {
                coursesData[index].isRepeat = checked ? 1 : 0;
            }
        }
        this.setState({
            coursesData
        })
    }

    onCheckClear = () => {
        const { coursesData } = this.state;
        for (let i = 0; i < coursesData.length; i++) {
            coursesData[i].isRegistered = 0;
            coursesData[i].isRepeat = 0;
        }
        this.setState({
            coursesData
        })
    }

    render() {
        const columns = [
            { name: "Nucleus Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '12%' } },
            {
                name: "Student Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortIndex: "firstName", sortable: true, customStyleHeader: { width: '17%' }
            },
            { name: "Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '18%' } },
            {
                name: "Registration Status",
                dataIndex: "isRegisteredLabel", sortIndex: "paymentStatusLabel", sortable: true, customStyleHeader: { width: '19%' }
            },
            {
                name: "No. of Reg Courses", renderer: rowData => {
                    return (
                        <Fragment>
                            {rowData.registeredCourses || ""}
                        </Fragment>
                    )
                }, sortIndex: "registeredCourses", sortable: true, customStyleHeader: { width: '19%' }
            },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Button disabled={this.state.viewLoading} style={{
                            fontSize: 12,
                            cursor: `${this.state.viewLoading ? 'wait' : 'pointer'}`,
                            textTransform: 'capitalize'
                        }} variant="outlined" onClick={() => {this.getCouresData(rowData)
                            this.getModulesData(rowData)
                            this.getStudentAchivementsData(rowData)
                            }
                        } >View</Button>
                    )
                }, sortable: false, customStyleHeader: { width: '15%' }
            },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />

                <StudentCourseSelectionAction onSave={() => this.onSaveClick()} open={this.state.isOpenActionMenu} handleClose={() => this.setState({ isOpenActionMenu: false })}
                    selectedData={this.state.selectedData} coursesData={this.state.coursesData} moduleData={this.state.moduleData} achivementsData={this.state.achivementsData} onClear={() => this.onCheckClear()}
                    handleCheckboxChange={(e, value, type) => this.handleCheckboxChange(e, value, type)} />

                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Student Course Selection
            </Typography>

                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <StudentCourseSelectionFilter isLoading={this.state.isLoading} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={status => this.getData(status)} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                    }}>
                        <TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columns} />
                    </div>
                </div>
                <form noValidate id="selectionForm" onSubmit={this.onFormSubmit}>
                    <input name="sessionId" value={this.state.sessionId} type="hidden" />
                    <input name="programmeGroupId" value={this.state.programmeId} type="hidden" />
                    <input name="studentId" value={this.state.selectedData.id} type="hidden" />
                    {this.state.coursesData.map(item => {
                        if (item.isRegistered === 1) {
                            return (
                                <Fragment>
                                    <input name="courseId" value={item.id} type="hidden" />
                                    <input name="isRepeat" value={item.isRepeat || 0} type="hidden" />
                                </Fragment>
                            );
                        }
                    })}
                    <input type="submit" style={{ display: 'none' }} id="courseSubmit" />
                </form>
            </Fragment>
        );
    }
}
export default StudentCourseSelection;