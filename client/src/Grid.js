import React, { Component } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-balham.css";
//import PropTypes from "prop-types";

class GridInfiniteScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' },
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
      ]
    };

    this.onGridReady = this.onGridReady.bind(this);
  }

  onGridReady = (params) => {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  render() {
    const { columnDefs, rowData } = this.state;
    return (
      <div className="ag-theme-balham-dark" style={{height: '700px'}}>
        <AgGridReact
          columnDefs={columnDefs}
          onGridReady={this.onGridReady}
          rowData={rowData}
          rowSelection="multiple"
          enableColResize
        />
      </div>
    );
  }
}

export default GridInfiniteScroll;
