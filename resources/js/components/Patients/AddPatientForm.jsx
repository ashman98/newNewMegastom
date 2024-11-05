import React, { useState } from 'react';
import useAddEntity from '../../hooks/useAddEntity.js'; // Specify the correct path to the hook
import './AddPatinetForm.css';

import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography, Spinner,
} from "@material-tailwind/react";
import alertify from 'alertifyjs'; // Make sure to install alertifyjs

export default function AddPatientForm({toggleModal}) {
    alertify.set('notifier', 'position', 'top-right');

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        city: '',
        address: '',
        birthday: '',
    });

    const getFormData  = () => {
        return formData;
    }

    const setData  = (formData) => {
        setFormData(formData);
    }

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [errors, setErrors] = useState({
        name: false,
        surname: false,
        phone: false,
        city: false,
        address: false,
        birthday: false,
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
            name: !formData.name,
            surname: !formData.surname,
            phone: !formData.phone,
            city: !formData.city,
            address: !formData.address,
            birthday: !formData.birthday,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(x => !x);
    };

    const { addEntity, isLoading, validationErrors } = useAddEntity('patients');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEntity(formData);
            alertify.success('Patient added successfully.');
            setFormData({
                name: '',
                surname: '',
                phone: '',
                city: '',
                address: '',
                birthday: '',
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
                        label="Name"
                        size="lg"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <Input
                        label="Surname"
                        size="lg"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                    />
                    <Input
                        label="Phone"
                        size="lg"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={validationErrors.phone && validationErrors.phone[0]}
                    />
                    {validationErrors.phone && (
                        <span className="text-red-500 text-sm">{validationErrors.phone[0]}</span>
                    )}
                    <Input
                        label="City"
                        size="lg"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <Input
                        label="Address"
                        size="lg"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <Input
                        type="date"
                        label="Date of Birth"
                        size="lg"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit" className="mt-6" fullWidth loading={isLoading}>
                    Add
                </Button>
            </form>
        </div>
    );
}
