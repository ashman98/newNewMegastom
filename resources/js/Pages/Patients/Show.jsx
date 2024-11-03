import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    Avatar,
    Input,
} from "@material-tailwind/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import { debounce } from 'lodash';
import {GenericModal} from "@/components/GenericModal.jsx";
import AddTreatmentForm from "@/components/Patients/AddTreatmentForm.jsx";

export default function PatientShow({ patient, treatments: initialTreatments }) {
    const [open, setOpen] = useState(false);
    const toggleModal = () => setOpen((cur) => !cur);
    const [treatments, setTreatments] = useState(initialTreatments);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

    // Spinner component
    const Spinner = () => (
        <div className="flex justify-center items-center">
            <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );

    // Debounced fetch function to prevent excessive calls when typing in search
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

    // Throttled pagination function to avoid rapid page switching
    const handlePageChange = useCallback(
        debounce((newPage) => {
            setCurrentPage(newPage);
        }, 300),
        []
    );

    const goToTreatmentPage = (id) => {
        debugger
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
                            <Card className="text-center">
                                <CardHeader floated={false} className="relative">
                                    <Avatar
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                        alt="avatar"
                                        size="xl"
                                        className="rounded-full mx-auto"
                                    />
                                </CardHeader>
                                <CardBody>
                                    <div className="my-4">
                                        <Button onClick={toggleModal} variant="gradient" color="blue" size="md">Add treatments</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Right Column - Patient Details */}
                        <div className="w-full lg:w-2/3 px-4">
                            <Card>
                                <CardBody>
                                    {[{ label: 'Full Name', value: `${patient.name} ${patient.surname}` },
                                        { label: 'Birthday', value: patient.birthday || 'N/A' },
                                        { label: 'Phone', value: patient.phone },
                                        { label: 'City', value: patient.city },
                                        { label: 'Address', value: 'Bay Area, San Francisco, CA' },
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b">
                                            <Typography variant="small" color="blue-gray">{item.label}</Typography>
                                            <Typography variant="small" color="gray">{item.value}</Typography>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    {/* Filter Inputs */}
                    <div className="flex flex-wrap -mx-4 mt-8">
                        <div className="w-full md:w-1/3 px-4 mb-4">
                            <Input
                                label="Search Title"
                                type="text"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-1/3 px-4 mb-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-1/3 px-4 mb-4">
                            <Input
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Treatments and Diagnosis Cards */}
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className="flex flex-wrap -mx-4 mt-8">
                            {treatments.length > 0 ? (
                                treatments.map((treatment, idx) => (
                                    <div key={idx} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                                        <Card
                                            className="shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
                                            <CardBody
                                                style={{cursor: 'pointer'}}
                                                onClick={() => goToTreatmentPage(treatment.id)}
                                                className="rounded-lg border border-gray-200 p-6"
                                            >
                                                <Typography variant="h6" color="blue" className="mb-2">
                                                    {treatment.title}
                                                </Typography>
                                                <Typography variant="small" color="gray" className="mb-2">
                                                    <span
                                                        className="font-semibold text-blue-gray-700">Diagnosis:</span> {treatment.diagnosis.length > 100 ? `${treatment.diagnosis.substring(0, 60)}...` : treatment.diagnosis}
                                                </Typography>
                                                <Typography variant="small" color="gray" className="mb-2">
                                                    <span
                                                        className="font-semibold text-blue-gray-700">Treatment Plan:</span> {treatment.treatment_plan.length > 100 ? `${treatment.treatment_plan.substring(0, 60)}...` : treatment.treatment_plan || 'N/A'}
                                                </Typography>
                                                <Typography variant="small" color="gray" className="mb-2">
                                                    <span
                                                        className="font-semibold text-blue-gray-700">Start Date:</span> {new Date(treatment.treatment_plan_start_date).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="small" color="gray" className="mb-2">
                                                    <span
                                                        className="font-semibold text-blue-gray-700">End Date:</span> {treatment.treatment_plan_end_date ? new Date(treatment.treatment_plan_end_date).toLocaleDateString() : 'Ongoing'}
                                                </Typography>
                                                <Typography variant="small" color="gray" className="mb-2">
                                                    <span
                                                        className="font-semibold text-blue-gray-700">Amount:</span> ${treatment.amount || 'N/A'}
                                                </Typography>
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))
                            ) : (
                                <Typography variant="small" color="gray" className="text-center w-full mt-4">
                                    No treatments available for this patient.
                                </Typography>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-4">
                        <Button
                            variant="outlined"
                            color="blue"
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
                            color="blue"
                            onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.last_page))}
                            disabled={currentPage === pagination.last_page}
                        >
                            Next
                        </Button>
                    </div>
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
                <AddTreatmentForm toggleModal={toggleModal}/>
            </GenericModal>
        </AuthenticatedLayout>
    );
}
