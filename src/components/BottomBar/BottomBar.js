import React from "react";

import { makeStyles, useTheme, withStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Drawer,
  List,
  ListItem,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button
} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },

  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  bigAvatar: {
    margin: 10
  },
  badgeMargin: {

    margin: theme.spacing()

  },
  inline: {
    display: "inline"
  },
  button: {

    margin: theme.spacing()
  },
  leftIcon: {
    marginRight: theme.spacing()
  },
  rightIcon: {
    marginLeft: theme.spacing()

  },
  iconSmall: {
    fontSize: 20
  }
}));

function BottomBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const isMenuOpen = Boolean(anchorEl);
  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }
  function handleDrawerOpen() {
    setOpen(true);
  }
  function bottomRightButtonAction(props) {
    props.bottomRightButtonAction();
  }

  function bottomLeftButtonAction(props) {
    props.bottomLeftButtonAction();
  }
  return (
    <div>
      <AppBar
        position="fixed"

        color="default"
<<<<<<< HEAD
        style={{
          top: "auto",
          bottom: 0,
=======
        style={{ 
          top: "auto", 
          bottom:0,
>>>>>>> 5e006d44315ab26c7e1ebe6d2ac6c12f60858663
          paddingLeft: props.isDrawerOpen ? 280 : 0
        }}

      >
        <Toolbar variant="dense">
          <Button
            variant="contained"
            color="default"
            onClick={event => bottomLeftButtonAction(props)}

            style={{ display: props.left_button_hide == true ? "none" : "block" }}
          >
            {props.left_button_text}
          </Button>
          <div className={classes.grow} />

          <Button
            variant="contained"
            color="primary"
            variant="contained"
            disabled={props.loading}
            onClick={event => bottomRightButtonAction(props)}
            style={{
              backgroundColor: '#174A84'
            }}
          >

            {props.loading ?
              <CircularProgress
                size={24}
                style={{ color: 'white' }}
              />

              :
              props.right_button_text
            }
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default BottomBar;
