import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import './DentistsTable.css';
import {Button, Chip} from "@material-tailwind/react";
import useWindowSize from "@/hooks/useWindowSize.js";

const DentistsTable = ({ filter,onDentistAdd }) => {
    const [dentists, setDentists] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 5,
        total: 0,
        lastPage: 1,
    });
    const [loading, setLoading] = useState(false);
    const { width } = useWindowSize();


    // Define your column definitions
    const columnDefs = [
        { headerName: "№", valueGetter: "node.rowIndex + 1", sortable: true, filter: false, width: 70 },
        { headerName: "ID", field: "id", hide: true },
        { headerName: "Անուն", field: "name", sortable: true, filter: false, width: 130 },
        { headerName: "Ազգանուն", field: "surname", sortable: true, filter: false, width: 150 },
        { headerName: "Հեռախոսահամար", field: "phone", sortable: true, filter: false, width: 180 },
        // { headerName: "Տարածաշրջան", field: "region", sortable: true, filter: false, width: 100 },
        { headerName: "Քաղաք", field: "city", sortable: true, filter: false, width: 140 },
        { headerName: "Հասե", field: "address", sortable: true, filter: false,width: 180 },
        // { headerName: "Ծննդյան տարեթիվ", field: "birthday", sortable: true, filter: false, width: 100, headerClass: 'wrap-header' },
        { headerName: "Սեռ", field: "gender", sortable: true, filter: false, width: 120 },
        {
            headerName: "Ակտիվ",
            field: "surname",
            sortable: true,
            filter: false,
            width: 140,
            cellRenderer: (params) => (

                <div className="flex items-center pt-2">
                    <Chip
                        color={params.data.active === 0? 'green' : 'red'}
                        value={params.data.active === 0? 'Ակտիվ' : 'Ակտիվ չէ'}
                        variant='outlined'/>
                </div>
            ),
        },
        // {
        //     headerName: "Խմբագրել",
        //     field: "actions",
        //     width: 150,
        //     cellRenderer: (params) => (
        //         <div className="flex items-center pt-2">
        //             <Button
        //                 size="sm"
        //                 color="blue"
        //                 onClick={() => handleEdit(params.data)}
        //             >
        //                 Խմբագրել
        //             </Button>
        //         </div>
        //     ),
        // },
        // {
        //     headerName: "Ջնջել",
        //     field: "actions",
        //     width: 100,
        //     cellRenderer: (params) => (
        //         <div className="flex items-center pt-2">
        //             <Button
        //                 size="sm"
        //                 color="red"
        //                 onClick={() => handleDelete(params.data.id)}
        //             >
        //                 Ջնջել
        //             </Button>
        //         </div>
        //     ),
        // },
    ];

    // Fetch data
    const fetchDentist = useCallback(async (page, pageSize, patientFilter) => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`/dentists/data`, {
                params: { page, pageSize, ...patientFilter },
            });
            debugger
            setDentists(response.data.dentists);
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
        fetchDentist(pagination.currentPage, pagination.pageSize, filter);
    }, [pagination.currentPage, pagination.pageSize, fetchDentist, filter ,onDentistAdd]);

    // Handlers
    const handleEdit = (data) => {
        console.log("Edit patient:", data);
        // Add your edit logic here
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this patient?")) {
            try {
                await axios.delete(`/patients/${id}`);
                fetchDentist(pagination.currentPage, pagination.pageSize, filter); // Refresh the data
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
                rowData={dentists}
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

            <div className={`custom-pagination-container ${width < 960 ? "justify-center gap-2 flex-col" : ""}`}>

                {width > 960 && (
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
                )}


                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-center sm:justify-start mr-2">
                    <Button
                        type="submit"
                        color="gray"
                        className="text-white font-semibold rounded-md flex gap-1 items-center text-sm px-3 py-1"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.currentPage === 1}
                        variant='gradient'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-4">
                            <path fillRule="evenodd"
                                  d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z"
                                  clipRule="evenodd"/>
                            <path fillRule="evenodd"
                                  d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z"
                                  clipRule="evenodd"/>
                        </svg>
                        Առաջին
                    </Button>

                    <Button
                        type="submit"
                        color="gray"
                        className="text-white font-semibold rounded-md flex gap-1 items-center text-sm px-3 py-1"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        variant='gradient'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-4">
                            <path fillRule="evenodd"
                                  d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                                  clipRule="evenodd"/>
                        </svg>
                        Նախորդ
                    </Button>

                    <span className="text-sm text-center w-full sm:w-auto">
    Էջ {pagination.currentPage} - {pagination.lastPage}
  </span>

                    <Button
                        type="submit"
                        color="gray"
                        className="text-white font-semibold rounded-md flex gap-1 items-center text-sm px-3 py-1"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        variant='gradient'
                    >
                        Հաջորդ
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-4">
                            <path fillRule="evenodd"
                                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </Button>

                    <Button
                        type="submit"
                        color="gray"
                        className="text-white font-semibold rounded-md flex gap-1 items-center text-sm px-3 py-1"
                        onClick={() => handlePageChange(pagination.lastPage)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        variant='gradient'
                    >
                        Վերջին
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-4">
                            <path fillRule="evenodd"
                                  d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                  clipRule="evenodd"/>
                            <path fillRule="evenodd"
                                  d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </Button>
                </div>


                {width < 960 && (
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
                )}
            </div>
        </div>
    );
};

export default DentistsTable;
