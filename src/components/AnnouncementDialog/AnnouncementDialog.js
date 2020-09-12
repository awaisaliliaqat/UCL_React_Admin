import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AnnouncmentBackgroundIcon2 from '../../assets/Images/megaphoneIcon2.png';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: 550,
    //maxWidth: 500,
    backgroundColor: theme.palette.secondary.light
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: theme.palette.common.white,
  },
  titleTypography:{
    //color: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize:"1.5em"
  }
}); 

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, hideClose, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4" className={classes.titleTypography}>{children}&nbsp;<img src={AnnouncmentBackgroundIcon2} style={{height:32}}/></Typography>
      {!hideClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const AnnouncementDialog = props => {
  const { handleClose, open, title, content, isFullScreen, disableBackdropClick, actions, disableEscapeKeyDown, disableScrollLock, hideClose, dividers } = props;
  return (
    <div>
      <Dialog 
        maxWidth="md"
        disableBackdropClick={disableBackdropClick} 
        disableScrollLock={disableScrollLock}
        disableEscapeKeyDown={disableEscapeKeyDown} 
        fullScreen={isFullScreen} 
        onClose={handleClose}
        aria-labelledby="customized-dialog-title" 
        open={open}
      >
        <DialogTitle id="customized-dialog-title" hideClose={hideClose} onClose={handleClose}>
          {title}
        </DialogTitle>
        <DialogContent dividers={dividers}>
          <Typography gutterBottom>
            {content}
          </Typography>
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    </div>
  );
}

AnnouncementDialog.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
  disableScrollLock: PropTypes.bool,
  hideClose: PropTypes.bool,
  content: PropTypes.any,
  actions: PropTypes.any,
  dividers: PropTypes.bool
};

AnnouncementDialog.defaultProps = {
  title: "",
  open: false,
  content: "",
  handleClose: fn => fn,
  isFullScreen: false,
  actions: "",
  disableBackdropClick: false,
  disableEscapeKeyDown: false,
  disableScrollLock: false,
  hideClose: false,
  dividers: false
};

export default AnnouncementDialog;