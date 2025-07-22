import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  CardActions,
  Typography,
  Avatar,
  CardContent,
  IconButton,
  withStyles,
  Tooltip,
  LinearProgress
} from "@material-ui/core";
import LeavesIcon from "../../../../../../assets/Images/leaves.png";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link } from "react-router-dom";

const styles = () => ({
  card: {
    cursor: "pointer"
  },
  bigAvatar: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 0
  }
});
const Attendances = (props) => {
  const classes = props.classes;
  const { data } = props;

  return (
    <Card>
      <CardHeader
        title={<Typography color="primary">Attendance</Typography>}
        subheader={"Assess your attendace"}
        avatar={<Avatar className={classes.bigAvatar} src={LeavesIcon} />}
        onClick={() => window.open('#/dashboard/teacher-attendance-report')}
        className={classes.card}
      />

      <CardContent
        style={{ height: '210px' }}
      >
        <div style={{ marginTop: '-15px' }}>
          {data.map((item, index) => {
            const attend = item.attendedClasses ? Number(item.attendedClasses) : 0;
            const total = item.totalClasses ? Number(item.totalClasses) : 1;
            const value = Number((attend / total) * 100);
            return (
              <Fragment key={item.sectionId} >
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td>
                        <Typography variant="caption">{item.sectionLabel}</Typography>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <Typography variant="caption">{item.attendedClasses}/{item.totalClasses}</Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <LinearProgress color={index % 2 == 0 ? "primary" : "secondary"} variant="buffer" value={value} valueBuffer={100} />
                <br />
              </Fragment>
            )
          })}
        </div>
      </CardContent>
      <Divider variant="middle" />
      <CardActions style={{ textAlign: "center" }} className={classes.actions}>
        <div>
          <Tooltip title="View More">
            <Link style={{ textDecoration: 'none' }} to="/dashboard/teacher-attendance-report" target="_blank">
              <IconButton aria-label="View More">
                <VisibilityIcon />
                <Typography
                      variant="subtitle2"
                      style={{marginLeft: 10}}
                    >
                      View Attendance
                    </Typography>
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      </CardActions>
    </Card>
  );
}
Attendances.propTypes = {
  classes: PropTypes.object.isRequired
}

Attendances.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
}

Attendances.defaultProps = {
  data: [],
  isLoading: false
}

export default withStyles(styles)(Attendances);
