/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress, Paper, TableCell, TableRow } from "@material-ui/core";
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

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const F322HourlySheetsForCoordinatorsTableComponent = (props) => {
  // const filteredColumns = props.columns.filter(
  //   (column) => column.name !== "totalAmount" && column.name !== "ratePerHour"
  // );
  // const updatedData = {
  //   ...props,
  //   columns: filteredColumns,
  // };
  const [tableColumnExtensions] = useState([
    { columnName: "totalSchedules", align: "right" },
    { columnName: "totalAttended", align: "right" },
    { columnName: "durationPerSession", align: "right" },
    { columnName: "totalHours", align: "right" },
    { columnName: "ratePerHour", align: "right" },
    { columnName: "totalAmount", align: "right" },
    { columnName: "adjustedHours", align: "right" },
    { columnName: "netHours", align: "right" },
  ]);

  const [tableGroupColumn] = useState([{ columnName: "teacherLabel" }]);

  const [groupSummaryItems] = useState([
    { columnName: "netHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalHours", type: "sum" },
  ]);

  const [totalSummaryItems] = useState([
    { columnName: "netHours", type: "sum" },
    { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalAmount", type: "sum" },
  ]);

  const { data, columns, isApproved } = props;
  const [currencyColumns] = useState(["perHourRate", "totalAmount"]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [isApprovedSheet, setIsApprovedSheet] = useState(false);

  useEffect(() => {
    console.log("data", data);
    setExpandedGroups(data.expandedGroupsData);
    setIsApprovedSheet(data.isApproved);
  }, [data]);

  const onExpandedGroupChange = (groups) => {
    setExpandedGroups(groups);
  };
  
  const rows = data.teachersAttendanceSheetData || [];

  const NoDataRow = () => (
    <TableRow>
      <TableCell colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
        {!isApprovedSheet ? (
          <Box fontSize="1rem">No Data</Box>
        ) : (
          <Box color="primary.light" fontSize="1rem">The sheet has already been approved. Please check the view for the approved sheet.</Box>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Paper>
      <Grid rows={isApprovedSheet ? [] : rows} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <GroupingState
          defaultGrouping={tableGroupColumn}
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
          grouping={tableGroupColumn}
        />
        <SummaryState
          totalItems={totalSummaryItems}
          groupItems={groupSummaryItems}
        />
        <IntegratedGrouping />
        <IntegratedSummary />
        <Table 
          columnExtensions={tableColumnExtensions}
          noDataRowComponent={NoDataRow}
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
    </Paper>
  );
};

F322HourlySheetsForCoordinatorsTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F322HourlySheetsForCoordinatorsTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F322HourlySheetsForCoordinatorsTableComponent;
