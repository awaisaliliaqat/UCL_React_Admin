import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { Box, IconButton, Typography, CircularProgress, Grid, Button } from "@material-ui/core";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@material-ui/core";
import { format, parse } from "date-fns";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";

const LandscapePrintStyle = () => (
	<style>
	  {`
		@media print {
		  @page {
			size: landscape;
		  }
		  body {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		  }
		}
	  `}
	</style>
  );

const styles = (theme) => ({
	mainDiv: {
		margin: "50px 10px 0px 10px",
		// "@media print": {
		//   minWidth: "7.5in",
		//   maxWidth: "11in",
		// },
	},
	approveButton: {
		top: theme.spacing(1),
		left: theme.spacing(2),
		zIndex: 1,
		position: "fixed",
		"@media print": {
			display: "none",
		},
	},
	closeButton: {
		top: theme.spacing(1),
		right: theme.spacing(2),
		zIndex: 1,
		border: "1px solid #ff4040",
		borderRadius: 5,
		position: "fixed",
		padding: 3,
		"@media print": {
			display: "none",
		},
	},
	bottomSpace: {
		marginBottom: 40,
		"@media print": {
			display: "none",
		},
	},
	bottomBar: {
		//marginBottom: 40,
		"@media print": {
			visibility: "hidden"
		},
	},
	overlay: {
		display: "flex",
		justifyContent: "start",
		flexDirection: "column",
		alignItems: "center",
		position: "fixed",
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.2)",
		zIndex: 2,
		marginTop: -10
	},
	overlayContent: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center",
		color: "white",
		fontSize: 48,
		margin: "auto"
	},
	title: {
		fontSize: 36,
		fontWeight: "bolder",
		fontFamily: "sans-serif",
		color: "#2f57a5",
		letterSpacing: 1,
		marginLeft: 10
	},
	subTitle: {
		fontSize: 22,
		fontWeight: 600,
		color: "#2f57a5",
	},
	subTitle2: {
		fontSize: 16,
		fontWeight: 600,
		color: "#2f57a5"
	},
	flexColumn: {
		display: "flex",
		flexDirection: "column",
	},
	table: {
		minWidth: 700,
	},
});

const StyledTableCell = withStyles((theme) => ({
	head: {
		//backgroundColor: "rgb(189 214 228)",//"rgb(47, 87, 165)", //theme.palette.common.black,
		color: theme.palette.common.black,
		fontWeight: 800,
		border: "1px solid rgb(47, 87, 165)",
		fontSize: 13,
		padding: ".25rem",

		height: 150, // Give it some height to display vertical text properly
		writingMode: "vertical-rl", // Vertical text direction
		transform: "rotate(180deg)", // Ensures top-to-bottom, not bottom-to-top
		// whiteSpace: "nowrap",
		textAlign: "left",
		// verticalAlign: "bottom",
	},
	body: {
		fontSize: 13,
		border: "1px solid rgb(29, 95, 152)",
		padding: "5px 3px"
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

const CurrencyFormatter = ({ value }) => typeof value === "number" ? value.toLocaleString("en-US", {maxFractionDigits: 2}) : value;

class F357Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			academicSessionsData: [],
			academicSessionId: "",
			academicSessionLabel: "____-____",
			fromDateLabel: "",
			toDateLabel: "",
			tableHeaderData: [
				"Category","ID","Name","Position","Employment Status","Joining Date",
				"Leaving Date","Rate This Year","Rate Next Year","Rate Increase%","Months This Year",
				"Months Next Year","Salary This Year","Salary Next Year","Salary Increase%",
				"Yearly Claim This Year","Yearly Claim Next Year","Yearly Salary This Year",
				"Yearly Salary Next Year","Yearly Expense This Year","Yearly Expense Next Year","Percent Change",
				"Comments on Salary Determination", "Suggested Rate Next Year", "Suggested Salary Next Year"
			],
			tableData: [],
			academicSessionId: 0,
			sheetStatusData : [],
			sheetStatusId: ""
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
						//if (array[i].isActive == "1") {
						if (array[i].ID == this.state.academicSessionId) {
							this.setState({ academicSessionLabel:  array[i].Label });
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

	getData = async (academicsSessionId, fromDate, toDate) => {
		this.setState({ isLoading: true });
		let data = new FormData();
		data.append("academicSessionId", academicsSessionId);
		data.append("fromDate", fromDate);
		data.append("toDate", toDate);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/View`;
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
					if (json.CODE === 1) {
						let data = json.DATA || [];
						let dataLength = data.length;
						if (dataLength) {
							this.setState({
								tableData: data,
								sheetStatusId: data[0].statusId
							});
						}
					} else {
						//alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error");
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						//alert('Failed to fetch, Please try again later.');
						this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
						console.log(error);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	handleSheetStatusUpdate = async(statusId) => {
		let data =  new FormData();
		const tableData = this.state.tableData;
		data.append("id", parseInt(tableData.at(-1).salaryIncrementRevisionSheetId) || 0);
		data.append("statusId", statusId);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357SalaryIncrementRevisionSheet/UpdateStatus`;
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
					this.setState({sheetStatusId: statusId});
					const updatedData = this.state.tableData.map(item => ({ ...item, statusId: statusId }));
					this.setState({ tableData: updatedData });
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

	handleSendForApproval = () => {
		this.handleSheetStatusUpdate(2);
	}

	handleConfirmAndApproved = () => {
		this.handleSheetStatusUpdate(4);
	}

	componentDidMount() {
		const { academicSessionId, fromDate, toDate } = this.props.match.params;
		this.setState({academicSessionId, fromDateLabel:fromDate, toDateLabel:toDate});
		this.getAcademicSessions();
		this.getSheetStatusView();
		this.getData(academicSessionId, fromDate, toDate);
	}

	render() {

		const { classes } = this.props;

		const sheetStatusLabel = this.state.sheetStatusData.find( (obj) => obj.id === this.state.sheetStatusId )?.label ?? ". . .";
		
		return (
			<Fragment>
				 <LandscapePrintStyle />
				 <LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<div style={{display:"flex"}}>
				<Button
					variant="contained"
					color="primary"
					className={classes.approveButton}
					disabled={!this.state.tableData.length || (this.state.sheetStatusId!=1 && this.state.sheetStatusId!=5)}
					onClick={this.handleSendForApproval}
				>
					{ this.state?.sheetStatusId!==5 ? " Send For Approval " : "Resend for Approval"}
				</Button>
				<Button
					variant="contained"
					color="primary"
					className={classes.approveButton}
					disabled={!this.state.tableData.length || this.state.sheetStatusId!==3}
					onClick={this.handleConfirmAndApproved}
					style={{left:"15em"}}
				>
					Execute BOD Approved Sheet
				</Button>
				</div>
				<IconButton
					onClick={() => window.close()}
					aria-label="close"
					className={classes.closeButton}
				>
					<CloseIcon color="secondary" />
				</IconButton>
				<div className={classes.mainDiv}>
					<table style={{ width: "100%" }}>
						<thead>
							<tr>
								<th>
									<Box 
										color="primary.main" 
										display="flex" 
										justifyContent="space-between" 
										alignItems="flex-end"
									>
										<span>
											Academic Year : {this.state.academicSessionLabel}
										</span>
										<span>
											Employees Increment Sheet
											<br/>
											<small>Status&nbsp;:&ensp;{sheetStatusLabel}</small>
										</span>
										<span>
											Date : {this.state.fromDateLabel} - {this.state.toDateLabel}
										</span>
									</Box>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={this.state.tableHeaderData.length}>
									<Paper className={classes.root}>
										<div className={classes.tableWrapper}>
											<Table size="small" className={classes.table} stickyHeader aria-label={"customized table"}>
												<TableHead>
													<TableRow>
														{this.state.tableHeaderData &&
															this.state.tableHeaderData.map((data, index) =>
																<StyledTableCell key={data + index} style={{ width: "unset" }} align="center" >{data}</StyledTableCell>
															)
														}
													</TableRow>
												</TableHead>
													<TableBody>
														<Fragment>
															{this.state.tableData.length > 0 ? (
																<Fragment>
																	{this.state.tableData.map((row, index) => (
																		<StyledTableRow key={"tableData-"+index}>
																			<StyledTableCell align="center">{row.rolesLabel}</StyledTableCell>
																			<StyledTableCell align="center">{row.id}</StyledTableCell>
																			<StyledTableCell align="center">{row.displayName}</StyledTableCell>
																			<StyledTableCell align="center">{row.designationsLabel}</StyledTableCell>
																			<StyledTableCell align="center">{row.jobStatusLabel}</StyledTableCell>
																			<StyledTableCell align="center">{row.joiningDate ? format(new Date(row.joiningDate), "dd-MM-yyyy") : ""}</StyledTableCell>
																			<StyledTableCell align="center">{row.leavingDate ? format(new Date(row.leavingDate), "dd-MM-yyyy") : ""}</StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.rateThisYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.rateNextYear} /></StyledTableCell>
																			<StyledTableCell align="center"><CurrencyFormatter value={row.rateIncreasePercentage} /></StyledTableCell>
																			<StyledTableCell align="center">{row.monthsThisYear}</StyledTableCell>
																			<StyledTableCell align="center">{row.monthsNextYear}</StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.salaryThisYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.salaryNextYear} /></StyledTableCell>
																			<StyledTableCell align="center"><CurrencyFormatter value={row.salaryIncreasePercentage} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.yearlyClaimThisYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.yearlyClaimNextYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.yearlySalaryThisYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.yearlySalaryNextYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.yearlyExpenseThisYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.yearlyExpenseNextYear} /></StyledTableCell>
																			<StyledTableCell align="center"><CurrencyFormatter value={row.percentChange} /></StyledTableCell>
																			<StyledTableCell align="left">{(row.comments || [])?.map((obj, ind) => <span key={"comment-"+ind}>{obj.comment}<br/></span>)}</StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.suggestedRateNextYear} /></StyledTableCell>
																			<StyledTableCell align="right"><CurrencyFormatter value={row.suggestedSalaryNextYear} /></StyledTableCell>
																		</StyledTableRow>
																	))}
																</Fragment>
															) : (
																<TableRow>
																	<StyledTableCell colSpan={this.state.tableHeaderData.length}>
																	{this.state.isLoading ?
																		<center><CircularProgress size={37} /></center>
																		:
																		<Box color="primary.main" fontSize={18} textAlign="center" fontWeight="bold">No Data</Box>
																	}
																	</StyledTableCell>
																</TableRow>
															)}
														</Fragment>
													</TableBody>
											</Table>
										</div>
									</Paper>									
								</td>
								<td className={classes.bottomSpace}></td>
							</tr>
						</tbody>
					</table>
				</div>
				<CustomizedSnackbar
					isOpen={this.state.isOpenSnackbar}
					message={this.state.snackbarMessage}
					severity={this.state.snackbarSeverity}
					handleCloseSnackbar={this.handleCloseSnackbar}
				/>
			</Fragment>
		);
	}
}

F357Reports.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(F357Reports);
