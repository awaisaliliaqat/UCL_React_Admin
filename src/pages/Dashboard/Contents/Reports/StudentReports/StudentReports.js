import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';




class StudentReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            attendanceData: [],

            selectedData: {},

            eventDate: new Date(),

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",

            isDownloadExcel: false

        }
    }

    componentDidMount() {

    }

    downloadExcelData = async () => {
        if (this.state.isDownloadExcel === false) {
            this.setState({
                isDownloadExcel: true,
                isLoading: true

            })


            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C37CommonStudentsExcelDownload`;
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
                            tempLink.setAttribute("download", `Students Reports.xlsx`);
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
                isDownloadExcel: false,
                isLoading: false
            })
        }
    }




    onClearFilters = () => {

        this.setState({
            eventDate: new Date()
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }


    handleDateChange = (date) => {
        this.setState({
            eventDate: date
        });
    }

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar: false
        });
    };

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };

    render() {
        const { isLoading } = this.state;

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
                            Student Excel Report
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />

                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        onClick={() => this.downloadExcelData()}
                    > {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Download in Excel Format"}</Button>

                </div>

            </Fragment>
        );
    }
}
export default StudentReports;