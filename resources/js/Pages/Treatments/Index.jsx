import React, {useEffect, useMemo, useRef, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Accordion, AccordionBody, AccordionHeader,
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    IconButton,
    Input,
    Typography
} from "@material-tailwind/react";
import TextEditor from "@/components/TextEditor.jsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import './Index.css';
import { Inertia } from "@inertiajs/inertia";
import useAddEntity from "@/hooks/useAddEntity.js";
import useWindowSize from "@/hooks/useWindowSize.js";

import { format } from "date-fns";
import { hy } from "date-fns/locale";

import alertify from "alertifyjs";
import {GenericModal} from "@/components/GenericModal.jsx";
import AddToothForm from "@/components/ToothSelect/AddToothForm.jsx";
import {ConfirmDialog} from "@/components/ConfirmDialog.jsx";
import {HomeIcon} from "@heroicons/react/24/solid/index.js";

const TreatmentIndex = ({ treatment }) => {
    const [diagnosisContent, setDiagnosisContent] = useState('');
    const [treatmentContent, setTreatmentContent] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const [teeth, setTeeth] = useState([]);
    const [selectedToothData, setSelectedToothData] = useState({});
    const [errors, setErrors] = useState({});
    const { width } = useWindowSize();

    const bottomRef = useRef(null);

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
            alertify.success('Բուժումը հաջողությամբ պահպանվեց։');
        } catch (err) {
            console.error('Submission failed:', validationErrors);
            validationErrors.forEach((err)=>{
                // alertify.error(err.message);
                console.log(`${err.key} ===  ${err.message}`);
            })


        } finally {
        }
    };
    const slidesToShow = width>960? 3 : width>560 ? 2 : 1;
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShow ,
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

            if (deleteType === 'delete_treatment'){
                alertify.success('Բուժումը հաջողությամբ ջնջվեց։');
                Inertia.get(`/patients/${treatment.patient.id}`);
            }else{
                alertify.success('R հաջողությամբ ջնջվեց։');
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

    const badgeStyles = `badge-block top-1/2 relative group flex items-center justify-center bg-gray-300 py-1  hover:py-2 hover:px-2 rounded-md ${open && 'hidden'}`;


    const [openAccordion, setOpenAccordion] = useState(0);

    const handleOpenAccordion = (value) => setOpenAccordion(openAccordion === value ? 0 : value);

    return (
        <AuthenticatedLayout>
            <Head title="Բուժում"/>

            {treatment.isOwner && (
                <div
                    className={badgeStyles}>
                    <div  onClick={toggleModal}
                        className='flex rounded-md gap-2 items-center justify-center hover:shadow-md px-2 py-1 border-1'>
                        <IconButton>
                            <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                 xmlnsXlink="http://www.w3.org/1999/xlink" width="30px" height="30px"
                                 viewBox="0 0 146.939 146.939" xmlSpace="preserve">

                                <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

                                <g id="SVGRepo_iconCarrier"> <g> <path
                                    d="M142.643,42.277c-2.614-11.297-10.266-19.584-22.116-23.971c-7.925-2.938-27.176-5.565-35.603,4.459 c-4.031-2.377-7.91-4.361-11.556-5.756C66.492,6.761,54.803,0,41.564,0C20.45,0,3.27,17.174,3.27,38.288 c0,15.19,8.916,28.301,21.768,34.481c1.665,3.303,3.716,6.421,6.086,9.032c6.602,7.271,8.512,11.464,9.582,16.263 c0.235,1.056,0.779,4.165,0.812,4.843c1.683,39.958,15.313,43.395,18.574,43.634c0.95,0.273,1.881,0.399,2.792,0.399 c1.66,0,3.238-0.443,4.667-1.319c6.77-4.156,8.849-17.062,10.688-28.443c0.667-4.098,1.288-7.989,2.016-10.249 c1.262-3.913,2.308-4.787,2.295-4.941c0.909,0.416,2.441,3.333,2.605,4.487c0.252,1.74,0.438,3.956,0.635,6.457 c1.04,12.837,2.604,32.208,16.257,33.599c0.963,0.219,3.27,0.426,6.099-1.287c6.438-3.904,11.205-15.086,14.153-33.253l0.451-2.91 c1.06-7.289,2.526-17.266,8.54-23.595C138.231,78.233,146.622,59.461,142.643,42.277z M8.874,38.274 c0-18.025,14.663-32.685,32.69-32.685c18.02,0,32.679,14.66,32.679,32.685c0,18.022-14.659,32.684-32.679,32.684 c-4.597,0-8.965-0.963-12.934-2.681c-0.287-0.214-0.604-0.366-0.946-0.455C16.589,62.594,8.874,51.33,8.874,38.274z M127.249,81.62 c-7.245,7.619-8.923,19.064-10.033,26.65l-0.435,2.811c-3.391,20.899-8.446,27.207-11.155,29.122 c-1.424,0.996-2.316,0.859-2.218,0.892c-0.209-0.07-0.42-0.115-0.635-0.125c-9.15-0.789-10.501-17.45-11.393-28.487 c-0.209-2.648-0.405-5.005-0.668-6.817c-0.274-1.85-2.867-8.865-7.661-9.271c-5.062-0.393-7.382,6.523-8.127,8.811 c-0.857,2.676-1.484,6.567-2.22,11.093c-1.401,8.656-3.513,21.745-8.089,24.563c-0.628,0.371-1.569,0.776-3.205,0.234 c-0.297-0.104-0.588-0.104-0.919-0.125c-0.138,0-11.815-1.401-13.375-38.293c-0.056-1.287-0.733-4.915-0.941-5.822 c-1.467-6.588-4.428-11.688-10.903-18.816c-0.652-0.714-1.218-1.551-1.818-2.339c2.614,0.569,5.325,0.882,8.105,0.882 c21.104,0,38.281-17.175,38.281-38.288c0-4.698-0.892-9.185-2.449-13.349c6.57,3.347,13.781,8.222,21.53,14.581 c0.515,0.426,1.149,0.634,1.767,0.634c0.816,0,1.615-0.347,2.175-1.026c0.985-1.193,0.809-2.96-0.383-3.945 c-4.385-3.598-8.576-6.629-12.643-9.319c6.479-6.566,21.715-4.908,28.729-2.303c10.15,3.762,16.407,10.479,18.605,19.983 C140.543,58.061,133.575,74.988,127.249,81.62z M19.15,41.075c-1.548,0-2.802-1.253-2.802-2.801c0-1.546,1.253-2.802,2.802-2.802 h19.613V15.86c0-1.546,1.253-2.802,2.801-2.802c1.545,0,2.801,1.256,2.801,2.802v19.612h19.612c1.546,0,2.802,1.256,2.802,2.802 c0,1.548-1.256,2.801-2.802,2.801H44.365v19.613c0,1.548-1.256,2.801-2.801,2.801c-1.548,0-2.801-1.253-2.801-2.801V41.075H19.15z"/> </g> </g>

                            </svg>
                        </IconButton>
                        <Typography
                            variant="h5"
                            className="
                                hidden group-hover:flex
                                text-blue-gray-800 font-semibold cursor
                                 top-full
                        "
                        >
                            Ավելացնել ռենտգեն
                        </Typography>
                    </div>
                </div>
            )}


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
                                    onClick={(e) => handleConfirm(e, 'delete_treatment', treatment.id)}>
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
                                Բուժման մանրամասներ
                            </Typography>
                            <div className="flex flex-col w-full">
                                <div className="mb-5 w-full">
                                    {!treatment.isOwner && (
                                        <label className="text-gray-400" htmlFor="title">
                                            Վերնագիր
                                        </label>
                                    )}
                                    <Input
                                        name="title"
                                        className="w-full text-center"
                                        type="text"
                                        label="Վերնագիր"
                                        value={formData.title}
                                        disabled={!treatment.isOwner}
                                        error={errors.title}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            errors.title = '';
                                            handleChange(e.target.name, e.target.value);
                                        }}
                                    />
                                    {errors.title && <p className="error-message">{errors.title}</p>}
                                </div>

                                {/* Adjusted flex container */}
                                <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                                    <div className="w-full lg:w-1/3">
                                        {!treatment.isOwner && (
                                            <label className="text-gray-400" htmlFor="treatment_plan_start_date">
                                                Բուժման պլանի սկիզբ
                                            </label>
                                        )}
                                        <Input
                                            id="treatment_plan_start_date"
                                            name="treatment_plan_start_date"
                                            type="datetime-local"
                                            label="Բուժման պլանի սկիզբ"
                                            value={formData.treatment_plan_start_date}
                                            disabled={!treatment.isOwner}
                                            error={errors.treatment_plan_start_date}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                errors.treatment_plan_start_date = '';
                                                handleChange(e.target.name, e.target.value);
                                            }}
                                        />
                                        {errors.treatment_plan_start_date && (
                                            <p className="error-message">{errors.treatment_plan_start_date}</p>
                                        )}
                                    </div>

                                    <div className="w-full lg:w-1/3">
                                        {!treatment.isOwner && (
                                            <label className="text-gray-400" htmlFor="treatment_plan_end_date">
                                                Բուժման պլանի ավարտ
                                            </label>
                                        )}
                                        <Input
                                            id="treatment_plan_end_date"
                                            name="treatment_plan_end_date"
                                            type="datetime-local"
                                            label="Բուժման պլանի ավարտ"
                                            value={formData.treatment_plan_end_date || ""}
                                            disabled={!treatment.isOwner}
                                            error={errors.treatment_plan_end_date}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                errors.treatment_plan_end_date = '';
                                                handleChange(e.target.name, e.target.value);
                                            }}
                                            min={formData.treatment_plan_start_date}
                                        />
                                        {errors.treatment_plan_end_date && (
                                            <p className="error-message">{errors.treatment_plan_end_date}</p>
                                        )}
                                    </div>

                                    <div className="w-full lg:w-1/3">
                                        {!treatment.isOwner && (
                                            <label className="text-gray-400" htmlFor="amount">
                                                Գումար (֏)
                                            </label>
                                        )}
                                        <Input
                                            id="amount"
                                            name="amount"
                                            label="Գումար (֏)"
                                            type="number"
                                            className="w-full"
                                            value={formData.amount || ""}
                                            disabled={!treatment.isOwner}
                                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>





                        {/* Diagnosis and Treatment Plan Section */}
                        <div className={`grid ${+width>960?'grid-cols-2':'grid-cols-1'} gap-6`}>
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="gray" className="text-center mb-2">
                                    Ախտորոշում
                                </Typography>
                                <TextEditor contentText={treatment.diagnosis}
                                            setExternalContent={setDiagnosisContent}
                                            readOnly={!treatment.isOwner}/>
                            </Card>
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="gray" className="text-center mb-2">
                                    Բուժման պլան
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
                    </CardBody>
                </Card>
            </div>
            <div className="mx-auto px-4 w-full my-4" ref={bottomRef}>
                {teeth.length > 0 && (
                    <Card className="p-6 rounded-lg shadow-md my-4">
                        <div className='flex justify-start'>
                            <Typography variant="h6" className="mb-4 text-blue-gray-700">
                                Ռենտգեն
                            </Typography>
                        </div>

                        {/*<Card className="shadow-md p-6 bg-gray-100 mb-4">*/}

                        <div className='px-5'>
                        <Slider {...sliderSettings} className="py-4">
                            {teeth.map((tooth, index) => (
                                <Card key={index} className="shadow-lg card-spacing">
                                    <CardBody className="p-0 position-relative" style={{cursor: 'pointer'}}>
                                        <div className="relative">
                                            {/* IconButton positioned on top */}
                                            <IconButton
                                                size='sm'
                                                color='red'
                                                variant="outlined"
                                                className="rounded-full z-10 delete_treatment"
                                                onClick={(e) => handleConfirm(e, 'delete_tooth', tooth.id)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24"
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
                                                    src={tooth.x_ray_images?.[0]?.path ? `${import.meta.env.VITE_APP_URL}storage/${tooth.x_ray_images[0].path}` : ''}
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
                                                        {/*    {new Date(tooth.created_at).toLocaleDateString('hy-AM', {*/}
                                                        {/*        year: 'numeric',*/}
                                                        {/*        month: 'long',*/}
                                                        {/*        day: '2-digit'*/}
                                                        {/*    })}*/}
                                                            {format(new Date(tooth.created_at), "dd MMMM yyyy", { locale: hy })}
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
                        </div>
                    </Card>
                )}
            </div>

            <GenericModal
                open={open}
                onClose={closeModal}
                title={selectedToothData.id?"Խմբագրել ռենտգենը":"Ավլեացնել ռենտգեն"}
                confirm="Add Patient"
                cancel="Cancel"
                footer={false}
                // header={false}<
                size={`${width < 720 ? width< 520 ? 'sm' : 'md' : 'xl' }`}
            >
                <AddToothForm isOwner={treatment.isOwner} addNewToothData={addNewToothData}
                              updateToothData={updateToothData} selectedToothData={selectedToothData}
                              toggleModal={toggleModal} treatmentID={treatment.id} bottomRef={bottomRef}/>
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
