import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import EditStudentInformationFilter from './Chunks/EditStudentInformationFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { Link } from 'react-router-dom';

class EditStudentInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            admissionData: [],
            studentId: "",
            applicationId: "",
            isLoginMenu: false,
            isReload: false,
            eventDate: null,

        }
    }

    componentDidMount() {
        this.getData();
    }

    onClearFilters = () => {
        this.setState({
            studentId: "",
            applicationId: ""
        })
    }

    getData = async () => {
        this.setState({
            isLoading: true
        })
        const reload = this.state.studentId === "" && this.state.applicationId === "";
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C21CommonStudentsView?applicationId=${this.state.applicationId}&studentId=${this.state.studentId}`;
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
            { name: "Nucleus Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '13%', textAlign: 'center' } },
            { name: "Application Id", dataIndex: "applicationId", sortable: false, customStyleHeader: { width: '13%', textAlign: 'center' } },
            {
                name: "Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '15%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '13%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '20%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '17%' } },
            {
                name: "Action", renderer: rowData => {
                    console.log(rowData);
                    return (
                        <Button style={{
                            fontSize: 12,
                            textTransform: 'capitalize'
                        }} variant="outlined">
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/dashboard/edit-student-information/${rowData.id}`}>
                                Edit Profile
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
                            Edit Student Profile
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <EditStudentInformationFilter isLoading={this.state.isLoading} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
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
export default EditStudentInformation;