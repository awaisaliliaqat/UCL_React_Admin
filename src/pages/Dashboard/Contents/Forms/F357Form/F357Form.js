import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { DatePicker } from "@material-ui/pickers";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Divider, CircularProgress, Grid, Button, Typography, TextField, Tooltip, IconButton, MenuItem, Box } from "@material-ui/core";
import FilterOutline from "mdi-material-ui/FilterOutline";
import F357FormTableComponent from "./chunks/F357FormTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBarWithViewColorBlue";
import { withRouter } from "react-router-dom";
import { format, parse } from "date-fns";
import F357ChatBox from "./chunks/F357ChatBox"

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

class F357Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			recordId: null,
			isApprovedByHead: 0,
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			showTableFilter: false,
			yearId: "",
			yearData: [],
			academicSessionsData: [],
			academicSessionsDataLoading: false,
			academicSessionId: "",
			academicSessionIdError: "",
			openDialog: false,
			selectedStudent: null,
			attendanceSheetId: 0,
			fromDate: null,
			toDate: null,
			rateIncreasePercentageCriteria : "",
			salaryIncreasePercentageCriteria : "",
			yearlyClaimWeeksCriteria : "",
			isEditableCriteria : "",
			employeesSalarySheet: [],
			sheetStatusData: [],
			sheetStatusId: "",
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

	handleToggleTableFilter = () => {
		this.setState((prevState)=>({ ...prevState, showTableFilter: !prevState.showTableFilter }));
	}
	
	setDatesFromAcademicSession = (academicSessionsLabel) => {
		if (!academicSessionsLabel || !academicSessionsLabel.includes("-")) return;
		const [startYear, endYear] = academicSessionsLabel.split("-");
		if (!startYear || !endYear) return;
		this.setState({
			fromDate: parse(`01-09-${startYear}`, "dd-MM-yyyy", new Date()),
			toDate: parse(`31-08-${endYear}`, "dd-MM-yyyy", new Date())
		});
	};

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
							this.getCriteria(sessionId);
						}
					}
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
					console.error("getAcademicSessions Error : ", error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error");
				}
			}
		);
		this.setState({ academicSessionsDataLoading: false });
	};

	getCriteria = async (academicSessionId) => {
		let data = new FormData();
		data.append("academicSessionId", academicSessionId);
		this.setState({ academicSessionsDataLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/CriteriaView`;
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
		.then((json) => {
				if (json.CODE === 1) {
					let array = json.DATA || [];
					if(array!=null && array.length>0){
						let obj = array[0];
						this.setState({
							rateIncreasePercentageCriteria : obj.rateIncreasePercentage,
							salaryIncreasePercentageCriteria : obj.salaryIncreasePercentage,
							yearlyClaimWeeksCriteria : obj.yearlyClaimWeeks,
							isEditableCriteria: obj.isEditable
						});
					} else {
						this.setState({
							rateIncreasePercentageCriteria : 8,
							salaryIncreasePercentageCriteria : 8,
							yearlyClaimWeeksCriteria : 30,
							isEditableCriteria: 1
						});
					}
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
					console.error("getCriteria Error : ", error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error");
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

	onSearchClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		let data = new FormData();
		data.append("academicSessionId", this.state.academicSessionId);
		data.append("fromDate", format(this.state.fromDate, "dd-MM-yyyy"));
		data.append("toDate", format(this.state.toDate, "dd-MM-yyyy"));
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/EmployeesView`;
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
					if(data.length>0){
						const statusId = data.find(obj=> obj.statusId!=null)?.statusId || "";
						this.setState({
							sheetStatusId : statusId,
							employeesSalarySheet: data,
						});
					}
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					console.error("onSearchClick Error : ", error);
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
			sheetStatusId: ""
		});
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		switch (name) {
			case "academicSessionId":
				this.setState({
					employeesSalarySheet: [],
					sheetStatusId: ""
				});
				let academicSessionLabel = this.state.academicSessionsData.find((obj)=>obj.ID==value)?.Label || "2024-2025";
				this.setDatesFromAcademicSession(academicSessionLabel);
				this.getCriteria(value);
				break;
			default:
				break;
		};
		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	handleInputChange = (fieldName, value, rowData) => {
		const { id } = rowData;
		const updatedData = this.state.employeesSalarySheet.map((item) =>
			item.id === id
				? {
					...item,
					[fieldName]: fieldName === "remarks" ? value : Number(value),
				}
				: item
		);
		this.setState({
			employeesSalarySheet: updatedData,
		});
	};

	handleCommitChanges = ({ added, changed, deleted }) => {
		let rows = [...this.state.employeesSalarySheet];
		if (added) {
		  const startingAddedId = rows.length ? rows[rows.length - 1].id + 1 : 0;
		  added.forEach((row, i) => {
			rows.push({ id: startingAddedId + i, ...row });
		  });
		}
		if (changed) {
			rows = rows.map(row => {
				if(changed[row.id]) {
					const updatedRow = { ...row, ...changed[row.id] };
					this.handleSave(updatedRow);
					//console.log(updatedRow);
					return updatedRow; 
				} 
				return row;
		  	});
			// this.handleOpenSnackbar("Saved", "success");
		}
		if (deleted) {
		  const deletedSet = new Set(deleted);
		  rows = rows.filter(row => !deletedSet.has(row.id));
		}
		this.setState({ employeesSalarySheet: rows });
	};

	handleSaveCriteria = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		let data = new FormData();
		data.append("academicSessionId", this.state.academicSessionId);
		data.append("fromDate", format(this.state.fromDate, "dd-MM-yyyy"));
		data.append("toDate", format(this.state.toDate, "dd-MM-yyyy"));
		data.append("rateIncreasePercentage", this.state.rateIncreasePercentageCriteria);
		data.append("salaryIncreasePercentage", this.state.salaryIncreasePercentageCriteria);
		data.append("yearlyClaimWeeks", this.state.yearlyClaimWeeksCriteria);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/CriteriaSave`;
		await fetch(url, {
			method: "POST",
			body: data,
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
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
					this.onSearchClick();
					//this.handleOpenSnackbar("Saved", "success");
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error" );
				}
			}
		);
	};

	handleSave = async(rowData) => {
		let data =  new FormData();
		data.append("id", 0);
		data.append("academicsSessionId", this.state.academicSessionId);
		data.append("employeeId", rowData.id);
		data.append("fromDate", format(this.state.fromDate,"dd-MM-yyyy"));
		data.append("toDate", format(this.state.toDate,"dd-MM-yyyy"));
		data.append("rateThisYear", rowData.rateThisYear);
		data.append("monthsThisYear", parseInt(rowData.monthsThisYear) || 0);
		data.append("monthsNextYear", parseInt(rowData.monthsNextYear) || 0);
		data.append("salaryThisYear", rowData.salaryThisYear);
		data.append("rateNextYear", rowData.rateNextYear);
		data.append("rateIncreasePercentage", rowData.rateIncreasePercentage);
		data.append("salaryNextYear", rowData.salaryNextYear);
		data.append("salaryIncreasePercentage", rowData.salaryIncreasePercentage);
		data.append("yearlyClaimNextYear", rowData.yearlyClaimNextYear);
		data.append("comment", " ");
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/Save`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}</span>,"success");
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					
				} else {
					console.error(error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
	}

	handleSaveAll = async () => {
		let employeesSalarySheet = [...this.state.employeesSalarySheet];
		let data = new FormData();
		data.append("id", 0);
		data.append("academicsSessionId", employeesSalarySheet[0].academicSessionId);
		data.append("fromDate", format(this.state.fromDate, "dd-MM-yyyy"));
		data.append("toDate", format(this.state.toDate, "dd-MM-yyyy"));
		employeesSalarySheet.forEach((rowData, index) => {
			data.append(`employeeId`, rowData.id);
			data.append(`rateThisYear`, rowData.rateThisYear);
			data.append(`monthsThisYear`, parseInt(rowData.monthsThisYear) || 0);
			data.append(`monthsNextYear`, parseInt(rowData.monthsNextYear) || 0);
			data.append(`salaryThisYear`, rowData.salaryThisYear);
			data.append(`rateNextYear`, rowData.rateNextYear);
			data.append(`rateIncreasePercentage`, rowData.rateIncreasePercentage);
			data.append(`salaryNextYear`, rowData.salaryNextYear);
			data.append(`salaryIncreasePercentage`, rowData.salaryIncreasePercentage);
			data.append(`yearlyClaimNextYear`, rowData.yearlyClaimNextYear);
			data.append(`comment`, " ");
		});
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/Save`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					this.handleOpenSnackbar(<span>{USER_MESSAGE}</span>,"success");
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					
				} else {
					console.error(error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		this.setState({ isLoading: false });
	};


	handleGenrateView = () => {
		const { academicSessionId, fromDate, toDate } = this.state;
		window.open(`#/F357Reports/${academicSessionId+"/"+format(fromDate, "dd-MM-yyyy")+"/"+format(toDate, "dd-MM-yyyy")}`,"_blank");
	}

	componentDidMount() {
		const { recordId } = this.props.match.params;
		this.props.setDrawerOpen(false);
		this.getAcademicSessions();
		this.getSheetStatusView();
		this.setState({ recordId: recordId }, () => {
			// this.onSearchClick();
		});
	}

	render() {

		const { classes } = this.props;

		const sheetStatusLabel = this.state.sheetStatusData.find( (obj) => obj.id === this.state.sheetStatusId )?.label ?? ". . .";

		const columns = [
			{ name: "rolesLabel", title: "Category" },
			{ name: "id", title: "ID" },
			{ name: "displayName", title: "Name"},
			{ name: "entitiesLabel", title: "Entities"},
			{ name: "designationsLabel",	title: "Position"},
			{ name: "jobStatusLabel",	title: "Employment Status"},
			{ name: "joiningDate", title: "Joining Date",
				getCellValue: (rowData) => {
					return (format(new Date(rowData.joiningDate), "dd-MM-yyyy"));
				},
			},
			{ name: "leavingDate", title: "Leaving Date",
				getCellValue: (rowData) => {
					return (rowData.leavingDate ? format(new Date(rowData.leavingDate), "dd-MM-yyyy") : "");
				},
			 },
			{ name: "weeklyLoadThisYear", title: "Weekly Load This Year" },
			{ name: "weeklyLoadNextYear", title: "Weekly Load Next Year"},
			{ name: "weeklyClaimHoursThisYear", title: "Weekly Claim Hours This Year" },
			{ name: "weeklyClaimHoursNextYear", title: "Weekly Claim Hours Next Year"},
			{ name: "rateThisYear",	title: "Rate This Year"},
			{ name: "rateNextYear", title: "Rate Next Year"},
			{ name: "rateIncreasePercentage", title: "Rate Increase%"},
			{ name: "monthsThisYear", title: "Months This Year"},
			{ name: "monthsNextYear",	title: "Months Next Year"},
			{ name: "salaryThisYear", title: "Salary This Year" },
			{ name: "salaryNextYear", title: "Salary Next Year" },
			{ name: "salaryIncreasePercentage", title: "Salary Increase%" },
			{ name: "yearlyClaimThisYear", title: "Yearly Claim This Year" },
			{ name: "yearlyClaimNextYear", title: "Yearly Claim Next Year" },
			{ name: "yearlySalaryThisYear", title: "Yearly Salary This Year" },
			{ name: "yearlySalaryNextYear", title: "Yearly Salary Next Year" },
			{ name: "yearlyExpenseThisYear", title: "Yearly Expense This Year" },
			{ name: "yearlyExpenseNextYear", title: "Yearly Expense Next Year" },
			{ name: "percentChange", title: "Percent Change" },
			{ name: "suggestedRateNextYear", title: "Suggested Rate Next Year"},
			{ name: "suggestedSalaryNextYear", title: "Suggested Salary Next Year"},
			{ name: "comments", title: "Comments on Salary Determination",
				getCellValue: (rowData) => {
					const stableChat = Array.isArray(rowData.comments) ? rowData.comments : [];
					return (
						<F357ChatBox
							salaryIncrementRevisionSheetId={rowData.salaryIncrementRevisionSheetId}
							salaryIncrementRevisionSheetEmployeesId={rowData.salaryIncrementRevisionSheetEmployeesId}
							employeeId={rowData.id}
							statusId={rowData.statusId}
							value={stableChat}
							onChange={(updatedList) => {
								const updatedData = this.state.employeesSalarySheet.map( item =>
									item.id === rowData.id ? { ...item, comments: updatedList } : item
								);
								this.setState({ employeesSalarySheet: updatedData });
							}}
						/>
					);
				}
			},
		];

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<Grid container justifyContent="center" alignItems="center" spacing={2} className={classes.main}>
					<Grid item xs={12}>
						<Typography className={classes.title} variant="h5">
							Employees Salary Increment Sheet
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
					<Grid item xs={12} md={3}>
						<TextField
							name="academicSessionId"
							label="Academic Session"
							variant="outlined"
							onChange={this.onHandleChange}
							value={this.state.academicSessionId}
							error={!!this.state.academicSessionIdError}
							helperText={this.state.academicSessionIdError}
							required
							fullWidth
							select
						>
							{this.state.academicSessionsData?.map((item) => (
								<MenuItem key={"academicSessionsData"+item.ID} value={item.ID}>
									{item.Label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={6} md={2}>
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
					<Grid item xs={6} md={2}>
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
					<Grid item xs={4} md={1}>
						<TextField
							id="rateIncreasePercentageCriteria"
							name="rateIncreasePercentageCriteria"
							label="Rate Inc %"
							type="number"
							placeholder=""
							variant="outlined"
							fullWidth
							required
							value={this.state.rateIncreasePercentageCriteria}
							onChange={this.onHandleChange}
							disabled={!this.state.isEditableCriteria}
						/>
					</Grid>
					<Grid item xs={4} md={1}>
						<TextField
							id="salaryIncreasePercentageCriteria"
							name="salaryIncreasePercentageCriteria"
							label="Salary Inc %"
							type="number"
							placeholder=""
							variant="outlined"
							fullWidth
							required
							value={this.state.salaryIncreasePercentageCriteria}
							onChange={this.onHandleChange}
							disabled={!this.state.isEditableCriteria}
						/>
					</Grid>
					<Grid item xs={4} md={1}>
						<TextField
							id="yearlyClaimWeeksCriteria"
							name="yearlyClaimWeeksCriteria"
							label="Claim Months"
							type="number"
							placeholder=""
							variant="outlined"
							fullWidth
							required
							value={this.state.yearlyClaimWeeksCriteria}
							onChange={this.onHandleChange}
							disabled={!this.state.isEditableCriteria}
						/>
					</Grid>
					<Grid item xs={6} md={1}>
						<Button
							variant="contained"
							color="primary"
							className={classes.button}
							disabled={ this.state.isLoading || this.state.academicSessionsDataLoading || !this.state.academicSessionId}
							//onClick={(e) => this.onSearchClick(e)}
							onClick={(e) => this.handleSaveCriteria(e)}
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
								this.state.academicSessionsDataLoading 
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
					<Grid item xs={12} style={{marginBottom: "30px"}}>
						<F357FormTableComponent
							isLoading={this.state.isLoading}
							showTableFilter={this.state.showTableFilter}
							columns={columns}
							rows={this.state.employeesSalarySheet}
							onCommitChanges={this.handleCommitChanges}
						/>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
					<BottomBar
						leftButtonText="Save All"
						leftButtonHide={false}
						bottomLeftButtonAction={this.handleSaveAll}
						disableLeftButton={this.state.isLoading || !this.state.employeesSalarySheet.length || (this.state.sheetStatusId!=="" && this.state.sheetStatusId!==1 && this.state.sheetStatusId!==5)}
						otherActions={<Box color="info.main">Status: {sheetStatusLabel}&emsp;</Box>}
						right_button_text="Genrate"
						disableRightButton={!this.state.academicSessionId}
						bottomRightButtonAction={this.handleGenrateView}
						loading={this.state.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
					/>
				</Grid>
			</Fragment>
		);
	}
}

F357Form.propTypes = {
	classes: PropTypes.object,
	setDrawerOpen: PropTypes.func,
};

F357Form.defaultProps = {
	classes: {},
	setDrawerOpen: (fn) => fn,
};

export default withRouter(withStyles(styles)(F357Form));