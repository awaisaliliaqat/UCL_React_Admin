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
  // ListItem,
  // ListItemText,
  // ListItemAvatar,
  Button,
  withStyles,
  Tooltip
} from "@material-ui/core";
import MyObjectivesIcon from "../../../../../../assets/Images/my_objectives.png";
// import ImproveProductivityIcon from '../../../../../assets/Images/my_objectives_module.png';
// import ReduceMistakesIcon from '../../../../../assets/Images/my_objectives_training.png';
// import ImproveSkillsIcon from '../../../../../assets/Images/grade_book_mid_term.png';


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
const Quiz = (props) => {
  const classes = props.classes;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={<Typography color="primary">Quiz</Typography>}
        subheader={"Create quiz"}
        avatar={<Avatar className={classes.bigAvatar} src={MyObjectivesIcon} />}
      />

      <CardContent style={{ height: '210px' }}>
        <List style={{
          marginTop: '-30px'
        }}>
          {/* <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={ImproveProductivityIcon}
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
                  Improve Productivity
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    Apr 20, 2019
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={ReduceMistakesIcon}
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
                  Reduce Mistakes and Waste
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    Dec 30, 2019
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={ImproveSkillsIcon}
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
                  Improve Interpersonal Skills
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    July 30, 2019
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem> */}
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
Quiz.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Quiz);
