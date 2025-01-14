import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Divider, IconButton, Tooltip, CircularProgress, Grid, Paper, } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = (theme) => ({
	root: {
		padding: theme.spacing(2),
		minWidth: 350,
		overFlowX: "auto",
	},
	paper: {
		padding: `${theme.spacing(0.25)+"px"} ${theme.spacing(0.5)+"px"}`
	},
	lavelTag: {
		color: theme.palette.info.light
	}
});

class F83Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			showSearchBar: false,
			isDownloadExcel: false,
			reportData: [],
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
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

	getData = async () => {
		this.setState({isLoading: true});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C83CommonFeaturesLevelWiseView`;
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
						this.setState({reportData: data});
					} else {
						//alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
						this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
						console.log(error);
					}
				}
			);
		this.setState({
			isLoading: false,
		});
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleToggleTableFilter = () => {
		this.setState({ showTableFilter: !this.state.showTableFilter });
	};

	handleToggleSearchBar = () => {
		this.setState({ showSearchBar: !this.state.showSearchBar });
	};

	componentDidMount() {
		this.getData();
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
					spacing={0}
					justifyContent="center"
					alignItems="center"
				> 
					<Grid item xs={12}>
						<Typography style={{ color: "#1d5f98", fontWeight: 600, textTransform: "capitalize", }} variant="h5" >
							<Tooltip title="Back">
								<IconButton onClick={() => window.history.back()}>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Chart of Features Report
						</Typography>          
						<Divider style={{ backgroundColor: "rgb(58, 127, 187)", opacity: "0.3", }} />
						<br/>
					</Grid>
					<Grid item xs={12} md={8}>
						{this.state.reportData.length>0 ? (
							this.state.reportData.map((fType, fTypeIndex) => 
								<Fragment key={`fType-${fTypeIndex}`}>
							 		<Paper variant="outlined" square elevation={3} className={classes.paper}><span className={classes.lavelTag}>L1:</span><Typography variant="subtitle2" component="span" style={{marginLeft:"3rem", display:"inline-block"}}>{(fTypeIndex+1)+") "+fType.typeLabel}</Typography></Paper>
									{fType.level1.map((l1 , l1Index)=>
										<Fragment key={`level1-${l1Index}`}>
											<Paper variant="outlined" square elevation={3} className={classes.paper}><span className={classes.lavelTag}>L2:</span><Typography variant="subtitle2" component="span" style={{marginLeft:"6rem", display:"inline-block"}}>{(l1Index+1)+") "+l1.level1Label}</Typography></Paper>
												{l1.level2.map((l2 , l2Index) => 
													<Fragment key={`level2-${l2Index}`}>
														<Paper variant="outlined" square elevation={3} className={classes.paper}><span className={classes.lavelTag}>L3:</span><Typography variant="subtitle2" component="span" style={{marginLeft:"9rem", display:"inline-block"}}>{(l2Index+1)+") "+l2.level2Label}</Typography></Paper>
														{l2.level3.map((l3 , l3Index) => 
															<Fragment key={`level3-${l3Index}`}>
															<Paper variant="outlined" square elevation={3} className={classes.paper}><span className={classes.lavelTag}>L4:</span><Typography variant="subtitle2" component="span" style={{marginLeft:"12rem", display:"inline-block"}}>{(l3Index+1)+") "+l3.level3Label}</Typography></Paper>
															{l3.level4.map((l4 , l4Index) => 
																<Fragment key={`level4-${l4Index}`}>
																<Paper variant="outlined" square elevation={3} className={classes.paper}><span className={classes.lavelTag}>L5:</span><Typography variant="subtitle2" component="span" style={{marginLeft:"15rem", display:"inline-block"}}>{(l4Index+1)+") "+l4.level4Label}</Typography></Paper>
																{l4.level5.map((l5 , l5Index) => 
																	<Paper variant="outlined" square elevation={3} key={`level5-${l5Index}`} className={classes.paper}><span className={classes.lavelTag}>L6:</span><Typography variant="body2" component="span" style={{marginLeft:"18rem", display:"inline-block"}}>{(l5Index+1)+") "+l5.label}</Typography></Paper>
																)}
																</Fragment>
															)}
															</Fragment>
														)}
													</Fragment>
												)}
										</Fragment>
									)}
								</Fragment>
							)
						) : this.state.isLoading ?
								<center><CircularProgress /></center>
								:
								""
						}
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
export default withStyles(styles)(F83Reports);
