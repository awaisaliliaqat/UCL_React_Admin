import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { SummaryState, GroupingState, IntegratedGrouping, IntegratedSummary, DataTypeProvider } from "@devexpress/dx-react-grid";
import { Grid, Table, TableHeaderRow, TableGroupRow, TableSummaryRow } from "@devexpress/dx-react-grid-material-ui";

const CurrencyFormatter = ({ value }) => value.toLocaleString("en-US", {maximumFractionDigits: 2});

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

// Custom Table Header Cell with background color
const CustomHeaderCell = (props) => (
  <TableHeaderRow.Cell
    {...props}
    style={{
      ...props.style,
      backgroundColor: "#306b9e", // Set your desired background color
      color: "#fff", // Set text color
      fontWeight: "600", // Optional: Bold text
      border: "1px solid white",
      fontSize: "0.875rem",
      padding: "0.5rem"
    }}
  />
);

const F334ConsolidatedSheetsAccountsOfficeTableComponent = (props) => {

  const [tableColumnExtensions] = useState([
    { columnName: "userId", align: "center", width: 75},
    { columnName: "userLabel", align: "left" },
    { columnName: "ratePerHour", align: "right",  wordWrapEnabled: true, width: 100 },
    { columnName: "netHoursAfterAdjustmentHours", align: "center",  wordWrapEnabled: true, width: 100 },
    { columnName: "hourlyAmount", align: "right",  wordWrapEnabled: true, width: 100 },
    { columnName: "perMonthSalary", align: "right",  wordWrapEnabled: true, width: 100 },
    { columnName: "adjustedAbsentDays", align: "center", wordWrapEnabled: true, width: 100 },
    { columnName: "adjustedLateDays", align: "center", wordWrapEnabled: true, width: 100},
    { columnName: "deductionAmount", align: "right", wordWrapEnabled: true, width: 100}
  ]);

  const [groupSummaryItems] = useState([
    // { columnName: "totalPayableAmount", type: "sum" },
    // { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalAmount", type: "sum" },
  ]);

  const [totalSummaryItems] = useState([
    { columnName: "hourlyAmount", type: "sum" },
    { columnName: "monthlyAmount", type: "sum" },
    { columnName: "perMonthSalary", type: "sum" }
  ]);

  const [currencyColumns] = useState(["ratePerHour","hourlyAmount","perMonthSalary","deductionAmount"]);
  
  const { data, columns } = props;

  const [expandedGroups, setExpandedGroups] = useState([]);

  useEffect(() => {
    setExpandedGroups(data.expandedGroups);
  }, [data]);

  const onExpandedGroupChange = (groups) => {
    setExpandedGroups(groups);
  };

  // Transforming the data to include month labels
  const transformedData = data.consolidatedSheetData.map((item) => ({ ...item, userLabel: item.userLabel })).flat();

  return (
    <Paper>
      <Grid rows={transformedData} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <GroupingState
          defaultGrouping={[
              // { columnName: "monthLabel" },
              // { columnName: "userLabel" },
          ]}
          defaultExpandedGroups={expandedGroups}
          expandedGroups={expandedGroups}
          onExpandedGroupsChange={onExpandedGroupChange}
        />
        <SummaryState
          totalItems={totalSummaryItems}
          groupItems={groupSummaryItems}
        />
        {/* <IntegratedGrouping /> */}
        <IntegratedSummary />

        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow cellComponent={CustomHeaderCell}/>
        <TableGroupRow />
        <TableSummaryRow />
      </Grid>
    </Paper>
  );
};

F334ConsolidatedSheetsAccountsOfficeTableComponent.propTypes = {
  data: PropTypes.object,
  columns: PropTypes.array,
  expandedGroups: PropTypes.array,
  showFilter: PropTypes.bool,
};

F334ConsolidatedSheetsAccountsOfficeTableComponent.defaultProps = {
  data: {},
  columns: [],
  expandedGroups: [],
  showFilter: false,
};

export default F334ConsolidatedSheetsAccountsOfficeTableComponent;
