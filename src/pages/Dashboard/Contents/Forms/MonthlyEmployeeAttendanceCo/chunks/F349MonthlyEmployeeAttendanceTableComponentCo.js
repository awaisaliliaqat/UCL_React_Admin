import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import {
  SummaryState,
  GroupingState,
  IntegratedGrouping,
  IntegratedSummary,
  DataTypeProvider,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableGroupRow,
  TableSummaryRow,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";

// Sticky header logic
const StickyHeaderCell = (props) => (
  <VirtualTable.Cell
    {...props}
    style={{
      ...props.style,
      top: 0,
      zIndex: 10,
      position: "sticky",
      background: "#fff",
      borderBottom: "1px solid #ccc",
    }}
  />
);

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const F349MonthlyEmployeeAttendanceTableComponentCo = (props) => {
  const [tableColumnExtensions] = useState([
    { columnName: "id", align: "left", width: "80px" },
    { columnName: "displayName", align: "left", width: "110px" },
    { columnName: "totalWorkingDays", align: "right", width: "100px" },
    { columnName: "totalAttendedDays", align: "right", width: "100px" },
    {
      columnName: "totalAttendanceMissingDays",
      align: "right",
      width: "100px",
    },
    { columnName: "missingAttendanceDates", align: "right", width: "150px" },
    { columnName: "totalLateDays", align: "right", width: "100px" },
    { columnName: "lateDates", align: "right", width: "150px" },
    { columnName: "adjustedLateDays", align: "left", width: "150px" },
    { columnName: "checkOut2", align: "left", width: "150px" },
    { columnName: "sumLateTime", align: "left", width: "100px" },
    { columnName: "sumEarlyDeparture", align: "left", width: "120px" },
    { columnName: "sumBreakTime", align: "left", width: "100px" },
    { columnName: "sumOverTime", align: "left", width: "100px" },
    { columnName: "sumShortTime", align: "left", width: "100px" },
    { columnName: "adjustedAbsentDays", align: "left", width: "150px" },
    { columnName: "remarks", align: "left", width: "250px" },
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
    <Paper style={{}}>
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
        <VirtualTable columnExtensions={tableColumnExtensions} />
        <TableHeaderRow cellComponent={StickyHeaderCell} />{" "}
        {/* Sticky header */}
        {/* <TableGroupRow /> */}
        {/* <TableSummaryRow /> */}
        <TableFixedColumns leftColumns={["id", "displayName"]} />
      </Grid>
    </Paper>
  );
};

F349MonthlyEmployeeAttendanceTableComponentCo.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F349MonthlyEmployeeAttendanceTableComponentCo.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F349MonthlyEmployeeAttendanceTableComponentCo;
