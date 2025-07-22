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

const F334ReportsTableComponent = (props) => {

  const [tableColumnExtensions] = useState([
    { columnName: "employeeId", align: "center", width: 75},
    { columnName: "employeeLabel", align: "left" },
    { columnName: "rate", align: "right",  wordWrapEnabled: true, width: 100 },
    { columnName: "claimHours", align: "center",  wordWrapEnabled: true, width: 100 },
    { columnName: "claimAmount", align: "right",  wordWrapEnabled: true, width: 100 },
    { columnName: "grossSalaryAmount", align: "right",  wordWrapEnabled: true, width: 100 },
    { columnName: "adjustedAbsentDays", align: "center", wordWrapEnabled: true, width: 100 },
    { columnName: "adjustedLateDays", align: "center", wordWrapEnabled: true, width: 100},
    { columnName: "deductionAmount", align: "right", wordWrapEnabled: true, width: 100},
    { columnName: "adjustedOverTime", align: "center", wordWrapEnabled: true, width: 110},
    { columnName: "overTimeAmount", align: "right", wordWrapEnabled: true, width: 100}
  ]);

  const [groupSummaryItems] = useState([
    // { columnName: "totalPayableAmount", type: "sum" },
    // { columnName: "ratePerHour", type: "avg" },
    // { columnName: "totalAmount", type: "sum" },
  ]);

  const [totalSummaryItems] = useState([
    { columnName: "claimAmount", type: "sum" },
    { columnName: "grossSalaryAmount", type: "sum" },
    { columnName: "deductionAmount", type: "sum" }
  ]);

  const [currencyColumns] = useState(["rate","claimAmount","grossSalaryAmount","deductionAmount", "overTimeAmount"]);
  
  const { data, columns } = props;

  useEffect(() => {
    
  }, [data]);


  return (
    <Paper>
      <Grid rows={data} columns={columns}>
        <CurrencyTypeProvider for={currencyColumns} />
        <SummaryState
          totalItems={totalSummaryItems}
          groupItems={groupSummaryItems}
        />
        <IntegratedSummary />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow cellComponent={CustomHeaderCell}/>
        <TableSummaryRow />
      </Grid>
    </Paper>
  );
};

F334ReportsTableComponent.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  showFilter: PropTypes.bool,
};

F334ReportsTableComponent.defaultProps = {
  data: [],
  columns: [],
  showFilter: false,
};

export default F334ReportsTableComponent;
