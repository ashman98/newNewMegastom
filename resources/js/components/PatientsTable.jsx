import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import { AgGridReact } from "ag-grid-react";
import React from "react";

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import './PatientsTable.css';
import { provideGlobalGridOptions } from "ag-grid-community";

import { Inertia } from '@inertiajs/inertia'; // Import Inertia


const userLocaleText = {
    filterOoo: 'Փնտրել...',
    equals: 'Հավասար է',
    contains: 'Պարունակում է',
    selectAll: 'Ընտրել բոլորը',
    noRowsToShow: 'Տվյալներ չեն գտնվել',
    doesNotContain: 'Չի պարունակում',
    doesNotEqual: 'Չի պարունակում',
    beginsWith: 'Սկսված'
};

provideGlobalGridOptions({
    localeText: userLocaleText,
});

const PatientsTable = ({ patients }) => {
    const columnDefs = [
        { headerName: "ID", field: "id", sortable: true, filter: true },
        { headerName: "Имя пациента", field: "name", sortable: true, filter: true },
        { headerName: "Возраст", field: "age", sortable: true, filter: true },
        { headerName: "Заболевание", field: "disease", sortable: true, filter: true,
            filterParams: {
                filterOptions: ["contains", "startsWith", "endsWith"],
                defaultOption: "startsWith",
            },
        },
    ];

    const goToPatientPage = (event) => {
        const patientId = event.data.id; // Access the patient ID
        console.log("Double-clicked Patient ID:", patientId); // Debugging
        if (patientId) {
            Inertia.get(`/patients/${patientId}`);
        } else {
            console.log("Patient ID not found.");
        }
    };

    return (
        <div className="ag-theme-material" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                rowData={patients}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
                suppressHorizontalScroll={true}
                onRowDoubleClicked={goToPatientPage}
            />
        </div>
    );
};

export default PatientsTable;
