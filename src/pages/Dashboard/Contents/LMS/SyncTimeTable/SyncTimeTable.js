import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Button } from '@material-ui/core';

class SyncTimeTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            statusId: 0,

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",

        }
    }

    componentDidMount() {
        this.syncTimeTable();
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity,
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        this.setState({
            isOpenSnackbar: false,
        });
    };

    syncTimeTable = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C52SyncTimeTable`;
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

                        this.handleOpenSnackbar('Sync Completed', "success");
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
                    }
                    console.log(json);
                    this.setState({ isLoading: false, statusId: json.CODE });
                },
                (error) => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true,
                        });
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar(
                            "Failed to fetch, Please try again later.",
                            "error"
                        );
                    }
                    this.setState({ isLoading: false, statusId: 0 });
                }
            );
    };



    render() {

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
                            Sync Time Table
                        </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    {
                        this.state.isLoading ? <div style={{ textAlign: "center", marginTop: 30 }}> <CircularProgress /> </div> : <div style={{
                            marginTop: 30,
                            marginBottom: 15,
                            color: '#174A84',
                            font: 'Bold 16px Lato',
                            letterSpacing: '1.8px',
                            textAlign: 'center'
                        }}>{
                                this.state.statusId === 1 ? <Fragment><span style={{ color: 'green' }}>Sync Completed.</span> </Fragment>
                                    : <Fragment><span style={{ color: 'darkred' }}> Sync Failed. </span> <Button style={{ marginLeft: 10 }} onClick={() => this.syncTimeTable()} variant="outlined" color="primary">Retry</Button></Fragment>
                            }
                        </div>
                    }
                </div>

                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={() => this.handleCloseSnackbar()}
                />
            </Fragment>
        );
    }
}
export default SyncTimeTable;