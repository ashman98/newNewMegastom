import React, {useEffect, useMemo, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {Button, Card, CardBody, CardHeader, IconButton, Input, Typography} from "@material-tailwind/react";
import TextEditor from "@/components/TextEditor.jsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import './Index.css';
import { Inertia } from "@inertiajs/inertia";
import useAddEntity from "@/hooks/useAddEntity.js";
import useWindowSize from "@/hooks/useWindowSize.js";

import alertify from "alertifyjs";
import {GenericModal} from "@/components/GenericModal.jsx";
import AddToothForm from "@/components/ToothSelect/AddToothForm.jsx";
import {ConfirmDialog} from "@/components/ConfirmDialog.jsx";

const TreatmentIndex = ({ treatment }) => {
    const [diagnosisContent, setDiagnosisContent] = useState('');
    const [treatmentContent, setTreatmentContent] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const [teeth, setTeeth] = useState([]);
    const [selectedToothData, setSelectedToothData] = useState({});
    const [errors, setErrors] = useState({});
    const { width } = useWindowSize();

    const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [entityUrl, setEntityUrl] = useState('');
    const [deleteType, setDeleteType] = useState('');
    const toggleDialogConfirm = () => setOpenDialogConfirm((cur) => !cur);
    const [deleteLoading, setDeleteLoading] = useState(false);



    const [open, setOpen] = useState(false);

    const updateToothData = (updatedTooth) => {
        if (updatedTooth){
            setTeeth((prevTeeth) =>
                prevTeeth.map((tooth) =>
                    tooth.id === updatedTooth.id ? updatedTooth : tooth
                )
            );
        }
    };

    const addNewToothData = (newTooth) => {
        setTeeth([...teeth, newTooth]);
    };

    const toggleModal = () => setOpen((cur) => !cur);
    const closeModal = () => {
        setOpen(false);
        setSelectedToothData({});
    };


    const [formData, setFormData] = useState({
        title: '',
        diagnosis: '',
        treatment_plan: '',
        treatment_plan_start_date: '',
        treatment_plan_end_date: '',
        amount: '',
    });

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const initialFormData = useMemo(() => {
        if (treatment) {
            return {
                title: treatment.title || '',
                diagnosis: treatment.diagnosis || '',
                treatment_plan: treatment.treatment_plan || '',
                treatment_plan_start_date: treatment.treatment_plan_start_date,
                treatment_plan_end_date: treatment.treatment_plan_end_date,
                amount: treatment.amount || '',
            };
        }
        return {
            title: '',
            diagnosis: '',
            treatment_plan: '',
            treatment_plan_start_date: '',
            treatment_plan_end_date: '',
            amount: '',
        };
    }, [treatment]);

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    useEffect(() => {
        if (diagnosisContent || treatmentContent) {
            setFormData(prevFormData => ({
                ...prevFormData,
                diagnosis: diagnosisContent || prevFormData.diagnosis,
                treatment_plan: treatmentContent || prevFormData.treatment_plan,
            }));
        }
    }, [treatmentContent, diagnosisContent]);

    const { updateEntity, isLoading, validationErrors, error } = useAddEntity(`treatments/${treatment.id}`);

    useEffect(()=>{
        setLoading(isLoading);
    },[isLoading])

    const validateForm = () => {
        const newErrors = {};

        // Title validation
        if (!formData.title) {
            newErrors.title = "Title is required.";
        } else if (formData.title.length > 40) {
            newErrors.title = "Title cannot exceed 40 characters.";
        }

        // Start date validation
        if (!formData.treatment_plan_start_date) {
            newErrors.treatment_plan_start_date = "Start date is required.";
        }

        if (formData.treatment_plan_end_date && new Date(formData.treatment_plan_end_date) < new Date(formData.treatment_plan_start_date)) {
            newErrors.treatment_plan_end_date = "End date cannot be earlier than start date.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if there are no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            // If form validation fails, do not proceed
            console.warn("Validation failed, please check the form fields.");
            return;
        }
        try {
            await  updateEntity(formData)
            alertify.success('Patient added successfully.');
        } catch (err) {
            console.error('Submission failed:', validationErrors);
            validationErrors.forEach((err)=>{
                alertify.error(err.message);
                console.log(`${err.key} ===  ${err.message}`);
            })


        } finally {
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: true,
        spaceBetween: 20,  // Default spacing
        breakpoints: {
            640: { spaceBetween: 10 },
            768: { spaceBetween: 15 },
            1024: { spaceBetween: 20 },
        },
        autoplay: true,          // Enables auto scroll
        autoplaySpeed: 4000,     // Sets the delay in ms (e.g., 3000ms = 3 seconds)
        pauseOnHover: true,
        // centerMode: true,  // enables spacing between slides
        // centerPadding: '20px',  // adjust padding as needed
    };

    const goToPatientPage = (id) => {
        console.log("Double-clicked Patient ID:", id);
        if (id) {
            Inertia.get(`/patients/${id}`);
        } else {
            console.log("Patient ID not found.");
        }
    };

    useEffect(()=>{
        setTeeth(treatment.teeth)
    },[treatment])

    const { deleteEntity } = useAddEntity(entityUrl);
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const result = await deleteEntity();
            alertify.success('Patient added successfully.');
            if (deleteType === 'delete_treatment'){
                Inertia.get(`/patients/${treatment.patient.id}`);
            }else{
                debugger
                const updatedTeeth = teeth.filter((tooth) => tooth.id !== result.tooth_id);
                setTeeth(updatedTeeth);
                toggleDialogConfirm();
            }
        } catch (err) {
            console.error('Submission failed:', err);
        } finally {
            setEntityUrl(``);
            setConfirmDelete(false);
            setDeleteType('');
            if (deleteType !== 'delete_treatment'){
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
        }else if (type === 'delete_tooth') {
            setEntityUrl(`teeth/${id}`);
        }
        setOpenDialogConfirm(true);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Patients"/>

            <div className="md:container md:mx-auto w-full max-w-10xl my-4">
                <Card className="p-4 shadow-md pt-10">
                    <CardHeader className="bg-gray-100 rounded-lg shadow-md py-2 px-4 mb-4">
                        <div className='flex justify-between'>
                        <Typography
                            variant="h5"
                            className="
                                text-blue-gray-800 font-semibold cursor-pointer
                                hover:text-gray-900 hover:shadow-md hover:bg-gray-300
                                transition-all duration-200 transform hover:scale-105
                                px-3 py-2 rounded-md inline-block
                            "
                            onClick={() => goToPatientPage(treatment.patient.id)}
                        >
                            {`${treatment.patient.name} ${treatment.patient.surname}`}
                        </Typography>

                        <Button variant='outlined' color="red" className='flex items-center gap-2'
                                onClick={(e) => handleConfirm(e,'delete_treatment', treatment.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24" fill="currentColor"
                                 className="size-5">
                                <path fillRule="evenodd"
                                      d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 14.25a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5H9.75Z"
                                      clipRule="evenodd"/>
                                <path
                                    d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z"/>
                            </svg>
                            Հեռացնել
                        </Button>
                        </div>
                    </CardHeader>

                    <CardBody>
                        {/* Date and Amount Section */}
                        <Card className="shadow-md p-6 bg-gray-100 mb-4">
                            <Typography variant="h6" className="mb-4 text-blue-gray-700">
                                Treatment Details
                            </Typography>
                            <div className="mb-5">
                                {!treatment.isOwner && (
                                    <label className={!treatment.isOwner ? 'text-gray-400' : ''}
                                           htmlFor="title">
                                        Title
                                    </label>
                                )}
                                <Input
                                    name="title"
                                    className='text-center'
                                    type="text"
                                    placeholder="Enter Title"
                                    label='Title'
                                    size="lg"
                                    value={formData.title}
                                    disabled={!treatment.isOwner} // Disable if not owner
                                    error={errors.title}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        errors.title = '';
                                        handleChange(e.target.name, e.target.value);
                                    }}
                                />
                                {errors.title && <p className="error-message">{errors.title}</p>}

                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    {!treatment.isOwner && (
                                        <label className={!treatment.isOwner ? 'text-gray-400' : ''}
                                               htmlFor="treatment_plan_start_date">
                                            Treatment plan start date
                                        </label>
                                    )}
                                    <Input
                                        id="treatment_plan_start_date"
                                        name="treatment_plan_start_date"
                                        type="datetime-local"
                                        label='Treatment plan start date'
                                        size="lg"
                                        value={formData.treatment_plan_start_date}
                                        disabled={!treatment.isOwner} // Disable if not owner
                                        onChange={(e) => {
                                            e.preventDefault();
                                            errors.treatment_plan_start_date = '';
                                            handleChange(e.target.name, e.target.value)
                                        }}
                                        error={errors.treatment_plan_start_date}
                                    />
                                    {errors.treatment_plan_start_date &&
                                        <p className="error-message">{errors.treatment_plan_start_date}</p>}
                                </div>

                                <div>
                                    {!treatment.isOwner && (
                                        <label className={!treatment.isOwner ? 'text-gray-400' : ''}
                                               htmlFor="treatment_plan_end_date">
                                            Treatment plan end date
                                        </label>
                                    )}
                                    <Input
                                        id="treatment_plan_end_date"
                                        name="treatment_plan_end_date"
                                        type="datetime-local"
                                        label='Treatment plan end date'
                                        size="lg"
                                        value={formData.treatment_plan_end_date}
                                        disabled={!treatment.isOwner} // Disable if not owner
                                        error={errors.treatment_plan_end_date}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            errors.treatment_plan_end_date = '';
                                            handleChange(e.target.name, e.target.value)
                                        }}
                                        min={formData.treatment_plan_start_date}
                                    />
                                    {errors.treatment_plan_end_date &&
                                        <p className="error-message">{errors.treatment_plan_end_date}</p>}
                                </div>

                                <div>
                                    {!treatment.isOwner && (
                                        <label className={!treatment.isOwner ? 'text-gray-400' : ''}
                                               htmlFor="amount">
                                            Amount (֏)
                                        </label>
                                    )}
                                    <Input
                                        id="amount"
                                        name="amount"
                                        label="Amount (֏)"
                                        type="number"
                                        size="lg"
                                        value={formData.amount}
                                        disabled={!treatment.isOwner} // Disable if not owner
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Diagnosis and Treatment Plan Section */}
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="gray" className="text-center mb-2">
                                    Diagnosis
                                </Typography>
                                <TextEditor contentText={treatment.diagnosis} setExternalContent={setDiagnosisContent}
                                            readOnly={!treatment.isOwner}/>
                            </Card>
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="gray" className="text-center mb-2">
                                    Treatment Plan
                                </Typography>
                                <TextEditor contentText={treatment.treatment_plan}
                                            setExternalContent={setTreatmentContent}
                                            readOnly={!treatment.isOwner}
                                />
                            </Card>
                        </div>

                        {/* Save Button */}
                        {treatment.isOwner && (
                            <div className="flex justify-center mt-8">
                                <Button
                                    color="gray"
                                    size="lg"
                                    className="bg-gradient-to-r from-gray-900 to-gray-900 rounded-lg px-8 py-3"
                                    onClick={handleSubmit}
                                    loading={isLoading}
                                >
                                    Պահպանել
                                </Button>
                            </div>
                        )}

                        <Typography variant="h5" className="text-center mt-8 text-blue-gray-700">
                            Ռենտգեն
                        </Typography>
                        {/* X-Ray Images Section with Carousel */}
                        {treatment.isOwner && (
                        <Button
                            color="gray"
                            size="lg"
                            className="bg-gradient-to-r from-gray-900 to-gray-900 rounded-lg px-8 py-3"
                            onClick={toggleModal}
                            loading={isLoading}
                        >
                            Ավելացնել ռենտգեն
                        </Button>)}

                        {teeth.length > 0 && (
                        <Slider {...sliderSettings} className="py-4">
                            {teeth.map((tooth, index) => (
                                <Card key={index} className="shadow-lg card-spacing" >
                                    <CardBody className="p-0 position-relative" style={{ cursor: 'pointer' }}>
                                        <div className="relative">
                                            {/* IconButton positioned on top */}
                                            <IconButton
                                                size='sm'
                                                color='red'
                                                variant="outlined"
                                                className="rounded-full z-10 delete_treatment"
                                                onClick={(e)=>handleConfirm(e, 'delete_tooth',tooth.id )}
                                            >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                         strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                    </svg>
                                            </IconButton>
                                            <figure className="relative h-60 w-full" onClick={(e) => {
                                                setSelectedToothData(tooth);
                                                toggleModal();
                                            }}>
                                                <img
                                                    src={tooth.x_ray_images?.[0]?.path ? `https://megastom.loc/storage/${tooth.x_ray_images[0].path}` : ''}
                                                    alt={`X-ray ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <figcaption
                                                    className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm"
                                                >
                                                    <div>
                                                        <Typography variant="h5" color="gray">
                                                            {tooth.title}
                                                        </Typography>
                                                        {+width < 1145 ? (
                                                            <Typography variant="h5" color="gray">
                                                                {tooth.tooth_number}
                                                            </Typography>
                                                        ) : null}
                                                        <Typography color="gray" className="mt-2 font-normal">
                                                            {new Date(tooth.created_at).toLocaleDateString('hy-AM', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: '2-digit'
                                                            })}
                                                        </Typography>
                                                    </div>
                                                    {+width > 1145 ? (
                                                        <Typography variant="h5" color="gray">
                                                            {tooth.tooth_number}
                                                        </Typography>
                                                    ) : null}
                                                </figcaption>
                                            </figure>
                                        </div>
                                    </CardBody>
                                </Card>

                            ))}
                        </Slider>
                        )}
                    </CardBody>
                </Card>
            </div>

            <GenericModal
                open={open}
                onClose={closeModal}
                title="Add Patient"
                confirm="Add Patient"
                cancel="Cancel"
                footer={false}
                // header={false}
                size='xl'
            >
                <AddToothForm isOwner={treatment.isOwner} addNewToothData={addNewToothData} updateToothData={updateToothData} selectedToothData={selectedToothData} toggleModal={toggleModal} treatmentID={treatment.id}/>
            </GenericModal>
            <ConfirmDialog
                open={openDialogConfirm}
                onClose={toggleDialogConfirm}
                onConfirm={setConfirmDelete}
                isLoading={deleteLoading}
                title={deleteType === 'delete_tooth' ? 'Հեռացնել ռենտգենը' : 'Հեռացնել բուժումը'}
            >
                <Typography className='text-center' style={{fontSize: 18}}>
                    {deleteType === 'delete_tooth' ? ' Ցանկանում ե՞ք հեռացնել ռենտգենը։' : ' Ցանկանում ե՞ք հեռացնել բուժումը:'}

                </Typography>
            </ConfirmDialog>
        </AuthenticatedLayout>
    );
};

export default TreatmentIndex;
