import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";
import { Divider, CircularProgress, Grid, Button, Typography, TextField, MenuItem, IconButton, Box, } from "@material-ui/core";
import F353FormTableComponent from "./chunks/F353FormTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import DeleteIcon from "@material-ui/icons/Delete";
import { isBefore, addDays, startOfDay, toDate, parse, format, differenceInDays, isAfter, isEqual } from 'date-fns';
import { from } from "seamless-immutable";

const styles = () => ({
	mainContainer: {
		padding: 20,
	},
	titleContainer: {
		display: "flex",
		justifyContent: "space-between",
	},
	title: {
		color: "#1d5f98",
		fontWeight: 600,
		textTransform: "capitalize",
	},
	divider: { backgroundColor: "rgb(58, 127, 187)", opacity: "0.3" },
	actions: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "100%",
	},
	button: {
		textTransform: "capitalize",
		fontSize: 14,
		height: 45,
	},
});

class F353Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: {
				isLoading : false,
				leaveTypes: false
			},
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "info",
			leaveTypeMenuItems : [],
			leaveTypeId: "",
			leaveTypeIdError: "",
			fromDate: null,
			fromDateError: "",
			toDate: null,
			toDateError: "",
			noOfDays: 0,
			employeeLeavesData: [],
			employeeLeavePlanData: [],
			appliedLeaveDataPlan: [],
			recordIndex : 0
		};
	}

	handleOpenSnackbar = (msg, severity) => {
		this.setState({
			isOpenSnackbar: true,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};

	loadLeaveTypes = async() => {
		this.setState(prevState => ({ isLoading: { ...prevState.isLoading, leaveTypes:true } }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C353CommonEmployeesLeaves/CommonLeaveTypesView`;
		await fetch(url, {
				method: "POST",
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
						if(json.DATA.length){
								this.setState({
										leaveTypeMenuItems: json.DATA
								});
						} else {
								window.location = "#/dashboard/F353Form";
						}
				} else {
						//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
						this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
				}
				console.log("loadLeaveTypes:", json);
		},
		error => {
				if (error.status == 401) {
						this.setState({
								isLoginMenu: true,
								isReload: true
						})
				} else {
						console.log(error);
						// alert("Failed to Save ! Please try Again later.");
						this.handleOpenSnackbar("Failed to Fetch ! Please try Again later.","error");
				}
		});
		this.setState(prevState => ({ isLoading: { ...prevState.isLoading, leaveTypes: false } }));
}

loadLeavePlans = async() => {
	this.setState(prevState => ({ isLoading: { ...prevState.isLoading, leaveTypes:true } }));
	const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C353CommonEmployeesLeaves/UserLeavePlanView`;
	await fetch(url, {
			method: "POST",
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
					if(json.DATA.length){
							this.setState({
								employeeLeavePlanData: json.DATA
							});
					}
			} else {
					//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
					this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
			}
			console.log("loadLeavePlans:", json);
	},
	error => {
			if (error.status == 401) {
					this.setState({
							isLoginMenu: true,
							isReload: true
					})
			} else {
					console.log(error);
					// alert("Failed to Save ! Please try Again later.");
					this.handleOpenSnackbar("Failed to Fetch ! Please try Again later.","error");
			}
	});
	this.setState(prevState => ({ isLoading: { ...prevState.isLoading, leaveTypes: false } }));
}

clickOnFormSubmit=()=>{
	this.onFormSubmit();
}

onFormSubmit = async(e) => {
	//e.preventDefault();
	if(
			// !this.islabelValid() || 
			// !this.isDateValid() ||
			// !this.isEmployeeValid()
			false
	){ return; }
	let myForm = document.getElementById('myForm');
	const data = new FormData(myForm);
	this.setState({isLoading: true});
	const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C353CommonEmployeesLeaves/Save`;
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
								// if(this.state.recordId!=0){
								//     window.location="#/dashboard/F353Reports";
								// } else {
										window.location.reload();
								//}
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

	handleSnackbar = (open, msg, severity) => {
		this.setState({
			isOpenSnackbar: open,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};

	viewReport = () => {
		window.location = "#/dashboard/F353Reports";
	};

	islabelValid = () => {
		let isValid = true;
		if (!this.state.leaveTypeId) {
			this.setState({leaveTypeIdError:"Please select Leave Type."});
			document.getElementById("leaveTypeId").focus();
			isValid = false;
		} else {
			this.setState({leaveTypeIdError:""});
		}
		return isValid;
	}

	isDateValid = () => {
		let isValid = true;

		const { fromDate, toDate, employeeLeavesData } = this.state;

		if (isAfter(startOfDay(fromDate), startOfDay(toDate))) {
			this.setState({toDateError:"The ToDate should be later & equal than the FromDate."});
			document.getElementById("toDate").focus();
			isValid = false;
		} 
		
		if(isValid){
			// Check for overlapping dates
			const isOverlapping = employeeLeavesData.some((leave) => {
				const leaveFromDate = parse(leave.fromDate, "dd-MM-yyyy", new Date());
				const leaveToDate = parse(leave.toDate, "dd-MM-yyyy", new Date());
				return (isEqual(fromDate, leaveFromDate) || isEqual(fromDate, leaveToDate)) || 
					(isEqual(toDate, leaveFromDate) || isEqual(toDate, leaveToDate)) || 
					(isBefore(fromDate, leaveToDate) && isAfter(toDate, leaveFromDate)) || 
					(isBefore(fromDate, leaveToDate) && isAfter(fromDate, leaveFromDate)) ||
					(isBefore(toDate, leaveToDate) && isAfter(toDate, leaveFromDate));
			});

			if (isOverlapping) {
				this.handleOpenSnackbar("The selected dates overlap with existing leave dates.", "error");
				isValid = false;
			}
		}
		
		if(isValid) {
			this.setState({
				fromDateError: "",
				toDateError: ""
			});
		}

		return isValid;
	}

	onHandleChange = (event) => {
		const { name, value } = event.target;
		const errName = `${name}Error`;
		switch (name) {
			case "leaveTypeId":
				if(value!=1){
					this.setState({
						fromDate: startOfDay(new Date()),
						fromDateError: "",
						toDate: startOfDay(new Date()),
						toDateError: "",
						noOfDays: Math.abs(differenceInDays(startOfDay(new Date()), startOfDay(new Date()))) + 1,
					});
					this.setState({appliedLeaveDataPlan : [{startOnDate: parse('2024-09-01', 'yyyy-MM-dd', new Date()), endOnDate: parse('2025-08-31', 'yyyy-MM-dd', new Date())}] });
				} else {
					let employeeLeavePlanData = this.state.employeeLeavePlanData;
					this.setState({
						fromDate: startOfDay(new Date(employeeLeavePlanData[0]?.startOnDate)),
						fromDateError: "",
						toDate: startOfDay(new Date(employeeLeavePlanData[0]?.endOnDate)),
						toDateError: "",
						noOfDays: Math.abs(differenceInDays(employeeLeavePlanData[0]?.startOnDate, employeeLeavePlanData[0]?.endOnDate)) + 1
					});
					this.setState({appliedLeaveDataPlan : employeeLeavePlanData});
				}
			break;
		 case "fromDate":
				this.setState({
					toDateError: "",
					noOfDays: Math.abs(differenceInDays(startOfDay(this.state.toDate), startOfDay(value)))+1 
				});
			break;
			case "toDate":
				this.setState({
					fromDateError: "",
					noOfDays: Math.abs(differenceInDays(startOfDay(value) , startOfDay(this.state.fromDate)))+1 
				});
			break;
			default:
		}
		this.setState({
			[name]: value,
			[errName]: ""
		});
	};

	handleAdd = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		if(
			!this.islabelValid() || 
			!this.isDateValid() 
		){ return; }

		this.setState(prevState => ({ isLoading: { ...prevState.isLoading, isLoading:true } }));     
		
		let leaveTypeLabel = this.state.leaveTypeMenuItems.find(d => d.id === this.state.leaveTypeId)?.label;

		const obj = {
			recordIndex: this.state.recordIndex,
			leaveTypeId: this.state.leaveTypeId,
			leaveTypeLabel: leaveTypeLabel || "",
			fromDate: format(this.state.fromDate, "dd-MM-yyyy"),
			toDate: format(this.state.toDate, "dd-MM-yyyy"),
			noOfDays: this.state.noOfDays
		};
		this.setState(prevState => ({
			recordIndex: (prevState.recordIndex + 1),
			leaveTypeId: "",
			fromDate: startOfDay(new Date()),
			toDate: startOfDay(new Date()),
			noOfDays: Math.abs(differenceInDays(startOfDay(new Date()), startOfDay(new Date()))) + 1,
			isLoading: { ...prevState.isLoading, isLoading: false },
			employeeLeavesData: [...prevState.employeeLeavesData, obj], 
		}));
	};

	handleDelete = (rowData) => {
		const filterData = this.state.employeeLeavesData.filter(
			(item) => item.recordIndex !== rowData.recordIndex
		);

		this.setState({
			employeeLeavesData: [...filterData],
		});
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadLeaveTypes();
		this.loadLeavePlans();
	}

	render() {

		const { classes } = this.props;

		const columns = [
			{ name: "leaveTypeLabel", title: "Leave Type", 
				getCellValue: (rowData) => {   
					return (
						<>
							<Box>{rowData.leaveTypeLabel}</Box>
							<TextField type="hidden" value={rowData.leaveTypeId} name="leaveTypeId"/>
						</>
					)}
			},
			{ name: "fromDate", title: "From Date", 
				getCellValue: (rowData) => {  
					return (
						<>
							<Box>{rowData.fromDate}</Box>
							<TextField type="hidden" value={rowData.fromDate} name="fromDate"/>
						</>
					)}
			},
			{ name: "toDate", title: "To Date", 
				getCellValue: (rowData) => {  
					return (
						<>
							<Box>{rowData.toDate}</Box>
							<TextField type="hidden" value={rowData.toDate} name="toDate"/>
						</>
					)}
			},
			{ name: "noOfDays", title: "Days", 
				getCellValue: (rowData) => {  
					return (
						<>
							<Box>{rowData.noOfDays}</Box>
							<TextField type="hidden" value={rowData.noOfDays} name="noOfDays"/>
						</>
					)}
			},
			{
				name: "action", title: "Action",
				getCellValue: (rowData) => {
					return (
						<IconButton 
							color="secondary"
							aria-label="delete" 
							className={classes.margin} 
							onClick={() => this.handleDelete(rowData)}
						>
							<DeleteIcon />
						</IconButton>
					);
				},
			},
		];

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<div className={classes.mainContainer}>
					<div className={classes.titleContainer}>
						<Typography className={classes.title} variant="h5">
							{"Employee Leave Form"}
							<br />
						</Typography>
					</div>
					<Divider className={classes.divider} />
					<br />
					<Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
						<Grid item xs={12} sm={12} md={5}>
							<TextField
									name="leaveTypeId"
									label="Leave Type"
									required
									fullWidth
									variant="outlined"
									select
									onChange={this.onHandleChange}
									value={this.state.leaveTypeId}
									error={!!this.state.leaveTypeIdError}
									helperText={this.state.leaveTypeIdError}
									SelectProps={{
											id : "leaveTypeId",
											style: {paddingRight:0},
											endAdornment: (
													<>
														{this.state.isLoading?.leaveTypes ? (
															<CircularProgress color="inherit" size={20} style={{marginRight:36, height:"inherit"}}/>
														) : null}
													</>
											)
									}}
									
							>
									<MenuItem value="" disabled><em>None</em></MenuItem>
									{this.state.leaveTypeMenuItems?.map((d, i) => 
											<MenuItem key={"leaveTypeMenuItems"+d.id} value={d.id}>{d.label}</MenuItem>
									)}
								</TextField>
							</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<DatePicker
								autoOk
								id="fromDate"
								name="fromDate"
								label="From Date"
								invalidDateMessage=""
								placeholder=""
								inputVariant="outlined"
								format="dd-MM-yyyy"
								minDate={parse('2024-09-01', 'yyyy-MM-dd', new Date())}
								maxDate={parse('2025-08-31', 'yyyy-MM-dd', new Date())}
								fullWidth
								required
								value={this.state.fromDate}
								onChange={(date) =>
									this.onHandleChange({
										target: { name: "fromDate", value: date },
									})
								}
								shouldDisableDate={(date) => {
									// const allowedRanges = [
									//   { start: new Date('2024-09-01'), end: new Date('2024-09-15') },
									//   { start: new Date('2025-01-10'), end: new Date('2025-01-20') },
									//   { start: new Date('2025-06-01'), end: new Date('2025-06-30') }
									// ];
									// return !allowedRanges.some((range) => date >= range.start && date <= range.end);
									return !this.state.appliedLeaveDataPlan.some((range) => date >= range.startOnDate && date <= range.endOnDate);
								}}
								error={!!this.state.fromDateError}
								helperText={this.state.fromDateError}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<DatePicker
								autoOk
								id="toDate"
								name="toDate"
								label="To Date"
								invalidDateMessage=""
								placeholder=""
								inputVariant="outlined"
								format="dd-MM-yyyy"
								minDate={parse('2024-09-01', 'yyyy-MM-dd', new Date())}
								maxDate={parse('2025-08-31', 'yyyy-MM-dd', new Date())}
								fullWidth
								required
								value={this.state.toDate}
								onChange={(date) =>
									this.onHandleChange({
										target: { name: "toDate", value: date },
									})
								}
								shouldDisableDate={(date) => {
									return !this.state.appliedLeaveDataPlan.some((range) => date >= range.startOnDate && date <= range.endOnDate);
								}}
								error={!!this.state.toDateError}
								helperText={this.state.toDateError}
							/>
						</Grid>
						<Grid item xs={12} sm={10} md={2}>
							<TextField
								id="noOfDays"
								name="noOfDays"
								label="No of Days"
								placeholder=""
								variant="outlined"
								fullWidth
								required
								readOnly
								value={this.state.noOfDays}
								//onChange={this.onHandleChange}
								error={!!this.state.noOfDaysError}
								helperText={this.state.noOfDaysError}
								autoComplete="false"
							/>
						</Grid>
						<Grid item xs={12} sm={2} md={1}>
							<div className={classes.actions}>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									disabled = {!this?.state?.leaveTypeId || !this?.state?.fromDate || !this?.state?.toDate}
									onClick={(e) => this.handleAdd(e)}
									style={{padding:"1.7rem"}}
									fullWidth
								>
									{" "}
									{this.state.isLoading?.isLoading ? (
										<CircularProgress style={{ color: "white" }} size={24} />
									) : (
										"Add"
									)}
								</Button>
							</div>
						</Grid>
						<Grid item xs={12}>
							<Divider className={classes.divider} />
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<form id="myForm">
						<F353FormTableComponent
							columns={columns}
							rows={this.state.employeeLeavesData || []}
						/>
						</form>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={() => this.handleSnackbar(false, "", this.state.snackbarSeverity)}
					/>
					<BottomBar
						// leftButtonHide
						leftButtonText="View"
						leftButtonHide={false}
						bottomLeftButtonAction={this.viewReport}
						right_button_text="Save"
						disableRightButton={this.state.employeeLeavesData.length === 0}
						loading={this.state.isLoading?.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						bottomRightButtonAction={() => { this.clickOnFormSubmit(); }}
					/>
				</div>
			</Fragment>
		);
	}
}

F353Form.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F353Form.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F353Form);
