import React from 'react';
import Paper from '@material-ui/core/Paper';
import ControlledChart from '../../../../../../components/ControlledCharts/ControlledCharts';


const ApplicantRegistrationAnalyticsGenderChart = () => {

    const record = [{
        name: 'BBA',
        data: [5, 3, 4, 7, 2],
        color: '#A3A1FB'
    }, {
        name: 'BSc Economics',
        data: [2, 2, 3, 2, 10, 2, 2, 22, 2, 2],
        color: '#56D9FE'
    }, {
        name: 'Joe',
        data: [3, 4, 4, 2, 5, 4, 4, 4, 4, 2, 3, 4, 5, 6, 7, 8, 9],
        color: '#5FE2A0'
    }
    ]

    const options = {
        chart: {
            type: 'column',
            backgroundColor: null,
            events: {
                load: function (event) {
                    event.target.reflow();
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [],
            gridLineWidth: 1,
            startOnTick: false,
            endOnTick: false,
            labels:
            {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            stackLabels: {
                enabled: true,

            }
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                showInLegend: false
            }
        },
        series: record,
        credits: {
            enabled: false
        },
    }

    const style = {
        marginLeft: 30,
        marginTop: 20,
        width: "92%"
    }

    return (
        <Paper id="barchart" style={{ width: '98%', marginTop: 20 }}>
            <div style={{
                paddingTop: 20,
                paddingLeft: 20,
                color: '#1d5f98',
                fontWeight: 'bold'

            }}>Degree Programmes</div>
            <div style={{
                display: 'flex',
                width: '70%',
                marginTop: 50,
                paddingRight: 45,
                color: '#174A84'
            }}>
                <span style={{
                    display: 'inline-flex',
                    marginLeft: '20%'
                }}><div style={{
                    height: 13,
                    width: 20,
                    marginRight: 14,
                    backgroundColor: '#A3A0FB',
                    borderRadius: '100%',
                    marginTop: 3
                }} />BBA</span>
                <span style={{
                    display: 'inline-flex',
                    marginLeft: 70
                }}><div style={{
                    height: 13,
                    width: 20,
                    marginRight: 14,
                    backgroundColor: '#56D9FE',
                    borderRadius: '100%',
                    marginTop: 3
                }} />BSc Economics</span>
                <span style={{
                    display: 'inline-flex',
                    marginLeft: 70
                }}><div style={{
                    height: 13,
                    width: 20,
                    marginRight: 14,
                    backgroundColor: '#5FE2A0',
                    borderRadius: '100%',
                    marginTop: 3
                }} />A-Levels</span>
            </div>
            <div id="container" style={{
                display: 'flex',
            }}>
                <ControlledChart options={options} style={style} />

            </div>
        </Paper>
    );
}

export default ApplicantRegistrationAnalyticsGenderChart;