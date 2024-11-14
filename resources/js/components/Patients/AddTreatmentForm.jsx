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

export default function AddTreatmentForm({toggleModal, patientID, onNewTreatmentAdded }) {
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

    const today = new Date().toISOString().split("T")[0];


    const validateForm = () => {
        const newErrors = {};

        if (!formData.title) {
            newErrors.title = "Title is required.";
        } else if (formData.title.length > 40) {
            newErrors.title = "Title cannot exceed 40 characters.";
        }

        if (!formData.treatment_plan_start_date) {
            newErrors.treatment_plan_start_date = "Treatment plan start date is required.";
        } else {
            const startDate = new Date(formData.treatment_plan_start_date);

            if (startDate < today) {
                newErrors.treatment_plan_start_date = "Treatment plan start date cannot be in the past.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if there are no errors
    };

    const { addEntity, isLoading, validationErrors } = useAddEntity('treatments');
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // If form validation fails, do not proceed
            console.warn("Validation failed, please check the form fields.");
            return;
        }

        try {
            const t = await addEntity(formData);
            alertify.success('Treatment added successfully.');
            setFormData({
                title: '',
                diagnosis: '',
                treatment_plan_start_date: '',
            });
            if (onNewTreatmentAdded) {
                onNewTreatmentAdded();
            }
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
                    <div>
                        <Input
                            label="Title"
                            size="lg"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            color="gray"
                        />
                        {errors.title && <p className="error-message">{errors.title}</p>}
                    </div>
                    <div>
                        <Textarea
                            color="gray"
                            label="Diagnosis"
                            size="lg"
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}


                        />
                    </div>
                    <div>
                        <Input
                            type="date"
                            label="Treatment plan start date"
                            size="lg"
                            name="treatment_plan_start_date"
                            value={formData.treatment_plan_start_date}
                            onChange={handleChange}
                            color="gray"
                            // min={today}
                        />
                        {errors.treatment_plan_start_date && <p className="error-message">{errors.treatment_plan_start_date}</p>}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="mt-6"
                    fullWidth

                    variant="gradient" color="gray"
                    loading={isLoading}>
                    Add
                </Button>
            </form>
        </div>
    );
}
