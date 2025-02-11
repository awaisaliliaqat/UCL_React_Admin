import React, { Fragment } from "react";
import { Card, Grid, Typography, IconButton, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
// import DescriptionIcon from "@material-ui/icons/Description";
// import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
// import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
// import AddIcon from "@material-ui/icons/Add";
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
	card: {
		padding: theme.spacing(2),
		borderRadius: theme.spacing(1),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		backgroundColor:"#ffffff8a"
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing(2),
	},
	gridItem: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		padding: theme.spacing(2),
		borderRadius: theme.spacing(1),
		backgroundColor: "#f8f9fc",
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		cursor: "pointer",
		"&:hover": {
			boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
		},
	},
	icon: {
		marginBottom: theme.spacing(1),
	},
	text: {
		fontWeight: "bold",
		textAlign: "center",
		whiteSpace: "nowrap",
    	overflow: "hidden",
    	textOverflow: "ellipsis",
    	width: "100%",
		fontSize:"0.9rem"
	},
	baxItem: {
		overflow: "auto",
    	height: 205, // Default fixed height for larger screens
		paddingRight: 8,
    	[theme.breakpoints.down("sm")]: {
			maxHeight: 410,
      		height: "auto", // Adjust height dynamically for small screens
    	},
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
}));

const QuickActionsCard = ({isLoadingFavouriteFeatures, favouriteFeatures}) => {

	const classes = useStyles();

	const history = useHistory();

	while (favouriteFeatures.length < 4) {
		favouriteFeatures.push({ id: 0, label: "- - -", webUrl: "" });
	}

	return (
		<Card className={classes.card}>
			<Box className={classes.header}>
				<Typography variant="h6" style={{ fontWeight: 600, fontSize: "1.1rem"}}>
					Quick Actions
				</Typography>
				{/* 
				<IconButton color="primary" size="small">
					<AddIcon />
				</IconButton> 
				*/}
			</Box>
			<Grid container spacing={2} className={classes.baxItem}>
				{!isLoadingFavouriteFeatures && favouriteFeatures ?
					favouriteFeatures.map((feature, i)=>
					<Grid item xs={12} sm={6} key={`favouriteFeatures-${i}`}>
						<Box className={classes.gridItem} onClick={ (e)=> feature.webUrl ? history.push(`${feature.webUrl}`) : null } style={ feature.webUrl ? {cursor:"pointer"} : {cursor:"default"} }>
							{feature.webUrl ?  <StarRoundedIcon className={classes.icon} color="primary" /> : <StarBorderRoundedIcon className={classes.icon} color="primary" /> }
							<Typography className={classes.text}>{feature.label}</Typography>
						</Box>
					</Grid>
					)
					:
					<Fragment>
						{Array(4).fill(0).map((d, i) =>
						<Grid item xs={12} sm={6} key={"favouriteFeaturesSkeleton-"+i}>
							<Skeleton height={85} style={{transform:"none"}}/>
						</Grid>
						)}
					</Fragment>
				}
				{/* 
				<Grid item xs={12} sm={6}>
					<Box className={classes.gridItem}>
						<CalendarTodayIcon className={classes.icon} color="primary" />
						<Typography className={classes.text}>
							Reschedule Classes
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Box className={classes.gridItem}>
						<DescriptionIcon className={classes.icon} color="primary" />
						<Typography className={classes.text}>
							Degree Program Activation
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Box className={classes.gridItem}>
						<FormatListBulletedIcon className={classes.icon} color="primary" />
						<Typography className={classes.text}>
							Assigning Section to Teacher
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Box className={classes.gridItem}>
						<ChatBubbleIcon className={classes.icon} color="primary" />
						<Typography className={classes.text}>Grade Book Setup</Typography>
					</Box>
				</Grid> 
				*/}
			</Grid>
		</Card>
	);
}

export default QuickActionsCard;
