import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import './DiseaseTable.css';
import {Button, Chip} from "@material-tailwind/react";

const DiseaseTable = ({ filter }) => {
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 5,
        total: 0,
        lastPage: 1,
    });
    const [loading, setLoading] = useState(false);

    // Define your column definitions
    const columnDefs = [
        { headerName: "№", valueGetter: "node.rowIndex + 1", sortable: true, filter: false, width: 70 },
        { headerName: "ID", field: "id", hide: true },
        { headerName: "Անվանում", field: "name", sortable: true, filter: false, width: 130 },
        {
            headerName: "Ակտիվ",
            field: "surname",
            sortable: true,
            filter: false,
            width: 140,
            cellRenderer: (params) => (
                <div className="flex items-center pt-2">
                    <Chip color="red" value="red" variant='outlined'/>
                </div>
            ),
        },
        { headerName: "Ստեղծման ամսաթիվ", field: "phone", sortable: true, filter: false, width: 180 },
        {
            headerName: "Խմբագրել",
            field: "actions",
            width: 150,
            cellRenderer: (params) => (
                <div className="flex items-center pt-2">
                    <Button
                        size="sm"
                        color="blue"
                        onClick={() => handleEdit(params.data)}
                    >
                        Խմբագրել
                    </Button>
                </div>
            ),
        },
        {
            headerName: "Ջնջել",
            field: "actions",
            width: 100,
            cellRenderer: (params) => (
                <div className="flex items-center pt-2">
                    <Button
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(params.data.id)}
                    >
                        Ջնջել
                    </Button>
                </div>
            ),
        },
    ];

    // Fetch data
    const fetchDisease = useCallback(async (page, pageSize, patientFilter) => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`/disease/data`, {
                params: { page, pageSize, ...patientFilter },
            });
            setPatients(response.data.diseases);
            setPagination(prev => ({
                ...prev,
                currentPage: response.data.pagination?.current_page || 1,
                total: response.data.pagination?.total || 0,
                lastPage: response.data.pagination?.last_page || 1,
            }));
        } catch (error) {
            console.error("Ошибка при загрузке пациентов:", error);
        } finally {
            setLoading(false); // End loading
        }
    }, []);

    useEffect(() => {
        fetchDisease(pagination.currentPage, pagination.pageSize, filter);
    }, [pagination.currentPage, pagination.pageSize, fetchDisease, filter]);

    // Handlers
    const handleEdit = (data) => {
        console.log("Edit patient:", data);
        // Add your edit logic here
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this patient?")) {
            try {
                await axios.delete(`/patients/${id}`);
                fetchDiseas(pagination.currentPage, pagination.pageSize, filter); // Refresh the data
            } catch (error) {
                console.error("Error deleting patient:", error);
            }
        }
    };

    const handlePageSizeChange = (newPageSize) => {
        setPagination(prev => ({
            ...prev,
            pageSize: newPageSize,
            currentPage: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    return (
        <div className="ag-theme-material" style={{ width: '100%', position: 'relative' }}>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <AgGridReact
                rowData={patients}
                columnDefs={columnDefs}
                localeText={{
                    noRowsToShow: "Տվյալներ չեն գտնվել",
                    filterOoo: "Փնտրել...",
                }}
                paginationPageSize={pagination.pageSize}
                domLayout="autoHeight"
                suppressHorizontalScroll={true}
                overlayNoRowsTemplate={loading ? '<span>Загрузка...</span>' : '<span>Տվյալներ չեն գտնվել</span>'}
                suppressPaginationPanel={true}
            />

            <div className="custom-pagination-container">
                <div className="w-30 max-w-sm min-w-[20px] flex gap-3 items-center ml-2">
                    <label className="block mb-1 text-sm text-slate-800">Պացիետների քանակը էջի վրա:</label>
                    <select
                        className="w-15 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                        onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
                        value={pagination.pageSize}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="flex gap-3 items-center mr-2">
                    <Button
                        type="submit"
                        color="gray"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.currentPage === 1}
                        variant="gradient"
                    >
                        Առաջին
                    </Button>
                    <Button
                        type="submit"
                        color="gray"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        variant="gradient"
                    >
                        Նախկին
                    </Button>
                    <span>Էջ {pagination.currentPage} - {pagination.lastPage}</span>
                    <Button
                        type="submit"
                        color="gray"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        variant="gradient"
                    >
                        Հաջորդ
                    </Button>
                    <Button
                        type="submit"
                        color="gray"
                        onClick={() => handlePageChange(pagination.lastPage)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        variant="gradient"
                    >
                        Վերջին
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DiseaseTable;
