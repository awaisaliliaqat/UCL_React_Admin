import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { DatePicker } from "@material-ui/pickers";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Divider, CircularProgress, Grid, Button, Typography, TextField, Tooltip, IconButton, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableHead, TableBody, TableRow, TableCell, InputLabel } from "@material-ui/core";
import FilterOutline from "mdi-material-ui/FilterOutline";
import F356FormTableComponent from "./chunks/F356FormTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBarWithViewColorBlue";
import { withRouter } from "react-router-dom";
import { format, parse } from "date-fns";

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
			isApprovedByHead: 0,
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			showTableFilter: false,
			isExisted: 1,
			yearId: "",
			yearData: [],
			academicSessionsData: [],
			academicSessionsDataLoading: false,
			academicSessionId: "",
			academicSessionIdError: "",
			openDialog: false,
			selectedStudent: null,
			programmeGroupsData: [],
			programmeGroupsDataLoading: false,
			programmeGroupId: "",
			attendanceSheetId: 0,
			programmeGroupIdError: "",
			expandedGroupsData: [],
			fromDate: null,
			toDate: null,
			employeesSalarySheet: [],
			isApproved: false,
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
			fromDate: parse(`01-07-${startYear}`, "dd-MM-yyyy", new Date()),
			toDate: parse(`30-06-${endYear}`, "dd-MM-yyyy", new Date())
		});
	};

	onSaveClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}

		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayroleAttendanceSave`;
		// var data = new FormData();
		const { employeesSalarySheet } = this.state;
		let array = [];
		const groupedData = employeesSalarySheet.map((acc) => {
			const courseDetail = {
				...acc,
			};

			array.push(courseDetail);
		});

		const data = {
			academicSessionId: this.state.academicSessionId,
			yearId: this.state.yearId,
			monthId: this.state.monthId.id,
			attendanceDetail: array,
		};

		await fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
				"Content-Type": "application/json",
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
						this.handleSnackbar(true, "Saved", "success");
					} else {
						this.handleSnackbar(
							true,
							<span>
								{json.SYSTEM_MESSAGE}
								<br />
								{json.USER_MESSAGE}
							</span>,
							"error"
						);
					}
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
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
		this.setState({ isLoading: false });
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

	onSearchClick = async (e) => {
		if (!IsEmpty(e)) {
			e.preventDefault();
		}
		let data = new FormData();
		data.append("academicSessionId", this.state.academicSessionId);
		data.append("fromDate", format(this.state.fromDate, "dd-MM-yyyy"));
		data.append("toDate", format(this.state.toDate, "dd-MM-yyyy"));
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356CommonEmployeesSalaryIncrementSheet/AllEmployeesWithOrWithoutSheetView`;
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
					const hasConfirmed = data.some(obj => obj.isConfirmed === 1 || obj.isFinalized);
					if(hasConfirmed){
						data.map(obj=>{
							obj.isConfirmed=1;
						});
					}
					this.setState({
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

		// this.getProgrammeGroupsBySessionId(sessionId);

		this.setState({
			academicSessionId: sessionId,
			academicSessionIdError: "",
			academicSessionsDataLoading: false,
			employeesSalarySheet: [],
		});
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		switch (name) {
			case "academicSessionId":
				this.setState({
					employeesSalarySheet: [],
					programmeGroupId: "",
					programmeGroupIdError: "",
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

	// Utility Method
	formatNumber = (num) => {
		return Number(parseFloat(num).toFixed(2)); // 2 decimal formatting
	};

	handleSave = async(rowData) => {
		//handleIsExistUpdate(rowData);
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
		data.append("comment", rowData.comment);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356CommonEmployeesSalaryIncrementSheet/Save`;
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

	handleGenrateView = () => {
		const { academicSessionId, fromDate, toDate } = this.state;
		window.open(`#/F356Reports/${academicSessionId+"/"+format(fromDate, "dd-MM-yyyy")+"/"+format(toDate, "dd-MM-yyyy")}`,"_blank");
	}

	componentDidMount() {
		const { recordId } = this.props.match.params;
		this.props.setDrawerOpen(false);
		this.getAcademicSessions();
		this.setState({ recordId: recordId }, () => {
			// this.onSearchClick();
		});
	}

	render() {
		const { classes } = this.props;

		const columns = [
			{ name: "rolesLabel", title: "Category" },
			{ name: "id", title: "ID" },
			{ name: "displayName", title: "Name"},
			{ name: "designationsLabel",	title: "Position",
				// getCellValue: (rowData) => {
				// 	return (
				// 		<TextField
				// 			variant="outlined"
				// 			size="small"
				// 			name="adjustedLateDays"
				// 			type="number"
				// 			value={rowData.adjustedLateDays || ""}
				// 			onChange={(event) =>
				// 				this.handleInputChange(
				// 					"adjustedLateDays",
				// 					event.target.value,
				// 					rowData
				// 				)
				// 			}
				// 		/>
				// 	);
				// },
			},
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
			{ name: "comment", title: "Comments on Salary Determination" }
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
					<Grid item xs={12} md={4}>
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
							onClick={(e) => this.onSearchClick(e)}
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
					<Grid item xs={12} style={{marginBottom: "30px"}}>
						<F356FormTableComponent
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
						leftButtonText=""
						leftButtonHide={true}
						bottomLeftButtonAction={() => this.handleOpenSnackbar("Feature under development", "info") }
						right_button_text="Genrate"
						disableLeftButton={this.state.isExisted === 1}
						disableRightButton={!this.state.academicSessionId}
						loading={this.state.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						bottomRightButtonAction={this.handleGenrateView}
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
