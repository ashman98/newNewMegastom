// resources/js/Pages/PatientsTable.jsx

import React, {useState} from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PatientsTable from "@/components/PatientsTable.jsx";
import Modal from "@/components/Modal.jsx";
import AddPatientForm from "@/components/Patients/AddPatientForm.jsx";
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";
import {GenericModal} from "@/components/GenericModal.jsx";
import alertify from "alertifyjs";
import useAddEntity from "@/hooks/useAddEntity.js";
import './Index.css';
import PatientsFilter from "../../components/PatientsFilter.jsx";

const dentistInfo = {
    image: '/path/to/dentist-image.jpg', // Update with actual image path
    name: 'Dr. Ivan Petrov',
    specialization: 'Стоматолог',
};

const PatientIndex = ({ patients }) => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState({});
    const toggleModal = () => setOpen((cur) => !cur);

    return (
        <AuthenticatedLayout>
            <Head title="Patients"/>

            <div className="md:container md:mx-auto w-full max-w-10xl my-4">
                        <div className="patients-container">
                            <div className='flex justify-between mb-3'>
                                <Button color='gray' variant='gradient' className='flex gap-3 items-center' onClick={toggleModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="size-5">
                                        <path
                                            d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z"/>
                                    </svg>
                                    Նոր պացիենտ
                                </Button>
                                <PatientsFilter onFilterChange={setFilter}/>
                            </div>

                            <GenericModal
                                open={open}
                                onClose={toggleModal}
                                title="Ավելացնել նոր պացիենտ"
                                footer={false}
                            >
                                <AddPatientForm toggleModal={toggleModal}/>
                            </GenericModal>
                            {/*<button onClick={addNewProduct} className="add-product-button">*/}
                            {/*    Добавить продукт*/}
                            {/*</button>*/}

                                <PatientsTable filter={filter} patients={patients}/>
                        </div>
            </div>
        </AuthenticatedLayout>
);
};

export default PatientIndex;
