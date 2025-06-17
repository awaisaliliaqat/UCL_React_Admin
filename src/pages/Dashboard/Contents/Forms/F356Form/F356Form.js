import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { DatePicker } from "@material-ui/pickers";
import { FilterOutline } from "mdi-material-ui";
import { format, parse } from "date-fns";
import { Divider, CircularProgress, Grid, Button, Typography, TextField,  MenuItem, Tooltip, IconButton, Box } from "@material-ui/core";
import F356FormTableComponent from "./chunks/F356FormTableComponent";
import FullScreenDialog from "./chunks/F356FormDialog";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBarWithViewColorBlue";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = (theme) => ({
	main: {
		padding: theme.spacing(2)
	},
	title: {
		color: "#1d5f98",
		fontWeight: 600,
		textTransform: "capitalize",
	},
	divider: { 
		backgroundColor: "rgb(58, 127, 187)", opacity: "0.3" 
	},
	button: {
		textTransform: "capitalize",
		padding: 14
	}
});

class F356Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			recordId: null,
			showTableFilter: false,

			isLoginMenu: false,
			isReload: false,

			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			isExisted: 1,

			yearId: "",
			yearData: [],
			academicSessionsData: [],
			academicSessionsDataLoading: false,
			academicSessionId: "",
			academicSessionIdError: "",

			openDialog: false,
			dialogRowData : null,

			fromDate: null,
			toDate: null,
			sheetStatusData: [],
			employeesSalarySheet: [],
			sheetStatusId: 0,
		};
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
		this.setState({ isOpenSnackbar: false });
	};

	handleOpenDialog = (rowData) => {
		this.setState((preState) => 
			({
				openDialog: true,
				dialogRowData: rowData
			})
		)
	}

	handleCloseDialog = () => {
		this.setState((preState) => 
			({
				openDialog: false,
				dialogRowData: null
			})
		)
	}

	handleToggleTableFilter = () => {
		this.setState({ showTableFilter: !this.state.showTableFilter });
	};
	
	setDatesFromAcademicSession = (academicSessionsLabel) => {
		if (!academicSessionsLabel || !academicSessionsLabel.includes("-")) return;
		const [startYear, endYear] = academicSessionsLabel.split("-");
		if (!startYear || !endYear) return;
		this.setState({
			fromDate: parse(`01-09-${startYear}`, "dd-MM-yyyy", new Date()),
			toDate: parse(`31-08-${endYear}`, "dd-MM-yyyy", new Date())
		});
	};

	// onSaveClick = async (e) => {
	// 	if (!IsEmpty(e)) {
	// 		e.preventDefault();
	// 	}

	// 	this.setState({ isLoading: true });
	// 	const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayroleAttendanceSave`;
	// 	// var data = new FormData();
	// 	const { employeesSalarySheet } = this.state;
	// 	let array = [];
	// 	const groupedData = employeesSalarySheet.map((acc) => {
	// 		const courseDetail = {
	// 			...acc,
	// 		};

	// 		array.push(courseDetail);
	// 	});

	// 	const data = {
	// 		academicSessionId: this.state.academicSessionId,
	// 		yearId: this.state.yearId,
	// 		monthId: this.state.monthId.id,
	// 		attendanceDetail: array,
	// 	};

	// 	console.log(data);

	// 	await fetch(url, {
	// 		method: "POST",
	// 		body: JSON.stringify(data),
	// 		headers: new Headers({
	// 			Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
	// 			"Content-Type": "application/json",
	// 		}),
	// 	})
	// 		.then((res) => {
	// 			if (!res.ok) {
	// 				throw res;
	// 			}
	// 			return res.json();
	// 		})
	// 		.then(
	// 			(json) => {
	// 				if (json.CODE === 1) {
	// 					this.handleSearch();
	// 					this.handleSnackbar(true, "Saved", "success");
	// 				} else {
	// 					this.handleSnackbar(
	// 						true,
	// 						<span>
	// 							{json.SYSTEM_MESSAGE}
	// 							<br />
	// 							{json.USER_MESSAGE}
	// 						</span>,
	// 						"error"
	// 					);
	// 				}
	// 			},
	// 			(error) => {
	// 				if (error.status == 401) {
	// 					this.setState({
	// 						isLoginMenu: true,
	// 						isReload: false,
	// 					});
	// 				} else {
	// 					this.handleSnackbar(
	// 						true,
	// 						"Failed to fetch ! Please try Again later.",
	// 						"error"
	// 					);
	// 				}
	// 			}
	// 		);
	// 	this.setState({ isLoading: false });
	// };

	getAcademicSessions = async () => {
		this.setState({ academicSessionsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonAcademicSessionsView`;
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
		.then((json) => {
				if (json.CODE === 1) {
					let array = json.DATA || [];
					this.setState({ academicSessionsData: array });
					let arrayLength = array.length;
					for (let i = 0; i < arrayLength; i++) {
						if (array[i].isActive == "1") {
							const sessionId = array[i].ID;
							this.setState({ academicSessionId: sessionId });
							this.setDatesFromAcademicSession(array[i].Label);
						}
					}
				} else {
					this.handleSnackbar( true, <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleSnackbar(
						true,
						"Failed to fetch ! Please try Again later.",
						"error"
					);
				}
			}
		);
		this.setState({ academicSessionsDataLoading: false });
	};

	getSheetStatusView = async () => {
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/SheetStatusView`;
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
		.then((json) => {
				if (json.CODE === 1) {
					let array = json.DATA || [];
					this.setState({ sheetStatusData: array });
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					console.error(error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error");
				}
			}
		);
	};

	handleSearch = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		this.setState({ isLoading: true });
		let data = new FormData();
		data.append("academicSessionId", this.state.academicSessionId);
		data.append("fromDate", format(this.state.fromDate, "dd-MM-yyyy"));
		data.append("toDate", format(this.state.fromDate, "dd-MM-yyyy"));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/EmployeesView`;
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
		.then(
			(json) => {
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					const sheetStatusId = data.find((obj) => obj.sheetStatusId!=0)?.sheetStatusId || 0;
					this.setState({
						sheetStatusId: sheetStatusId,
						employeesSalarySheet: data,
					});
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					console.error(error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		this.setState({ isLoading: false });
	};

	handleSnackbar = (open, msg, severity) => {
		this.setState({
			isOpenSnackbar: open,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};
	viewReport = () => {
		window.location = "#/dashboard/F322Reports";
	};

	onClearAllData = () => {
		let sessionId = "";
		let array = this.state.academicSessionsData || [];
		let arrayLength = array.length;
		for (let i = 0; i < arrayLength; i++) {
			if (array[i].isActive == "1") {
				sessionId = array[i].ID || "";
			}
		}
		this.setState({
			academicSessionId: sessionId,
			academicSessionIdError: "",
			academicSessionsDataLoading: false,
			employeesSalarySheet: [],
			sheetStatusId: 0
		});
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		switch (name) {
			case "academicSessionId":
				this.setState({
					employeesSalarySheet: []
				});
				let academicSessionLabel = this.state.academicSessionsData.find((obj)=>obj.ID==value)?.Label || "2024-2025";
				this.setDatesFromAcademicSession(academicSessionLabel);
				break;
			default:
				break;
		};
		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	handleIsExistUpdate = (rowData) => {
		this.handleOpenSnackbar("Saved", "success");
		const { id } = rowData;
		let employeesSalarySheet = [...this.state.employeesSalarySheet];
		const updatedData = employeesSalarySheet.map((item) =>
			item.id === id ? { ...item, isExist: 1 } : { ...item }
		);
		this.setState({
			employeesSalarySheet: updatedData,
		});
		this.handleCloseDialog();
	};

	componentDidMount() {
		const { recordId } = this.props.match.params;
		this.props.setDrawerOpen(false);
		this.getAcademicSessions();
		this.getSheetStatusView();
	}

	render() {

		const { classes } = this.props;

		const sheetStatusLabel = this.state.sheetStatusData.find( (obj) => obj.id === this.state.sheetStatusId )?.label ?? ". . .";

		const columns = [
			{ name: "id", title: "ID" },
			{ name: "displayName", title: "Name"},
			{ name: "rolesLabel", title: "Roles"},
			{ name: "entitiesLabel", title: "Entities"},
			{ name: "mobileNo", title: "Contact#"},
			{ name: "email", title: "Email"},
			{ name: "action", title: "Action", 
				getCellValue: (rowData) => {
					return (
						<center>
						<Button 
							color="primary"
							variant="outlined"
							size="small"
							onClick={() => this.handleOpenDialog(rowData)}
						>
						{rowData?.isExist ?	"Edit" : "Add"}
						</Button>
						</center>
					);
				}
			}
		];

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<FullScreenDialog 
					handleOpenSnackbar={this.handleOpenSnackbar}
					openDialog={this.state.openDialog}
					handleOpenDialog={this.handleOpenDialog}
					handleCloseDialog={this.handleCloseDialog}
					academicsSessionId={this.state.academicSessionId}
					fromDate={this.state.fromDate}
					toDate={this.state.toDate}
					rowData={this.state.dialogRowData}
					handleIsExistUpdate={this.handleIsExistUpdate}
				/>
				<Grid container justifyContent="center" alignItems="center" spacing={2} className={classes.main}>
					<Grid item xs={12}>
						<Typography className={classes.title} variant="h5">
							Employees Salary Increment Revision Sheet
							<div style={{ display:"inline-block", float:"right", marginTop: -8 }}>
								<Tooltip title="Table Filter">
									<IconButton
										size="small"
										style={{ marginTop: 8 }}
										onClick={() => this.handleToggleTableFilter()}
									>
										<FilterOutline color="primary" />
									</IconButton>
								</Tooltip>
							</div>
						</Typography>
						<Divider className={classes.divider} />
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							
							name="academicSessionId"
							label="Academic Session"
							onChange={this.onHandleChange}
							value={this.state.academicSessionId}
							error={!!this.state.academicSessionIdError}
							helperText={this.state.academicSessionIdError}
							variant="outlined"
							required
							fullWidth
							select
							InputProps={{
								id:"academicSessionId"
							}}
						>
							{this.state.academicSessionsData?.map((item) => (
								<MenuItem key={"academicSessionsData-"+item.ID} value={item.ID}>
									{item.Label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={6} md={3}>
						<DatePicker
							autoOk
							id="fromDate"
							name="fromDate"
							label="From Date"
							invalidDateMessage=""
							disabled={Object.keys(this.state.yearId).length === 0}
							placeholder=""
							variant="inline"
							inputVariant="outlined"
							format="dd-MM-yyyy"
							fullWidth
							required
							value={this.state.fromDate}
							onChange={(date) =>
								this.onHandleChangeDate({
									target: { name: "fromDate", value: date },
								})
							}
						/>
					</Grid>
					<Grid item xs={6} md={3}>
						<DatePicker
							autoOk
							id="toDate"
							name="toDate"
							label="To Date"
							invalidDateMessage=""
							disabled={Object.keys(this.state.yearId).length === 0}
							placeholder=""
							variant="inline"
							inputVariant="outlined"
							format="dd-MM-yyyy"
							fullWidth
							required
							// disabled={!this.state.fromDate}
							value={this.state.toDate}
							onChange={(date) =>
								this.onHandleChangeDate({
									target: { name: "toDate", value: date },
								})
							}
						/>
					</Grid>
					<Grid item xs={6} md={1}>
						<Button
							variant="contained"
							color="primary"
							className={classes.button}
							disabled={ this.state.isLoading || this.state.academicSessionsDataLoading || !this.state.academicSessionId}
							onClick={(e) => this.handleSearch(e)}
							fullWidth
							size="large"
						>
							{" "}
							{this.state.isLoading ? (
								<CircularProgress style={{ color: "white" }} size={24} />
							) : (
								"Search"
							)}
						</Button>
					</Grid>
					<Grid item xs={6} md={1}>
						<Button
							variant="outlined"
							className={classes.button}
							disabled={
								this.state.isLoading ||
								this.state.academicSessionsDataLoading ||
								this.state.programmeGroupsDataLoading
							}
							onClick={() => this.onClearAllData()}
							fullWidth
							size="large"
						>
							Clear
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Divider className={classes.divider} />
					</Grid>
					<Grid item xs={12} style={{marginBottom: "6%"}}>
						<F356FormTableComponent
							showFilter={this.state.showTableFilter}
							isLoading={this.state.isLoading}
							columns={columns}
							rows={this.state.employeesSalarySheet}
						/>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
					<BottomBar
						leftButtonText="Save"
						leftButtonHide={true}
						bottomLeftButtonAction={() => this.handleOpenSnackbar("Feature under development", "info") }
						right_button_text="Save"
						disableLeftButton={true}
						otherActions={<Box color="info.main">Status&nbsp;:&ensp;{sheetStatusLabel}</Box>}
						hideRightButton={true}
						disableRightButton={true}
						loading={this.state.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						bottomRightButtonAction={() => this.handleOpenSnackbar("Feature under development", "info")}
					/>
				</Grid>
			</Fragment>
		);
	}
}

F356Form.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F356Form.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};
export default withRouter(withStyles(styles)(F356Form));
