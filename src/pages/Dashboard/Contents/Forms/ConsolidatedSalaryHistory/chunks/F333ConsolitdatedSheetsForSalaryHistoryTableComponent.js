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

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US");

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const F333ConsolitdatedSheetsForSalaryHistoryTableComponent = (props) => {
  const [tableColumnExtensions] = useState([
    { columnName: "userLabel", align: "left" },
    { columnName: "paymentThrough", align: "left" },
    { columnName: "backAccount1", align: "left" },
    { columnName: "backAccount2", align: "left" },
    { columnName: "hourlyAmount", align: "right" },
    { columnName: "monthlyAmount", align: "right" },
    { columnName: "totalPayableAmountLabel", align: "right" },
    { columnName: "action", align: "left" },
  ]);

  const [groupSummaryItems] = useState([
    // { columnName: "totalPayableAmount", type: "sum" },
    // { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalAmount", type: "sum" },
  ]);

  const [totalSummaryItems] = useState([
    { columnName: "hourlyAmount", type: "sum" },
    { columnName: "monthlyAmount", type: "sum" },
    { columnName: "totalPayableAmountLabel", type: "sum" },
  ]);

  const { data, columns } = props;
  const [currencyColumns] = useState(["totalPayableAmountLabel"]);
  const [expandedGroups, setExpandedGroups] = useState([]);

  useEffect(() => {
    setExpandedGroups(data.expandedGroups);
  }, [data]);

  const onExpandedGroupChange = (groups) => {
    setExpandedGroups(groups);
  };

  // Transforming the data to include month labels
  const transformedData = data.teachersAttendanceSheetData
    .map((item) => ({
      ...item,
      userLabel: item.userLabel,
    }))
    .flat();

  return (
    <Paper>
      <Grid rows={transformedData} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <GroupingState
          defaultGrouping={
            [
              // { columnName: "monthLabel" },
              // { columnName: "userLabel" },
            ]
          }
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
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow />
        <TableGroupRow />
        <TableSummaryRow />
      </Grid>
    </Paper>
  );
};

F333ConsolitdatedSheetsForSalaryHistoryTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F333ConsolitdatedSheetsForSalaryHistoryTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F333ConsolitdatedSheetsForSalaryHistoryTableComponent;
