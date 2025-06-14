import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
	grow: {
		flexGrow: 1,
	},
}));

function BottomBar(props) {

	const classes = useStyles();

	const bottomRightButtonAction = (props) => {
		props.bottomRightButtonAction();
	};

	const bottomLeftButtonAction = (props) => {
		props.bottomLeftButtonAction();
	};
	
	return (
		<div>
			<AppBar
				position="fixed"
				color="default"
				style={{
					top: "auto",
					bottom: 0,
					paddingLeft: props.isDrawerOpen ? 280 : 0,
				}}
			>
				<Toolbar variant="dense">
					<Button
						variant="contained"
						color="primary"
						onClick={() => bottomLeftButtonAction(props)}
						disabled={props.disableLeftButton}
						style={{ display: props.leftButtonHide ? "none" : "block" }}
					>
						{props.loading ? (
							<CircularProgress size={24} style={{ color: "white" }} />
						) : (
							props.leftButtonText
						)}
					</Button>
					<div className={classes.grow} />
					{props.otherActions}
					<Button
						variant="contained"
						color="primary"
						disabled={props.disableRightButton || props.loading}
						onClick={() => bottomRightButtonAction(props)}
						style={{
							display: props.hideRightButton ? "none" : "flex",
						}}
					>
						{props.loading ? (
							<CircularProgress size={24} style={{ color: "white" }} />
						) : (
							props.right_button_text
						)}
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}

BottomBar.propTypes = {
	isDrawerOpen: PropTypes.bool,
	disableLeftButton: PropTypes.bool,
	leftButtonHide: PropTypes.bool,
	leftButtonText: PropTypes.any,
	bottomLeftButtonAction: PropTypes.func,
	disableRightButton: PropTypes.bool,
	hideRightButton: PropTypes.bool,
	right_button_text: PropTypes.any,
	bottomRightButtonAction: PropTypes.func,
	loading: PropTypes.bool,
	otherActions: PropTypes.any,
};

BottomBar.defaultProps = {
	isDrawerOpen: true,
	disableLeftButton: false,
	leftButtonHide: false,
	leftButtonText: "View",
	bottomLeftButtonAction: (fn) => fn,
	disableRightButton: false,
	hideRightButton: false,
	right_button_text: "Save",
	bottomRightButtonAction: (fn) => fn,
	loading: false,
	otherActions: "",
};

export default BottomBar;
