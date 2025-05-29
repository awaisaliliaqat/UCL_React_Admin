import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, CircularProgress, Grid, InputAdornment, IconButton, Button, } from "@material-ui/core";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

const styles = (theme) => ({
  	main: {
    	padding: `0px ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
	},
	table: {
		minWidth: 750,
	}
});

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
		color: theme.palette.common.white,
		fontWeight: 500,
		border: "1px solid white",
	},
	body: {
		fontSize: 14,
		border: "1px solid rgb(29, 95, 152)",
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);


class R46Reports extends Component {
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
			academicSessionMenuItems:[],
			academicSessionId: "",
			academicSessionIdError: "",
			programGroupsMenuItems: [],
			programGroupId: "",
			programGroupIdError: "",
			searchTerm:"",
			searchTermError: "",
			effectiveDatesItems: [],
			effectiveDatesMenuItems:[],
			effectiveDatesId: "",
			effectiveDatesIdError: "",
			timetableData: [],
			filterdTimetableData: [],
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

	loadAcademicSessions = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C10CommonAcademicSessionsView`;
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
                let res = array.find( (obj) => obj.isActive === 1 );
                if(res){
                  this.setState({academicSessionId:res.ID});
                }
                this.setState({ academicSessionMenuItems: array });
              } else {
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
            },
            (error) => {
              if (error.status == 401) {
                this.setState({
                  isLoginMenu: true,
                  isReload: false,
                });
              } else {
                console.log(error);
                this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
              }
            }
        );
    	this.setState({ isLoading: false });
    };

	getprogramGroups = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C47CommonSessionOfferedProgrammeGroupsView`;
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
					this.setState({ programGroupsMenuItems: json.DATA || [] });
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				if (error.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
					console.log(error);
				}
			}
		);
		this.setState({ isLoading: false });
	};

	getEffectiveDates = async (programGroupId) => {
		this.setState({ isLoading: true });
		let data = new FormData();
		data.append("academicSessionId", this.state.academicSessionId);
		data.append("programmeGroupId", programGroupId);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C47CommonProgrammesGroupTimeTableEffectiveDatesView`;
		await fetch(url, {
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
			}),
			method: "POST",
			body: data
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
					this.setState({ effectiveDatesMenuItems: json.DATA || [] });
					this.setState({ effectiveDatesItems: json.DATA || [] });
				} else {
					this.handleOpenSnackbar( <span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				if (error.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
					console.log(error);
				}
			}
		);
		this.setState({ isLoading: false });
	};

	getData = async (programGroupId, effectiveDate) => {
		this.setState({ isLoading: true });
		let data = new FormData();
		data.append("academicSessionId", this.state.academicSessionId);
		data.append("programmeGroupId", programGroupId);
		data.append("effectiveDate", effectiveDate);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C47CommonProgrammesGroupTimeTableView`;
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
					this.setState({ timetableData: [] });
					if (json.CODE === 1) {
						let data = json.DATA || [];
						this.setState({ 
							timetableData: data,
							filterdTimetableData: data 
						});
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
					}
				},
				(error) => {
					this.setState({ timetableData: [] });
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

	handleSetProgrammeGroup = (value) => {
		if (value) {
			this.getEffectiveDates(value.Id);
			this.getData(value.Id, "01-01-1970");
		} else {
			this.setState({ timetableData: [] });
		}
		this.setState({
			programGroupId: value,
			programGroupIdError: "",
		});
	};

	handleFilterData = () => {
		let searchTerm = this.state.searchTerm.trim();
		let data = this.state.timetableData || [];
		if(searchTerm.length>0){
			let filteredData = data.map(slot => {
				const newSlot = { time: slot.time };
				for (const day in slot) {
					if (day === "time") continue;
					const entries = slot[day]
						.split(",")
						.filter(entry => entry.includes(searchTerm))
						.join(",");
					newSlot[day] = entries;
				}
				return newSlot;
			});
			if(filteredData.length>0){
				this.setState({filterdTimetableData: filteredData });
			} else {
				this.setState({filterdTimetableData: data });
			}
		} else {
			this.setState({
				searchTermError: "Please enter some text",
				filterdTimetableData: data 
			});
		}
	}

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		let regex = "";
		switch (name) {
			case "academicSessionId":
				this.setState({
					programGroupId: "",
					timetableData:[]
				});
			break;
			case "effectiveDates":
				this.setState({
					effectiveDatesId: value,
					[errName]: "",
				});
				this.getData(this.state.programGroupId.Id, value);
			break;
			case "searchTerm":
				if(value!=null && value.trim().length===0){
					this.setState({filterdTimetableData: this.state.timetableData});
				}
			break;
			default:
			break;
		}
		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	isCourseValid = () => {
		let isValid = true;
		if (!this.state.programGroupId) {
			this.setState({ programGroupIdError: "Please select course." });
			document.getElementById("programGroupId").focus();
			isValid = false;
		} else {
			this.setState({ programGroupIdError: "" });
		}
		return isValid;
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadAcademicSessions();
		this.getprogramGroups();
	}

	render() {

		const { classes } = this.props;

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<Grid
					container
					justifyContent="center"
					alignItems="center"
					spacing={2}
					className={classes.main}
				>
					<Grid item xs={12}>
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								textTransform: "capitalize",
							}}
							variant="h5"
						>
							Program Group Timetable
						</Typography>
						<Divider
							style={{
								backgroundColor: "rgb(58, 127, 187)",
								opacity: "0.3",
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
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
						{this.state.academicSessionMenuItems.map((dt) => (
							<MenuItem key={"academicSessionsData"+dt.ID} value={dt.ID}>{dt.Label}</MenuItem>
						))}
						</TextField>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Autocomplete
							fullWidth
							id="programGroupId"
							options={this.state.programGroupsMenuItems}
							value={this.state.programGroupId}
							onChange={(event, value) => this.handleSetProgrammeGroup(value)}
							getOptionLabel={(option) =>
								typeof option.Label === "string" ? option.Label : ""
							}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="outlined"
									label="Program Group"
									placeholder="Search and Select"
									error={!!this.state.programGroupIdError}
									helperText={this.state.programGroupIdError}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							id="effectiveDates"
							name="effectiveDates"
							variant="outlined"
							label="Effective Dates"
							onChange={this.onHandleChange}
							value={this.state.effectiveDatesId}
							error={!!this.state.effectiveDatesIdError}
							helperText={this.state.effectiveDatesIdError}
							required
							fullWidth
							select
						>
							{this.state.effectiveDatesMenuItems && !this.state.isLoading ? (
								this.state.effectiveDatesItems.map((dt, i) => (
									<MenuItem
										key={"effectiveDatesMenuItems" + dt.id}
										value={dt.label}
									>
										{dt.label}
									</MenuItem>
								))
							) : (
								<Grid container justifyContent="center">
									<CircularProgress />
								</Grid>
							)}
						</TextField>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							id="searchTerm"
							name="searchTerm"
							variant="outlined"
							label="Search"
							onChange={this.onHandleChange}
							value={this.state.searchTerm}
							error={!!this.state.searchTermError}
							helperText={this.state.searchTermError}
							fullWidth
							InputProps={{
								endAdornment :
									<InputAdornment position="end">
										<Button
											variant="contained"
											color="primary"
											aria-label="toggle password visibility"
											onClick={()=>this.handleFilterData()}
											edge="end"
											style={{minWidth:40, padding:"16px 8px", marginRight:"-13px"}}
											disabled={this.state.timetableData.length==0 || this.state.searchTerm.length==0}
										>
											<SearchOutlinedIcon />
										</Button>
									</InputAdornment>
							}}
						/>
					</Grid>
					<Grid item xs={12}>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="customized table">
							<TableHead>
								<TableRow>
									<StyledTableCell
										style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}
									>
										&nbsp;
									</StyledTableCell>
									<StyledTableCell align="center">Monday</StyledTableCell>
									<StyledTableCell align="center">Tuesday</StyledTableCell>
									<StyledTableCell align="center">Wednesday</StyledTableCell>
									<StyledTableCell align="center">Thursday</StyledTableCell>
									<StyledTableCell align="center">Friday</StyledTableCell>
									<StyledTableCell align="center">Saturday</StyledTableCell>
									<StyledTableCell
										align="center"
										style={{ borderRight: "1px solid rgb(29, 95, 152)" }}
									>
										Sunday
									</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{ //this.state.timetableData.length > 0 ? (
								this.state.filterdTimetableData.length > 0 ? (
									this.state.filterdTimetableData.map((row, index) => (
										<StyledTableRow key={row + index}>
											<StyledTableCell component="th" scope="row">
												{row.time.split("-").map((dt, i) => (
													<Fragment key={"time" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
															</Fragment>
														) : (
															""
														)}
														<span style={{ whiteSpace: "nowrap" }}>{dt}</span>
													</Fragment>
												))}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.Monday.split(",").map((dt, i) => (
													<Fragment key={"Monday" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
																<br />
															</Fragment>
														) : (
															""
														)}
														{dt}
													</Fragment>
												))}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.Tuesday.split(",").map((dt, i) => (
													<Fragment key={"Tuesday" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
																<br />
															</Fragment>
														) : (
															""
														)}
														{dt}
													</Fragment>
												))}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.Wednesday.split(",").map((dt, i) => (
													<Fragment key={"Wednesday" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
																<br />
															</Fragment>
														) : (
															""
														)}
														{dt}
													</Fragment>
												))}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.Thursday.split(",").map((dt, i) => (
													<Fragment key={"Thursday" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
																<br />
															</Fragment>
														) : (
															""
														)}
														{dt}
													</Fragment>
												))}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.Friday.split(",").map((dt, i) => (
													<Fragment key={"Friday" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
																<br />
															</Fragment>
														) : (
															""
														)}
														{dt}
													</Fragment>
												))}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.Saturday.split(",").map((dt, i) => (
													<Fragment key={"Saturday" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
																<br />
															</Fragment>
														) : (
															""
														)}
														{dt}
													</Fragment>
												))}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.Sunday.split(",").map((dt, i) => (
													<Fragment key={"Sunday" + dt + i}>
														{i != 0 ? (
															<Fragment>
																<br />
																<br />
															</Fragment>
														) : (
															""
														)}
														{dt}
													</Fragment>
												))}
											</StyledTableCell>
										</StyledTableRow>
									))
								) : this.state.isLoading ? (
									<StyledTableRow key={1}>
										<StyledTableCell component="th" scope="row" colSpan={8}>
											<center>
												<CircularProgress />
											</center>
										</StyledTableCell>
									</StyledTableRow>
								) : (
									<StyledTableRow key={1}>
										<StyledTableCell component="th" scope="row" colSpan={8}>
											<center>
												<b>No Data</b>
											</center>
										</StyledTableCell>
									</StyledTableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={() => this.handleCloseSnackbar()}
					/>
				</Grid>
			</Fragment>
		);
	}
}
export default withStyles(styles)(R46Reports);
