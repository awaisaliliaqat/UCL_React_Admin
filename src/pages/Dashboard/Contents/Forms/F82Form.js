import React, { Component, useState, Fragment, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Chip, Checkbox, Collapse, CircularProgress, Paper, TableContainer, IconButtonTable, Table, TableBody, TableCell, IconButton, TableHead, TableRow, Switch, } from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
	root: {
		padding: theme.spacing.unit*2,
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
	expand: {
		transform: "rotate(-90deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(0deg)",
	},
	textField: {
		// marginLeft: theme.spacing.unit,
		// marginRight: theme.spacing.unit,
		marginLeft: 0,
		marginRight: 0,
	 },
	 button: {
		//margin: theme.spacing.unit
	 },
});

function FeatureDetail(props) {
	const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
	const checkedIcon = <CheckBoxIcon fontSize="small" />;
	const {
		classes,
		data,
		isOpen,
		featureId,
		featureLabel,
		isChecked,
		i,
		programmeGroupMenuItems,
		isSelectedProgrammeGroups,
	} = props;

	const [GroupMenuItems, setprogrammeGroupMenuItems] = useState(programmeGroupMenuItems);

	const [selectedMenuItems, setSelectedMenuItems] = useState(isSelectedProgrammeGroups);

	const [isDisabled, setIsEnabled] = useState(!isChecked);

	const [programmeGroupIds, setProgrammeGroupIds] = useState("");

	const handleSetUserId = (value) => {
		
		setSelectedMenuItems(value);

		let programmeGroupIdArrays = "";
		if (value) {
			let users = value || [];
			let arrLength = value.length || 0;
			for (let i = 0; i < arrLength; i++) {
				if (i == 0) {
					programmeGroupIdArrays = users[i].Id;
				} else {
					programmeGroupIdArrays += "~" + users[i].Id;
				}
			}
			setProgrammeGroupIds(programmeGroupIdArrays);
		}
	};

	const handleCheckBoxChange = (target) => {
		console.log(target.checked);

		if (target.checked == false) {
			// console.log("UNCHECKED");
			setIsEnabled(true);
		} else if (target.checked == true) {
			// console.log("CHECKED");
			setIsEnabled(false);
		}
		//console.log("isDisabled =>> ",isDisabled);
	};

	const userSelected = (option) => {
		return selectedMenuItems.some(
			(selectedOption) => selectedOption.Id == option.Id
		);
	};

	useEffect(() => {
		handleSetUserId(selectedMenuItems);
	});

	return (
			<Fragment>
				<FormControlLabel
					label={featureLabel}
					control={
						<Checkbox
							onChange={(e) => handleCheckBoxChange(e.target)}
							value={featureId}
							defaultChecked={isChecked}
							id={"checkBox_" + featureId}
							name={"featureId"}
							color="primary"
						/>
					}
				/>
			</Fragment>
	);
}

function Features(props) {

	const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
	
	const checkedIcon = <CheckBoxIcon fontSize="small" />;

	const { classes, data, isOpen, userMenuItems, programmeGroupMenuItems, userId, } = props;

	const [selectedMenuItems, setSelectedMenuItems] = useState([]);

	const [expanded, setExpanded] = useState(true);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const userSelected = (option) => {
		return selectedMenuItems.some(
			(selectedOption) => selectedOption.id == option.id
		);
	};

	const handleSetUserId = (value) => {
		setSelectedMenuItems(value);
		let userIds = "";
	};

	return (
		<Grid item xs={12}>
			<Typography
				color="primary"
				component="div"
				style={{ fontWeight: 600, fontSize: "1rem", color: "rgb(29, 95, 134)" }}
			>
				<IconButton
					className={clsx(classes.expand, { [classes.expandOpen]: expanded })}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label="show more"
				>
					<ExpandMoreIcon
						color="primary"
						style={{ color: "rgb(29, 95, 134)" }}
					/>
				</IconButton>
				{data.typeLabel}
				<Divider
					style={{
						backgroundColor: "rgb(29, 95, 134)", //"rgb(58, 127, 187)",
						opacity: "0.3",
						marginLeft: 50,
						marginTop: -10,
					}}
				/>
			</Typography>
			<Collapse in={expanded} timeout="auto">
				<Grid 
					container
					direction="row"
					justifyContent="space-around"
					alignItems="center" 
				>
					<Grid xs={12} style={{marginLeft:50}}>
					{data.features.map((dt, i) => (
						<FeatureDetail
							key={`FeatureDetail`+i}
							classes={classes}
							data={data}
							featureId={dt.id}
							featureLabel={dt.label}
							isChecked={dt.isChecked}
							i={i}
							isOpen={false}
							userId={userId}
							programmeGroupMenuItems={programmeGroupMenuItems}
							isSelectedProgrammeGroups={dt.programmeGroups}
						/>
					))}
					</Grid>
				</Grid>
			</Collapse>
		</Grid>
	);
}

class F82Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recordId: this.props.match.params.recordId,
			isLoading: false,
			isLoadingFeatures: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			label: "",
			featureMenuItems: [],
			featureId: [],
			featureIds: "",
			featureIdError: "",
			isEditMode: false
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

	loadData = async (dashboardId) => {
		const data = new FormData();
		data.append("id", dashboardId);
		this.setState({ isLoadingFeatures: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C82CommonDashboardView`;
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
					let data = json.DATA || [];
					if(data!=null && data.length>0){
						this.setState({ 
							label : data[0].label,
							recordId : data[0].id,
							featureMenuItems: data[0].featureListTypeWise || [] 
						});
					}
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
					this.handleOpenSnackbar(
						"Failed to fetch ! Please try Again later.",
						"error"
					);
				}
			}
		);
		this.setState({ isLoadingFeatures: false });
	};

	isUsersValid = () => {
		let userId = this.state.userId;
		let isValid = true;
		if (userId.length == 0) {
			this.setState({ userIdError: "Please select at least one user." });
			document.getElementById("userId").focus();
			isValid = false;
		} else {
			this.setState({ userIdError: "" });
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

	featureSelected = (option) => {
		return this.state.featureId.some(
			(selectedOption) => selectedOption.id == option.id
		);
	};

	handleSetFeatureId = (value) => {
		this.setState({
			featureId: value,
			featureIdError: "",
		});

		let featureIds = "";
		if (value) {
			let features = value || [];
			let arrLength = value.length || 0;
			for (let i = 0; i < arrLength; i++) {
				if (i == 0) {
					featureIds = features[i].id;
				} else {
					featureIds += "," + features[i].id;
				}
			}
			this.setState({ featureIds: featureIds });
		}
	};

	clickOnFormSubmit = () => {
		//  if(
		//   !this.isUsersValid()
		//   || !this.isFeatureValid()
		// ){ return; }
		this.onFormSubmit();
	};

	onFormSubmit = async (e) => {
		
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
							window.location = "#/dashboard/F82Reports";
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
		window.location = "#/dashboard/F82Form/0";
		window.location.reload();
	}

	viewReport = () => {
		window.location = "#/dashboard/F82Reports";
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadData(this.state.recordId);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.recordId != nextProps.match.params.recordId) {
			if (nextProps.match.params.recordId != 0) {
				this.props.setDrawerOpen(false);
				this.loadData(nextProps.match.params.recordId);
			} else {
				window.location.reload();
			}
		}
	}

	render() {
		const { classes } = this.props;
		const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
		const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
							Define Dashboard
						</Typography>
						<Divider
							style={{
								backgroundColor: "rgb(58, 127, 187)",
								opacity: "0.3",
							}}
						/>
						<Grid
							container
							spacing={2}
						>
							<Grid item xs={12} md={11}>
								<TextField
									required
									id="outlined-required"
									name="label"
									label="Label"
									value={this.state.label}
									onChange={this.onHandleChange}
									className={classes.textField}
									margin="normal"
									variant="outlined"
									fullWidth
								/>
							</Grid>
							<Grid item xs={12} md={1} style={{textAlign: "right", alignContent: "center"}}>
								<Button 
									variant="outlined" 
									className={classes.button}
									size="large"
									style={{height:54, marginTop:7}}
									onClick={this.handleReset}
								>
									Reset
								</Button>
							</Grid>
							<Grid item xs={12}>
								<Typography
									style={{
										color: "#1d5f98",
										fontWeight: 600,
										borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
									}}
									variant="h6"
								>
									Features
								</Typography>
							</Grid>
						</Grid>
						<Grid item style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} xs={12}>
							{!this.state.isLoadingFeatures && this.state.featureMenuItems.length>0 ?
								this.state.featureMenuItems.map((data, index) => (
									<Features
										key={`Features:`+index}
										classes={classes}
										data={data}
										isOpen={false}
										userId={this.state.userId}
										userMenuItems={this.state.userMenuItems}
										programmeGroupMenuItems={this.state.programmeGroupMenuItems}
									/>
								))
								: 
								<Grid 
									container 
									justifyContent="center" 
									alignItems="center"
									style={{marginTop: "1rem"}}
								>
									{this.state.isLoadingFeatures ? 
										<CircularProgress />
									: 								
										<b>No Data</b>
									}
								</Grid>
							}
							<br/>
							<br/>
						</Grid>
					</Grid>
				</form>
				<BottomBar
					left_button_text="View"
					left_button_hide={false}
					bottomLeftButtonAction={this.viewReport}
					right_button_text="Save"
					bottomRightButtonAction={this.clickOnFormSubmit}
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
export default withStyles(styles)(F82Form);
