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
import DiscussionIcon from "../../../../../../assets/Images/workfellows.png";
import CommunityIcon from '../../../../../../assets/Images/community.png';
import GradedMarksIcon from '../../../../../../assets/Images/grade_book_quiz.png';
import GDBSummaryIcon from '../../../../../../assets/Images/workflows.png';

const styles = theme => ({
  margin: {
    margin: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
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
const GradedDiscussion = (props) => {

  const { classes } = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={<Typography color="primary">Graded Discussion Board</Typography>}
        subheader={"Graded discussion board"}
        avatar={<Avatar className={classes.bigAvatar} src={DiscussionIcon} />}
      />
      <CardContent style={{ height: '210px' }}>
        <List style={{
          marginTop: '-30px'
        }}>
          <ListItem style={{
            cursor: "pointer"
          }} onClick={() => window.open('#/dashboard/F40Form/0')} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={CommunityIcon}
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
                    Manage graded discussion board
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem style={{
            cursor: "pointer"
          }} onClick={() => window.open('#/dashboard/graded-discussion-board-list')} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={GradedMarksIcon}
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
          }} onClick={() => window.open('#/dashboard/teacher-gdb-summary-report')} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={GDBSummaryIcon}
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
                    Graded Discussion Board Summary
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
GradedDiscussion.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool
}

GradedDiscussion.defaultProps = {
  data: [],
  isLoading: false
}

export default withStyles(styles)(GradedDiscussion);