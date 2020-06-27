import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Divider from '@material-ui/core/Divider';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from '@material-ui/core/MenuItem';
import ProfilePlaceholder from '../../assets/Images/ProfilePlaceholder.png';
import ChangePasswordMenu from '../ChangePasswordMenu/ChangePasswordMenu';
import Menu from '@material-ui/core/Menu';
import HomeIcon from '@material-ui/icons/Home';
import { Link, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        marginTop: 15,
        fontSize: 20,
        fontStyle: 'italic',
        color: '#707070',
        fontWeight: 600,
        marginLeft: 10,
        whiteSpace: 'pre-wrap',
        lineHeight: 'normal',
        fontFamily: 'Gill Sans MT',
    },
    vline: {
        borderLeft: '1px solid #00000029',
        height: 50,
        marginLeft: 50
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },

}));

const NavBar = props => {
    const { logo, isAuthorize, userName, isOpenMenu, setOpenMenu } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openChangePassword, setOpenChangepassword] = React.useState(false);
    const open = Boolean(anchorEl);
    const classes = useStyles();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const onLogout = () => {
        window.localStorage.removeItem("adminData");
        window.localStorage.removeItem("uclAdminToken");
        window.location.replace("#/login");
    }

    // const handleChangePasswordClick = () => {
    //     setOpenChangepassword(true);
    //     handleClose();

    // }
    const homepage = () => {
        window.location.replace("#/dashboard");
        window.location.reload();
    }

    return (

        <Fragment>
            <AppBar style={{ color: 'black', backgroundColor: "white" }} position="fixed" className={classes.appBar}>
                <Toolbar style={{
                    paddingLeft: 3, display: 'flex',
                    justifyContent: 'space-between',
                    minHeight: `${isAuthorize ? '' : '57px'}`
                }} variant="dense">
                    <div style={{ display: 'flex' }}>
                        {isAuthorize &&
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                style={{ marginLeft: 5 }}
                                title={isOpenMenu ? 'Hide Menu' : 'Show Menu'}
                                onClick={(e) => setOpenMenu(e)}
                            >
                                {isOpenMenu ? <ArrowBackIosIcon /> : <MenuIcon />}
                            </IconButton>
                        }

                        <IconButton style={{ padding: 5 }} color="inherit" aria-label="Menu">
                            {logo && <img alt="" src={logo} width={50} />}
                        </IconButton>
                        <Typography className={classes.title} variant="subtitle1" noWrap>
                            {"University College Lahore"}
                        </Typography>
                    </div>
                    {isAuthorize && (
                        <div>
                            <IconButton
                                style={{ color: '#174A84', opacity: '0.8' }}
                                onClick={homepage}
                                title="Go to home page"
                            >
                                <HomeIcon />

                            </IconButton>

                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <img alt="" style={{ borderRadius: '50%' }} src={ProfilePlaceholder} width={30} />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem style={{ fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize' }} onClick={handleClose}>{userName}</MenuItem>
                                <Divider />
                                {/* <MenuItem style={{ fontSize: 12 }} onClick={handleChangePasswordClick}>Change Password</MenuItem> */}
                                <MenuItem onClick={() => onLogout()} style={{ fontSize: 12 }}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                    {
                        !isAuthorize && (
                            <div>
                                <Button
                                    color="primary"
                                    style={{
                                        marginBottom: 10,
                                        marginRight: 10,
                                        awidth: 150,
                                        textTransform: "capitalize",
                                        color: "#303F9F",
                                        borderColor: "#303F9F",
                                    }}
                                    onClick={() => window.location = "http://ucl.edu.pk/"}
                                >
                                    <Link style={{ textDecoration: 'none' }} to='http://ucl.edu.pk/'>
                                        UCL Home
                          </Link>

                                </Button>
                            </div>
                        )

                    }
                </Toolbar>

            </AppBar>

            <ChangePasswordMenu open={openChangePassword} handleClose={() => setOpenChangepassword(false)} />



        </Fragment >
    );
}
NavBar.propTypes = {
    logo: PropTypes.any,
    title: PropTypes.string,
    userName: PropTypes.string,
    isAuthorize: PropTypes.bool,
    isOpenMenu: PropTypes.bool,
    setOpenMenu: PropTypes.func
};

NavBar.defaultProps = {
    logo: null,
    title: "",
    userName: "Student",
    isAuthorize: false,
    isOpenMenu: false,
    setOpenMenu: fn => fn
};

export default NavBar;