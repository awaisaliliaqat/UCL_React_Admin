import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 10,
  },
  heading: {
    fontSize: '1rem',
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 700,
    display: 'contents'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const ControlledExpansionPanels = props => {
  const classes = useStyles();
  const { isExpanded, title, instructions, summary, isDisabledExpand, disabled, hideExpandIcon } = props;
  const [expanded, setExpanded] = React.useState(isExpanded);

  const handleChange = (event, isExpanded) => {
    if(!isDisabledExpand) setExpanded(isExpanded);
  };

  return (
    <div className={classes.root}>
      <ExpansionPanel disabled={disabled} expanded={expanded} onChange={handleChange}>
        <ExpansionPanelSummary
          expandIcon={!hideExpandIcon && <ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{title}</Typography>
          <Typography className={classes.secondaryHeading}>{instructions}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ display: 'inherit'}}>
          <Typography>
            {summary}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

ControlledExpansionPanels.propTypes = {
  isExpanded: PropTypes.bool,
  summary: PropTypes.string,
  title: PropTypes.string,
  instructions: PropTypes.string,
  isDisabledExpand: PropTypes.bool,
  hideExpandIcon: PropTypes.bool,
  disabled: PropTypes.bool
};

ControlledExpansionPanels.defaultProps = {
  isExpanded: false,
  summary: "",
  title: "",
  instructions: "",
  isDisabledExpand: false,
  hideExpandIcon: false,
  disabled: false
};

export default ControlledExpansionPanels;