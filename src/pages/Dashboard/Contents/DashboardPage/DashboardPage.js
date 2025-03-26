import React, { Fragment } from "react";
import PropTypes from "prop-types";
import BG from "../../../../assets/Images/bg.png";
import ProfileWelcome from "../LMS/HomePage/Chunks/ProfileWelcome";
import ProfileCard from "./Chunks/ProfileCard";
import ReportingToCard from "./Chunks/ReportingToCard";
import UserRoleCard from "./Chunks/UserRoleCard";
import QuickActionsCard from "./Chunks/QuickActionsCard";
import NucleusControlToolsCard from "./Chunks/NucleusControlToolsCard";
import FeaturesCard from "./Chunks/FeaturesCard";
import { Grid, Typography, Divider, Card, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Skeleton } from "@material-ui/lab";

const styles = (theme) => ({
	container: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(0),
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%",
	},
	card: {
		padding: theme.spacing(2),
		borderRadius: theme.spacing(1),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		backgroundColor: "#ffffff8a",
	},
	title: {
		fontWeight: 600,
		marginBottom: theme.spacing(2),
		fontSize: "1.1rem",
	},
});

class DashboardPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			isLoading: false,
			isLoginMenu: false,
			isReload: false,
			employee: null,
			reportingTo: [],
			dashboardId: this.props.match.params.dashboardId,
			isLoadingFavouriteFeatures: false,
			favouriteFeatures:[],
			dashboardFeatures:[]
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

	handleLoginMenu = (isOpen) => {
		this.setState({isLoginMenu: isOpen});
	}

	handleLoginMenuReload = (isReload) => {
		this.setState({isReload: isReload});
	}

	getFavouriteFeatures = async () => {
		this.setState({isLoadingFavouriteFeatures: true});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/UserFeatureFavouriteView`;
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
						this.setState({favouriteFeatures:data});
					} else {
						this.setState({favouriteFeatures:[]});
					}
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
				}
				//console.log("getFavouriteFeatures", json);
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true
					});
				} else {
					console.log(error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		this.setState({isLoadingFavouriteFeatures: false});
	};

	getDashboardFeatures = async (dashboardId) => {
		this.setState({isLoading: true});
		// let formData = new FormData();
		// dashboardId = parseInt(dashboardId);
		// if(isNaN(dashboardId)){ dashboardId=0; }
		// formData.append("dashboardId",  dashboardId);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/FeaturesLevelWiseByUserId`;
		await fetch(url, {
			method: "POST",
			//body: formData,
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
						this.setState({dashboardFeatures:data});
					} else {
						this.setState({dashboardFeatures:[]});
					}
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
				}
				//console.log("getDashboardFeatures", json);
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true
					});
				} else {
					console.log(error);
					this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		this.setState({isLoading: false});
	};

	componentDidMount(){
		this.props.setDrawerOpen(false);
		const { dashboardId } = this.props.match.params;
		if (dashboardId!=0) {
			this.getFavouriteFeatures();
			this.getDashboardFeatures(dashboardId);
			this.setState({dashboardId: dashboardId});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	// Typical usage (don't forget to compare props):
		const { dashboardId } = this.props.match.params;
		if (this.state.dashboardId != dashboardId) {
			this.setState({dashboardId: dashboardId});
			this.getDashboardFeatures(dashboardId);
		}
	}
	
	render() {
		
	const { title, classes, buttonRefNotiDrawerOpen } = this.props;

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				{/* Background Image */}
				<div
					style={{
						backgroundImage: `url(${BG})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						position: "fixed",
						backgroundRepeat: "no-repeat",
						width: "100%",
						height: "100%",
						margin: "-10px",
						zIndex: -1,
					}}
				/>
				{/* Content Grid */}
				<Grid container spacing={1} className={classes.container}>
					{/*
					<Grid item xs={12}>
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								textTransform: "capitalize",
							}}
							variant="h5"
						>
							Welcome {title}
						</Typography>
						<Divider className={classes.divider} />
					</Grid>
					*/}
					<Grid item xs={12}>
						<ProfileCard 
							handleLoginMenuReload={this.handleLoginMenuReload}
							handleLoginMenu={this.handleLoginMenu}
							handleOpenSnackbar={this.handleOpenSnackbar}
						/>
					</Grid>
					<Grid item xs={12} lg={8}>
						<Grid container spacing={1}>
							<Grid item xs={12} md={6}>
								<UserRoleCard
									handleLoginMenuReload={this.handleLoginMenuReload}
									handleLoginMenu={this.handleLoginMenu}
									handleOpenSnackbar={this.handleOpenSnackbar}
									buttonRefNotiDrawerOpen={buttonRefNotiDrawerOpen}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<QuickActionsCard 
									isLoadingFavouriteFeatures={this.state.isLoadingFavouriteFeatures}
									favouriteFeatures={this.state.favouriteFeatures}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} lg={4}>
						<ReportingToCard 
							handleLoginMenuReload={this.handleLoginMenuReload}
							handleLoginMenu={this.handleLoginMenu}
							handleOpenSnackbar={this.handleOpenSnackbar}
						/>
					</Grid>
										
					{this.state.dashboardFeatures.map((dashboardFeatures, index) =>
						dashboardFeatures.typeId==100 && false ? 
						<Grid item xs={12} key={`NucleusControlToolsCard-${index}`}>
							<NucleusControlToolsCard 
								data={dashboardFeatures}
								dataIndex={index}
							/>
						</Grid>
						:
							null
						)}
					
						{!this.state.dashboardFeatures?.length && !this.state.isLoading ? 
							<Grid item xs={12}>
							<Card className={classes.card}>
								<Typography 
									variant="h6"
									className={classes.title}
								>
									Features
								</Typography>
								<Grid container>
									<Grid item xs={12}>
										<Box color="text.secondary">
											No features for Dashboard
										</Box>
									</Grid>
								</Grid>
							</Card>
							</Grid>
							: this.state.isLoading ?
								<Grid item xs={12}>
									<Card className={classes.card}>
										<Typography 
											variant="h6"
											className={classes.title}
										>
											<Skeleton variant="rect" width="100%" />
										</Typography>
										<Typography 
											variant="h6"
											className={classes.title}
										>
											<Skeleton variant="rect" width="100%" />
										</Typography>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6}>
												<Skeleton variant="rect" width="100%" height={100}/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Skeleton variant="rect" width="100%" height={100}/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Skeleton variant="rect" width="100%" height={100}/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Skeleton variant="rect" width="100%" height={100}/>
											</Grid>
										</Grid>
									</Card>
								</Grid>
								:
								null
						}
						{!this.state.isLoading && this.state.dashboardFeatures.map((dashboardFeatures, index) =>
							dashboardFeatures.typeId!=100 || true ? 
							<Grid item xs={12} key={`FeaturesCard-${index}`}>
							<FeaturesCard
								handleLoginMenuReload={this.handleLoginMenuReload}
								handleLoginMenu={this.handleLoginMenu}
								handleOpenSnackbar={this.handleOpenSnackbar}
								data={dashboardFeatures}
								getFavouriteFeatures={this.getFavouriteFeatures}
								favouriteFeatures={this.state.favouriteFeatures}
								dataIndex={index}
							/>
							</Grid>
							:
							null
						)}
						{/* <FeaturesCard /> */}
					
					{/* 
					<Grid item xs={12} sm={3}>
						<ProfileWelcome />
					</Grid> 
					*/}
				</Grid>
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

DashboardPage.propTypes = {
	title: PropTypes.string,
	classes: PropTypes.object.isRequired, // Required for withStyles HOC
};

DashboardPage.defaultProps = {
	title: "to UCL",
};

// Exporting with styles
export default withStyles(styles)(DashboardPage);