
import React from 'react';
import PropTypes from 'prop-types';
// Material UI
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = () => ({
  headCell: {
    color: 'black',
    fontWeight: '900',
    fontSize: '15px',
  },
  activeSortIcon: {
    opacity: '1 !important',
  },
  // Half visible for inactive icons
  inactiveSortIcon: {
    opacity: '0.5 !important',
  },
  disableSortIcon: {
    opacity: '0 !important',
  },
});

class HeaderTableCell extends React.Component {
  state = {
    sortDirection: 'asc',
    activesort: false,
    // indexSorted: '',
  };

  componentDidUpdate(prevProps) {
    const { indexSorted, sortIndex } = this.props;

    if (prevProps.indexSorted !== indexSorted && indexSorted !== sortIndex) {
      this.setState({ sortDirection: 'asc', activesort: false });
    }
  }

  render() {
    const {
      classes,
      sortingEnabled,
      sortable,
      name,
      sortIndex,
      onClick,
      align,
      customStyle,
    } = this.props;
    const { sortDirection, activesort } = this.state;
    const isort = !!(sortingEnabled && sortable);
    return (
      <TableCell
        style={customStyle}
        className={classes.headCell}
        sortDirection={sortDirection}
        align={align}
      >
        <TableSortLabel
          active={isort}
          direction={sortDirection}
          /* eslint-disable  */
          classes={{ icon: (activesort && isort) ? classes.activeSortIcon : isort ? classes.inactiveSortIcon : classes.disableSortIcon }}
         /* eslint-enable  */
          onClick={() => {
            const direction = sortDirection === 'asc' ? 'desc' : 'asc';
            this.setState({ sortDirection: direction, activesort: true });
            onClick(sortIndex, direction);
          }}
        >
          <div> {name} </div>
        </TableSortLabel>
      </TableCell>
    );
  }
}

HeaderTableCell.defaultProps = {
  sortingEnabled: false,
  name: '',
  sortable: false,
  align: 'left',
  sortIndex: '',
  sortDirection: 'asc',
  onClick: fn => fn,
  indexSorted: '',
  customStyle: {}


};

HeaderTableCell.propTypes = {
  classes: PropTypes.object.isRequired,
  sortable: PropTypes.bool,
  align: PropTypes.string,
  sortingEnabled: PropTypes.bool,
  sortIndex: PropTypes.string,
  name: PropTypes.string,
  sortDirection: PropTypes.string,
  onClick: PropTypes.func,
  indexSorted: PropTypes.string,
  customStyle: PropTypes.object,
};

export default withStyles(styles)(HeaderTableCell);
