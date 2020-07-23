import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Zoom from "@material-ui/core/Zoom";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";


const useStyles = makeStyles(theme => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(10),
        right: theme.spacing(5)
    }
}));

const ScrollToTop = () => {
    const classes = useStyles();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    return (
        <Zoom in={trigger}>
            <div title="scroll back to top" onClick={handleClick} role="presentation" className={classes.root}>
                <Fab color="primary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </div>
        </Zoom>
    );
}

export default ScrollToTop;