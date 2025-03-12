import React, { Component, Fragment, useEffect } from "react";
import { CircularProgress, Collapse, Divider, Grid, IconButton, InputAdornment, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@material-ui/core";
import { ExpandMore, SaveOutlined, SettingsOutlined, AddOutlined } from '@material-ui/icons';
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import isEqual from 'lodash/isEqual';
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

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

 const CustomRow = React.memo((props) => {
	
	const {
	  featuresTypesMenuItems=[],
	  featuresLevel1MenuItems=[],
	  featuresLevel2MenuItems=[],
	  featuresLevel3MenuItems=[],
	  featuresLevel4MenuItems=[],
	  featureList=[],
	  handleSaveRow,
	} = props;

	return (
		featureList && featureList.map((feature, index) => 
		<StyledTableRow key={feature.id}>
			<StyledTableCell component="td" scope="row" align="center">
			{`${index + 1}`}
			</StyledTableCell>
			<StyledTableCell component="td" scope="row">
			<TextField
				variant="outlined"
				fullWidth
				size="small"
				name="featureTypeId"
				defaultValue={feature.typeId || ""}
				select
				inputProps={{
					id: `featureTypeId-${feature.id}`
				}}
			>
				<MenuItem value="">
				<em>None</em>
				</MenuItem>
				{featuresTypesMenuItems.map((t) => (
				<MenuItem key={`featuresTypesMenuItems-${t.label}`} value={t.id}>
					{t.label}
				</MenuItem>
				))}
			</TextField>
			</StyledTableCell>
			<StyledTableCell component="td" scope="row">
			<TextField
				variant="outlined"
				fullWidth
				size="small"
				name="level1Label"
				defaultValue={feature.level1 || ""}
				select
				inputProps={{
					id: `featureLevel1-${feature.id}`
				}}
			>
				<MenuItem value="">
				<em>None</em>
				</MenuItem>
				{featuresLevel1MenuItems.map((level1) => (
				<MenuItem key={`featuresLevel1MenuItems-${level1}`} value={level1}>
					{level1}
				</MenuItem>
				))}
			</TextField>
			</StyledTableCell>
			<StyledTableCell component="td" scope="row">
			<TextField
				variant="outlined"
				fullWidth
				size="small"
				name="level2Label"
				defaultValue={feature.level2 || ""}
				select
				inputProps={{
					id: `featureLevel2-${feature.id}`
				}}
			>
				<MenuItem value="">
				<em>None</em>
				</MenuItem>
				{featuresLevel2MenuItems.map((level2) => (
				<MenuItem key={`featuresLevel2MenuItems-${level2}`} value={level2}>
					{level2}
				</MenuItem>
				))}
			</TextField>
			</StyledTableCell>
			<StyledTableCell component="td" scope="row">
			<TextField
				variant="outlined"
				fullWidth
				size="small"
				name="level3Label"
				defaultValue={feature.level3 || ""}
				select
				inputProps={{
					id: `featureLevel3-${feature.id}`
				}}
			>
				<MenuItem value="">
				<em>None</em>
				</MenuItem>
				{featuresLevel3MenuItems.map((level3) => (
				<MenuItem key={`featuresLevel3MenuItems-${level3}`} value={level3}>
					{level3}
				</MenuItem>
				))}
			</TextField>
			</StyledTableCell>
			<StyledTableCell component="td" scope="row">
			<TextField
				variant="outlined"
				fullWidth
				size="small"
				name="level4Label"
				defaultValue={feature.level4 || ""}
				select
				inputProps={{
					id: `featureLevel4-${feature.id}`
				}}
			>
				<MenuItem value="">
				<em>None</em>
				</MenuItem>
				{featuresLevel4MenuItems.map((level4) => (
				<MenuItem key={`featuresLevel4MenuItems-${level4}`} value={level4}>
					{level4}
				</MenuItem>
				))}
			</TextField>
			</StyledTableCell>
			<StyledTableCell component="td" scope="row">
			<Typography
				variant="body2"
				component="span"
				style={{ display: "inline-block" }}
			>
				{feature.label}
			</Typography>
			</StyledTableCell>
			<StyledTableCell component="td" scope="row">
				<Tooltip title="Save">
					<IconButton
					variant="outlined"
					size="small"
					color="primary"
					onClick={(e) => handleSaveRow(e, feature.id)}
					>
					<SaveOutlined />
					</IconButton>
				</Tooltip>
			</StyledTableCell>
	  	</StyledTableRow>
	)
)}, (prevProps, nextProps) => {
	return isEqual(prevProps, nextProps);
  });

class F83Form extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			recordId: 0, // this.props.match.params.recordId,
			isLoading: false,
			isLoadingFeatures: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			toggleLevelForm: false,
			typeLabel: "",
			typeLabelError: "",
			level1: "",
			level1Error: "",
			level2: "",
			level2Error: "",
			level3: "",
			level3Error: "",
			level4: "",
			level4Error: "",
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
		this.setState((previousState)=>({ toggleLevelForm : !previousState.toggleLevelForm }));
	};

	loadFeatureTypes = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CharOfFeatures/TypesView`;
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
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CharOfFeatures/LevelsView`;
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
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CharOfFeatures/View`;
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

	handleAddLevel = (levelKey) => {
		const levelValue = this.state[`level${levelKey}`];
		const menuItemsKey = `featuresLevel${levelKey}MenuItems`;
		// Ensure the array is initialized properly
		let menuItems = this.state[menuItemsKey] ? [...this.state[menuItemsKey]] : [];
		// Check if the level value already exists
		const levelExists = menuItems.some(item => item === levelValue);
		if (!levelExists) {
			menuItems.push(levelValue);
			this.handleOpenSnackbar(`Level${levelKey+1} value added into list.`, "success");
		} else {
			this.setState({ [`level${levelKey}Error`]: "Value already exists in the list" });
			return;
		}
		// Update the state dynamically
		this.setState({
			[menuItemsKey]: menuItems,
			[`level${levelKey}`]: ""
		});
	};

	isTypeLabelValid = () => {
		let isValid = true;        
        if (this.state.typeLabel==null || this.state.typeLabel.trim() === "") {
            this.setState({typeLabelError:"Please enter Label"});
            document.getElementById("typeLabel").focus();
            isValid = false;
        } else if(this.state.typeLabel!=null || this.state.typeLabel.trim().length > 0){
			const levelValue = this.state.typeLabel.trim();
			const menuItemsKey = `featuresTypesMenuItems`;
			// Ensure the array is initialized properly
			let menuItems = this.state[menuItemsKey] ? [...this.state[menuItemsKey]] : [];
			// Check if the level value already exists
			const levelExists = menuItems.some(item => item.label.trim() === levelValue);
			if (levelExists){
				this.setState({ [`typeLabelError`]: "Value already exists in the list" });
				document.getElementById("typeLabel").focus();
				isValid = false;
			} else {
				this.setState({ [`typeLabelError`]: "" });
			}
		}
		return isValid;
	};

	handleSaveType = async () => {
		if(!this.isTypeLabelValid()){
			return null;
		}
		this.setState({ isLoading: true });
		const data = new FormData();
		data.append("label", this.state.typeLabel.trim());
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CharOfFeatures/TypeSave`;
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
			const { CODE, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.handleOpenSnackbar(USER_MESSAGE+" and value added into list.", "success");
					this.setState({ typeLabel: "" });
					this.loadFeatureTypes();
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				console.log("handleSaveType : ", json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					console.log(error);
					this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
				}
			}
		);
		this.setState({ isLoading: false });
	};

	handleSaveRow = async (e, featureId) => {
		
		// if(!this.isLevel3Validate()){
		// 	return null;
		// }

		let featureTypeEle = document.getElementById(`featureTypeId-${featureId}`);
		let featureTypeId = parseInt(featureTypeEle.value);
		if(isNaN(featureTypeId) || featureTypeId==0){ 
			featureTypeEle.focus();
			this.handleOpenSnackbar("Please select feature Level_1", "error" );
			return;
		};
		const data = new FormData();
		data.append("featureId", featureId);
		data.append("featureTypeId", featureTypeId);
		data.append("featureLevel1", document.getElementById(`featureLevel1-${featureId}`).value.trim());
		data.append("featureLevel2", document.getElementById(`featureLevel2-${featureId}`).value.trim());
		data.append("featureLevel3", document.getElementById(`featureLevel3-${featureId}`).value.trim());
		data.append("featureLevel4", document.getElementById(`featureLevel4-${featureId}`).value.trim());
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CharOfFeatures/FeatureLevelsSave`;
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
					// setTimeout(() => {
					// 	if (this.state.recordId != 0) {
					// 		window.location = "#/dashboard/F83Reports";
					// 	} else {
					// 		window.location.reload();
					// 	}
					// }, 2000);
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
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

	viewReport = () => {
		window.location = "#/dashboard/F83Reports";
	};

	isLevel3Validate = () => {
		// Select elements with name="level1Label" and name="level2Label"
		const level0ArrayEle = document.getElementsByName("typeLabel");
		const level1ArrayEle = document.getElementsByName("level1Label");
		const level2ArrayEle = document.getElementsByName("level2Label");
		// Convert NodeList to array of values
		const level0Array = Array.from(level0ArrayEle).map(ele => ele.value);
		const level1Array = Array.from(level1ArrayEle).map(ele => ele.value);
		const level2Array = Array.from(level2ArrayEle).map(ele => ele.value);
		if (level0Array.length !== level1Array.length || level1Array.length !== level2Array.length) {
			this.handleOpenSnackbar(<span>ERROR: Arrays must have the same length.</span>,"error");
			console.error("Error: Arrays must have the same length.");
			return false;
		}
		const combinedObject = {};
		for (let index = 0; index < level0Array.length; index++) {
			const key = `${this.state.featuresTypesMenuItems.find((d,i)=>d.id==level0Array[index]).label.replaceAll(" ","_")}-${level1Array[index].replaceAll(" ","_")}`; // Create combined key
			const value = level2Array[index];
			if (!combinedObject[key]) {
				combinedObject[key] = [];
			}
			if (!combinedObject[key].includes(value)) {
				combinedObject[key].push(value);
			}
			// Stop execution if any key has multiple unique values
			if (combinedObject[key].length > 1) {
				this.handleOpenSnackbar(<span>ERROR: L1 + L2 must have same L3.<br/>Key {key} has multiple values: {combinedObject[key]}</span>,"error");
				console.error(`Error: Key "${key}" has multiple values: ${combinedObject[key]}`);
				return false; // Stop execution
			}
		}
		//console.log("Final Combined Object:", combinedObject);
		return true;
	};
	  
	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadFeatureTypes();
		this.loadFeatureLevels();
		this.loadData();
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
										<ExpandMore color="primary" />
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
									<Grid container justifyContent="center" alignItems="center" spacing={2}>
									<Grid item xs={12} md={4}>
											<TextField
												name="typeLabel"
												label="Level 1"
												value={this.state.typeLabel}
												onChange={this.onHandleChange}
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.typeLabelError}
												helperText={this.state.typeLabelError}
												size="small"
												required
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Add">
																<span>
																	<IconButton
																		variant="outlined"
																		size="small"
																		onClick={e => this.handleSaveType()}
																		disabled={this.state.isLoading}
																	>
																		{ this.state.isLoading ? <CircularProgress size={16} /> : <AddOutlined /> } 
																	</IconButton>
																</span>
															</Tooltip>
														</InputAdornment>
													),
													id: "typeLabel"
												}}
											/>
										</Grid>
										<Grid item xs={12} md={4}>
											<TextField
												name="level1"
												label="Level 2"
												value={this.state.level1}
												onChange={this.onHandleChange}
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.level1Error}
												helperText={this.state.level1Error}
												size="small"
												required
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Add">
																<IconButton
																	variant="outlined"
																	size="small"
																	onClick={e => this.handleAddLevel(1)}
																>
																	<AddOutlined />
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),
													id: "level1"
												}}
											/>
										</Grid>
										<Grid item xs={12} md={4}>
											<TextField
												required
												name="level2"
												label="Level 3"
												value={this.state.level2}
												onChange={this.onHandleChange}
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.level2Error}
												helperText={this.state.level2Error}
												size="small"
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Add">
																<IconButton
																	variant="outlined"
																	size="small"
																	onClick={e=>this.handleAddLevel(2)}
																>
																	<AddOutlined />
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),
													id : "level2"
												}}
											/>
										</Grid>
										<Grid item xs={12} md={4}>
											<TextField
												required
												name="level3"
												label="Level 4"
												value={this.state.level3}
												onChange={this.onHandleChange}
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.level3Error}
												helperText={this.state.level3Error}
												size="small"
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Add">
																<IconButton
																	variant="outlined"
																	size="small"
																	onClick={e=>this.handleAddLevel(3)}
																>
																	<AddOutlined />
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),
													id : "level3"
												}}
											/>
										</Grid>
										<Grid item xs={12} md={4}>
											<TextField
												required
												name="level4"
												label="Level 5"
												value={this.state.level4}
												onChange={this.onHandleChange}
												className={classes.textField}
												margin="normal"
												variant="outlined"
												fullWidth
												error={!!this.state.level4Error}
												helperText={this.state.level4Error}
												size="small"
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Add">
																<IconButton
																	variant="outlined"
																	size="small"
																	onClick={e=>this.handleAddLevel(4)}
																>
																	<AddOutlined />
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),
													id : "level4"
												}}
											/>
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
										<StyledTableCell align="center" width={32} style={{ borderRight: "1px solid rgb(29, 95, 152)" }}><Tooltip title="Action"><SettingsOutlined /></Tooltip></StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{this.state.featuresList && this.state.featuresList.length>0 && !this.state.isLoadingFeatures ?	
									<CustomRow
										featuresTypesMenuItems={this.state.featuresTypesMenuItems || []}
										featuresLevel1MenuItems={this.state.featuresLevel1MenuItems || []}
										featuresLevel2MenuItems={this.state.featuresLevel2MenuItems || []}
										featuresLevel3MenuItems={this.state.featuresLevel3MenuItems || []} 
										featuresLevel4MenuItems={this.state.featuresLevel4MenuItems || []}
										featureList={this.state.featuresList} 
										handleSaveRow={this.handleSaveRow}
									/>
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