import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  DialogContent,
  Typography,
  ListItemAvatar,
  Avatar,
  DialogActions,
  Button,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import EcoIcon from "@material-ui/icons/Eco";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  button: {
    textTransform: "capitalize",
    fontSize: 12,
    margin: 10,
  },
  imageContainer: {
    height: 40,
    width: 40,
    border: "1px solid #ccc3c3",
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 15,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
});

const R314StudentCentricDashboardDialog = (props) => {
  const classes = useStyles();
  const { handleClose, data, open } = props;

  return (
    <Fragment>
      <Dialog
        scroll="paper"
        onClose={handleClose}
        aria-labelledby="student features"
        open={open}
      >
        <DialogTitle color="primary" id="simple-dialog-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              className={classes.imageContainer}
              style={{
                backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${data.imageName})`,
              }}
            />

            <Typography
              color="primary"
              style={{
                fontSize: 17,
                fontWeight: 600,
              }}
            >{`${data.studentId || "N/A"} - ${
              data.displayName || "N/A"
            }`}</Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            style={{
              fontSize: 12,
            }}
          >
            Please click below on any <b>Feature</b> to open details according
            to selected student{" "}
          </Typography>
          {data.featuresData && data.featuresData?.length > 0 ? 
            <List>
            {data.featuresData?.map((item) => (
              <ListItem
                button
                onClick={() => {
                  if (item.action) {
                    window.open(item.action, "_blank", "noreferrer");
                  }
                }}
                key={item}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <EcoIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List> :
          <center><Typography style={{
            marginTop: 20,
            color: "gray",
            opacity: 0.8,
            fontSize: 14
          }}>Student&apos;s related Features are not assigned.</Typography></center>
          }
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClose}
            color="default"
          >
            Close
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={() =>  window.open(`#/dashboard/R314StudentCentricDashboard/${data.studentId}`, "_blank", "noreferrer")}
            color="primary"
          >
            Dashboard View
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

R314StudentCentricDashboardDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.object,
};

R314StudentCentricDashboardDialog.defaultProps = {
  handleClose: (fn) => fn,
  open: false,
  data: {},
};

export default R314StudentCentricDashboardDialog;
