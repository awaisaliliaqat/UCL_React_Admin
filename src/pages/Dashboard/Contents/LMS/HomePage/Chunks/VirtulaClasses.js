import React from "react";
import PropTypes from "prop-types";
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
  // Badge,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  withStyles,
  Tooltip,
  Button,
  ListItemSecondaryAction,
} from "@material-ui/core";
import TrainingIcon from "../../../../../../assets/Images/my_objectives_training.png";
// import CreateIcon from "@material-ui/icons/Create";
import AssignmentsIcon from "../../../../../../assets/Images/grade_book_assignments.png";
import VisibilityIcon from "@material-ui/icons/Visibility";
// import NotificationsIcon from "@material-ui/icons/Notifications";
// import ScheduleIcon from "@material-ui/icons/Schedule";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(),
  },
  smallAvatar: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
  card: {
    cursor: "pointer",
  },
  bigAvatar: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 0,
  },
});
const VirtulaClasses = (props) => {
  const classes = props.classes;
  return (
    <Card>
      <CardHeader
        title={<Typography color="primary">Classes</Typography>}
        subheader={"Join your virtual classes"}
        onClick={() => window.open("#/dashboard/F33Form/0")}
        avatar={<Avatar className={classes.bigAvatar} src={TrainingIcon} />}
        className={classes.card}
      />
      <CardContent style={{ height: "210px" }}>
        <List
          style={{
            marginTop: "-30px",
          }}
        >
          {props.classesData.map((item, index) => {
            return (
              <ListItem
                key={index}
                style={{ paddingTop: 0 }}
                alignItems="flex-start"
              >
                <ListItemAvatar>
                  <Avatar
                    alt="img"
                    src={TrainingIcon}
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
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        variant="caption"
                        style={{ paddingLeft: "2px" }}
                      >
                        {item.startTime}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction style={{ right: 0 }}>
                  <Button
                    disabled={!item.meetingStartUrl}
                    onClick={(e) => props.onJoinClick(e, item)}
                    color="primary"
                  >
                    Join
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      <Divider variant="middle" />
      <CardActions style={{ textAlign: "center" }} className={classes.actions}>
        <div>
          <Tooltip title="View All">
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/F33Form/0"
              target="_blank"
            >
              <IconButton aria-label="View">
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
          {/* <Tooltip title="In Progress">
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
          </Tooltip> */}
        </div>
      </CardActions>
    </Card>
  );
};
VirtulaClasses.propTypes = {
  classes: PropTypes.object.isRequired,
  classesData: PropTypes.array,
  onJoinClick: PropTypes.func,
};

VirtulaClasses.defaultProps = {
  classesData: [],
  onJoinClick: (fn) => fn,
};

export default withStyles(styles)(VirtulaClasses);
