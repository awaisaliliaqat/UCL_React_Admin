import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { Box, IconButton, Typography, CircularProgress, Grid } from "@material-ui/core";
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
		minWidth: 700
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
		padding: "5px 0px"
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

class F356Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			documentData: [],
			data: {},
			isLoading: false,
			isLoginMenu: false,
			isReload: false,
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
				"Comments on Salary Determination", "Final Salary Next Year"
			],
			tableData: [],
			programmeLabel: "",
			studentLabel: "",
			uptoDate: "__/__/____",
			totalPOS: "_ _",
			totalAchieved: "_ _",
			totalPercentage: "_ _",
			resultClassification: "_ _ _",
			allStudentData: [],
			subjectName: "",
			subjectName: "",
			textAreaValue: "",
			academicSessionId: 0,
			programmeId: 0,
			sessionTermId: 0,
			studentId: 0,
			sessionTermLabel: "",
			anouncementDate: new Date(),
			anouncementDateError: "",
			alevelYear: "",
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

	getData = async (academicsSessionId, fromDate, toDate) => {
		this.setState({ isLoading: true });
		let data = new FormData();
		data.append("academicSessionId", academicsSessionId);
		data.append("fromDate", fromDate);
		data.append("toDate", toDate);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356CommonEmployeesSalaryIncrementSheet/View`;
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
							this.setState({tableData: data});
						}
					} else {
						//alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error");
					}
					console.log("getData", json);
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

	componentDidMount() {
		const { academicSessionId, fromDate, toDate } = this.props.match.params;
		this.setState({academicSessionId, fromDateLabel:fromDate, toDateLabel:toDate});
		this.getAcademicSessions();
		this.getData(academicSessionId, fromDate, toDate);
	}

	render() {

		const { classes } = this.props;
		
		return (
			<Fragment>
				 <LandscapePrintStyle />
				 <LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				{/* {this.state.isLoading && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress
								style={{ marginBottom: 10, color: "white" }}
								size={36}
							/>
							<span>Loading...</span>
						</div>
					</div>
				)} */}
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
									<span style={{ display: "inlineBlock" }}>
										<span
											style={{
												fontSize: "1em",
												fontWeight: 700,
												textAlign: "center",
												color: "#2f57a5",
												width: 200,
												padding: 5,
												border: "solid 2px #2f57a5",
												display: "block",
												float: "right",
												// marginRight: 56
											}}
										>
											Increment Sheet
											<br />
											Academic Year
											<br />
											{this.state.academicSessionLabel}
											<br />
											{this.state.fromDateLabel}&emsp;{this.state.toDateLabel}
										</span>
									</span>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={this.state.tableHeaderData.length}>
									<br />
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
																		<StyledTableRow key={"row" + index}>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.rolesLabel}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.id}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.displayName}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.designationsLabel}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.jobStatusLabel}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.joiningDate ? format(new Date(row.joiningDate), "dd-MM-yyyy") : ""}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.leavingDate ? format(new Date(row.leavingDate), "dd-MM-yyyy") : ""}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.rateThisYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.rateNextYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.rateIncreasePercentage} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.monthsThisYear}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.monthsNextYear}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.salaryThisYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.salaryNextYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.salaryIncreasePercentage} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.yearlyClaimThisYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.yearlyClaimNextYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.yearlySalaryThisYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.yearlySalaryNextYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.yearlyExpenseThisYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.yearlyExpenseNextYear} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.percentChange} /></StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center">{row.comment}</StyledTableCell>
																			<StyledTableCell key={"[" + index + "]"}  align="center"><CurrencyFormatter value={row.finalSalaryNextYear} /></StyledTableCell>
																		</StyledTableRow>
																	))}
																</Fragment>
															) : (
																<TableRow>
																	<StyledTableCell colSpan={this.state.tableHeaderData.length}>
																	{this.state.isLoading ?
																		<center><CircularProgress size={36} /></center>
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

F356Reports.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(F356Reports);
