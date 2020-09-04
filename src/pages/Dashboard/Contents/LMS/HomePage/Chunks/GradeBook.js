import React from "react";
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  CardActions,
  Typography,
  Avatar,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  withStyles,
  Tooltip
} from "@material-ui/core";
import GradeBook from "../../../../../../assets/Images/grade_book.png";
import QuizIcon from '../../../../../../assets/Images/grade_book_quiz.png';
import AssignmentsIcon from '../../../../../../assets/Images/grade_book_assignments.png';
import MidTermIcon from '../../../../../../assets/Images/grade_book_mid_term.png';


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
function WorkflowsApproval(props) {
  const classes = props.classes;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={<Typography color="primary">Grade Book</Typography>}
        subheader={"Access gradebook"}
        avatar={<Avatar className={classes.bigAvatar} src={GradeBook} />}
      />

      <CardContent style={{ height: '210px' }}>
        <List style={{
          marginTop: '-30px'
        }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={QuizIcon}
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
                  Quiz
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    manage quiz results
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
                  Assignments
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    manage assignment
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={MidTermIcon}
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
                  Mid Term
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    manage mid term results
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
WorkflowsApproval.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(WorkflowsApproval);
