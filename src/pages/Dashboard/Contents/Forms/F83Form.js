import React, { Component, Fragment } from "react";
import { CircularProgress, Collapse, Divider, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";

const styles = (theme) => ({
	root: {
		padding: `${theme.spacing(0)}px ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
		marginTop:`-${theme.spacing(2)}px`,
		minWidth: 350,
		overFlowX: "auto",
	},
	formControl: {
		minWidth: "100%",
	},
	sectionTitle: {
		fontSize: 19,
		color: "#174a84",
	},
	checkboxDividerLabel: {
		marginTop: 10,
		marginLeft: 5,
		marginRight: 20,
		fontSize: 16,
		fontWeight: 600,
	},
	rootProgress: {
		width: "100%",
		textAlign: "center",
	},
	levelForm: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		})
	},
	levelFormExpand: {
		transform: "rotate(180deg)"
	},
	textField: {
		// marginLeft: theme.spacing.unit,
		// marginRight: theme.spacing.unit,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		marginBottom: 0,
	},
	button: {
		padding: 7,
	},
	table: {
		tableLayout : "fixed"
	}
});


const StyledTableCell = withStyles((theme) => ({
	head: {
	 backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
	 color: theme.palette.common.white,
	 fontWeight: "bold",
	 border: "1px solid white",
	 padding: theme.spacing(1),
	 fontSize: "1rem"
	},
	body: {
	 fontSize: 14,
	 border: "1px solid rgb(29, 95, 152)",
	 padding: theme.spacing(1),
	},
 }))(TableCell);
 
 const StyledTableRow = withStyles((theme) => ({
	root: {
	 "&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	 },
	},
 }))(TableRow);

class F83Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recordId: 0, // this.props.match.params.recordId,
			isLoading: false,
			isLoadingFeatures: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			toggleLevelForm: false,
			level2: "",
			level2Error: "",
			featuresTypesMenuItems: [],
			featuresLevel1MenuItems: [],
			featuresLevel2MenuItems: [],
			featuresLevel3MenuItems: [],
			featuresLevel4MenuItems: [],
			featuresList: []
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
		this.setState({
			isOpenSnackbar: false,
		});
	};

	handleToggleLevlForm = () => {
		this.setState({ toggleLevelForm : !this.state.toggleLevelForm });
	};

	loadFeatureTypes = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CommonFeaturesTypesView`;
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
					let data = json.DATA || [];
					let dataLength = data.length;
					this.setState({featuresTypesMenuItems: [...data]});
				} else {
					this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
				}
				console.log("loadFeatureTypes", json);
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

	loadFeatureLevels = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CommonFeaturesLevelsView`;
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
					let data = json.DATA || [];
					let dataLength = data.length;
					if(dataLength>0){
						this.setState({
							featuresLevel1MenuItems: [...data[0].level1],
							featuresLevel2MenuItems: [...data[0].level2],
							featuresLevel3MenuItems: [...data[0].level3],
							featuresLevel4MenuItems: [...data[0].level4]
						});
					}
				} else {
					this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
				}
				console.log("loadFeatureLevels", json);
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

	loadData = async () => {
		this.setState({ isLoadingFeatures: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CommonFeaturesView`;
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
					let data = json.DATA || [];
					let dataLength = data.length;
					this.setState({featuresList: [...data]});
				} else {
					this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
				}
				console.log("loadData", json);
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
		this.setState({ isLoadingFeatures: false });
	};

	isLabelValid = () => {
		let label = this.state.label.trim();
		let isValid = true;
		if (label.length < 1) {
			this.setState({ labelError: "Please enter valid label" });
			document.getElementById("label").focus();
			isValid = false;
		} else {
			this.setState({ labelError: "" });
		}
		return isValid;
	};

	isFeatureValid = () => {
		let featureId = this.state.featureId;
		let isValid = true;
		if (featureId.length == 0) {
			this.setState({ featureIdError: "Please select at least one feature." });
			document.getElementById("featureId").focus();
			isValid = false;
		} else {
			this.setState({ featureIdError: "" });
		}
		return isValid;
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		let regex = "";
		switch (name) {
			case "":
				break;
			default:
		}
		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	clickOnFormSubmit = () => {
		this.handleOpenSnackbar("Saved", "success");
		return;
		 if(!this.isLabelValid()
		  //|| !this.isFeatureValid()
		){ return; }
		this.onFormSubmit();
	};

	onFormSubmit = async () => {
		
		let myForm = document.getElementById("myForm");
		const data = new FormData(myForm);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C82CommonDashboardSave`;
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
					this.handleOpenSnackbar(json.USER_MESSAGE, "success");
					setTimeout(() => {
						if (this.state.recordId != 0) {
							window.location = "#/dashboard/F83Reports";
						} else {
							window.location.reload();
						}
					}, 2000);
				} else {
					this.handleOpenSnackbar( json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error" );
				}
				console.log(json);
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					console.log(error);
					this.handleOpenSnackbar( "Failed to Save ! Please try Again later.", "error" );
				}
			}
		);
		this.setState({ isLoading: false });
	};

	handleReset = () => {
		window.location = "#/dashboard/F83Form/0";
		window.location.reload();
	}

	viewReport = () => {
		window.location = "#/dashboard/F83Reports";
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadFeatureTypes();
		this.loadFeatureLevels();
		this.loadData();
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (this.props.match.params.recordId != nextProps.match.params.recordId) {
	// 		if (nextProps.match.params.recordId != 0) {
	// 			this.props.setDrawerOpen(false);
	// 			this.loadData(nextProps.match.params.recordId);
	// 		} else {
	// 			window.location.reload();
	// 		}
	// 	}
	// }

	// componentDidUpdate(prevProps, prevState, snapshot) {
	// 	if (this.props.match.params.recordId != prevProps.match.params.recordId) {
	// 		if (this.props.match.params.recordId != 0) {
	// 			this.props.setDrawerOpen(false);
	// 			this.loadFeatureTypes();
	// 			this.loadData(this.props.match.params.recordId);
	// 		} else {
	// 			window.location.reload();
	// 		}
	// 	}
	// }

	render() {
		
		const { classes } = this.props;
		
		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<form id="myForm" onSubmit={this.isFormValid}>
					<TextField type="hidden" name="id" value={this.state.recordId} />
					<Grid 
						container 
						component="main"
						className={classes.root}
					>
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
								width: "100%",
								marginBottom: 25
							}}
							variant="h5"
						>
							Chart of Features
							<div style={{display:"inline-block", float:"right"}}>
								<Tooltip title="Toogle Levels From">
									<IconButton
										// style={{ marginLeft: "-10px" }}
										className={clsx(classes.levelForm, { [classes.levelFormExpand]: this.state.toggleLevelForm })}
										onClick={this.handleToggleLevlForm}
										size="small"
									>
										<ExpandMoreIcon color="primary" />
									</IconButton>
								</Tooltip>
							</div>
						</Typography>
						<Divider
							style={{
								backgroundColor: "rgb(58, 127, 187)",
								opacity: "0.3",
							}}
						/>
						<Grid container>
							<Grid item xs={12}>
								<Collapse in={this.state.toggleLevelForm}>
									<Grid container justifyContent="center" alignItems="center">
										<Grid item xs={10} md={4}>
											<TextField
												required
												name="level2"
												label="Level 2"
												value={this.state.level1}
												onChange={this.onHandleChange}
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.labelError}
												helperText={this.state.labelError}
												size="small"
												inputProps={{
													id : "Level 2"
												}}
											/>
										</Grid>
										<Grid item xs={2} md={1} style={{textAlign: "center"}}>
											<Button 
												variant="outlined" 
												className={classes.button}
												size="small"
												onClick={this.clickOnFormSubmit}
											>
												Add
											</Button>
										</Grid>
										<Grid item xs={12} md={2}>
												&emsp;
										</Grid>
										<Grid item xs={10} md={4}>
											<TextField
												required
												name="level3"
												label="Level 3"
												defaultValue=""
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.labelError}
												helperText={this.state.labelError}
												size="small"
												inputProps={{
													id : "Level 3"
												}}
											/>
										</Grid>
										<Grid item xs={2} md={1} style={{textAlign: "center"}}>
											<Button 
												variant="outlined" 
												className={classes.button}
												size="small"
												onClick={this.clickOnFormSubmit}
											>
												Add
											</Button>
										</Grid>
										<Grid item xs={12}>
												&emsp;
										</Grid>
										<Grid item xs={10} md={4}>
											<TextField
												required
												name="level4"
												label="Level 4"
												defaultValue=""
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.labelError}
												helperText={this.state.labelError}
												size="small"
												inputProps={{
													id : "Level 4"
												}}
											/>
										</Grid>
										<Grid item xs={2} md={1} style={{textAlign: "center"}}>
											<Button 
												variant="outlined" 
												className={classes.button}
												size="small"
												onClick={this.clickOnFormSubmit}
											>
												Add
											</Button>
										</Grid>
										<Grid item xs={12} md={2}>
												&emsp;
										</Grid>
										<Grid item xs={10} md={4}>
											<TextField
												required
												name="level5"
												label="Level 5"
												defaultValue=""
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.labelError}
												helperText={this.state.labelError}
												size="small"
												inputProps={{
													id : "Level 5"
												}}
											/>
										</Grid>
										<Grid item xs={2} md={1} style={{textAlign: "center"}}>
											<Button 
												variant="outlined" 
												className={classes.button}
												size="small"
												onClick={this.clickOnFormSubmit}
											>
												Add
											</Button>
										</Grid>
										<Grid item xs={12}>
											<br/>
										</Grid>
									</Grid>
								</Collapse> 
							</Grid>
							<TableContainer component={Paper}>
							<Table className={classes.table} aria-label="customized table">
								<TableHead>
									<TableRow>
										<StyledTableCell align="center" width={32} style={{ borderLeft: "1px solid rgb(29, 95, 152)" }} >#</StyledTableCell>
										<StyledTableCell align="center">L1</StyledTableCell>
										<StyledTableCell align="center">L2</StyledTableCell>
										<StyledTableCell align="center">L3</StyledTableCell>
										<StyledTableCell align="center">L4</StyledTableCell>
										<StyledTableCell align="center">L5</StyledTableCell>
										<StyledTableCell align="center">Features</StyledTableCell>
										<StyledTableCell align="center" width={32} style={{ borderRight: "1px solid rgb(29, 95, 152)" }}><Tooltip title="Action"><SettingsOutlinedIcon /></Tooltip></StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{this.state.featuresList.length>0 && !this.state.isLoadingFeatures ?	
									this.state.featuresList.map((feature, index) => 
										<StyledTableRow key={`feature-${(index+1)}`}>
											<StyledTableCell component="td" scope="row" align="center">
												{`${(index+1)}`}
											</StyledTableCell>
											<StyledTableCell component="td" scope="row">
												<TextField variant="outlined" fullWidth size="small" name="typeLabel" defaultValue={feature.typeId || ""} select>
													<MenuItem value=""><em>None</em></MenuItem>
													{this.state.featuresTypesMenuItems.map((t, i) =>
														<MenuItem key={`featuresTypesMenuItems-${t.label}`} value={t.id}>{t.label}</MenuItem>
													)}
												</TextField>
											</StyledTableCell>
											<StyledTableCell component="td" scope="row">
												<TextField variant="outlined" fullWidth size="small" name="level1Label" defaultValue={feature.level1 || ""} select>
												<MenuItem value=""><em>None</em></MenuItem>
												{this.state.featuresLevel1MenuItems.map((level1, level1Index) =>
													<MenuItem key={`featuresLevel1MenuItems-${level1}`} value={level1}>{level1}</MenuItem>
												)}
												</TextField>
											</StyledTableCell>
											<StyledTableCell component="td" scope="row">
												<TextField variant="outlined" fullWidth size="small" name="level2Label" defaultValue={feature.level2 || ""} select>
													<MenuItem value=""><em>None</em></MenuItem>
													{this.state.featuresLevel2MenuItems.map((level2, level2Index) =>
														<MenuItem key={`featuresLevel2MenuItems-${level2}`} value={level2}>{level2}</MenuItem>
													)}
												</TextField>
											</StyledTableCell>
											<StyledTableCell component="td" scope="row">
												<TextField variant="outlined" fullWidth size="small" name="level3Label" defaultValue={feature.level3 || ""} select>
													<MenuItem value=""><em>None</em></MenuItem>
													{this.state.featuresLevel3MenuItems.map((level3, level3Index) =>
														<MenuItem key={`featuresLevel3MenuItems-${level3}`} value={level3}>{level3}</MenuItem>
													)}
												</TextField>
											</StyledTableCell>
											<StyledTableCell component="td" scope="row">
												<TextField variant="outlined" fullWidth size="small" name="level4Label" defaultValue={feature.level4 || ""} select>
													<MenuItem value=""><em>None</em></MenuItem>
													{this.state.featuresLevel4MenuItems.map((level4, level4Index) =>
														<MenuItem key={`featuresLevel4MenuItems-${level4}`} value={level4}>{level4}</MenuItem>
													)}
												</TextField>
											</StyledTableCell>
											<StyledTableCell component="td" scope="row">
												<Typography variant="body2" component="span" style={{display:"inline-block"}}>{feature.label}</Typography>
											</StyledTableCell>
											<StyledTableCell component="td" scope="row">
												<Tooltip title="Save"><IconButton variant="outlined" size="small" color="primary" onClick={this.clickOnFormSubmit}><SaveOutlinedIcon /></IconButton></Tooltip>
											</StyledTableCell>
										</StyledTableRow>
																				
									)
								: this.state.isLoadingFeatures ? (
									<StyledTableRow key={`CircularProgress`}>
										<StyledTableCell component="td" scope="row" colSpan={8}>
											<center><CircularProgress disableShrink /></center>
										</StyledTableCell>
									</StyledTableRow>
								) : (
									<StyledTableRow key={`No-Data`}>
										<StyledTableCell component="td" scope="row" colSpan={8}>
											<center><b>No Data</b></center>
										</StyledTableCell>
									</StyledTableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					</Grid>
					<Grid item style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} xs={12}>
							<br/>
					</Grid>
				</Grid>
				</form>
				<BottomBar
					leftButtonHide={false}
					leftButtonText="View"
					bottomLeftButtonAction={this.viewReport}
					hideRightButton={true}
					right_button_text="Save"
					bottomRightButtonAction={(e)=>this.clickOnFormSubmit()}
					loading={this.state.isLoading || this.state.rowEditMode}
					isDrawerOpen={this.props.isDrawerOpen}
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
export default withStyles(styles)(F83Form);
