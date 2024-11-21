import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const MyDataTable = () => {
    const [rowData, setRowData] = useState([]);
    const [columnDefs] = useState([
        { headerName: "ID", field: "id" },
        { headerName: "Name", field: "name" },
        { headerName: "Age", field: "age" }
    ]);

    // Example data fetching - replace with your data source
    useEffect(() => {
        fetch("https://api.example.com/data")
            .then(response => response.json())
            .then(data => setRowData(data));
    }, []);

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true} // Enables pagination
            />
        </div>
    );
};

export default MyDataTable;
