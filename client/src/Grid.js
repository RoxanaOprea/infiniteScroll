import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-material.css";

//import dataSource from "./db.json";
//import PropTypes from "prop-types";

class GridInfiniteScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "First name", field: "firstName", width: 450 },
        { headerName: "Last name", field: "lastName", width: 450 },
        { headerName: "Username", field: "userName", width: 450 },
        { headerName: "Email", field: "email", width: 500 }
      ],
      rowBuffer: 0,
      paginationPageSize: 100,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 1,
      infiniteInitialRowCount: 25,
      maxBlocksInCache: 2,
      getRowId: function(item) {
        return item.id.toString();
      }
    };

    this.onGridReady = this.onGridReady.bind(this);
  }

  // removeItem(start, limit) {
  //   allOfTheData.splice(start, limit);
  //   this.gridApi.refreshInfiniteCache();
  // }

  onGridReady = async params => {
    this.api = params.api;
    this.columnApi = params.columnApi;

    const response = await fetch("/users/10", {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const repos = await response.json();
    //console.log(repos);

    let dataSource = {
      rowCount: null,
      getRows: function(params) {
        console.log("asking for " + params.startRow + " to " + params.endRow);

        //var dataAfterSortingAndFiltering = sortAndFilter(data, params.sortModel, params.filterModel);
        var rowsThisPage = repos.slice(params.startRow, params.endRow);
        var lastRow = -1;
        if (repos.length <= params.endRow) {
          lastRow = repos.length;
        }
        params.successCallback(rowsThisPage, lastRow);
      }
    };
    params.api.setDatasource(dataSource);
  };

  // removeUser = (id)  => {
  //   const {users} = this.dataSource;
  //   console.log(users)
  //   this.setState({
  //     users: users.filter((user, i) => {
  //       return i !== id;
  //     })
  //   })
  //   this.gridApi.refreshInfiniteCache();
  // };

  render() {
    const { columnDefs } = this.state;

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
            columnDefs={columnDefs}
            onGridReady={this.onGridReady}
            rowSelection="multiple"
            rowModelType="infinite"
            enableColResize={true}
            rowDeselection={true}
            paginationPageSize={this.state.paginationPageSize}
            cacheOverflowSize={this.state.cacheOverflowSize}
            getRowNodeId={this.state.getRowId}
            maxConcurrentDatasourceRequests={
              this.state.maxConcurrentDatasourceRequests
            }
            infiniteInitialRowCount={this.state.infiniteInitialRowCount}
            maxBlocksInCache={this.state.maxBlocksInCache}
          />
        </div>
        <div style={{ position: "absolute", top: "0px", right: "0px" }}>
          <button>Delete user</button>
        </div>
      </div>
    );
  }
}

export default GridInfiniteScroll;
