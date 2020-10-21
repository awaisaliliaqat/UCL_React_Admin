import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { numberFreeExp } from '../../../../utils/regularExpression';
import { TextField, Grid, Button, CircularProgress, Snackbar, Divider, Typography,
		MenuItem} from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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

class F208Form extends Component {

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
			snackbarSeverity:"",
			academicSessionIdMenuItems: [],
			academicSessionId: "",
			academicSessionIdError: "",
			fromDateMindTerm: [],
			fromDateMindTermError: "",
			toDateMindTerm: "",
			toDateMindTermError:"",
			fromDateFinalTerm: [],
			fromDateFinalTermError: "",
			toDateFinalTerm: "",
			toDateFinalTermError:""
    }
	}
	
	getTomorrowDate = () => {
    let a = new Date();
    a.setDate(a.getDate() + 1);
    return a;
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
		
		
		loadAcademicSession = async () => {
			this.setState({ isLoading: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C208CommonAcademicSessionsView`;
			await fetch(url, {
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
					(json) => {
						if (json.CODE === 1) {
							this.setState({ academicSessionIdMenuItems: json.DATA });
							for (var i = 0;	i < this.state.academicSessionIdMenuItems.length;	i++) {
								if (this.state.academicSessionIdMenuItems[i].isActive == "1") {
									this.state.academicSessionId = this.state.academicSessionIdMenuItems[i].ID;
								}
							}
						} else {
							this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
						}
						console.log("loadAcademicSession", json);
					},
					(error) => {
						if (error.status == 401) {
							this.setState({
								isLoginMenu: true,
								isReload: true,
							});
						} else {
							console.log(error);
							this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
						}
					}
				);
			this.setState({ isLoading: false });
		};

    loadData = async(index) => {
        const data = new FormData();
        data.append("id",index);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C208CommonAcademicsSessionsTermsView`;
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
            .then(json => {
              if (json.CODE === 1) {
								let data = json.DATA || [];
								let dataLength = data.length;
                if(dataLength){
									this.setState({academicSessionId: data[0].academicsSessionId});
									let termInfo = data[0].termInfo || [];
									let termInfoLength = termInfo.length;
									for(let i=0; i<termInfoLength; i++){
										if(termInfo[i].termId==1){
											this.setState({
												fromDateMindTerm: termInfo[i].fromDate,
												toDateMindTerm: termInfo[i].toDate,
											});
										}
										if(termInfo[i].termId==2){
											this.setState({
												fromDateFinalTerm: termInfo[i].fromDate,
												toDateFinalTerm: termInfo[i].toDate,
											});
										}
									}
              } else {
              	window.location = "#/dashboard/F208Form/0";
              }
            } else {
              //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
              this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
            }
              console.log("loadData", json);
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
		
		isAcademicSessionValid = () => {
			let isValid = true;
			if (!this.state.academicSessionId) {
				this.setState({
					academicSessionIdError: "Please select Academic Session.",
				});
				document.getElementById("academicSessionId").focus();
				isValid = false;
			} else {
				this.setState({ academicSessionIdError: "" });
			}
			return isValid;
		};

    isFromDateValid = () => {
			let isValid = true;
			if (!this.state.fromDate) {
				this.setState({ fromDateError: "Please select start date." });
				document.getElementById("fromDate").focus();
				isValid = false;
			} else {
				this.setState({ fromDateError: "" });
			}
			return isValid;
		};
	
		isDueDateValid = () => {
			let isValid = true;
			if (!this.state.dueDate) {
				this.setState({ dueDateError: "Please select due date." });
				document.getElementById("dueDate").focus();
				isValid = false;
			} else {
				this.setState({ dueDateError: "" });
			}
			return isValid;
		};

		handleChangeFromDateMindTerm = (date) => {
			this.setState({fromDateMindTerm: date});
		};
	
		handleChangeToDateMidTerm = (date) => {
			this.setState({toDateMindTerm: date});
		};

		handleChangeFromDateFinalTerm = (date) => {
			this.setState({fromDateFinalTerm: date});
		};
	
		handleChangeToDateFinalTerm = (date) => {
			this.setState({toDateFinalTerm: date});
		};

    onHandleChange = e => {
			const { name, value } = e.target;
			const errName = `${name}Error`;
			let regex = "";
			switch (name) {
					case "":
					break;
			default:
					break;
			}
			this.setState({
					[name]: value,
					[errName]: ""
			});
    }

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async(e) => {
        if(
						!this.isAcademicSessionValid() && false
						//|| !this.isshortLabelValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C208CommonAcademicsSessionsTermsSave`;
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
                                window.location="#/dashboard/F208Reports";
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
        window.location = "#/dashboard/F208Reports";
    }

    componentDidMount() {
			this.props.setDrawerOpen(false);
			this.loadAcademicSession();
			if(this.state.recordId!=0){
					this.loadData(this.state.recordId);
			}
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.recordId!=nextProps.match.params.recordId){
            if(nextProps.match.params.recordId!=0){
                this.props.setDrawerOpen(false);
                this.loadData(nextProps.match.params.recordId);
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
											Define Session Terms
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
												<Grid item xs={12} md={12}>
													<TextField
														id="academicSessionId"
														name="academicSessionId"
														variant="outlined"
														label="Academic Session"
														onChange={this.onHandleChange}
														value={this.state.academicSessionId}
														error={!!this.state.academicSessionIdError}
														helperText={this.state.academicSessionIdError}
														required
														fullWidth
														select
													>
														{this.state.academicSessionIdMenuItems.map((dt, i) => (
															<MenuItem
																key={"academicSessionIdMenuItems" + dt.ID}
																value={dt.ID}
															>
																{dt.Label}
															</MenuItem>
														))}
													</TextField>
												</Grid>
												<Grid item xs={12} md={4}>
													<Card style={{height:55}}>
														<CardContent>
															<Typography variant="button" color="primary">
																<center><b>1<small>st</small> Term</b></center>
															</Typography>
														</CardContent>
													</Card>
												</Grid>
												<TextField type="hidden" name="termId" defaultValue="1"/>
												<Grid item xs={12} md={4}>
													<DatePicker
														autoOk
														name="fromDate"
														id="fromDate"
														label="Start Date"
														invalidDateMessage=""
														//disablePast
														minDate="2020-01-01"
														placeholder=""
														variant="inline"
														inputVariant="outlined"
														format="dd-MM-yyyy"
														fullWidth
														required
														value={this.state.fromDateMindTerm}
														onChange={this.handleChangeFromDateMindTerm}
														error={!!this.state.fromDateMindTermError}
														helperText={this.state.fromDateMindTermError}
													/>
												</Grid>
												<Grid item xs={12} md={4}>
													<DatePicker
														autoOk
														name="toDate"
														id="toDate"
														label="End Date"
														invalidDateMessage=""
														//disablePast
														minDate="2020-01-01"
														placeholder=""
														variant="inline"
														inputVariant="outlined"
														format="dd-MM-yyyy"
														fullWidth
														required
														value={this.state.toDateMindTerm}
														onChange={this.handleChangeToDateMidTerm}
														error={!!this.state.toDateMindTermError}
														helperText={this.state.toDateMindTermError}
													/>
												</Grid>
												<Grid item xs={12} md={4}>
													<Card style={{height:55}}>
														<CardContent>
															<Typography variant="button" color="primary">
																<center><b>2<small>nd</small> Term</b></center>
															</Typography>
														</CardContent>
													</Card>
												</Grid>
												<TextField type="hidden" name="termId" defaultValue="2"/>
												<Grid item xs={12} md={4}>
													<DatePicker
														autoOk
														name="fromDate"
														id="fromDate"
														label="Start Date"
														invalidDateMessage=""
														//disablePast
														minDate="2020-01-01"
														placeholder=""
														variant="inline"
														inputVariant="outlined"
														format="dd-MM-yyyy"
														fullWidth
														required
														value={this.state.fromDateFinalTerm}
														onChange={this.handleChangeFromDateFinalTerm}
														error={!!this.state.preDateFinalTermError}
														helperText={this.state.fromDateFinalTermError}
													/>
												</Grid>
												<Grid item xs={12} md={4}>
													<DatePicker
														autoOk
														name="toDate"
														id="toDate"
														label="End Date"
														invalidDateMessage=""
														//disablePast
														minDate="2020-01-01"
														placeholder=""
														variant="inline"
														inputVariant="outlined"
														format="dd-MM-yyyy"
														fullWidth
														required
														value={this.state.toDateFinalTerm}
														onChange={this.handleChangeToDateFinalTerm}
														error={!!this.state.toDateFinalTermError}
														helperText={this.state.toDateFinalTermError}
													/>
												</Grid>
												<Grid item xs={12}>
													<br/>
													<br/>
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
export default withStyles(styles)(F208Form);