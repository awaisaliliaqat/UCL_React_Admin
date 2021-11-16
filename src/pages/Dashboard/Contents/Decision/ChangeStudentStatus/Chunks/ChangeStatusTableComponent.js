import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {FilteringState, IntegratedFiltering, IntegratedSorting, SortingState} from '@devexpress/dx-react-grid';
import {Grid, Table, TableFilterRow, TableHeaderRow} from '@devexpress/dx-react-grid-material-ui';
import PropTypes from "prop-types";

class ChangeStatusTableComponent extends Component {

    constructor(props) {

        super(props);

        this.state = {
            columns: [],
            rows: [],
            formatColumns: [],
            currencyColumns: [],
            availableFilterOperations: [
                "equal",
                "notEqual",
                "greaterThan",
                "greaterThanOrEqual",
                "lessThan",
                "lessThanOrEqual",
            ],
            resizingMode: "widget",
            defaultFilters: [],
            filteringStateColumnExtensions: [
                { columnName: 'action', filteringEnabled: false },
            ],
            tableColumnExtensions: [
                { columnName: 'studentId', width: 100 },
                { columnName: 'firstName', wordWrapEnabled: true, width: 100 },
                { columnName: 'middleName', wordWrapEnabled: true, width: 100 },
                { columnName: 'lastName', wordWrapEnabled: true, width: 70 },
                { columnName: 'genderLabel', wordWrapEnabled: true, width: 70 },
                { columnName: 'degreeLabel', wordWrapEnabled: true, width: 150 },
                { columnName: 'mobileNo', wordWrapEnabled: true, width: 120 },
                { columnName: 'email', wordWrapEnabled: true, width: 160 },
                { columnName: 'sessionLabel', wordWrapEnabled: true, width: 90 },
                { columnName: 'uolNumber', wordWrapEnabled: true, width: 90 },
                { columnName: 'statusLabel', wordWrapEnabled: true, width: 90 },
                //{ columnName: 'action', width: 90, align:"center" },
                { columnName: 'statusChangeDate', width: 100, wordWrapEnabled: true },
            ],
            defaultSorting: [],
            sortingStateColumnExtensions: [
                { columnName: "action", sortingEnabled: false },
            ],
        };
    }

    render() {

        const {
            tableColumnExtensions,
            defaultSorting,
            sortingStateColumnExtensions,
            filteringStateColumnExtensions,
            defaultFilters,
        } = this.state;

        const { rows, columns, showFilter } = this.props;

        return (
            <Paper>
                <Grid rows={rows} columns={columns}>
                    <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions} />
                    <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions} />
                    <IntegratedFiltering />
                    <IntegratedSorting />
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow
                        showSortingControls={true}
                        titleComponent={(props) => (
                            props.children != "Selection" ?
                                <b>{props.children}</b>
                                :
                                <b>&emsp;{props.children}</b>
                        )}
                    />
                    {showFilter ? <TableFilterRow showFilterSelector={true} /> : ""}
                </Grid>
            </Paper>
        );
    }
}

ChangeStatusTableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    showFilter: PropTypes.bool
}

ChangeStatusTableComponent.defaultProps = {
    columns: [],
    rows: [],
    showFilter: false
}

export default ChangeStatusTableComponent;
