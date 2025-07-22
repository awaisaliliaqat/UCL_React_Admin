import React, { Fragment, useEffect, useState } from "react";
import { Card, Grid, Typography, Box, List, ListItem, ListItemText, Divider, Collapse, Tooltip, IconButton, FormControlLabel, Checkbox, Dialog, DialogContent, Button } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { useHistory } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import CloseIcon from '@material-ui/icons/Close';
import { ZoomOutMapOutlined }  from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	card: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(0),
		borderRadius: theme.spacing(1),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		backgroundColor: "#ffffff8a",
	},
	title: {
		fontWeight: 600,
		marginBottom: theme.spacing(0),
		fontSize: "1.1rem",
		cursor:"pointer"
	},
	item: {
		display: "flex",
		alignItems: "center",
		position: "relative", // Ensure correct positioning for sidebar
		borderRadius: theme.spacing(1),
		padding: theme.spacing(2),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		// cursor: "pointer",
		"&:hover": {
			boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
		},
	},
	icon: {
		marginRight: theme.spacing(2),
		fontSize: "2rem",
	},
	greenBackground: {
		backgroundColor: "rgb(232, 245, 233)",
		color: "rgb(76, 175, 80)",
	},
	blueBackground: {
		backgroundColor: "#eef4ff",
		color: "#0d47a1",
	},
	pinkBackground: {
		backgroundColor: "#ffeef0",
		color: "#d32f2f",
	},
	purpleBackground: {
		backgroundColor: "#f5e8ff",
		color: "#6a1b9a",
	},
	sideBar: {
		width: "0.5px", // Reduced width for the sidebar
		height: "100%",
		position: "absolute",
		left: "30px", // Position after the dots
		top: 0
	},
	dragHandle: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginRight: theme.spacing(3), // Adjusted margin for proper spacing
		color: "#c4c4c4",
		fontSize: "1rem",
	},
	dot: {
		width: "4px",
		height: "4px",
		borderRadius: "50%",
		backgroundColor: "#c4c4c4",
		marginBottom: "2px",
	},
	listBox: {
		height:120, 
		overflow:"auto", 
		paddingRight:8,
		/* width */
		'&::-webkit-scrollbar' : {
				width: 5,
			},
		/* Track */
		'&::-webkit-scrollbar-track' : {
			background: "rgba(0, 0, 0, 0.05)", 
		}, 
		/* Handle */
		"&::-webkit-scrollbar-thumb" : {
			background: "rgba(0, 0, 0, 0.1)", 
		},
		/* Handle on hover */
		'&::-webkit-scrollbar-thumb:hover' : {
			background: "rgba(0, 0, 0, 0.2)",
		}
	},
	// list: {
	// 	height:150, 
	// 	overflow:"auto", 
	// 	paddingRight:8,
	// 	/* width */
	// 	'&::-webkit-scrollbar' : {
	// 			width: 5,
	// 		},
	// 	/* Track */
	// 	'&::-webkit-scrollbar-track' : {
	// 		background: "rgba(0, 0, 0, 0.05)", 
	// 	}, 
	// 	/* Handle */
	// 	"&::-webkit-scrollbar-thumb" : {
	// 		background: "rgba(0, 0, 0, 0.1)", 
	// 	},
	// 	/* Handle on hover */
	// 	'&::-webkit-scrollbar-thumb:hover' : {
	// 		background: "rgba(0, 0, 0, 0.2)",
	// 	}
	// },
	listItem: {
		padding: theme.spacing(1),
		borderRadius: "4px",
		marginBottom: theme.spacing(1),
		backgroundColor: "white",
		boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
		cursor: "pointer",
		'&:hover':{
			boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
		},
	},
	listText: {
		fontSize: "1rem",
		fontWeight: 500,
		color: "#333"
	},
	listSecoundaryText: {
		fontSize: "0.8rem",
		fontWeight: 500,
		color: "#cbcbcb"
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
	dialog: {
		overflow:"auto", 
		paddingRight: "0.5rem",
		/* width */
		'&::-webkit-scrollbar' : {
				width: "0.5rem",
			},
		/* Track */
		'&::-webkit-scrollbar-track' : {
			background: "rgba(0, 0, 0, 0.05)", 
		}, 
		/* Handle */
		"&::-webkit-scrollbar-thumb" : {
			background: "rgba(0, 0, 0, 0.1)", 
		},
		/* Handle on hover */
		'&::-webkit-scrollbar-thumb:hover' : {
			background: "rgba(0, 0, 0, 0.2)",
		}
	},
}));

const ColouredCheckbox = withStyles((theme) => ({
	root: {
		marginRight: theme.spacing(1),
	  	color: "inherit",
	//   '&$checked': {
	// 	color: green[600],
	//   },
	},
	checked: {},
  }))((props) => <Checkbox color="default" {...props} />);

const FeaturesCard = ({handleLoginMenuReload, handleLoginMenu, handleOpenSnackbar, data, dataIndex, favouriteFeatures, getFavouriteFeatures}) => {
	
	const classes = useStyles();

	const themes = ["greenBackground", "blueBackground", "pinkBackground", "purpleBackground"];

	const history = useHistory();

	const [toggleLevelForm, setToggleLevelForm] = useState(false);

	const [checkedItems, setCheckedItems] = useState({}); // State to track checked checkboxes

	const [dialogOpen, setDialogOpen] = useState(false);

	const [selectedItem, setSelectedItem] = useState(null);

	const [selectedItemColorClasses, setSelectedItemColorClasses] = useState("");  
	
	const handleToggleLevlForm = () => {
		setToggleLevelForm(!toggleLevelForm);
	};

	const handleDialogOpen = (leavel1, colorClasses) => {
		setSelectedItem(leavel1);
		setDialogOpen(true);
		setSelectedItemColorClasses(colorClasses);
	  };
	
	  const handleDialogClose = () => {
		setDialogOpen(false);
	  };

	const handleChangeFavourite = async (event, featureId) => {
		const isChecked = event.target.checked;	
		const isFavourite = isChecked ? 1 : 0;
		const data = new FormData();
		data.append("featureId", featureId);
		data.append("isFavourite", isFavourite);
		//this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/SaveIsUserFeatureFavouriteByFeatureIdAndIsFavourite`;
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
					handleOpenSnackbar(json.USER_MESSAGE, "success");
					setCheckedItems((prevState) => ({
						...prevState,
						[featureId]: isChecked,
					}));
				} else {
					setCheckedItems((prevState) => ({
						...prevState,
						[featureId]: !isChecked,
					}));
					handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
				}
				console.log(json);
			},
			(error) => {
				if (error.status == 401) {
					handleLoginMenu(true);
					handleLoginMenuReload(false);
				} else {
					console.log(error);
					handleOpenSnackbar( "Failed to Save ! Please try Again later.", "error" );
				}
			}
		);
		//this.setState({ isLoading: false });
		getFavouriteFeatures();
	};

	useEffect(() => {
		// Convert favouriteFeatures array into an object with {id: true}
		const initialCheckedState = favouriteFeatures.reduce((acc, feature) => {
			acc[feature.id] = true; // Extracting 'id' from each object
			return acc;
		}, {});  // Initial accumulator value is an empty object {}
	
		setCheckedItems(initialCheckedState);
	}, [favouriteFeatures]); // Runs when favouriteFeatures changes

	return (
		<Card className={classes.card}>
			<Typography 
				variant="h6" 
				className={classes.title}
				onClick={handleToggleLevlForm}
			>
				{data?.typeLabel || "" } 
				<div style={{display:"inline-block", float:"right"}}>
					<Tooltip title="Toogle Levels From">
						<IconButton
							// style={{ marginLeft: "-10px" }}
							className={clsx(classes.levelForm, { [classes.levelFormExpand]: toggleLevelForm })}
							//onClick={handleToggleLevlForm}
							size="small"
						>
							<ExpandMoreIcon color="primary" />
						</IconButton>
					</Tooltip>
				</div>
			</Typography>
			<Collapse in={toggleLevelForm}>
				<br/>
				<Grid container spacing={2}>
					{data?.level1.map((l1, l1Index)=> { 
						// Cycle through themes using modulus operator
						const themeClass = themes[dataIndex % themes.length];
						return (
						<Grid key={`level1-${l1Index}`} item xs={12} md={6}>
							{/* <Box className={`${classes.item} ${classes.blueBackground}`}> */}
							<Box className={`${classes.item} ${classes[themeClass]}`}>
								<Box className={classes.dragHandle}>
									<Box className={classes.dot}></Box>
									<Box className={classes.dot}></Box>
									<Box className={classes.dot}></Box>
								</Box>
								<Divider className={classes.sideBar} />
								<Box style={{width:"100%"}}>
									<Box style={{display:"flex", justifyContent:"space-between"}}>
										<Box style={{display:"flex"}}>
											<PlaylistAddCheckIcon className={classes.icon} />
											<Typography variant="subtitle1" style={{ fontWeight: 600 }}>
												{l1?.level1Label || "" }
											</Typography>
										</Box>
										<Box>
											<IconButton 
												variant="outlined" 
												size="small" 
												onClick={() => handleDialogOpen(l1, `${classes[themeClass]}`)}
											>
												<ZoomOutMapOutlined fontSize="small" className={`${classes[themeClass]}`} />
											</IconButton>
										</Box>
									</Box>
									{l1?.level2.map((l2, l2Index) =>
										<Fragment key={`level2-${l2Index}`}>
											<Box style={{display:"flex"}}>
												<Typography variant="caption" display="block" style={{paddingLeft:"3.1rem", marginTop:-10}}>
													{l2?.level2Label || ""}
												</Typography>
											</Box>
											<Box className={classes.listBox}>
											{l2?.level3.map((l3, l3Index) =>
												<Fragment key={`level3-${l3Index}`}>
												<Typography variant="subtitle2" display="block">{l3?.level3Label || ""}</Typography>
												{l3?.level4.map((l4, l4Index) =>
													<List key={`level4-${l4Index}`}>
													{l4.level5.map((l5, l5Index) => { 
														
														return (
														<ListItem key={`level5-${l5Index}`} className={classes.listItem}>
															<Box 
																style={{marginTop:0, marginRight:4, marginBottom:4}}
															>
																	•&nbsp;
															</Box>
															<ListItemText 
																primary={l5.label} 
																secondary={l4.leval4Label} 
																primaryTypographyProps={{ className: classes.listText }} 
																secondaryTypographyProps={{ className: classes.listSecoundaryText }}
																onClick={(e)=> history.push(`${l5.webUrl}`) }
															/>
															<FormControlLabel
																label=""
																labelPlacement="start"
																value={l5.id}
																control={
																	<ColouredCheckbox 
																		icon={<StarBorderRoundedIcon />} 
																		checkedIcon={<StarRoundedIcon />} 
																		name="favouriteId"
																		checked={!!checkedItems[l5.id]} // Ensure boolean value
																		onChange={(event) => handleChangeFavourite(event, l5.id)}
																		style={{padding:4}}
																	/>
																}
															/>
														</ListItem>
													)})}
													</List>
												)}
												</Fragment>
											)}
											</Box>
										</Fragment>
									)}
								</Box>
							</Box>
						</Grid>
					)})}
				</Grid>
			</Collapse>
			{/* Dialog for detailed view */}
			<Dialog
				open={dialogOpen}
				onClose={handleDialogClose}
				fullWidth
				maxWidth="md"
				scroll="paper"
			>
				{selectedItem && (
					<DialogContent className={`${selectedItemColorClasses+" "+classes.dialog}`}>
						<Box style={{ width: "100%" }}>
							<Box style={{ display: "flex", justifyContent:"space-between" }}>
								<Box style={{ display: "flex" }}>
									<PlaylistAddCheckIcon className={classes.icon} />
									<Typography variant="subtitle1" style={{ fontWeight: 600 }}>
										{selectedItem?.level1Label || ""}
									</Typography>
								</Box>
								<Box style={{ display: "flex" }}>
									<Button size="small" onClick={handleDialogClose} style={{minWidth:"auto", padding: "0px 8px"}}>
										<CloseIcon fontSize="small" className={selectedItemColorClasses} />
									</Button>
								</Box>
							</Box>
							{selectedItem?.level2.map((l2, l2Index) => (
								<Fragment key={`dialog-level2-${l2Index}`}>
								<Box style={{ display: "flex" }}>
									<Typography
										variant="caption"
										display="block"
										style={{ paddingLeft: "3.1rem", marginTop: -10 }}
									>
									{l2?.level2Label || ""}
									</Typography>
								</Box>
								<Box className={classes.listBox} style={{ height: "auto" }}>
									{l2?.level3.map((l3, l3Index) => (
									<Fragment key={`dialog-level3-${l3Index}`}>
										<Typography variant="subtitle2" display="block">
										{l3?.level3Label || ""}
										</Typography>
										{l3?.level4.map((l4, l4Index) => (
										<List key={`dialog-level4-${l4Index}`}>
											{l4.level5.map((l5, l5Index) => (
											<ListItem
												key={`dialog-level5-${l5Index}`}
												className={classes.listItem}
											>
												<Box
													style={{
														marginTop: 0,
														marginRight: 4,
														marginBottom: 4
													}}
												>
													•&nbsp;
												</Box>
												<ListItemText
													primary={l5.label}
													secondary={l4.leval4Label}
													primaryTypographyProps={{
														className: classes.listText
													}}
													secondaryTypographyProps={{
														className: classes.listSecoundaryText
													}}
													onClick={(e) => {
														history.push(`${l5.webUrl}`);
														handleDialogClose();
													}}
												/>
												<FormControlLabel
													label=""
													labelPlacement="start"
													value={l5.id}
													control = {
														<ColouredCheckbox
															icon={<StarBorderRoundedIcon />}
															checkedIcon={<StarRoundedIcon />}
															name="favouriteId"
															checked={!!checkedItems[l5.id]}
															onChange={(event) =>
																handleChangeFavourite(event, l5.id)
															}
															style={{ padding: 4 }}
														/>
													}
												/>
											</ListItem>
											))}
										</List>
										))}
									</Fragment>
									))}
								</Box>
								</Fragment>
							))}
						</Box>
					</DialogContent>
				)}
			</Dialog>
		</Card>
	);
};

export default FeaturesCard;
