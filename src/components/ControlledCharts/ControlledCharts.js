import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ControlledCharts = props => {
    return (
        <Fragment>
            <HighchartsReact
                highcharts={Highcharts}
                options={props.options}
                containerProps={{
                    style: props.style
                }}
            />
        </Fragment>
    )
}

ControlledCharts.propTypes = {
    options: PropTypes.array,
    style: PropTypes.object
}

ControlledCharts.defaultProps = {
    options: [],
    style: {}
}

export default ControlledCharts;