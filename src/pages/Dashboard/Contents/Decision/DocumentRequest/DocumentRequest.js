import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import UploadDocumentsFilter from './Chunks/DocumentRequestFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
// import { format } from 'date-fns';
import { Link } from 'react-router-dom';


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

class DocumentRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            admissionData: [],
            genderData: [],
            degreeData: [],
            studentName: "",
            genderId: 0,
            degreeId: 0,
            applicationId: "",
            applicationStatusId: 0,
            isLoginMenu: false,
            isReload: false,
            eventDate: null,

        }
    }

    componentDidMount() {
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
            applicationStatusId: 0,
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
            isOpenDocumentMenu: false
        })
    };

    getData = async () => {
        this.setState({
            isLoading: true
        })
        const applicationId = this.state.applicationId ? this.state.applicationId : 0;
        const reload = applicationId === 0 && this.state.applicationStatusId === 0;
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C17AdmissionsProspectApplicationView?statusId=${this.state.applicationStatusId}&applicationId=${applicationId}`;
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

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    render() {
        const columnsSubmitted = [
            { name: "Application Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '13%', textAlign: 'center' } },
            {
                name: "Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '10%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '12%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '20%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '17%' } },
            { name: "Submission Date", dataIndex: "submittedOn", sortIndex: "submittedOn", sortable: true, customStyleHeader: { width: '17%' } },
            { name: "Status", dataIndex: "statusLabel", sortable: false, customStyleHeader: { width: '14%' } },

            {
                name: "Action", renderer: rowData => {
                    console.log(rowData);
                    return (
                        <Button style={{
                            fontSize: 12,
                            textTransform: 'capitalize'
                        }} variant="outlined">
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/dashboard/raise-document-requests/${rowData.id}`}>
                                Request Document
                             </Link>
                        </Button>
                    )
                }, sortable: false, customStyleHeader: { width: '21%' }
            },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Document Requests
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <UploadDocumentsFilter isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div><TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columnsSubmitted} />

                </div>
            </Fragment>
        );
    }
}
export default DocumentRequest;