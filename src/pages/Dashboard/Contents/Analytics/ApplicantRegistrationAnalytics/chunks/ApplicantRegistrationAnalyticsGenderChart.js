import React from 'react';
import Paper from '@material-ui/core/Paper';
import ControlledChart from '../../../../../../components/ControlledCharts/ControlledCharts';


const ApplicantRegistrationAnalyticsGenderChart = () => {

    const record = [{
        name: 'Male',
        y: 9,
        color: '#1F78B4'
    }, {
        name: 'Female',
        y: 6,
        color: '#A6CEE3'
    },
    {
        name: 'Other',
        y: 0.5,
        color: '#B2DF8A'
    }]

    const options = {
        chart: {
            backgroundColor: null,
            type: 'pie',
        },
        plotOptions: {
            pie: {
                innerSize: '60%',
                allowPointSelect: false,
                cursor: 'default',
                dataLabels: {
                    enabled: false
                },

                showInLegend: false
            },
        },
        title: {
            text: '1,000<br>Registrations',
            align: 'center',
            verticalAlign: 'middle',
            y: 14,
            style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#1F78B4'
            }
        },
        series: [{
            name: 'total',
            colorByPoint: true,
            data: record,
        }],
        credits: {
            enabled: false
        },
    }

    const style = {
        height: "250px", width: "240px", marginLeft: '30px', marginBottom: '-15px',
        marginTop: '-25px'
    }

    return (
        <Paper style={{ width: '60%', marginTop: 20 }}>
            <div style={{
                paddingTop: 20,
                paddingLeft: 20,
                color: '#1d5f98',
                fontWeight: 'bold'

            }}>Gender</div>
            <div style={{
                display: 'flex'
            }}>
                <ControlledChart options={options} style={style} />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                    marginTop: 50,
                    paddingRight: 45,
                    color: '#174A84'
                }}>
                    <div style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: 'space-between',
                        paddingBottom: 30,
                        paddingLeft: 10
                    }}>
                        <span style={{
                            display: 'inline-flex'
                        }}><div style={{
                            height: 13,
                            width: 13,
                            marginRight: 14,
                            border: '2px solid #1F78B4',
                            borderRadius: '100%',
                            marginTop: 3,
                        }} />Male</span>
                        <span style={{ inlineSize: 'max-content' }}>60 Registrations - 60%</span>
                    </div>
                    <div style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: 'space-between',
                        paddingBottom: 30,
                        paddingLeft: 10
                    }}>
                        <span style={{
                            display: 'inline-flex'
                        }}><div style={{
                            height: 13,
                            width: 13,
                            marginRight: 10,
                            border: '2px solid rgb(166, 206, 227)',
                            borderRadius: '100%',
                            marginTop: 3,
                        }} /> Female</span>
                        <span style={{ inlineSize: 'max-content' }}>30 Registrations - 30%</span>
                    </div>
                    <div style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: 'space-between',
                        paddingLeft: 10
                    }}>
                        <span style={{
                            display: 'inline-flex'
                        }}><div style={{
                            height: 13,
                            width: 13,
                            marginRight: 10,
                            border: '2px solid #B2DF8A',
                            borderRadius: '100%',
                            marginTop: 3,
                        }} /> Other</span>
                        <span style={{ inlineSize: 'max-content' }}>10 Registrations - 10%</span>
                    </div>
                </div>
            </div>
        </Paper>
    );
}

export default ApplicantRegistrationAnalyticsGenderChart;