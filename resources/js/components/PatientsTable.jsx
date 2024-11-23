import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import { AgGridReact } from "ag-grid-react";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import './PatientsTable.css';
import { Inertia } from '@inertiajs/inertia';
import {Button} from "@material-tailwind/react";

const userLocaleText = {
    filterOoo: 'Փնտրել...',
    equals: 'Հավասար է',
    contains: 'Պարունակում է',
    selectAll: 'Ընտրել բոլորը',
    noRowsToShow: 'Տվյալներ չեն գտնվել',
    doesNotContain: 'Չի պարունակում',
    doesNotEqual: 'Чи պարունակում',
    beginsWith: 'Սկսված'
};

const PatientsTable = ({filter}) => {
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 5,
        total: 0,
        lastPage: 1,
    });
    const [loading, setLoading] = useState(false);

    const columnDefs = [
        { headerName: "№", valueGetter: "node.rowIndex + 1", sortable: true, filter: false, width: 70 },
        { headerName: "ID", field: "id", hide: true },
        { headerName: "Անուն", field: "name", sortable: true, filter: false, width: 130 },
        { headerName: "Ազգանուն", field: "surname", sortable: true, filter: false, width: 140 },
        { headerName: "Հեռախոսահամար", field: "phone", sortable: true, filter: false, width: 180 },
        { headerName: "Քաղաք", field: "city", sortable: true, filter: false, width: 140 },
        { headerName: "Հասե", field: "address", sortable: true, filter: false, flex: 1 },
        { headerName: "Ծննդյան տարեթիվ", field: "birthday", sortable: true, filter: false, width: 120, headerClass: 'wrap-header' },
        { headerName: "Սեռ", field: "gender", sortable: true, filter: false, width: 100 }
    ];

    const fetchPatients = useCallback(
        async (page, pageSize, patinetFilter) => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get(`/patients/data`, {
                    params: { page, pageSize, ...patinetFilter },
                });
                setPatients(response.data.patients);
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
        },
        []
    );

    useEffect(() => {
        debugger
        fetchPatients(pagination.currentPage, pagination.pageSize, filter);
    }, [pagination.currentPage, pagination.pageSize, fetchPatients ,filter]);

    // const onGridReady = (params) => {
    //     params.api.setPaginationPageSize(pagination.pageSize);
    // };

    const goToPatientPage = (event) => {
        const patientId = event.data.id;
        if (patientId) {
            Inertia.get(`/patients/${patientId}`);
        } else {
            console.log("ID пациента не найден.");
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
                    {/*<span>Загрузка данных...</span>*/}
                </div>
            )}


            <AgGridReact
                rowData={patients}
                columnDefs={columnDefs}
                localeText={userLocaleText}
                paginationPageSize={pagination.pageSize}
                // onGridReady={onGridReady}
                domLayout="autoHeight"
                suppressHorizontalScroll={true}
                onRowClicked={goToPatientPage}
                overlayNoRowsTemplate={loading ? '<span>Загрузка...</span>' : userLocaleText.noRowsToShow}
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
                        className="text-white font-semibold rounded-md flex gap-1 items-center"
                        onClick={() => handlePageChange(1)} disabled={pagination.currentPage === 1}
                        variant='gradient'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-5">
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
                        className="text-white font-semibold rounded-md flex gap-1 items-center"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        variant='gradient'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-5">
                            <path fillRule="evenodd"
                                  d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                                  clipRule="evenodd"/>
                        </svg>
                        Նախորդ
                    </Button>

                    <span>Էջ {pagination.currentPage} - {pagination.lastPage}</span>

                    <Button
                        type="submit"
                        color="gray"
                        className="text-white font-semibold rounded-md flex gap-1 items-center"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        variant='gradient'
                    >
                        Հաջորդ
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-5">
                            <path fillRule="evenodd"
                                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </Button>
                    <Button
                        type="submit"
                        color="gray"
                        className="text-white font-semibold rounded-md flex gap-1 items-center"
                        onClick={() => handlePageChange(pagination.lastPage)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        variant='gradient'
                    >
                        Վարջին
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="size-5">
                            <path fillRule="evenodd"
                                  d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                  clipRule="evenodd"/>
                            <path fillRule="evenodd"
                                  d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                  clipRule="evenodd"/>
                        </svg>

                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PatientsTable;
