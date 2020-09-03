import React from "react";
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  CardActions,
  Button,
  Typography,
  Avatar,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  withStyles,
  Tooltip,
} from "@material-ui/core";

import AssignmentsIcon from '../../../../../../assets/Images/grade_book_assignments.png';

const styles = theme => ({
  margin: {
    margin: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing(2)
  },
  smallAvatar: {
    width: 30,
    height: 30
  },
  actions: {
    justifyContent: 'flex-end',
    textAlign: 'center'
  },
  btnText: {
    fontSize: 15,
    padding: 12,
    textTransform: 'capitalize'
  },
  bigAvatar: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 0
  }
});
const Assignements = (props) => {

  const { classes } = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={<Typography color="primary">Assignments</Typography>}
        subheader={"Manage assignments"}
        avatar={<Avatar className={classes.bigAvatar} src={AssignmentsIcon} />}
        onClick={() => window.location = "#/dashboard/F107Form/0"}
        style={{ cursor: "pointer" }}
      />
      <CardContent style={{ height: '210px' }}>
        <List style={{
          marginTop: '-30px'
        }}>
          <ListItem style={{
            cursor: "pointer"
          }} onClick={() => window.open('#/dashboard/F34Form/0')} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={AssignmentsIcon}
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
                  Setting
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    Manage assignments
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem style={{
            cursor: "pointer"
          }} onClick={() => window.open('#/dashboard/F36Form/0')} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={AssignmentsIcon}
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
                  Grading
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    Manage grades
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem style={{
            cursor: "pointer"
          }} onClick={() => window.open('#/dashboard/R41Reports')} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={AssignmentsIcon}
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
                  Summary Report
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    Assignments Summary
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </CardContent>
      <Divider variant="middle" />
      <CardActions className={classes.actions}>
        <div>
          <Tooltip title="More">
            <Button disabled className={classes.btnText} color="primary">
              More
            </Button>
          </Tooltip>
        </div>
      </CardActions>
    </Card>
  );
}
Assignements.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  downloadFile: PropTypes.func
}

Assignements.defaultProps = {
  data: [],
  isLoading: false,
  downloadFile: fn => fn
}

export default withStyles(styles)(Assignements);
