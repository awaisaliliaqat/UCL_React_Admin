/* eslint-disable react/prop-types */
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
  Table,
  TableHeaderRow,
  TableGroupRow,
  TableSummaryRow,
} from "@devexpress/dx-react-grid-material-ui";

// const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

// const CurrencyTypeProvider = (props) => (
//   <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
// );

const F337ViewRecordForMonthlyApprovalTableComponent = (props) => {
  // const filteredColumns = props.columns.filter(
  //   (column) => column.name !== "totalAmount" && column.name !== "ratePerHour"
  // );
  // const updatedData = {
  //   ...props,
  //   columns: filteredColumns,
  // };
  const [tableColumnExtensions] = useState([
    { columnName: "id", align: "left", width: "80px" },
    { columnName: "displayName", align: "left", width: "100px" },
    { columnName: "totalWorkingDays", align: "right", width: "50px" },
    { columnName: "totalAttendedDays", align: "right", width: "70px" },
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
    { columnName: "remarks", align: "left", width: "100px" },
  ]);

  const [tableGroupColumn] = useState([{ columnName: "teacherLabel" }]);

  const [groupSummaryItems] = useState([
    { columnName: "totalNetHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalNetHours", type: "sum" },
  ]);

  // const [totalSummaryItems] = useState([
  //   { columnName: "totalNetHours", type: "sum" },
  //   { columnName: "ratePerHour", type: "avg" },
  //   // { columnName: "totalNetHours", type: "sum" },
  // ]);

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
        {/* <CurrencyTypeProvider for={currencyColumns} /> */}
        <GroupingState
          // defaultGrouping={tableGroupColumn}
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
          // grouping={tableGroupColumn}
        />
        <SummaryState
          // totalItems={totalSummaryItems}
          groupItems={groupSummaryItems}
        />
        <IntegratedGrouping />
        <IntegratedSummary />
        <Table columnExtensions={tableColumnExtensions} />
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
    </Paper>
  );
};

F337ViewRecordForMonthlyApprovalTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F337ViewRecordForMonthlyApprovalTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F337ViewRecordForMonthlyApprovalTableComponent;
