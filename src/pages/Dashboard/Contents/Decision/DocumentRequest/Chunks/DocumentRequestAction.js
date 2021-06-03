/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import LoginMenu from '../../../../../../components/LoginMenu/LoginMenu';
import {
    TextField, Button, MenuItem
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import TablePanel from '../../../../../../components/ControlledTable/RerenderTable/TablePanel';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
// import DeleteIcon from '@material-ui/icons/Delete';

class DocumentRequestAction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            documentData: [],
            documentList: [],
            applicationId: props.match.params.id,
            documentTypeId: 0,
            documentTypeLabel: "",
            documentTypeIdError: "",
            remarks: "",
            remarksError: "",
            isLoginMenu: false,
            isReload: false,
            ArrayError:""

        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        this.setState({
            isLoading: true
        })
        await this.getData();
        await this.getDocumentList();
        this.setState({
            isLoading: false
        })
    }

    handleDateChange = (date) => {
        this.setState({
            eventDate: date
        });
    };
    getDocumentList = async () => {
        const urlList = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C17AdmissionsProspectApplicationRequiredDocumentListView`;
        await fetch(urlList, {
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
                            documentList: json.DATA || []
                        })
                    }
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
    }

    getData = async () => {

        const url2 = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C17AdmissionsProspectApplicationDocumentsView?applicationId=${this.state.applicationId}`;
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
                            documentData: json.DATA || []
                        })

                        console.log(this.state.documentData);
                    }
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
                }
            );
        this.setState({
            isLoading: false
        })


    }

    isFormValid = () => {
        let { documentTypeIdError, remarksError } = this.state;
        let isValid = true;
        if (!this.state.documentTypeId) {
            isValid = false
            documentTypeIdError = "Please select document type.";
        }
        if (!this.state.remarks) {
            isValid = false;
            remarksError = "Please give some remarks."
        }
        this.setState({
            documentTypeIdError,
            remarksError,
            ArrayError:""
        })
        return isValid;
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const { documentList } = this.state;
        console.log("e.target",e.target);
        console.log(documentList);
        for(let j=0;j<documentList.length;j++){
             if(value==documentList[j].ID){
                this.setState({
                    documentTypeLabel:documentList[j].Label
                })
             }
        }
        console.log("name"+name);
        const errName = `${name}Error`;
        this.setState({
            [name]: value,
            [errName]: ""
        })
    }


    onAdd=()=>{
       
        const isValid = this.isFormValid();
        if (isValid) {
            let {documentData} =this.state;
            documentData.push({
                 id: "", applicationId: this.state.applicationId,documentTypeId:this.state.documentTypeId,documentTypeLabel:this.state.documentTypeLabel,remarks:this.state.remarks,isUploaded:0,uploadedOn:""
            })
             
            this.setState({
                documentData,
                documentTypeId: "",
                documentTypeIdError: "",
                remarks: "",
                remarksError: ""
            })
        }
      
    }

    handleSubmitButtonClick = () => {
       
        if (this.state.documentData.length>0) {
            document.getElementById("submit-button").click();
        }else{
            this.setState({
                ArrayError:"Please add Document Type and Remarks."
            })
        }
        return;
    };

    handleSubmit = async (e) => {

        e.preventDefault();
        //const data = new FormData(e.target);
         const data = new FormData();
         data.append("applicationId", this.state.applicationId);
        for(let i=0;i<this.state.documentData.length;i++){
           
            data.append("documentTypeId", this.state.documentData[i].documentTypeId);
            data.append("remarks", this.state.documentData[i].remarks);
        }
        
      
        this.setState({
            isLoading: true,
        });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C17AdmissionsProspectApplicationDocumentRequestsRaiseRequest`;
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
                    alert("Request Raised");
                    this.setState({
                        documentTypeId: "",
                        documentTypeIdError: "",
                        remarks: "",
                        remarksError: ""
                    })
                    this.getData();
                } else {
                    alert(result.CODE + ":" + result.SYSTEM_MESSAGE + "\n" + result.USER_MESSAGE);
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
            isLoading: false,
        });
    };

    deleteFile = (id,documentTypeId) => {
        if(id!=0){

        
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C17AdmissionsProspectApplicationRaiseDocumentRequestDelete?documentTypeId=${id}`;
            fetch(url, {
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
                    (result) => {
                        console.log(result);
                        if (result["CODE"] === 1) {
                            this.loadData();

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
        } else{
            
            const index = this.state.documentData.findIndex(item => item.documentTypeId === documentTypeId)
            if (index != -1) {
                this.state.documentData.splice(index,1);
            } 
        }   
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

    render() {

        const columns = [
            { name: "Request Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '10%' } },
            { name: "Document Type", dataIndex: "documentTypeLabel", sortable: false, customStyleHeader: { width: '20%' } },
            { name: "Remarks", dataIndex: "remarks", sortable: false, customStyleHeader: { width: '30%' } },
            { name: "Upload Date", dataIndex: "uploadedOn", sortable: false, customStyleHeader: { width: '17%' } },
            {
                name: "Status", renderer: rowData => {
                    return (
                        `${rowData.isUploaded === 1 ? 'Uploaded' : 'Pending'}`
                    )
                }, sortIndex: "status", sortable: true, customStyleHeader: { width: '15%' }
            },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Fragment>
                            <div style={{ display: 'flex', margin: '-10px',float:'left' }}>
                                <IconButton disabled={rowData.isUploaded === 0} onClick={() =>
                                    this.DownloadFile(rowData.fileName)
                                } aria-label="download">
                                    <CloudDownloadIcon />
                                </IconButton>
                                <IconButton onClick={() => this.deleteFile(rowData.id,rowData.documentTypeId) } aria-label="delete">
                                    <DeleteIcon />
                                </IconButton> 
                                  {/* <IconButton  onClick={() =>
                                    this.DownloadFile(rowData.fileName)
                                } aria-label="delete">
                                    <CloudDownloadIcon />
                                </IconButton> */}
                            </div>
                     
                        </Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '10%' }
            },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />

                <div style={{
                    padding: 30
                }}>
                    <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                        <IconButton style={{
                            paddingBottom: 0,
                            marginTop: '-10px'
                        }} aria-label="Back">
                            <Link style={{
                                textDecoration: 'none',
                                color: 'gray'
                            }} to="/dashboard/raise-document-requests"><ArrowBackIcon /></Link>
                        </IconButton> Application ID: {this.state.applicationId}
                    </Typography>

                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <form id="myform"
                        onSubmit={this.handleSubmit}
                        autoComplete="off">
                        <div style={{
                            display: 'flex',
                            marginTop: 30
                        }}>
                            <input name="applicationId" type="hidden" value={this.state.applicationId} />
                            <TextField
                                select
                                style={{
                                    marginRight: 20
                                }}
                                error={this.state.documentTypeIdError}
                                value={this.state.documentTypeId || ""}
                                label="Document Type"
                                fullWidth
                                onChange={this.onHandleChange}
                                name="documentTypeId"

                            >
                                {this.state.documentList.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.ID}>
                                            {item.Label}
                                        </MenuItem>
                                    )
                                })
                                }
                            </TextField>
                        </div>
                        <div style={{
                            display: 'flex',
                            marginTop: 30
                        }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Remarks"
                                name="remarks"
                                multiline
                                fullWidth
                                style={{
                                    marginRight: 20
                                }}
                                value={this.state.remarks}
                                onChange={this.onHandleChange}
                                rows={3}
                                error={this.state.remarksError}
                                variant="outlined"
                            />
                        </div>
                        <div style={{
                            marginTop: 30,
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <input id="submit-button" type="submit" style={{ display: 'none' }} />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.onAdd()}
                                style={{
                                    height: 40,
                                    marginLeft: 20,
                                    marginRight: 20,
                                    textTransform: 'capitalize',
                                }}
                            > {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Add"}</Button>
                        </div>
                    </form>
                    { 
                    <span style={{
                        fontSize: 14,
                        color: 'red',
                        marginBottom:20
                        
                        }}>
                           {this.state.ArrayError}
                        </span>}
                    <div style={{ marginTop: 20 }}>
                        <TablePanel isShowIndexColumn data={this.state.documentData} isLoading={this.state.isLoading} sortingEnabled={false} columns={columns} />
                    </div>
                    <div style={{
                            marginTop: 30,
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                        <Button disabled={this.state.isLoading} variant="contained"
                                color="primary" onClick={this.handleSubmitButtonClick}  style={{
                                    height: 40,
                                    marginLeft: 20,
                                    marginRight: 20,
                                    textTransform: 'capitalize',
                                }}>
                            {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Request"}
                        </Button>
                        
                     </div>         
                </div>
              
            </Fragment>
            
        );
    }
}
export default DocumentRequestAction;