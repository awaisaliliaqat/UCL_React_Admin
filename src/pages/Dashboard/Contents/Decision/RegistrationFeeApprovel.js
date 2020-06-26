import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
// import ExcelIcon from '../../../../assets/Images/excel.png';
import RegistrationFeeApprovelFilter from './Chunks/RegistrationFeeApprovelFilter';
import TablePanel from '../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import RegistrationFeeApprovelMenu from './Chunks/RegistrationFeeApprovelMenu';

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

class RegistrationFeeApprovel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            applicationStatusId: 1,
            admissionData: [],
            genderData: [],
            degreeData: [],
            documentData: [],
            statusTypeData: [],
            studentName: "",
            referenceNo: "",
            genderId: 0,
            degreeId: 0,
            applicationId: "",
            isDownloadExcel: false,
            isLoginMenu: false,
            isReload: false,
            isSubmitLoading: false,
            isOpenApprovelMenu: false,
            eventDate: null,
            selectedData: {},
            methodData: [],
            methodId: 0,
            methodIdError: ""

        }
    }

    componentDidMount() {
        this.getGenderData();
        this.getDegreesData();
        this.getStatusTypeData();
        this.getMethodData();
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

    getMethodData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C03CommonAcademicsFeePayablePaymentMethodsView`;
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
                        methodData: json.DATA || [],
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
            referenceNo: "",
            applicationStatusId: 1,
            eventDate: null
        })
    }

    handleDateChange = (date) => {
        this.setState({
            eventDate: date
        });
    };


    downloadExcelData = async () => {
        if (this.state.isDownloadExcel === false) {
            this.setState({
                isDownloadExcel: true
            })
            const type = this.state.applicationStatusId === 2 ? 'Submitted' : 'Pending';
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplication${type}ApplicationsExcelDownload?applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}`;
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

    getData = async () => {
        this.setState({
            isLoading: true
        })
        const paymentDate = this.state.eventDate ? `&paymentDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
        const reload = this.state.applicationStatusId === 0 && this.state.applicationId === "" && this.state.genderId === 0 && this.state.degreeId === 0 && this.state.referenceNo === "" && this.state.studentName === "" && this.state.eventDate === null;
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C03AdmissionsProspectApplicationRegistrationFeeApprovalView?paymentStatusId=${this.state.applicationStatusId}&applicationId=${this.state.applicationId}&referenceNo=${this.state.referenceNo}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${paymentDate}`;
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

    onConfirmClick = async (e, id) => {
        e.preventDefault();
        this.setState({
            isSubmitLoading: true
        })
        if (this.state.methodId) {
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C03CommonAcademicsFeePayableChangeStatus?paymentId=${id}&paymentMethodId=${this.state.methodId}`;
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
                                isOpenApprovelMenu: false,
                                methodId: 0,
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
        } else {
            this.setState({ methodIdError: "Please select method." });
        }
        this.setState({
            isSubmitLoading: false
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        let { methodIdError } = this.state;
        if (name === "methodId") {
            methodIdError = "";
        }
        this.setState({
            [name]: value,
            methodIdError
        })
    }

    render() {
        const columns = [
            { name: "Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '8%', textAlign: 'center' } },
            {
                name: "Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '12%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '9%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '17%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Payment Reference No", dataIndex: "paymentReferenceNo", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Payment Method", dataIndex: "paymentMethodLabel", sortIndex: "paymentMethodLabel", sortable: true, customStyleHeader: { width: '15%' } },
            { name: "Payment Date", dataIndex: "paymentDate", sortIndex: "paymentDate", sortable: true, customStyleHeader: { width: '13%' } },
            { name: "Status", dataIndex: "paymentStatusLabel", sortIndex: "paymentStatusLabel", sortable: true, customStyleHeader: { width: '12%' } },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Button key={rowData.id} disabled={rowData.paymentMethodId === 4} style={{
                            fontSize: 12,
                            textTransform: 'capitalize'
                        }} variant="outlined" onClick={() => this.setState({ isOpenApprovelMenu: true, selectedData: rowData, methodId: rowData.paymentMethodId })} >View</Button>
                    )
                }, sortable: false, customStyleHeader: { width: '10%' }
            },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <RegistrationFeeApprovelMenu methodIdError={this.state.methodIdError} submitLoading={this.state.isSubmitLoading} onHandleChange={e => this.onHandleChange(e)} methodId={this.state.methodId}
                    methodData={this.state.methodData} data={this.state.selectedData} open={this.state.isOpenApprovelMenu}
                    handleClose={() => this.setState({ isOpenApprovelMenu: false })} onConfirmClick={(e, id) => this.onConfirmClick(e, id)} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Registration Fee Approval Dashboard
            </Typography>
                        {/* <img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                            height: 30, width: 32,
                            cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
                        }}
                        /> */}
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <RegistrationFeeApprovelFilter isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />

                    <TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columns} />


                </div>
            </Fragment>
        );
    }
}
export default RegistrationFeeApprovel;