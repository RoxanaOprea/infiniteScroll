import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-material.css";

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
        console.log("asking for " + params.startRow + " to " + params.endRow);
        const limit = params.endRow - params.startRow;
        const response = await fetch(`/users?limit=${limit}&offset=${params.startRow}`, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log(response)
    
        const data = await response.json();

        if(!data.length) {
          params.failCallback();
        }
  
        let lastRow = -1;
        if (data.length < limit) {
          console.log(data.length, params.endRow)
          lastRow = params.startRow + data.length;
        }
        
        params.successCallback(data, lastRow);
      }
    };
  
    params.api.setDatasource(dataSource);
  };

  //in store
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
            cacheBlockSize={this.state.cacheOverflowSize}
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

