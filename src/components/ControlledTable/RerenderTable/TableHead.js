/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
// Material UI
import { TableHead as MuiTableHead } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
// Components
import HeaderTableCell from './HeaderTableCell';

const TableHead = ({ columns, sortingEnabled, sortData, isShowIndexColumn }) => {
  // const [sortDirection, setSortDirection] = React.useState('asc');
  const sortIndex = columns.length > 0 ? columns[0].sortIndex : '';
  const [indexSorted, setIndexSorted] = React.useState(sortIndex);
  return (
    <MuiTableHead>
      <TableRow>
        {isShowIndexColumn &&
          <HeaderTableCell
            name={"SR#"}
            align={'left'}
            customStyle={{
              width: '7%',
              textAlign: 'center'
            }}
          />
        }
        {columns.map(column => {
          const key = column.name ? column.name : column.type;
          const customStyle = column.customStyleHeader
            ? column.customStyleHeader
            : {
              backgroundColor: 'transparent',
            };
          return (
            <HeaderTableCell
              key={key}
              name={column.name}
              sortIndex={column.sortIndex}
              sortable={column.sortable}
              sortingEnabled={sortingEnabled}
              customStyle={customStyle}
              // sortDirection={sortDirection}
              indexSorted={indexSorted}
              align={column.align !== undefined ? column.align : 'left'}
              onClick={(sortIndex, direction) => {
                // eslint-disable-next-line no-console
                // console.log(direction, sortIndex);
                setIndexSorted(sortIndex);
                sortData(sortIndex, direction);
                // setSortDirection('desc');
              }}
            // sortData={sortData}
            />
          );
        })}
      </TableRow>
    </MuiTableHead>
  );
};

TableHead.defaultProps = {
  sortingEnabled: false,
  sortData: fn => fn,
  columns: [],
  isShowIndexColumn: false
};

TableHead.propTypes = {
  columns: PropTypes.array,
  sortingEnabled: PropTypes.bool,
  sortData: PropTypes.func,
  isShowIndexColumn: PropTypes.bool
};

export default TableHead;
