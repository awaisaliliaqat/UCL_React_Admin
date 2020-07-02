import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import UploadTutionFessAction from './Chunks/UploadTutionFeesAction';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';

class DocumentRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            uploadLoading: false,
            files: [],
            filesError: "",
            documentData: [],
            isLoginMenu: false,
            isReload: false,

        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        this.setState({
            isLoading: true
        });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C11FinanceStudentsLegacyFeeVouchersDocumentsView`;
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
                            documentData: json.DATA || [],
                            files: [],
                            filesError: ""
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
                            isReload: true
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

    deleteFile = (id) => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationDocumentsDelete?documentTypeId=${id}`;
        fetch(url, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken"),
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                (result) => {
                    console.log(result);
                    if (result["CODE"] === 1) {
                        window.location.reload();
                    } else {
                        alert(result["SYSTEM_MESSAGE"]);
                    }
                })
            .catch((error) => {
                if (error.status === 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: false
                    })
                } else {
                    alert('Operation Failed, Please try again later.');
                    console.log(error);
                }
            });
    };

    DownloadFile = (fileName) => {
        const data = new FormData();
        data.append("fileName", fileName);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${
            process.env.REACT_APP_SUB_API_NAME
            }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;

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

    isFormValid = () => {
        let { filesError } = this.state;
        let isValid = true;
        if (this.state.files.length <= 0) {
            isValid = false;
            filesError = "Please select a file."
        }
        this.setState({
            filesError,
        })
        return isValid;
    }

    handleUploadButtonClick = () => {
        const isValid = this.isFormValid();
        if (isValid) {
            document.getElementById("submit-button").click();
        }
        return;
    };

    handleFileChange = event => {
        const { files = [] } = event.target;
        if (files.length > 0) {
            if (files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                this.setState({
                    files,
                    filesError: ""
                })
            } else {
                this.setState({
                    filesError: "Please select only xlsx file."
                })
            }
        }

    }

    handleSubmit = async (e) => {
        console.log(e);

        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({
            uploadLoading: true
        });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C11FinanceStudentsLegacyFeeVouchersUpload`;
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
            .then((result) => {
                if (result.CODE === 1) {
                    alert('File Uploaded');
                    this.getData();
                } else {
                    alert(result.CODE + ":" + result.USER_MESSAGE + "\n" + result.SYSTEM_MESSAGE);
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: false
                    })
                } else {
                    alert('Operation Failed, Please try again later.');
                    console.log(error);
                }
            });
        this.setState({
            uploadLoading: false,
        });
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
                            Upload Tuition Fee Vouchers
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <UploadTutionFessAction values={this.state} handleUploadButtonClick={() => this.handleUploadButtonClick()}
                        handleFileChange={e => this.handleFileChange(e)} handleSubmit={e => this.handleSubmit(e)}
                        downloadFile={name => this.DownloadFile(name)} deleteFile={id => this.deleteFile(id)} />
                </div>
            </Fragment>
        );
    }
}
export default DocumentRequest;