import React, { useState } from "react";
import { Card, Grid, Typography, Box, Tooltip, IconButton, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DescriptionIcon from "@material-ui/icons/Description";
import BusinessIcon from "@material-ui/icons/Business";
import SettingsApplicationsOutlinedIcon from '@material-ui/icons/SettingsApplicationsOutlined';
import { useHistory } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
	card: {
		padding: theme.spacing(2),
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
		cursor: "pointer",
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
		top: 0,
		borderRadius: theme.spacing(0.5),
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
}));

const NucleusControlToolsCard = ({data, dataIndex}) => {
	
	const classes = useStyles();

	const history = useHistory();

	const [toggleLevelForm, setToggleLevelForm] = useState(false);

	const handleToggleLevlForm = () => {
		setToggleLevelForm(!toggleLevelForm);
	};

	const themes = ["greenBackground", "blueBackground", "pinkBackground", "purpleBackground"];

	const colors = ["rgb(163, 232, 188)", "rgb(191, 198, 255)", "rgb(255, 202, 227)", "rgb(212, 169, 255)"];

	//const icons = [<BusinessIcon className={classes.icon} />, <DescriptionIcon className={classes.icon} />, <AddBoxIcon className={classes.icon} />, <DescriptionIcon className={classes.icon} />];

	const icons = [<SettingsApplicationsOutlinedIcon className={classes.icon} />, <SettingsApplicationsOutlinedIcon className={classes.icon} />, <SettingsApplicationsOutlinedIcon className={classes.icon} />, <SettingsApplicationsOutlinedIcon className={classes.icon} />];



	let countPrint = 0;

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
					return (
						l1?.level2.map((l2, l2Index) => 
							l2?.level3.map((l3, l3Index) => 
								l3?.level4.map((l4, l4Index) => 
									l4?.level5.map((l5, l5Index) => {
										// const themeClass = themes[l1Index % themes.length];
										// const color = colors[l1Index % colors.length];
										// const icon = icons[l1Index % icons.length];
										const themeClass = themes[countPrint];
										const color = colors[countPrint];
										const icon = icons[countPrint];
										if(countPrint>=4){
											countPrint = 0;
										} else {
											countPrint++;
										}
										return (
											<Grid key={`level5-${l5.id}`} item xs={12} sm={6}> 
												<Box className={`${classes.item} ${classes[themeClass]}`} onClick={(e)=> history.push(`${l5.webUrl}`)}>
													<Box className={classes.dragHandle}>
														<Box className={classes.dot}></Box>
														<Box className={classes.dot}></Box>
														<Box className={classes.dot}></Box>
													</Box>
													<Box className={classes.sideBar} style={{backgroundColor: `${color}`}} />
													{icon}
													<Typography variant="subtitle1" style={{ fontWeight: 600 }}>
														{l5.label}
													</Typography>
												</Box>
											</Grid>
										)
									})
								)		
							)
						)
					)}
				)}
			</Grid>
			</Collapse>
		</Card>
	);
};

export default NucleusControlToolsCard;
