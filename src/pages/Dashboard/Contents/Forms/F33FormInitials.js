import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  Divider,
  CardActions,
  Typography,
  Avatar,
  CardContent,
  List,
  Badge,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  withStyles,
  Tooltip,
  Button,
  ListItemSecondaryAction,
  CircularProgress,
  Grid
} from "@material-ui/core";
import HelpIcon from "../../../../assets/Images/workflows.png";
import CreateIcon from "@material-ui/icons/Create";
import NotificationsIcon from "@material-ui/icons/Notifications";
//import ProfilePlaceHolder from '../../../../assets/Images/ProfilePlaceholder.png';
import ProfilePlaceHolder from '../../../../assets/Images/my_objectives_training.png';
import ScheduleIcon from "@material-ui/icons/Schedule";
import BookAssignments from "../../../../assets/Images/grade_book_assignments.png";

const styles = theme => ({

  margin: {
    margin: theme.spacing(2)
  },

  extendedIcon: {
    marginRight: theme.spacing(2)
  },

  smallAvatar: {
    width: 30,
    height: 30,
    marginTop: 5,
    borderRadius: 0
  },

  bigAvatar: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 0
  },

  card: {
    //cursor: "pointer"
  }

});

const F33FormInitials = (props) => {

  const classes = props.classes;

  const data = props.data;

  return (
    <Card
      //onClick={() => window.open('#/dashboard/calendar')} 
      //title="View Time Table" 
      className={classes.card}
    >
      <CardHeader
        title={<Typography color="primary">Classes</Typography>}
        subheader={"Join your virtual classes"}
        avatar={<Avatar className={classes.bigAvatar} src={ProfilePlaceHolder} />}
      />
      <CardContent
      // style={{ 
      //   height: '210px' 
      // }}
      >
        <List style={{
          marginTop: '-30px'
        }}>
          {data ?
            data.map((dt, i) => (
              <Fragment key={i}>
                <ListItem
                  style={{ paddingTop: 0 }}
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar
                      alt="Img"
                      src={BookAssignments}
                      className={classes.smallAvatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        component="legend"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {dt.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          variant="caption"
                          style={{ paddingLeft: "2px" }}
                        >
                          {dt.startTime}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction style={{ right: 0 }}>
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
            :
            <Grid container justify="center">
              <CircularProgress />
            </Grid>
          }
          {/* 
          <ListItem style={{ paddingTop: 0 }} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src={ProfilePlaceHolder}
                className={classes.smallAvatar}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="legend"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Physics
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    9:00 am
                  </Typography>
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction style={{ right: 0 }}>
              <Button disabled color="primary">
                Join
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem style={{ paddingTop: 0 }} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src={ProfilePlaceHolder}
                className={classes.smallAvatar}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="legend"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Fundamentals of Programming
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    10:00 am
                  </Typography>
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction style={{ right: 0 }}>
              <Button disabled color="primary">
                Join
              </Button>
            </ListItemSecondaryAction>
          </ListItem> 
          */}
        </List>
      </CardContent>
      <Divider variant="middle" />
      <CardActions style={{ textAlign: "center" }} className={classes.actions}>
        <div>
          <Tooltip title="View">
            {/* <Link 
              style={{ textDecoration: 'none' }} 
              to="/dashboard/calendar" 
              target="_blank"
            > */}
            <IconButton aria-label="View">
              <CreateIcon />
            </IconButton>
            {/* </Link> */}
          </Tooltip>
          <Tooltip title="In Progress">
            <IconButton aria-label="In Progress">
              <Badge color="primary" badgeContent={4}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Action Awaited">
            <IconButton aria-label="Action Awaited">
              <Badge color="primary" badgeContent={4}>
                <ScheduleIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </div>
      </CardActions>
    </Card>
  );
}

F33FormInitials.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(F33FormInitials);
