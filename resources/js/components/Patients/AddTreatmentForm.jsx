import React, { useState } from 'react';
import useAddEntity from '../../hooks/useAddEntity.js'; // Specify the correct path to the hook
import './AddTreatmentForm.css';

import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography, Spinner, Textarea,
} from "@material-tailwind/react";
import alertify from 'alertifyjs'; // Make sure to install alertifyjs

export default function AddTreatmentForm({toggleModal, patientID}) {
    alertify.set('notifier', 'position', 'top-right');

    const [formData, setFormData] = useState({
        title: '',
        diagnosis: '',
        treatment_plan_start_date: '',
        patient_id: patientID
    });

    const getFormData  = () => {
        return formData;
    }

    const setData  = (formData) => {
        setFormData(formData);
    }

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [errors, setErrors] = useState({
        title: false,
        diagnosis: false,
        treatment_plan_start_date: false,
        patient_id: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };

    const validateForm = () => {
        const newErrors = {
            title: !formData.title,
            diagnosis: !formData.diagnosis,
            treatment_plan_start_date: !formData.treatmentPlanStartDate,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(x => !x);
    };

    const { addEntity, isLoading, validationErrors } = useAddEntity('treatments');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEntity(formData);
            alertify.success('Treatment added successfully.');
            setFormData({
                title: '',
                diagnosis: '',
                treatment_plan_start_date: '',
            });
            toggleModal();
        } catch (err) {
            console.error('Submission failed:', err);
        } finally {
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            {/*{isLoading && (*/}
            {/*    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">*/}
            {/*        <Spinner className="h-16 w-16 text-gray-900/50" />*/}
            {/*    </div>*/}
            {/*)}*/}
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                <div className="mb-1 flex flex-col gap-6">
                    <Input
                        label="Title"
                        size="lg"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        color="blue-gray"
                    />
                    <Textarea
                        color="blue-gray"
                        label="Diagnosis"
                        size="lg"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}


                    />
                    <Input
                        type="date"
                        label="Treatment plan start date"
                        size="lg"
                        name="treatment_plan_start_date"
                        value={formData.treatment_plan_start_date}
                        onChange={handleChange}
                        color="blue-gray"
                    />
                </div>
                <Button
                    type="submit"
                    className="mt-6"
                    fullWidth

                    variant="gradient" color="blue"
                    loading={isLoading}>
                    Add
                </Button>
            </form>
        </div>
    );
}
