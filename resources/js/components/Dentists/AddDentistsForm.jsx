import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useAddEntity from '../../hooks/useAddEntity.js'; // Specify the correct path to the hook
import './AddDentistsForm.css';

import {
    Card,
    Input,
    Option,
    Button,
    Typography, Spinner, Select as MatSelect
} from "@material-tailwind/react";
import alertify from 'alertifyjs';
import axios from "axios";
// import { MultiSelect } from 'primereact/multiselect';
// import { Button as PrimeButton } from 'primereact/button';
import Select from "react-select";

export default function AddDentistsForm({toggleModal, dentist, setDentist, toggleOnDentistAdd}) {
    alertify.set('notifier', 'position', 'top-right');

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        city: '',
        region: null,
        address: '',
        // birthday: '',
        gender: 'male',
        email: '',
        password: ''
    });

    //for edit
    // useMemo(() => {
    //     if (dentist && dentist.id) {
    //
    //         setFormData({
    //             name: patient.name,
    //             surname: patient.surname,
    //             phone: patient.phone,
    //             city: patient.city,
    //             address: patient.address,
    //             birthday: patient.birthday,
    //             gender: patient.gender,
    //         });
    //         setSelectedDiseases(p);
    //     }
    // }, [patient]);


    const [loading, setLoading] = useState(false);

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
        // birthday: false,
        region: false,
        email: false,
        password: false
    });


    const handleChange = (name, value) => {
        console.log(value.length);
        if (!validateChangeData(name, value)){
            return
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: false,  // Set the error for the field to false
        }));

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };

    const today = new Date().toISOString().split("T")[0];
    const validateChangeData = (name ,value) => {
        const newErrors = {};

        if (name === 'name' && value.length > 50) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: "Անունը չի կարող լինել այսքան երկար:",  // Reset any existing error for the field
            }));
            return false; // Do not update formData if the name exceeds 255 characters
        }
        if (name === 'surname' && value.length > 50) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: "Ազգանունը չի կարող լինել այսքան երկար:",  // Reset any existing error for the field
            }));
            return false;  // Do not update formData if the name exceeds 255 characters
        }
        if (name === 'city' && value.length > 50) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: "Քաղաքի անվանումը չի կարող լինել այսքան երկար:",  // Reset any existing error for the field
            }));
            return false;  // Do not update formData if the name exceeds 255 characters
        }
        if (name === 'address' && value.length > 255) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: "Հասցեն չի կարող լինել այսքան երկար:",  // Reset any existing error for the field
            }));
            return false;  // Do not update formData if the name exceeds 255 characters
        }
        if (name === 'phone') {
            if (value.length > 12) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: "Հեռախոսհամարը շատ երկար է:",  // Reset any existing error for the field
                }));
                return false;
            }
            else if (value && !/^\d+$/.test(value) ) {
                // Check that the phone contains only digits
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: "Հեռախոսահամարը պետք է պարունակի միայն թվեր:",  // Reset any existing error for the field
                }));
                return false;
            }
        }

        return true; // Return true if there are no errors
    };

    const validateForm = () => {
        const newErrors = {};


        if (!formData.name) {
            newErrors.name = "Պարտադիր է:";
        }

        if (!formData.surname) {
            newErrors.surname = "Պարտադիր է:";
        }

        if (!formData.phone) {
            newErrors.phone = "Պարտադիր է:";
        }

        if (!formData.city) {
            newErrors.city = "Պարտադիր է:";
        }

        if (!formData.address) {
            newErrors.address = "Պարտադիր է:";
        }

        if (!formData.email) {
            newErrors.email = "Պարտադիր է:";
        }

        if (!formData.password) {
            newErrors.password = "Պարտադիր է:";
        }

        // if (!formData.birthday) {
        //     newErrors.birthday = "Պարտադիր է:";
        // } else {
        //     const birthday = new Date(formData.birthday);
        //
        //     if (birthday > today) {
        //         newErrors.birthday = "Ծննդյան տարեթիվը սխալ է:";
        //     }
        // }

        Object.keys(newErrors).forEach((key) => {
            if (newErrors[key]) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [key]: newErrors[key],  // Reset any existing error for the field
                }));
            }
        });

        let val = true;
        Object.keys(errors).forEach((key) => {
            if (errors[key]) {
                val = false;
            }
        });

        return val; // Return true if there are no errors
    };

    const { addEntity, updateEntity,isLoading, validationErrors } = useAddEntity(`dentists${dentist && dentist.id ? "/"+dentist.id : ""}`);


    useEffect(() => {
        if (validationErrors.length > 0){
            validationErrors.forEach((err)=>{
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [err.key]: err.message,  // Reset any existing error for the field
                }));
            })

        }
    }, [validationErrors]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (!validateForm()) {
                // If form validation fails, do not proceed
                console.warn("Validation failed, please check the form fields.");
                return;
            }

            if (dentist && dentist.id){
               const response =  await updateEntity(formData)
                setDentist(response.dentist)
            } else{
                await addEntity(formData);
                toggleOnDentistAdd();
            }
            alertify.success(`${dentist && dentist.id ? "Բժիշկը հաջողությամբ խմբագրվեց։" : "Բժիշկը հաջողությամբ ավելացվեց։"}`);
            setFormData({
                name: '',
                surname: '',
                phone: '',
                city: '',
                address: '',
                // birthday: '',
                email: '',
                password: '',
            });
            toggleModal();
        } catch (err) {
            console.error('Submission failed:', err);
        } finally {
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            {loading?  (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
                    <Spinner className="h-16 w-16 text-gray-900/50" />
                </div>
            ) : (
            <form className=" mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                <div className=" flex flex-col gap-3">
                    <div>
                        <Input
                            label="Անուն"
                            size="lg"
                            name="name"
                            value={formData.name}
                            onChange={(e) => {
                                handleChange(e.target.name, e.target.value)
                            }}
                            error={errors.name}
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>
                    <div>
                        <Input
                            label="Ազգանուն"
                            size="lg"
                            name="surname"
                            value={formData.surname}
                            onChange={(e) => {
                                handleChange(e.target.name, e.target.value)
                            }}
                            error={errors.surname}
                        />
                        {errors.surname && <p className="error-message">{errors.surname}</p>}
                    </div>
                    <div>
                        <Input
                            label="Հեռախոսահամար"
                            size="lg"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {
                                handleChange(e.target.name, e.target.value)
                            }}
                            error={errors.phone}
                        />
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                    </div>
                    <div>
                        <Input
                            label="Քաղաք"
                            size="lg"
                            name="city"
                            value={formData.city}
                            onChange={(e) => {
                                handleChange(e.target.name, e.target.value)
                            }}
                            error={errors.city}
                        />
                        {errors.city && <p className="error-message">{errors.city}</p>}
                    </div>
                    <div>
                        <Input
                            label="Հասցե"
                            size="lg"
                            name="address"
                            value={formData.address}
                            onChange={(e) => {
                                handleChange(e.target.name, e.target.value)
                            }}
                            error={errors.address}
                        />
                        {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>
                    {/*<div>*/}
                    {/*    <Input*/}
                    {/*        type="date"*/}
                    {/*        label="Ծննդյան տարեթիվ"*/}
                    {/*        size="lg"*/}
                    {/*        name="birthday"*/}
                    {/*        className='birthday'*/}
                    {/*        value={formData.birthday}*/}
                    {/*        max={today}*/}
                    {/*        onChange={(e) => {*/}
                    {/*            handleChange(e.target.name, e.target.value)*/}
                    {/*        }}*/}
                    {/*        error={errors.birthday}*/}
                    {/*    />*/}
                    {/*    {errors.birthday && <p className="error-message">{errors.birthday}</p>}*/}
                    {/*</div>*/}
                    <MatSelect size="md" label="Սեռ" animate={{
                        mount: {y: 0},
                        unmount: {y: 25},
                    }}
                               value={formData.gender}
                               name='gender'
                               onChange={(val) => {
                                   handleChange('gender', val)
                               }}
                    >
                        <Option value='male'>
                            <div className='flex flex-row items-center gap-3'>
                                <svg width="20px" height="20px" viewBox="0 0 1024 1024"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#000000"
                                          d="M399.5 849.5a225 225 0 1 0 0-450 225 225 0 0 0 0 450zm0 56.25a281.25 281.25 0 1 1 0-562.5 281.25 281.25 0 0 1 0 562.5zm253.125-787.5h225q28.125 0 28.125 28.125T877.625 174.5h-225q-28.125 0-28.125-28.125t28.125-28.125z"/>
                                    <path fill="#000000"
                                          d="M877.625 118.25q28.125 0 28.125 28.125v225q0 28.125-28.125 28.125T849.5 371.375v-225q0-28.125 28.125-28.125z"/>
                                    <path fill="#000000"
                                          d="M604.813 458.9 565.1 419.131l292.613-292.668 39.825 39.824z"/>
                                </svg>
                                <Typography className='' color='gray'>
                                    Արական
                                </Typography>
                            </div>
                        </Option>
                        <Option value={'female'}>
                            <div className='flex flex-row items-center gap-3'>
                                <svg width="20px" height="20px" viewBox="0 0 1024 1024"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#000000"
                                          d="M512 640a256 256 0 1 0 0-512 256 256 0 0 0 0 512zm0 64a320 320 0 1 1 0-640 320 320 0 0 1 0 640z"/>
                                    <path fill="#000000"
                                          d="M512 640q32 0 32 32v256q0 32-32 32t-32-32V672q0-32 32-32z"/>
                                    <path fill="#000000" d="M352 800h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32z"/>
                                </svg>
                                <Typography className='' color='gray'>
                                    Իգական
                                </Typography>
                            </div>
                        </Option>
                    </MatSelect>
                    <div>
                        <Input
                            type="email"
                            label="Էլ․ հասցե"
                            size="lg"
                            name="email"
                            value={formData.email}
                            onChange={(e) => {
                                handleChange(e.target.name, e.target.value)
                            }}
                            error={errors.email}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div>
                        <Input
                            label="Գախտանաբառ"
                            size="lg"
                            type='password'
                            name="password"
                            value={formData.password}
                            onChange={(e) => {
                                handleChange(e.target.name, e.target.value)
                            }}
                            error={errors.password}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                </div>
                <Button type="submit" className="mt-6" fullWidth loading={isLoading}>
                    Ավելացնել
                </Button>
            </form>)}
        </div>
    );
}
