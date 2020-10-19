import React, { Component, Fragment } from 'react';
import { withStyles, ThemeProvider } from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { numberFreeExp } from '../../../../utils/regularExpression';
import { TextField, Grid, Button, CircularProgress, Snackbar, Divider, Typography  } from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = () => ({
    root: {
      padding: 20,
    },
    formControl: {
      minWidth: '100%',
    },
    sectionTitle: {
      fontSize: 19,
      color: '#174a84',
    },
    checkboxDividerLabel: {
      marginTop: 10,
      marginLeft: 5,
      marginRight: 20,
      fontSize: 16,
      fontWeight: 600
    },
    rootProgress: {
        width: '100%',
        textAlign: 'center',
    },
});

class F207Form extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            label:"",
            labelError:"",
            shortLabel:"",
            shortLabelError:"",
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:""
        }
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar:true,
            snackbarMessage:msg,
            snackbarSeverity:severity
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar:false
        });
    };

    loadData = async(index) => {
        const data = new FormData();
        data.append("id",index);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C06CommonSchoolsView`;
        await fetch(url, {
            method: "POST",
            body: data, 
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        if(json.DATA.length){
                            this.setState({
                                label:json.DATA[0].label,
                                shortLabel:json.DATA[0].shortLabel
                            });
                        }else{
                            window.location = "#/dashboard/F207Form/0";
                        }
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                       // alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    islabelValid = () => {
        let isValid = true;
        if (!this.state.label) {
            this.setState({labelError:"Please enter letter grade label."});
            document.getElementById("label").focus();
            isValid = false;
        } else {
            this.setState({labelError:""});
        }
        return isValid;
    }

    isshortLabelValid = () => {
        let isValid = true;        
        if (!this.state.shortLabel) {
            this.setState({shortLabelError:"Please enter Short Name."});
            document.getElementById("shortLabel").focus();
            isValid = false;
        } else {
            this.setState({shortLabelError:""});
        }
        return isValid;
    }

    onHandleChange = e => {
        
        const { name, value } = e.target;
        const errName = `${name}Error`;
        
        let regex = "";
        switch (name) {
            case "label":
            case "shortLabel":
                regex = new RegExp(numberFreeExp);
                if (value && !regex.test(value)) {
                    return;
                }
                break;
        default:
            break;
        }

        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async(e) => {
        if(
						!this.islabelValid() 
						//|| !this.isshortLabelValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C207CommonAcademicsLetterGradesSave`;
        await fetch(url, {
            method: "POST", 
            body: data, 
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        //alert(json.USER_MESSAGE);
                        this.handleOpenSnackbar(json.USER_MESSAGE,"success");
                        setTimeout(()=>{
                            if(this.state.recordId!=0){
                                window.location="#/dashboard/F207Reports";
                            }else{
                                window.location.reload();
                            }
                        }, 2000);
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                        this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        //alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    
    viewReport = () => {
        window.location = "#/dashboard/F207Reports";
    }

    componentDidMount() {
        this.props.setDrawerOpen(false);
        if(this.state.recordId!=0){
            //this.loadData(this.state.recordId);
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.recordId!=nextProps.match.params.recordId){
            if(nextProps.match.params.recordId!=0){
                this.props.setDrawerOpen(false);
                //this.loadData(nextProps.match.params.recordId);
            }else{
                window.location.reload();
            }
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form id="myForm">
									<TextField type="hidden" name="recordId" value={this.state.recordId}/>
									<Grid container component="main" className={classes.root}>
											<Typography 
													style={{
															color: '#1d5f98', 
															fontWeight: 600, 
															borderBottom: '1px solid rgb(58, 127, 187, 0.3)',
															width: '100%', 
															marginBottom: 25, 
															fontSize: 20
													}} 
													variant="h5"
											>
											Define Letter Grades
											</Typography>
											<Divider style={{
															backgroundColor: 'rgb(58, 127, 187)',
															opacity: '0.3'
													}} 
											/>
											<Grid 
												container 
												justify="space-between"
												spacing={2} 
											>
												<Grid item xs={12}>
														<TextField
																id="label"
																name="label"
																label="Letter Grade"
																required
																fullWidth
																variant="outlined"
																onChange={this.onHandleChange}
																value={this.state.label}
																error={!!this.state.labelError}
																helperText={this.state.labelError}
														/>
												</Grid>
												<Grid 
														item 
														xs={12} 
														style={{ 
																paddingBottom: 20, 
																paddingTop: 20, 
																display: 'flex' 
														}}
												>
											</Grid>
										</Grid>
									</Grid>
                </form>
                <BottomBar
                    left_button_text="View"
                    left_button_hide={false}
                    bottomLeftButtonAction={this.viewReport}
                    right_button_text="Save"
                    bottomRightButtonAction={this.clickOnFormSubmit}
                    loading={this.state.isLoading}
                    isDrawerOpen={ this.props.isDrawerOpen}
                />
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
export default withStyles(styles)(F207Form);