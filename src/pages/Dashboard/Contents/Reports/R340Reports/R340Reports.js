import React, { Component, Fragment } from "react";
import { Divider, IconButton, Tooltip, CircularProgress, Grid, Button, Typography, TextField, MenuItem, } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import ExcelIcon from "../../../../../assets/Images/excel.png";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import R340ReportsTableComponent from "./R340ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";

class R340Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			showSearchBar: false,
			isDownloadPdf: false,
			applicationStatusId: 1,
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			tableData: [],
			schoolsMenuItems: [],
			schoolId: "",
			schoolIdError: "",
			programmeGroupId: "",
			programmeGroupIdError: "",
			programmeGroupsMenuItems: [],
			programmeId: "",
			programmeIdError: "",
			programmeMenuItems: [],
			programId: "",
			programIdError: "",
			totalCourseStudent: "Total Students OF 0",
			totalPathwayStudent: "Total Students OF 0",
			totalGroupStudent: "Total Students OF 0",
			totalProgrammeStudent: "Total Students OF 0",
			totalSchoolStudent: "Total Students OF 0",
			coursesMenuItems: [],
			courseId: null,
			courseIdError: "",
			totalStudents: [],
			academicSessionMenuItems: [],
			academicSessionId: "",
			academicSessionIdError: "",
			pathwayMenuItems: [],
			pathwayId: "",
			pathwayIdError: "",

			fromDate: null,
			fromDateToSend: null,
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

	onHandleChangesDate = (event) => {
		const { name, value } = event.target;
		const date = new Date(value);
		const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
		if (name === "fromDate") {
			this.setState({ fromDateToSend: formattedDate });
		} else {
			this.setState({ toDateToSend: formattedDate, });
		}
		this.setState({ [name]: value, });
	};

	getProgramGroup = async () => {
		this.setState({ isLoading: true, programmeGroupsMenuItems: [] });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C340CommonProgrammeGroupsView`;
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
						this.setState({ programmeGroupsMenuItems: json.DATA || [] });
					} else {
						//alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
						this.handleOpenSnackbar(<span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error");
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
						this.handleOpenSnackbar(
							"Failed to fetch, Please try again later.",
							"error"
						);
						console.log(error);
					}
				}
			);
		this.setState({ isLoading: false });
	};
	loadAcademicSessions = async () => {
		this.setState({ isLoading: true });
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
			.then(
				(json) => {
					if (json.CODE === 1) {
						let array = json.DATA || [];
						let res = array.find((obj) => obj.isActive === 1);
						if (res) {
							this.setState({ academicSessionId: res.ID });
						}
						this.setState({ academicSessionMenuItems: array });
					} else {
						this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
					}
					console.log("loadAcademicSessions", json);
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar( "Failed to fetch ! Please try Again later.", "error" );
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getProgrammes = async (sessionId, programmeGroupId) => {
		if (sessionId && programmeGroupId) {
			this.setState({ isLoading: true, programmeMenuItems: [] });
			let data = new FormData();
			data.append("programmeGroupId", programmeGroupId);
			data.append("sessionId", sessionId);
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C340CommonProgrammesView`;
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
							this.setState({ programmeMenuItems: json.DATA || [] });
						} else {
							this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
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
							this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
							console.log(error);
						}
					}
				);
			this.setState({ isLoading: false });
		}
	};

	getCourse = async (sessionId, programmeGroupId) => {
		if (sessionId && programmeGroupId) {
			this.setState({ isLoading: true, coursesMenuItems: [] });
			let data = new FormData();
			data.append("programmeGroupId", programmeGroupId);
			data.append("sessionId", sessionId);
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C340CommonProgrammeCoursesView`;
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
							this.setState({ coursesMenuItems: json.DATA || [] });
						} else {
							this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
						}
					},
					(error) => {
						if (error.status === 401) {
							this.setState({
								isLoginMenu: true,
								isReload: true,
							});
						} else {
							this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
						}
					}
				);
			this.setState({ isLoading: false });
		}
	};

	loadPathway = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUolEnrollmentPathwayView`;
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
						this.setState({ pathwayMenuItems: json.DATA || [] });
					} else {
						this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
						console.log(error);
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C340CommonStudentGateAttendanceView?academicSessionId=${this.state.academicSessionId}&programmeGroupId=${this.state.programmeGroupId}&programmeId=${this.state.programmeId}&courseId=${this?.state?.courseId ? this.state.courseId.id : 0}&date=${this.state.fromDateToSend}`;
		await fetch(url, {
			method: "GET",
			// body: data,
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
						const sortedData = json.DATA[0].StudentsDetail.sort((a, b) => {
							const aHasCheckIn = Boolean(a.checkIn);
							const aHasCheckOut = Boolean(a.checkOut);
							const bHasCheckIn = Boolean(b.checkIn);
							const bHasCheckOut = Boolean(b.checkOut);
							const aStatus = aHasCheckIn && aHasCheckOut ? 0 : aHasCheckIn && !aHasCheckOut ? 1 : !aHasCheckIn && aHasCheckOut ? 2 : 3;
							const bStatus = bHasCheckIn && bHasCheckOut ? 0 : bHasCheckIn && !bHasCheckOut ? 1 : !bHasCheckIn && bHasCheckOut ? 2 : 3;
							return aStatus - bStatus;
						});
						this.setState({ tableData: sortedData || [] });
					} else {
						this.handleOpenSnackbar(<span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error");
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
						});
					} else {
						//alert('Failed to fetch, Please try again later.');
						this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	downloadPDFData = async () => {
		if (!this.isSectionValid()) {
			return;
		}
		if (this.state.isDownloadPdf === false) {
			let data = new FormData();
			data.append("programmeGroupId", this.state.programmeGroupId);
			data.append("programmeId", this.state.programmeId);
			data.append("academicSessionId", this.state.academicSessionId);
			if (this.state.courseId != null) {
				data.append("courseId", this.state.courseId.id);
			} else {
				data.append("courseId", "0");
			}
			data.append("pathwayId", this.state.pathwayId);
			this.setState({ isDownloadPdf: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C340CommonStudentsPdfDownload`;
			await fetch(url, {
				method: "POST",
				body: data,
				headers: new Headers({
					Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
				}),
			})
				.then((res) => {
					if (res.status === 200) {
						return res.blob();
					}
					return false;
				})
				.then(
					(json) => {
						if (json) {
							var csvURL = window.URL.createObjectURL(json);
							var tempLink = document.createElement("a");
							tempLink.setAttribute("download", `Students_List.xlsx`);
							tempLink.href = csvURL;
							tempLink.click();
							console.log("downloadPDFData:", json);
						}
					},
					(error) => {
						if (error.status === 401) {
							this.setState({
								isLoginMenu: true,
								isReload: false,
							});
						} else {
							this.handleOpenSnackbar(
								"Failed to download, Please try again later.",
								"error"
							);
							//alert('Failed to fetch, Please try again later.');
							console.log(error);
						}
					}
				);
			this.setState({
				isDownloadPdf: false,
			});
		}
	};

	handleSetUserId = (value) => {
		this.setState({
			courseId: value,
			courseIdError: "",
			tableData: [],
			totalCourseStudent: "Total Students OF 0",
			totalPathwayStudent: "Total Students OF 0",
			totalGroupStudent: "Total Students OF 0",
			totalProgrammeStudent: "Total Students OF 0",
			totalSchoolStudent: "Total Students OF 0",
		});
	};

	onClearAllData() {
		let activeSessionId = "";
		if (
			this.state.academicSessionMenuItems &&
			this.state.academicSessionMenuItems.length > 0
		) {
			let res = this.state.academicSessionMenuItems.find(
				(obj) => obj.isActive === 1
			);
			if (res.ID != null) {
				activeSessionId = res.ID;
			}
		}

		this.setState({
			totalCourseStudent: "Total Students OF 0",
			totalPathwayStudent: "Total Students OF 0",
			totalGroupStudent: "Total Students OF 0",
			totalProgrammeStudent: "Total Students OF 0",
			totalSchoolStudent: "Total Students OF 0",
			academicSessionId: activeSessionId,
			academicSessionIdError: "",
			pathwayId: "",
			pathwayIdError: "",
			schoolId: "",
			schoolIdError: "",
			programmeGroupId: "",
			programmeGroupIdError: "",
			programmeGroupsMenuItems: [],
			courseId: null,
			courseIdError: "",
			coursesMenuItems: [],
			programmeMenuItems: [],
			programmeId: "",
			programmeIdError: "",
			tableData: [],
		});
	}

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		switch (name) {
			case "academicSessionId":
				this.setState({
					totalCourseStudent: "Total Students OF 0",
					totalPathwayStudent: "Total Students OF 0",
					totalGroupStudent: "Total Students OF 0",
					totalProgrammeStudent: "Total Students OF 0",
					totalSchoolStudent: "Total Students OF 0",
					pathwayId: "",
					pathwayIdError: "",
					schoolId: "",
					schoolIdError: "",
					programmeGroupId: "",
					programmeGroupIdError: "",
					programmeGroupsMenuItems: [],
					courseId: null,
					courseIdError: "",
					coursesMenuItems: [],
					programmeMenuItems: [],
					programmeId: "",
					programmeIdError: "",
					tableData: [],
				});
				break;
			case "schoolId":
				this.setState({
					totalCourseStudent: "Total Students OF 0",
					totalPathwayStudent: "Total Students OF 0",
					totalGroupStudent: "Total Students OF 0",
					totalProgrammeStudent: "Total Students OF 0",
					totalSchoolStudent: "Total Students OF 0",
					programmeGroupId: "",
					programmeGroupIdError: "",
					courseId: null,
					courseIdError: "",
					coursesMenuItems: [],
					programmeMenuItems: [],
					programmeId: "",
					programmeIdError: "",
					tableData: [],
				});
				break;
			case "programmeGroupId":
				this.setState({
					totalCourseStudent: "Total Students OF 0",
					totalPathwayStudent: "Total Students OF 0",
					totalGroupStudent: "Total Students OF 0",
					totalProgrammeStudent: "Total Students OF 0",
					totalSchoolStudent: "Total Students OF 0",
					programmeGroupIdError: "",
					courseId: "",
					courseIdError: "",
					programmeId: "",
					programmeIdError: "",
					tableData: [],
				});
				this.getProgrammes(this.state.academicSessionId, value);
				this.getCourse(this.state.academicSessionId, value);
				break;
			case "programmeId":
				this.setState({
					tableData: [],
					totalCourseStudent: "Total Students OF 0",
					totalPathwayStudent: "Total Students OF 0",
					totalGroupStudent: "Total Students OF 0",
					totalProgrammeStudent: "Total Students OF 0",
					totalSchoolStudent: "Total Students OF 0",
				});
				break;
			case "courseId":
				this.setState({
					tableData: [],
					totalCourseStudent: "Total Students OF 0",
					totalPathwayStudent: "Total Students OF 0",
					totalGroupStudent: "Total Students OF 0",
					totalProgrammeStudent: "Total Students OF 0",
					totalSchoolStudent: "Total Students OF 0",
				});
				break;
			case "pathwayId":
				this.setState({
					tableData: [],
					totalCourseStudent: "Total Students OF 0",
					totalPathwayStudent: "Total Students OF 0",
					totalGroupStudent: "Total Students OF 0",
					totalProgrammeStudent: "Total Students OF 0",
					totalSchoolStudent: "Total Students OF 0",
				});
				break;
			default:
				break;
		}
		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	isSchoolValid = () => {
		let isValid = true;
		if (!this.state.schoolId) {
			this.setState({ schoolIdError: "Please select school." });
			document.getElementById("schoolId").focus();
			isValid = false;
		} else {
			this.setState({ schoolIdError: "" });
		}
		return isValid;
	};

	isSectionValid = () => {
		let isValid = true;
		if (!this.state.programmeGroupId) {
			this.setState({
				programmeGroupIdError: "Please select programme group.",
			});
			document.getElementById("programmeGroupId").focus();
			isValid = false;
		} else {
			this.setState({ programmeGroupIdError: "" });
		}
		return isValid;
	};

	isAssignmentValid = () => {
		let isValid = true;
		if (!this.state.programId) {
			this.setState({ programIdError: "Please select program." });
			document.getElementById("programId").focus();
			isValid = false;
		} else {
			this.setState({ programIdError: "" });
		}
		return isValid;
	};

	handleGetData = () => {
		if (
			//!this.isSchoolValid()
			!this.isSectionValid() 
			//|| !this.isAssignmentValid()
		) {
			return;
		}
		this.getData();
	};

	handleToggleTableFilter = () => {
		this.setState({ showTableFilter: !this.state.showTableFilter });
	};

	handleToggleSearchBar = () => {
		this.setState({ showSearchBar: !this.state.showSearchBar });
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.getProgramGroup();
		this.loadAcademicSessions();
		this.loadPathway();
	}

	render() {
		const columns = [
			{ name: "SRNo", title: "SR#" },
			{ name: "nucluesId", title: "NucleusID" },
			{ name: "studentName", title: "Student\xa0Name" },
			{ name: "checkIn", title: "Check-in Time" },
			{ name: "checkOut", title: "Check-out Time" },
			// { name: "schoolLabel", title: "School" },
			// { name: "programmeGroupLabel", title: "Program Group" },
			//{ name: "dateOfAdmission", title: "Date of Admission" },
			// { name: "statusLabel", title: "Status" }
		];

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<div style={{ padding: 20, }} >
					<div style={{ display: "flex", justifyContent: "space-between", }} >
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								textTransform: "capitalize",
							}}
							variant="h5"
						>
							Students Gate Attendance Report
						</Typography>
						<div style={{ float: "right" }}>
							<Tooltip title="Table Filter">
								<IconButton
									style={{ marginLeft: "-10px" }}
									onClick={this.handleToggleTableFilter}
								>
									<FilterIcon color="primary" />
								</IconButton>
							</Tooltip>
							{this.state.programmeGroupId ? (
								<Tooltip title="Export PDFD">
									{this.state.isDownloadPdf ? (
										<CircularProgress
											size={14}
											style={{ cursor: `${this.state.isDownloadPdf ? "wait" : "pointer"}`}}
										/>
									) : (
										<img
											alt=""
											src={ExcelIcon}
											onClick={() => this.downloadPDFData()}
											disabled={false}
											style={{
												height: 22,
												width: 22,
												marginBottom: -7,
												cursor: `${this.state.isDownloadPdf ? "wait" : "pointer"
													}`,
											}}
										/>
									)}
								</Tooltip>
							) : (
								""
							)}
						</div>
					</div>
					<Divider
						style={{
							backgroundColor: "rgb(58, 127, 187)",
							opacity: "0.3",
						}}
					/>
					<br />
					<Grid
						container
						justifyContent="flex-start"
						alignItems="flex-start"
						spacing={2}
					>
						<Grid item xs={12} md={4} lg={2}>
							<TextField
								id="academicSessionId"
								name="academicSessionId"
								variant="outlined"
								label="Academic Session"
								fullWidth
								select
								onChange={this.onHandleChange}
								value={this.state.academicSessionId}
								error={!!this.state.academicSessionIdError}
								helperText={this.state.academicSessionIdError}
								disabled={this.state.isLoading}
							>
								{this.state.academicSessionMenuItems &&
									this.state.academicSessionMenuItems.map((dt) => (
										<MenuItem
											key={"academicSessionMenuItems" + dt.ID}
											value={dt.ID}
										>
											{dt.Label}
										</MenuItem>
									))}
							</TextField>
						</Grid>
						<Grid item xs={12} md={4} lg={2}>
							<TextField
								id="programmeGroupId"
								name="programmeGroupId"
								variant="outlined"
								label="Program Group"
								fullWidth
								select
								onChange={this.onHandleChange}
								value={this.state.programmeGroupId}
								error={!!this.state.programmeGroupIdError}
								helperText={this.state.programmeGroupIdError}
								disabled={!this.state.academicSessionId || this.state.isLoading}
								required
							>
								{this.state.programmeGroupsMenuItems &&
									this.state.programmeGroupsMenuItems.map((dt) => (
										<MenuItem
											key={"programmeGroupsMenuItems" + dt.id}
											value={dt.id}
										>
											{dt.label}
										</MenuItem>
									))}
							</TextField>
						</Grid>
						<Grid item xs={12} md={4} lg={2}>
							<TextField
								id="programmeId"
								name="programmeId"
								variant="outlined"
								label="Programme "
								fullWidth
								select
								onChange={this.onHandleChange}
								value={this.state.programmeId}
								error={!!this.state.programmeIdError}
								helperText={this.state.programmeIdError}
								disabled={!this.state.programmeGroupId || this.state.isLoading}
							>
								{this.state.programmeMenuItems &&
									this.state.programmeMenuItems.map((dt) => (
										<MenuItem key={"programmeMenuItems" + dt.ID} value={dt.ID}>
											{dt.Label}
										</MenuItem>
									))}
							</TextField>
						</Grid>
						<Grid item xs={12} md={4} lg={2}>
							<Autocomplete
								fullWidth
								id="courseId"
								options={this.state.coursesMenuItems}
								value={this.state.courseId}
								onChange={(event, value) => this.handleSetUserId(value)}
								disabled={this.state.isEditMode || this.state.isLoading}
								loading={this.state.isLoading}
								getOptionLabel={(option) => option.label || ""}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="Course"
										placeholder="Search and Select"
										error={!!this.state.courseIdError}
										helperText={this.state.courseIdError}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4} lg={2}>
							<DatePicker
								autoOk
								id="fromDate"
								name="fromDate"
								label="Date"
								invalidDateMessage=""
								placeholder=""
								variant="inline"
								inputVariant="outlined"
								format="dd-MM-yyyy"
								fullWidth
								required
								value={this.state.fromDate}
								onChange={(date) =>
									this.onHandleChangesDate({
										target: { name: "fromDate", value: date },
									})
								}
							/>
						</Grid>
						<Grid item xs={12} md={2} lg={1}>
							<Button
								variant="contained"
								color="primary"
								disabled={
									this.state.isLoading ||
									!this.state.programmeGroupId ||
									!this.state.fromDate
								}
								onClick={() => this.handleGetData()}
								style={{ width: "100%", height: 54 }}
							>
								{this.state.isLoading ? (
									<CircularProgress style={{ color: "white" }} size={36} />
								) : (
									"Search"
								)}
							</Button>
						</Grid>
						<Grid item xs={12} md={2} lg={1}>
							<Button
								variant="contained"
								color="default"
								disabled={this.state.isLoading}
								onClick={() => this.onClearAllData()}
								style={{ width: "100%", height: 54 }}
							>
								Clear
							</Button>
						</Grid>
					</Grid>
					<br/>
					<Divider
						style={{
							backgroundColor: "rgb(58, 127, 187)",
							opacity: "0.3",
						}}
					/>
					{this.state.tableData && !this.state.isLoading ? (
						<R340ReportsTableComponent
							data={this.state.tableData}
							columns={columns}
							showFilter={this.state.showTableFilter}
						/>
					) : (
						<Grid container justifyContent="center">
							<Grid item xs={12} style={{ textAlign: "center" }}>
								<br />
								<CircularProgress disableShrink />
							</Grid>
						</Grid>
					)}
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={() => this.handleCloseSnackbar()}
					/>
				</div>
			</Fragment>
		);
	}
}
export default R340Reports;