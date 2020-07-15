import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import ApplicantRegistrationAnalyticsGenderChart from "./chunks/ApplicantRegistrationAnalyticsGenderChart";
import ApplicantRegistrationAnalyticsFilters from "./chunks/ApplicantRegistrationAnalyticsFilters";
import ApplicantRegistrationAnalyticsBarChart from './chunks/ApplicantRegistrationAnalyticsBarChart';
const ApplicantRegistrationAnalytics = () => {

    return (
        <div style={{
            padding: 20
        }}>
            <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                Applicant Registration
            </Typography>
            <Divider style={{
                backgroundColor: 'rgb(58, 127, 187)',
                opacity: '0.3',
            }} />
            <ApplicantRegistrationAnalyticsFilters />
            <Divider style={{
                backgroundColor: 'rgb(58, 127, 187)',
                opacity: '0.3',
            }} />
            <div style={{ marginBottom: 20, display: 'flex' }}>
                <ApplicantRegistrationAnalyticsGenderChart />
            </div>

            <ApplicantRegistrationAnalyticsBarChart />


        </div>
    );
}

export default ApplicantRegistrationAnalytics;