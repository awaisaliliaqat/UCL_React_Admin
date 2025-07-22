import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { SummaryState, GroupingState, IntegratedGrouping, IntegratedSummary, DataTypeProvider, } from "@devexpress/dx-react-grid";
import { Grid, Table, TableHeaderRow, TableGroupRow, TableSummaryRow, } from "@devexpress/dx-react-grid-material-ui";

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
	<DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const MonthlyEmployeeLateDaysReportforPayrollTableComponent = (props) => {

	const [tableColumnExtensions] = useState([
		{ columnName: "userId", width: "80px" },
		{ columnName: "displayName", align: "left", wordWrapEnabled: true },
		{ columnName: "totalWorkingDays", align: "center", width: "70px", wordWrapEnabled: true },
		{ columnName: "totalAttendedDays", align: "center", width: "80px" },
		{ columnName: "totalAttendanceMissingDays", align: "center", width: "80px" },
		{ columnName: "missingAttendanceDates", align: "right", width: "150px" },
		{ columnName: "totalLateDays", align: "right", width: "100px" },
		{ columnName: "lateDates", wordWrapEnabled: true },
		{ columnName: "adjustedLateDays", align: "center", width: "130px", wordWrapEnabled: true },
		{ columnName: "checkOut2", align: "left", width: "150px" },
		{ columnName: "sumLateTime", align: "left", width: "100px" },
		{ columnName: "sumEarlyDeparture", align: "left", width: "120px" },
		{ columnName: "sumBreakTime", align: "left", width: "100px" },
		{ columnName: "sumOverTime", align: "left", width: "100px" },
		{ columnName: "sumShortTime", align: "left", width: "100px" },
		{ columnName: "adjustedAbsentDays", align: "center", width: "120px", wordWrapEnabled: true },
		{ columnName: "adjustedOverTime", align: "center", width: "110px", wordWrapEnabled: true },
		{ columnName: "remarks", wordWrapEnabled: true },
	]);

	const [groupSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const [totalSummaryItems] = useState([
		{ columnName: "netHours", type: "sum" },
		{ columnName: "ratePerHour", type: "avg" },
	]);

	const { data, columns } = props;
	const [currencyColumns] = useState(["perHourRate", "totalAmount"]);
	const [expandedGroups, setExpandedGroups] = useState([]);

	useEffect(() => {
		setExpandedGroups(data.expandedGroupsData);
	}, [data]);

	const onExpandedGroupChange = (groups) => {
		setExpandedGroups(groups);
	};
	const rows = data.teachersAttendanceSheetData || [];
	return (
		<Paper>
			<Grid rows={rows} columns={columns}>
				<CurrencyTypeProvider for={currencyColumns} />
				<GroupingState
					defaultExpandedGroups={expandedGroups}
					expandedGroups={expandedGroups}
					onExpandedGroupsChange={onExpandedGroupChange}
				/>
				<SummaryState
					totalItems={totalSummaryItems}
					groupItems={groupSummaryItems}
				/>
				<IntegratedGrouping />
				<IntegratedSummary />
				<Table
					columnExtensions={tableColumnExtensions}
				/>
				<TableHeaderRow
					titleComponent={(props) =>
						props.children === "Action" ? (
							<b>&emsp;{props.children}</b>
						) : (
							<b>{props.children}</b>
						)
					}
				/>
				<TableGroupRow icon />
				<TableSummaryRow />
			</Grid>
			{/* </div> */}
		</Paper>
	);
};

MonthlyEmployeeLateDaysReportforPayrollTableComponent.propTypes = {
	data: PropTypes.object,
	columns: PropTypes.array,
	expandedGroups: PropTypes.array,
	showFilter: PropTypes.bool,
};

MonthlyEmployeeLateDaysReportforPayrollTableComponent.defaultProps = {
	data: {},
	columns: [],
	expandedGroups: [],
	showFilter: false,
};

export default MonthlyEmployeeLateDaysReportforPayrollTableComponent;
