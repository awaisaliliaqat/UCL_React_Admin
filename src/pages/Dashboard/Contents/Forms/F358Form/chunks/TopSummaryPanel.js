import React from 'react';
import { Box } from '@material-ui/core';
import { TemplateConnector } from '@devexpress/dx-react-core';

const calculateCustomSummary = (rows) => {
	const totalThisYear = rows.reduce((sum, row) => sum + (parseFloat(row.yearlyExpenseThisYear) || 0), 0);
	const totalNextYear = rows.reduce((sum, row) => sum + (parseFloat(row.yearlyExpenseNextYear) || 0), 0);
	const percentChange = totalThisYear === 0 ? 0 : ((totalNextYear - totalThisYear) / totalThisYear) * 100;

	return {
		yearlyExpenseThisYear: totalThisYear,
		yearlyExpenseNextYear: totalNextYear,
		percentChange: Math.round((percentChange + Number.EPSILON) * 100) / 100
	};
};

const TopSummaryPanel = () => (
	<TemplateConnector>
		{({ rows: visibleRows }) => {
			const summary = calculateCustomSummary(visibleRows || []);
			return (
				<Box bgcolor="primary.main" color="primary.contrastText" borderRadius={2} p={1} display="flex" justifyContent="space-between">
					<span>Summary :</span>
					<span><small>Total Yearly Expense This Year : {summary.yearlyExpenseThisYear.toLocaleString()}</small></span>
					<span><small>Total Yearly Expense Next Year : {summary.yearlyExpenseNextYear.toLocaleString()}</small></span>
					<span><small>Percent Change : {summary.percentChange}%</small></span>
				</Box>
			);
		}}
	</TemplateConnector>
);

export default TopSummaryPanel;
