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
  { label: "Class not held by teacher (In-Person)", color: "darkred" },
  { label: "Class not held by teacher (Virtual)", color: "orangered" },
  { label: "Class held by teacher (Virtual)", color: "mediumseagreen" },
  { label: "Class held by teacher (In-Person)", color: "royalblue" },
  { label: "Student gate-in exist", color: "darkgreen" },
  { label: "Student gate-in not exist", color: "crimson" },
  { label: "Present", color: "black" },
  { label: "Absent", color: "darkgrey" },
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
      <CardContent>
        {/* Status Legends */}
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

        {/* Class List */}
        <List>
          {data.length > 0 ? (
            data.map((dt, i) => (
              <Fragment key={i}>
                <ListItem style={{ paddingTop: 0 }} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Img"
                      src={BookAssignments}
                      className={classes.smallAvatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography component="legend" color="textPrimary">
                        {dt.sectionLabel}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        style={{ paddingLeft: "2px" }}
                      >
                        {dt.startTime}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      onClick={(e) => props.onJoinClick(e, dt)}
                      color="primary"
                      disabled={!dt.meetingStartUrl}
                    >
                      Join
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </Fragment>
            ))
          ) : isLoading ? (
            <Grid container justify="center">
              <CircularProgress />
            </Grid>
          ) : null}
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
