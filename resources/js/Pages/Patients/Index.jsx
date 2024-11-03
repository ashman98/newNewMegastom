// resources/js/Pages/PatientsTable.jsx

import React, {useState} from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PatientsTable from "@/components/PatientsTable.jsx";
import Modal from "@/components/Modal.jsx";
import AddPatientForm from "@/components/Patients/AddPatientForm.jsx";
import {Button, Typography} from "@material-tailwind/react";
import {GenericModal} from "@/components/GenericModal.jsx";
import alertify from "alertifyjs";
import useAddEntity from "@/hooks/useAddEntity.js";

const dentistInfo = {
    image: '/path/to/dentist-image.jpg', // Update with actual image path
    name: 'Dr. Ivan Petrov',
    specialization: 'Стоматолог',
};

const PatientIndex = ({ patients }) => {
    const [open, setOpen] = useState(false);
    const toggleModal = () => setOpen((cur) => !cur);

    return (
        <AuthenticatedLayout>
            <Head title="Patients" />

            <div className="patients-container">
                <div className="dentist-card">
                    <img src={dentistInfo.image} alt="Dentist" className="dentist-image" />
                    <div className="dentist-info">
                        <h2>{dentistInfo.name}</h2>
                        <p>{dentistInfo.specialization}</p>
                    </div>
                </div>

                <Button onClick={toggleModal}>Add Patient</Button>
                <GenericModal
                    open={open}
                    onClose={toggleModal}
                    title="Add Patient"
                    confirm="Add Patient"
                    cancel="Cancel"
                    footer={false}
                >
                    <AddPatientForm toggleModal={toggleModal}/>
                </GenericModal>
                {/*<button onClick={addNewProduct} className="add-product-button">*/}
                {/*    Добавить продукт*/}
                {/*</button>*/}

                <PatientsTable patients={patients}/>

            </div>

        </AuthenticatedLayout>
    );
};

export default PatientIndex;
