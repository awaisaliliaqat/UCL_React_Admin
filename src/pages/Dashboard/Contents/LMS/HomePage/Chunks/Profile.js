import React from "react";
import PropTypes from 'prop-types';
import AssignmentsIcon from '../../../../../../assets/Images/grade_book_assignments.png';
import { withStyles } from "@material-ui/core/styles";

import {
  Card,
  CardHeader,
  Button,
  Typography,
  Avatar,
  CardContent,
  Divider,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Link
} from "@material-ui/core";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import ProfilePlaceHolder from '../../../../../../assets/Images/ProfilePlaceholder.png';

const styles = () => ({
  smallAvatar: {
    width: 30,
    height: 30,
    marginTop: 12,
    marginRight: 15,
    marginLeft: '-15px'
  },
  action: {
    display: "flex"
  },
  handCursor: {
    cursor: "pointer",
    listStyleType: "square"
  },
});


const Profile = (props) => {
  const classes = props.classes;
  const adminData = localStorage.getItem("adminData")
    ? JSON.parse(localStorage.getItem("adminData"))
    : {};

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader
        avatar={<Avatar aria-label="Recipe" src={ProfilePlaceHolder} />}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={adminData.displayName || "Student"}
        subheader={adminData.email || "N/A"}
      />

      <CardContent style={{ paddingBottom: 0 }}>
        <Typography variant="caption">Quick Links</Typography>
        <Divider variant="fullWidth" />
        <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
          <Link href="#/dashboard/F33Form/0" target="_blank" variant="body1" className={classes.handCursor}>
            Time Table
          </Link>
          <br />
          <Link href="#/dashboard/teacher-attendance-report" target="_blank" variant="body1" className={classes.handCursor}>
            Attendance Report
          </Link>
          <br />
        </div>
        <br />

        <Typography variant="caption">Enrolled Sections</Typography>
        <Divider variant="fullWidth" />

        <List style={{ marginLeft: "-5px" }}>
          {props.sectionsData.map((item, index) => {
            if (index < 8) {
              return (
                <ListItem key={index} style={{ marginBottom: '-5px' }} alignItems="flex-start">
                  <Avatar
                    alt="img"
                    src={AssignmentsIcon}
                    className={classes.smallAvatar}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        component="legend"
                        color="textPrimary"
                      >
                        {item.label}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="caption" color="textSecondary">
                          {`${item.courseLabel}`}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              );
            }
          })}
        </List>
      </CardContent>
      <Divider variant="middle" />
      <CardActions className={classes.action}>
        <Button
          disabled
          color={"primary"}
          style={{ marginLeft: "auto", textTransform: "none" }}
        >
          View All
        </Button>
      </CardActions>
    </Card>
  );
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  sectionsData: PropTypes.array
}

Profile.defaultProps = {
  sectionsData: []
}

export default withStyles(styles)(Profile);
