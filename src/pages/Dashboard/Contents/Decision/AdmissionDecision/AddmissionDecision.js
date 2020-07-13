import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import AddmissionDecisionFilter from './Chunks/AddmissionDecisionFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import DecisionActionMenu from './Chunks/DecisionActionMenu';
import ExcelIcon from '../../../../../assets/Images/excel.png';
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

class AddmissionDecision extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDownloadExcel: false,
            admissionData: [],
            degreeData: [],
            isOpenForm: false,
            documentData: [],
            DecisionData: [],
            addmissionForm: {},
            selectedData: {},
            DecisionId: 1,
            applicationStatusId: 1,
            applicationId: "",
            studentName: "",
            genderId: 0,
            degreeId: 0,
            eventDate: null,
            genderData: [],
            isLoginMenu: false,
            isSubmitLoading: false,
            isReload: false,
            isOpenDecisionMenu: false

        }
    }

    componentDidMount() {
        this.getDegreesData();
        this.getDecisionData();
        this.getGenderData();
        this.getData();

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

    getStatusTypeData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C03CommonAcademicsFeePayableStatusTypesView`;
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
                        statusTypeData: json.DATA,
                    });
                    console.log(json.DATA);
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

    getDecisionData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C04AdmissionsProspectApplicationStatusTypesView`;
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
                        DecisionData: json.DATA || [],
                    });
                    console.log(json.DATA);
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

    getData = async () => {
        this.setState({
            isLoading: true
        })
        const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
        const reload = this.state.applicationStatusId === 0 && this.state.applicationId === "" && this.state.genderId === 0 && this.state.degreeId === 0 && this.state.studentName === "";
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C04AdmissionsProspectApplicationView?applicationStatusId=${this.state.applicationStatusId}&applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
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
            degreeId: 0,
            genderId: 0,
            applicationStatusId: 1,
            eventDate: null,
            studentName: "",
            applicationId: ""
        })
    }

    onConfirmClick = async (e, id) => {
        e.preventDefault();
        this.setState({
            isSubmitLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C04AdmissionsProspectApplicationChangeStatus?applicationId=${id}&statusId=${this.state.DecisionId}&degreeId=${this.state.degreeId}`;
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
                            isOpenDecisionMenu: false,
                            degreeId: 0,
                            DecisionId: 1,
                            selectedData: {}
                        })
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
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                });
        this.setState({
            isSubmitLoading: false
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    downloadExcelData = async () => {
        if (this.state.isDownloadExcel === false) {
            this.setState({
                isDownloadExcel: true
            })
            const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C04AdmissionsProspectApplicationViewExcelDownload?applicationStatusId=${this.state.applicationStatusId}&applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
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
                            tempLink.setAttribute("download", `AdmissionDecisionStatus.xlsx`);
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


    handleDateChange = (date) => {
        this.setState({
            eventDate: date
        });
    }

    render() {
        const columns = [
            { name: "Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '8%', textAlign: 'center' } },
            {
                name: "Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '13%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '12%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '17%', textAlign: 'center' }, align: 'center' },
            { name: "Age", dataIndex: "age", sortable: false, customStyleHeader: { width: '10%' } },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Reg Fee Payment Status", dataIndex: "paymentStatusLabel", sortable: false, customStyleHeader: { width: '17%' } },
            { name: "Status", dataIndex: "statusLabel", sortable: false, customStyleHeader: { width: '15%' } },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Button key={rowData.id} style={{
                            fontSize: 12,
                            textTransform: 'capitalize'
                        }} variant="outlined" onClick={() => this.setState({ isOpenDecisionMenu: true, selectedData: rowData, degreeId: rowData.degreeId, DecisionId: rowData.statusId })} >View</Button>
                    )
                }, sortable: false, customStyleHeader: { width: '10%' }
            },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <DecisionActionMenu submitLoading={this.state.isSubmitLoading} onConfirmClick={(e, id) => this.onConfirmClick(e, id)} DecisionId={this.state.DecisionId} DecisionData={this.state.DecisionData} onHandleChange={e => this.onHandleChange(e)} data={this.state.selectedData} degreeId={this.state.degreeId} degreeData={this.state.degreeData} open={this.state.isOpenDecisionMenu} handleClose={() => this.setState({ isOpenDecisionMenu: false })} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Admission Decision Dashboard
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
                    <AddmissionDecisionFilter isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                    <TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columns} />

                </div>
            </Fragment>
        );
    }
}
export default AddmissionDecision;