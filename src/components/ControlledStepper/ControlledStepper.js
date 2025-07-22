import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  stepperRoot: {
      paddingRight: '0 !important',
      paddingLeft: '0 !important'
  }
}));

const ControlledStepper = props => {
  const classes = useStyles();
  const { activeStep, steps} = props;

  return (
    <div className={classes.root}>
      <Stepper className={classes.stepperRoot} activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

ControlledStepper.propTypes = {
    steps: PropTypes.array,
    activeStep: PropTypes.number
};

ControlledStepper.defaultProps = {
    steps: [],
    activeStep: 0
};

export default ControlledStepper; 