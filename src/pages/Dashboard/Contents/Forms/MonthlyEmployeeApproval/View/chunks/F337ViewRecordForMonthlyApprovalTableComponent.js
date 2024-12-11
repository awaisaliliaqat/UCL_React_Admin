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
    { columnName: "id", align: "left" },
    { columnName: "displayName", align: "left" },
    { columnName: "totalWorkingDays", align: "right" },
    { columnName: "totalAttendedDays", align: "right" },
    { columnName: "totalAttendanceMissingDays", align: "right" },
    { columnName: "missingAttendanceDates", align: "right" },
    { columnName: "totalLateDays", align: "right" },
    { columnName: "lateDates", align: "right" },
    { columnName: "adjustedLateDays", align: "left" },
    { columnName: "adjustedAbsentDays", align: "left", width: "150px" },

    { columnName: "remarks", align: "left" },
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
