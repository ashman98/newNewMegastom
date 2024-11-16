import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    Avatar,
    Input,
    IconButton
} from "@material-tailwind/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import { debounce } from 'lodash';
import {GenericModal} from "@/components/GenericModal.jsx";
import AddTreatmentForm from "@/components/Patients/AddTreatmentForm.jsx";
import {ConfirmDialog} from "@/components/ConfirmDialog.jsx";
import useAddEntity from "@/hooks/useAddEntity.js";
import alertify from "alertifyjs";

export default function PatientShow({ patient }) {
    const [open, setOpen] = useState(false);
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [entityUrl, setEntityUrl] = useState('');
    const [deleteType, setDeleteType] = useState('');


    const toggleModal = () => setOpen((cur) => !cur);
    const toggleDialogConfirm = () => setOpenDialogConfirm((cur) => !cur);

    const [treatments, setTreatments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

    const Spinner = () => (
        <div className="flex justify-center items-center">
            <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );

    const handleNewTreatmentAdded = () => {
        debouncedFetchTreatments(currentPage, searchTitle, startDate, endDate);
    };

    const debouncedFetchTreatments = useCallback(
        debounce(async (page, title, start, end) => {
            setLoading(true);
            try {
                const response = await axios.get(`/patients/${patient.id}/treatments`, {
                    params: { page, title, start_date: start, end_date: end },
                });
                setTreatments(response.data.treatments);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error("Error fetching treatments:", error);
            } finally {
                setLoading(false);
            }
        }, 500),
        [] // Dependencies: empty array, so it only re-creates the function on mount
    );

    // Fetch treatments when filters change, debounced
    useEffect(() => {
        debouncedFetchTreatments(currentPage, searchTitle, startDate, endDate);
    }, [currentPage, startDate, endDate, searchTitle, debouncedFetchTreatments]);


    const { deleteEntity, isLoading, validationErrors } = useAddEntity(entityUrl);
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
                await deleteEntity();
                alertify.success('Patient added successfully.');
            if (deleteType === 'delete_patient'){
                Inertia.get(`/patients`);
            }else{
                handleNewTreatmentAdded();
                toggleDialogConfirm();
            }
        } catch (err) {
            console.error('Submission failed:', err);
        } finally {
            setEntityUrl(``);
            setConfirmDelete(false);
            setDeleteType('');
            if (deleteType !== 'delete_patient'){
                setDeleteLoading(false)
            }
        }
    };

    useEffect(() => {
        if(confirmDelete){
            handleDelete();
        }
    }, [confirmDelete]);

    const handleConfirm = (e,type, id) => {
        e.preventDefault();
        setDeleteType(type);
        if (type === 'delete_treatment'){
            setEntityUrl(`treatments/${id}`);
        }else if (type === 'delete_patient') {
            setEntityUrl(`patients/${patient.id}`);
        }
        setOpenDialogConfirm(true);
    }


    const handlePageChange = useCallback(
        debounce((newPage) => {
            setCurrentPage(newPage);
        }, 300),
        []
    );

    const goToTreatmentPage = (id) => {
        // const patientId = event.data.id; // Access the patient ID
        console.log("Double-clicked Patient ID:", id); // Debugging
        if (id) {
            Inertia.get(`/treatments/${id}`);
        } else {
            console.log("Patient ID not found.");
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Patients" />

            <section className="bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap -mx-4">
                        {/* Left Column - Patient Info */}
                        <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
                            <Card className="text-center py-5">
                                    <Avatar
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                        alt="avatar"
                                        size="xl"
                                        className="rounded-full mx-auto"
                                    />
                                <CardBody>
                                    <div className="my-4 flex gap-2 justify-center items-center">
                                        <Button variant="gradient" color="gray" size="md" className='flex items-center gap-3'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="size-5">
                                                <path
                                                    d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"/>
                                            </svg>

                                            Փոփոխել
                                        </Button>
                                        <Button variant='outlined' color="red" className='flex items-center gap-3'
                                                onClick={(e) => handleConfirm(e,'delete_patient')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="size-5">
                                                <path
                                                    d="M10.375 2.25a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25ZM10.375 12a7.125 7.125 0 0 0-7.124 7.247.75.75 0 0 0 .363.63 13.067 13.067 0 0 0 6.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 0 0 .364-.63l.001-.12v-.002A7.125 7.125 0 0 0 10.375 12ZM16 9.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z"/>
                                            </svg>


                                            Հեռացնել
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Right Column - Patient Details */}
                        <div className="w-full lg:w-2/3 px-4">
                            <Card>
                                <CardBody>
                                    {[{label: 'Անուն Ազգանուն', value: `${patient.name} ${patient.surname}` },
                                        { label: 'Ծննդյան տարթիվ', value: patient.birthday || 'N/A' },
                                        { label: 'Հեռախոսահամր', value: patient.phone },
                                        { label: 'Քաղաք', value: patient.city },
                                        { label: 'Հացե', value: 'Bay Area, San Francisco, CA' },
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b">
                                            <Typography variant="small" color="gray">{item.label}</Typography>
                                            <Typography variant="small" color="gray">{item.value}</Typography>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    <Card className='pb-8 pt-2 mt-5'>
                        <Typography variant="h6" className="ml-5 text-blue-gray-700">
                            Բուժումներ
                        </Typography>
                        {/* Filter Inputs */}
                        <CardHeader className='px-3 mt-0'>

                            <div className='py-4'>
                                <Button onClick={toggleModal} variant="gradient" color="gray" size="md" className='flex gap-2 items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="size-5">
                                        <path fillRule="evenodd"
                                              d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z"
                                              clipRule="evenodd"/>
                                        <path
                                            d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z"/>
                                    </svg>
                                    Ավելացնել բուժում
                                </Button>

                            </div>

                            <div className="flex flex-wrap -mx-4 py-2">
                                <div className="w-full md:w-1/3 px-4 mb-4">
                                    <Input
                                        label="Որոնել բուժման անվանումը"
                                        type="text"
                                        value={searchTitle}
                                        onChange={(e) => setSearchTitle(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-4 mb-4">
                                    <Input
                                        label="Բուժման պլանի սկիզբ"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-4 mb-4">
                                    <Input
                                        label="Բուժման պլանի ավարտ"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody>
                            {/* Treatments and Diagnosis Cards */}
                            {loading ? (
                                <Spinner />
                            ) : (
                                <div className="flex flex-wrap -mx-4 mt-8 ">
                                    {treatments && treatments.length > 0 ? (
                                        treatments.map((treatment, idx) => (
                                            <>
                                            <div key={idx}
                                                 className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 px-4 mb-8 position-relative">

                                                <Card
                                                    className="shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">

                                                    <CardBody
                                                        className="rounded-lg border border-gray-200 p-6"
                                                    >
                                                        <div className='flex justify-between'>
                                                            <Typography variant="h6" color="blue-gray-900"
                                                                        className="mb-2 " style={{cursor: 'pointer'}}
                                                                        onClick={() => goToTreatmentPage(treatment.id)}>
                                                                {treatment.title}
                                                            </Typography>
                                                            <IconButton
                                                                variant="outlined"
                                                                size="sm"
                                                                color='red'
                                                                className=''
                                                                placeholder='De'
                                                                onClick={(e) => handleConfirm(e, 'delete_treatment', treatment.id)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 24 24" fill="currentColor"
                                                                     className="size-5">
                                                                    <path fillRule="evenodd"
                                                                          d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 14.25a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5H9.75Z"
                                                                          clipRule="evenodd"/>
                                                                    <path
                                                                        d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z"/>
                                                                </svg>
                                                            </IconButton>
                                                        </div>

                                                        <div onClick={() => goToTreatmentPage(treatment.id)}
                                                             style={{cursor: 'pointer'}}>
                                                            <Typography variant="small" color="gray" className="mb-2">
                                                                <span
                                                                    className="font-semibold text-blue-gray-500">Ախտորոշում: </span>
                                                                {treatment.diagnosis ?
                                                                    treatment.diagnosis.replace(/<[^>]+>/g, '').length > 30
                                                                        ? `${treatment.diagnosis.replace(/<[^>]+>/g, '').substring(0, 30)}...`
                                                                        : treatment.diagnosis.replace(/<[^>]+>/g, '')
                                                                    : ''}
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="mb-2">
                                                                <span
                                                                    className="font-semibold text-blue-gray-500">Բուժման պլան: </span>
                                                                {treatment.treatment_plan ?
                                                                    treatment.treatment_plan.replace(/<[^>]+>/g, '').length > 30
                                                                        ? `${treatment.treatment_plan.replace(/<[^>]+>/g, '').substring(0, 30)}...`
                                                                        : treatment.treatment_plan.replace(/<[^>]+>/g, '')
                                                                    : ''}
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="mb-2">
                                                                <span
                                                                    className="font-semibold text-blue-gray-500">Բուժման սկիզբ:</span> {new Date(treatment.treatment_plan_start_date).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="mb-2">
                                                                <span
                                                                    className="font-semibold text-blue-gray-500">Բուժման ավարտ:</span> {treatment.treatment_plan_end_date ? new Date(treatment.treatment_plan_end_date).toLocaleDateString() : 'Ongoing'}
                                                            </Typography>
                                                            {/*<Typography variant="small" color="gray" className="mb-2">*/}
                                                            {/*    <span*/}
                                                            {/*        className="font-semibold text-blue-gray-700">Amount:</span> {treatment.amount ? `${treatment.amount}֏` : 'N/A'}*/}
                                                            {/*</Typography>*/}
                                                        </div>

                                                    </CardBody>
                                                </Card>
                                            </div>
                                            <div className="flex justify-center mt-4">
                                                <Button
                                                    variant="outlined"
                                                    color="gray"
                                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </Button>
                                                <Typography variant="small" color="gray" className="mx-4">
                                                    Page {currentPage} of {pagination.last_page}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    color="gray"
                                                    onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.last_page))}
                                                    disabled={currentPage === pagination.last_page}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                            </>
                                            ))
                                            ) : (
                                            <Typography variant="small" color="gray"
                                                        className="text-center w-full my-4">
                                                Բուժումներ չկան։
                                            </Typography>
                                            )}
                                            </div>
                                        )}

                                    {/* Pagination Controls */}
                                </CardBody>
                                </Card>
                                </div>
                                </section>

                                <GenericModal
                                open={open}
                            onClose={toggleModal}
                            title="Add Treatment"
                            confirm="Add Treatment"
                            cancel="Cancel"
                            footer={false}
                        >
                            <AddTreatmentForm toggleModal={toggleModal} patientID={patient.id}
                                              onNewTreatmentAdded={handleNewTreatmentAdded}/>
                        </GenericModal>
                        <ConfirmDialog
                            open={openDialogConfirm}
                            onClose={toggleDialogConfirm}
                            onConfirm={setConfirmDelete}
                            isLoading={deleteLoading}
                            title={deleteType === 'delete_patient' ? 'Հեռացնել պացիենտին' : 'Հեռացնել բուժումը'}
                        >
                            <Typography className='text-center' style={{fontSize: 18}}>
                                {deleteType === 'delete_patient' ? ' Ցանկանում ե՞ք հեռացնել պացիենտին։' : ' Ցանկանում ե՞ք հեռացնել բուժումը:'}

                            </Typography>
                        </ConfirmDialog>
        </AuthenticatedLayout>
    );
}
