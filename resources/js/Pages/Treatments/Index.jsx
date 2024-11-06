import React, {useEffect, useMemo, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";
import TextEditor from "@/components/TextEditor.jsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import './Index.css';
import { Inertia } from "@inertiajs/inertia";
import useAddEntity from "@/hooks/useAddEntity.js";
import alertify from "alertifyjs";
import ToothSelect from "@/components/ToothSelect/ToothSelect.jsx";
import {GenericModal} from "@/components/GenericModal.jsx";
import AddPatientForm from "@/components/Patients/AddPatientForm.jsx";
import AddToothForm from "@/components/ToothSelect/AddToothForm.jsx";

const TreatmentIndex = ({ treatment }) => {
    const [diagnosisContent, setDiagnosisContent] = useState('');
    const [treatmentContent, setTreatmentContent] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading

    const [open, setOpen] = useState(false);

    const toggleModal = () => setOpen((cur) => !cur);


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

    const handleSubmit = async (e) => {
        e.preventDefault();
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

    const images = [
        "https://avatars.mds.yandex.net/i?id=d07129c5858b0ec06d6767aaa91fa231867a345671a57b33-9831149-images-thumbs&n=13",
        "https://medlineservice.ru/images/med-icon/pulpit.webp",
        "https://med-pd-stomatologicheskaya-izhevsk-r18.gosweb.gosuslugi.ru/netcat_files/userfiles/Moya_papka/5af6966401e1eb13134b3ba3e45cd3b3.jpg",
        "https://assets.ohi-s.com/blog-service/media/default/WkZdE_64cbba0acc2b0.jpg",
        "https://avatars.mds.yandex.net/i?id=8cebe4098f400243d5c8d15c3b491d0f_l-5235427-images-thumbs&n=13"
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    const goToPatientPage = (id) => {
        console.log("Double-clicked Patient ID:", id);
        if (id) {
            Inertia.get(`/patients/${id}`);
        } else {
            console.log("Patient ID not found.");
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Patients"/>

            <div className="md:container md:mx-auto w-full max-w-10xl my-4">
                <Card className="p-4 shadow-md pt-10">
                    <CardHeader className="bg-blue-50 rounded-lg shadow-md py-2 px-4 mb-4">
                        <Typography
                            variant="h5"
                            className="
                                text-blue-gray-800 font-semibold cursor-pointer
                                hover:text-blue-600 hover:shadow-md hover:bg-blue-100
                                transition-all duration-200 transform hover:scale-105
                                px-3 py-2 rounded-md inline-block
                            "
                            onClick={() => goToPatientPage(treatment.patient.id)}
                        >
                            {`${treatment.patient.name} ${treatment.patient.surname}`}
                        </Typography>
                    </CardHeader>

                    <CardBody>
                        {/* Date and Amount Section */}
                        <Card className="shadow-md p-6 bg-gray-100 mb-4">
                            <Typography variant="h6" className="mb-4 text-blue-gray-700">
                                Treatment Details
                            </Typography>
                            <div className="mb-5">
                                <label className={!treatment.isOwner ? 'text-gray-400' : ''}
                                       htmlFor="title">
                                    Start Date
                                </label>
                                <Input
                                    name="title"
                                    className='text-center'
                                    type="text"
                                    placeholder="Enter Title"
                                    label='Title'
                                    size="lg"
                                    value={formData.title}
                                    disabled={!treatment.isOwner} // Disable if not owner
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <Input
                                    name="treatment_plan_start_date"
                                    type="datetime-local"
                                    label='Treatment plan start date'
                                    size="lg"
                                    value={formData.treatment_plan_start_date}
                                    disabled={!treatment.isOwner} // Disable if not owner
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                <Input
                                    name="treatment_plan_end_date"
                                    type="datetime-local"
                                    label='Treatment plan end date'
                                    size="lg"
                                    value={formData.treatment_plan_end_date}
                                    disabled={!treatment.isOwner} // Disable if not owner
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                <Input
                                    name="amount"
                                    label="Amount (֏)"
                                    type="number"
                                    size="lg"
                                    value={formData.amount}
                                    disabled={!treatment.isOwner} // Disable if not owner
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                        </Card>

                        {/* Diagnosis and Treatment Plan Section */}
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="blue-gray" className="text-center mb-2">
                                    Diagnosis
                                </Typography>
                                <TextEditor contentText={treatment.diagnosis} setExternalContent={setDiagnosisContent} readOnly={!treatment.isOwner}/>
                            </Card>
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="blue-gray" className="text-center mb-2">
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
                                    color="blue"
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg px-8 py-3"
                                    onClick={handleSubmit}
                                    loading={isLoading}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        )}

                        <Typography variant="h5" className="text-center mt-8 text-blue-gray-700">
                            X-Ray Images
                        </Typography>
                        {/* X-Ray Images Section with Carousel */}
                        <Button
                            color="blue"
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg px-8 py-3"
                            onClick={toggleModal}
                            loading={isLoading}
                        >
                            Add Tooth Retngen
                        </Button>

                        <Slider {...sliderSettings} className="py-4">
                            {images.map((image, index) => (
                                <Card key={index} className="shadow-lg mx-2">
                                    <CardBody className="p-0">
                                        <figure className="relative h-60  w-full">
                                            <img
                                                src={image}
                                                alt={`X-ray ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg "
                                                onClick={toggleModal}
                                            />
                                            <figcaption
                                                className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                                                <div>
                                                    <Typography variant="h5" color="blue-gray">
                                                        Tooth is no good
                                                    </Typography>
                                                    <Typography color="gray" className="mt-2 font-normal">
                                                        { Math.floor(Math.random() * (27 - 21 + 1)) + 21} July {Math.floor(Math.random() * (2024 - 2020 + 1)) + 2020}
                                                    </Typography>
                                                </div>
                                                <Typography variant="h5" color="blue-gray">
                                                    {/*21*/}
                                                    { Math.floor(Math.random() * (27 - 21 + 1)) + 21}
                                                </Typography>
                                            </figcaption>
                                        </figure>
                                    </CardBody>
                                </Card>
                            ))}
                        </Slider>
                    </CardBody>
                </Card>
            </div>

            <GenericModal
                open={open}
                onClose={toggleModal}
                title="Add Patient"
                confirm="Add Patient"
                cancel="Cancel"
                footer={false}
                // header={false}
                size='xl'
            >
                <AddToothForm toggleModal={toggleModal}/>
            </GenericModal>

        </AuthenticatedLayout>
    );
};

export default TreatmentIndex;
