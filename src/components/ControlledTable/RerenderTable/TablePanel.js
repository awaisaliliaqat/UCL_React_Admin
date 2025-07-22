/* eslint-disable indent */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
// 3rd Party
import orderBy from "lodash/orderBy";
import differenceWith from "lodash/differenceWith";
import isEqual from "lodash/isEqual";
// Common
import TableHead from "./TableHead";
// eslint-disable-next-line import/no-named-as-default
import TableContent from "./TableContent";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = () => ({
  overlay: {
    display: "flex",
    justifyContent: "start",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",
    width: "96%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 2,
  },
  overlayContent: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "200px",
  },
  table: {
    tableLayout: "fixed",
    width: "100%",
  },
});

const ascSort = (data, sortIndex) => {
  const fn = [
    (resultItem) => {
      // eslint-disable-next-line no-nested-ternary
      return resultItem[sortIndex] != null
        ? typeof resultItem[sortIndex] !== "number"
          ? resultItem[sortIndex].toString().toLowerCase().trim()
          : resultItem[sortIndex]
        : "";
    },
    { sortIndex },
  ];
  const sortedData = orderBy(data, fn, ["asc"]);
  return sortedData;
};
const descSort = (data, sortIndex) => {
  const fn = [
    (resultItem) => {
      // eslint-disable-next-line no-nested-ternary
      return resultItem[sortIndex] != null
        ? typeof resultItem[sortIndex] !== "number"
          ? resultItem[sortIndex].toString().toLowerCase().trim()
          : resultItem[sortIndex]
        : "";
    },
    { sortIndex },
  ];
  const sortedData = orderBy(data, fn, ["desc"]);
  return sortedData;
};

const TablePanel = ({
  classes,
  columns,
  data,
  onClick,
  sortingEnabled,
  isLoading,
  isShowIndexColumn,
  isDense,
}) => {
  const [sortedData, setSortedData] = React.useState(data);
  const [perData, setPerData] = React.useState(data);
  const [index, setIndex] = React.useState("");
  const [sortDirection, setDirection] = React.useState("");
  React.useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (sortedData.length > 0) {
      const diff = differenceWith(perData, data, isEqual);
      if (diff.length !== 0) {
        const sort =
          sortDirection === "asc"
            ? ascSort(data, index)
            : descSort(data, index);
        setSortedData(sort);
        setPerData(data);
      }
    }
  }, [sortedData.length, perData, data, sortDirection, index]);
  const tableData = sortedData.length > 0 ? sortedData : data;
  return (
    <Fragment>
      {isLoading && (
        <div className={classes.overlay}>
          <div className={classes.overlayContent}>
            <CircularProgress style={{ marginBottom: 10 }} size={36} />
            <span>Loading...</span>
          </div>
        </div>
      )}
      <Table size={isDense ? "small" : "medium"} className={classes.table}>
        <TableHead
          columns={columns}
          sortingEnabled={sortingEnabled}
          isShowIndexColumn={isShowIndexColumn}
          sortData={(sortIndex, direction) => {
            let sorted = [];
            if (direction === "asc") {
              sorted = ascSort(data, sortIndex);
            } else {
              sorted = descSort(data, sortIndex);
            }
            setIndex(sortIndex);
            setDirection(direction);
            setPerData(data);
            setSortedData(sorted);
          }}
        />
        <TableContent
          isShowIndexColumn={isShowIndexColumn}
          onRowClick={(rowData) => onClick(rowData)}
          columns={columns}
          data={tableData}
        />
      </Table>
    </Fragment>
  );
};

TablePanel.defaultProps = {
  onClick: (fn) => fn,
  sortingEnabled: false,
  isLoading: false,
  data: [],
  columns: [],
  isShowIndexColumn: false,
  isDense: false,
};

TablePanel.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array,
  data: PropTypes.array,
  onClick: PropTypes.func,
  sortingEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isShowIndexColumn: PropTypes.bool,
  isDense: PropTypes.bool,
};

export default withStyles(styles)(TablePanel);
