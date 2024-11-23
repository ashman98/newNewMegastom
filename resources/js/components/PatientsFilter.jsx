import React, {useState, useEffect, useMemo} from 'react';
import {
    Input,
    Button,
    Select as MtSelect,
    Option,
    Typography,
    Drawer,
    IconButton,
    Checkbox
} from '@material-tailwind/react';
import useWindowSize from "@/hooks/useWindowSize.js";
import Select from "react-select";


const PatientsFilter = ({ onFilterChange, diseases }) => {
    const [filters, setFilters] = useState({
        name: '',
        surname: '',
        phone: '',
        city: '',
        address: '',
        birthday_from: '',
        birthday_to: '',
        gender: '',
        patient_diseases: [],
        isOwnPatient: false,

    });

    const [selectedDiseases, setSelectedDiseases] = useState([]);
    const handleChangeDiseases = (selectedOptions) => {
        setFilters({
            ...filters,
            ['patient_diseases']: selectedOptions,
        });
        setSelectedDiseases(selectedOptions);
    };

    const rendDiseases = useMemo(() => {
        if (diseases && diseases.length > 0) {
            return diseases.map((disease) => ({
                value: disease.name,
                label: disease.title,
            }));
        }
        return [];
    }, [diseases]);

    const [openTop, setOpenTop] = useState(false);


    const openDrawerTop = () => setOpenTop(true);
    const closeDrawerTop = () => setOpenTop(false);

    useEffect(() => {
        document.body.style.overflow = openTop ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [openTop]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleChangeChecked = () => {
        setFilters((prev) => ({
            ...prev,
            ['isOwnPatient']: !filters.isOwnPatient
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange(filters);
    };

    const handleReset = () => {
        setFilters({
            name: '',
            surname: '',
            phone: '',
            city: '',
            address: '',
            birthday_from: '',
            birthday_to: '',
            gender: '',
            patient_diseases: [],
            isOwnPatient: false,

        });
        onFilterChange({
            name: '',
            surname: '',
            phone: '',
            city: '',
            address: '',
            birthday_from: '',
            birthday_to: '',
            gender: '',
            patient_diseases: [],
            isOwnPatient: false,

        });
    };

    return (
        <div>
            {/* Filter Button */}
            <Button variant="gradient" className="flex gap-2 items-center" onClick={openDrawerTop} color='gray'>
                Ֆիլտրել
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5">
                    <path
                        fillRule="evenodd"
                        d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z"
                        clipRule="evenodd"
                    />
                </svg>
            </Button>

            {/* Drawer */}
            <Drawer
                placement="right"
                open={openTop}
                onClose={closeDrawerTop}
                className="p-6 bg-white shadow-lg rounded-lg"
                size={500}
            >
                <div className="max-w-4xl mx-auto mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h4" className="text-gray-700">
                            Փնտրել հիվանդներ
                        </Typography>
                        <IconButton variant="text" color="gray" onClick={closeDrawerTop}>
                            ✕
                        </IconButton>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/*<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">*/}
                        <div className='flex flex-col gap-3'>
                            {/* Name */}
                            <div className='flex w-full justify-start gap-2'>
                                <Input
                                    label="Անուն"
                                    variant="outlined"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleChange}
                                    className="bg-white rounded-lg w-1/4"  // 25% ширины
                                />

                                <Input
                                    label="Ազգանուն"
                                    variant="outlined"
                                    name="surname"
                                    value={filters.surname}
                                    onChange={handleChange}
                                    className="bg-white rounded-lg w-3/4"  // 75% ширины
                                />
                            </div>

                            {/* Phone */}
                            <div className='flex flex-row gap-2'>
                                <Input
                                    label="Հեռախոսահամար"
                                    variant="outlined"
                                    name="phone"
                                    value={filters.phone}
                                    onChange={handleChange}
                                    className="bg-white rounded-lg"
                                />

                                {/* City */}
                                <Input
                                    label="Քաղաք"
                                    variant="outlined"
                                    name="city"
                                    value={filters.city}
                                    onChange={handleChange}
                                    className="bg-white rounded-lg"
                                />
                            </div>

                            {/* Address */}


                            <div className='flex flex-row gap-2'>
                                {/* Birthday Range - From */}
                                <Input
                                    label="Ծննդյան ամսաթիվից"
                                    variant="outlined"
                                    name="birthday_from"
                                    type="date"
                                    value={filters.birthday_from}
                                    onChange={handleChange}
                                    className="bg-white rounded-lg"
                                />

                                {/* Birthday Range - To */}
                                <Input
                                    label="Ծննդյան ամսաթիվ մինչև"
                                    variant="outlined"
                                    name="birthday_to"
                                    type="date"
                                    value={filters.birthday_to}
                                    onChange={handleChange}
                                    className="bg-white rounded-lg"
                                />
                            </div>
                            <Input
                                label="Հասե"
                                variant="outlined"
                                name="address"
                                value={filters.address}
                                onChange={handleChange}
                                className="bg-white rounded-lg"
                            />
                            {/* Gender */}
                            <MtSelect
                                label="Ընտրեք սեռը"
                                value={filters.gender}
                                onChange={(value) =>
                                    setFilters((prev) => ({...prev, gender: value}))
                                }
                                className="bg-white rounded-lg"
                            >
                                <Option value="male">Արական</Option>
                                <Option value="female">Իգական</Option>
                            </MtSelect>
                        </div>

                        {Array.isArray(rendDiseases) && rendDiseases.length > 0 && (
                            <div className="w-full">
                                <Select
                                    isMulti
                                    name="patient_diseases"
                                    options={rendDiseases}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Ընտրել հիվանդություններ"
                                    onChange={handleChangeDiseases}
                                />
                            </div>
                        )}

                            <Checkbox
                                name="isOwnPatient"
                                label="Ցուցադրել միայն իմ հիվանդները"
                                id="isOwnPatient"
                                onChange={(e)=>
                                {
                                    // e.preventDefault();
                                    handleChangeChecked();
                                }}
                                checked={filters.isOwnPatient}
                            />


                        {/* Action Buttons */}
                        <div className="flex justify-end flex-row space-x-4 mt-6">
                            <Button
                                type="button"
                                color="gray"
                                variant="outlined"
                                onClick={handleReset}
                                className="rounded-lg flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="size-5">
                                    <path fillRule="evenodd"
                                          d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                          clipRule="evenodd"/>
                                </svg>
                                Վերականգնել
                            </Button>
                            <Button
                                type="submit"
                                color="gray"
                                variant="gradient"
                                className="rounded-lg flex items-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Փնտրել
                            </Button>
                        </div>
                    </form>
                </div>
            </Drawer>
        </div>
    );
};

export default PatientsFilter;
