import React, { Component } from "react";
import { connect } from "react-redux";
import { usersFetchData } from "../actions/users";
import { AgGridReact } from "ag-grid-react";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-material.css";
import PropTypes from 'prop-types';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "First name", field: "firstName", width: 450 },
        { headerName: "Last name", field: "lastName", width: 450 },
        { headerName: "Username", field: "userName", width: 450 },
        { headerName: "Email", field: "email", width: 500 }
      ],
      //rowBuffer: 0,
      paginationPageSize: 20,
      cacheOverflowSize: 20,
      maxConcurrentDatasourceRequests: 1,
      maxBlocksInCache: 2,
      getRowId: function(item) {
        return item.id.toString();
      }
    };

    this.onGridReady = this.onGridReady.bind(this);
  }

  onGridReady = async params => {
    this.api = params.api;
    this.columnApi = params.columnApi;
    
    let dataSource = {
      rowCount: null,
      getRows: async params => {
        console.log("asking for " + params.startRow + " to " + params.endRow);//0 to 20
        const limit = params.endRow - params.startRow;
        
        const response = await this.props.fetchData(
          limit,
          params.startRow
        );
        
        const data = await response.json();
        
        if (!data.length) {
          params.failCallback();
        }

        let lastRow = -1;
        if (data.length < limit) {
          //console.log(data.length, params.endRow);
          lastRow = params.startRow + data.length;
        }

        params.successCallback(data, lastRow);
      }
    };

    params.api.setDatasource(dataSource);
  };


  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the users</p>;
    }

    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }

    return (
      <div style={{ width: "100%", height: "900px" }}>
        <div
          id="myGrid"
          style={{
            boxSizing: "border-box",
            height: "100%",
            width: "100%"
          }}
          className="ag-theme-material"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            onGridReady={this.onGridReady}
            rowSelection="multiple"
            rowModelType="infinite"
            enableColResize={true}
            rowDeselection={true}
            paginationPageSize={this.state.paginationPageSize}
            cacheBlockSize={this.state.cacheOverflowSize}
            getRowNodeId={this.state.getRowId}
            maxConcurrentDatasourceRequests={
              this.state.maxConcurrentDatasourceRequests
            }
            infiniteInitialRowCount={this.state.infiniteInitialRowCount}
            maxBlocksInCache={this.state.maxBlocksInCache}
            reactNext={true}
            reduxStore={this.context.store} // must be supplied when using redux with reactNext
          />
        </div>
      </div>
    );
  }
}

// UserList.contextTypes = {
//   store: PropTypes.object
// };

const mapStateToProps = state => {
  return {
    users: state.users,
    hasErrored: state.usersHasErrored,
    isLoading: state.usersIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: url => dispatch(usersFetchData(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);
