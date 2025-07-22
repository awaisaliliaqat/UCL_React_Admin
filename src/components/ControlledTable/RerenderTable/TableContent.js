import React from 'react';
import PropTypes from 'prop-types';
// Material UI
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import hasIn from 'lodash/hasIn';

const styles = () => ({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#F8F8F9',
    },
  },
  delayed: {
    backgroundColor: '#FFE4E4',
    '&:hover': {
      backgroundColor: '#FFE4E4 !important',
    },
  },
});

const TableContent = ({ columns, data, onRowClick, classes, isShowIndexColumn }) => {
  return (
    <TableBody>
      {data.map((datum, index) => {
        let isDelayClass = classes.row;
        if (hasIn(datum, 'delayAlert')) {
          const { delayAlert } = datum;
          const isDelayed = delayAlert;
          isDelayClass = isDelayed ? classes.delayed : classes.row;
        }
        if (hasIn(datum, 'delayFlag')) {
          const { delayFlag } = datum;
          const isDelayed = delayFlag;
          isDelayClass = isDelayed ? classes.delayed : classes.row;
        }
        if (hasIn(datum, 'expired')) {
          const { expired } = datum;
          const isExpired = expired;
          isDelayClass = isExpired ? classes.delayed : classes.row;
        }
        return (
          <TableRow
            hover
            key={index}
            className={isDelayClass}
            onClick={e => {
              e.stopPropagation();
              onRowClick(datum);
            }}
          // style={{ cursor: 'pointer' }}
          >
            {isShowIndexColumn &&
              <TableCell
                align={'left'}
              >
                {index + 1}
              </TableCell>
            }
            {columns.map((column, idx) => {
              const value = column.renderer ? column.renderer(datum) : datum[column.dataIndex];
              /* eslint-disable indent */
              const customStyle = column.customStyleColumn
                ? column.customStyleColumn
                : {
                  // padding: '4px 23px 4px 24px',
                  backgroundColor: 'transparent',
                  wordBreak: 'break-all'
                };
              /* eslint-enable indent */
              return (
                <TableCell
                  style={customStyle}
                  key={idx}
                  align={column.align !== undefined ? column.align : 'left'}
                >
                  <span>{value}</span>
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

TableContent.defaultProps = {
  onRowClick: fn => fn,
  columns: [],
  data: [],
  isShowIndexColumn: false
};

TableContent.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  onRowClick: PropTypes.func,
  isShowIndexColumn: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(TableContent);
