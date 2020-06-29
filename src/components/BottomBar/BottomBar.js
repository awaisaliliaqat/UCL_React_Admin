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
  Button,
  TextareaAutosize
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
        style={{ 
          top: "auto", 
          bottom:0,
          paddingLeft: props.isDrawerOpen ? 250 : 0
        }}
      >
        <Toolbar variant="dense">
          <Button
            variant="contained"
            color="default"
            onClick={event => bottomLeftButtonAction(props)}
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
