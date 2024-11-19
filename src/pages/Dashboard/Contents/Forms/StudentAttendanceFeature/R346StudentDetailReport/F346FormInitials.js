import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  Divider,
  CardContent,
  List,
  Avatar,
  Typography,
  Button,
  withStyles,
  CircularProgress,
  Grid,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from "@material-ui/core";
import ProfilePlaceHolder from "../../../../../../assets/Images/my_objectives_training.png";
import BookAssignments from "../../../../../../assets/Images/grade_book_assignments.png";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  smallAvatar: {
    width: 30,
    height: 30,
    marginTop: 5,
    borderRadius: 0,
  },
  bigAvatar: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 0,
  },
  statusBullet: {
    display: "inline-block",
    width: 15,
    height: 15,
    borderRadius: "50%",
    marginRight: theme.spacing(1),
  },
  darkred: {
    backgroundColor: "darkred",
  },
  orangered: {
    backgroundColor: "orangered",
  },
  mediumseagreen: {
    backgroundColor: "mediumseagreen",
  },
  royalblue: {
    backgroundColor: "royalblue",
  },
  crimson: {
    backgroundColor: "#FFA499",
  },
  darkgreen: {
    backgroundColor: "#64B5F6",
  },
  black: {
    backgroundColor: "black",
  },
  darkgrey: {
    backgroundColor: "#585858",
  },
});

const statusData = [
  { label: "Class not held by teacher", color: "darkred" },
  // { label: "Class not held by teacher (Virtual)", color: "orangered" },
  // { label: "Class held by teacher (Virtual)", color: "mediumseagreen" },
  { label: "Class held by teacher", color: "royalblue" },

  { label: "Present", color: "black" },
  { label: "Absent", color: "orangered" },
];

const backgroundStatus = [
  { label: "Student gate-in exist", color: "darkgreen" },
  { label: "Student gate-in not exist", color: "crimson" },
];

const F33FormInitials = (props) => {
  const { classes, data, isLoading } = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={<Typography color="primary">Legend</Typography>}
        // subheader={"Classes Status"}
        avatar={
          <Avatar className={classes.bigAvatar} src={ProfilePlaceHolder} />
        }
      />
      {/* <CardHeader title={<Typography color="primary">Font Color</Typography>} /> */}

      <CardContent>
        {/* Status Legends */}
        <CardHeader
          title={<Typography color="primary">Font Color</Typography>}
        />

        <List style={{ marginBottom: "20px" }}>
          {statusData.map((status, index) => (
            <ListItem key={index}>
              <span
                className={`${classes.statusBullet} ${classes[status.color]}`}
              />{" "}
              <Typography variant="body2">{status.label}</Typography>
            </ListItem>
          ))}
        </List>
        {/* 
        <CardHeader
          title={<Typography color="primary">background Color</Typography>}
        /> */}
        {/* </CardContent>
      <CardContent> */}
        <CardHeader
          title={<Typography color="primary">Background Color</Typography>}
        />
        <List style={{ marginBottom: "20px" }}>
          {backgroundStatus.map((status, index) => (
            <ListItem key={index}>
              <span
                className={`${classes.statusBullet} ${classes[status.color]}`}
              />{" "}
              <Typography variant="body2">{status.label}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Divider variant="middle" />
    </Card>
  );
};

F33FormInitials.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(F33FormInitials);
