import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";
import TextEditor from "@/components/TextEditor.jsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import './Index.css';

const PatientIndex = ({ treatment }) => {
    const [title, setTitle] = useState('Title');
    const [diagnosisContent, setDiagnosisContent] = useState('');
    const [treatmentContent, setTreatmentContent] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (treatment.title) setTitle(treatment.title);
        console.log(treatment);
    }, [treatment]);

    useEffect(() => {
        if (diagnosisContent) console.log(diagnosisContent);
        if (treatmentContent) console.log(treatmentContent);
    }, [treatmentContent, diagnosisContent]);

    const images = [
        "/path/to/xray1.jpg",
        "/path/to/xray2.jpg",
        "/path/to/xray3.jpg",
        // Add more image paths as needed
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    return (
        <AuthenticatedLayout>
            <Head title="Patients"/>

            <div className="md:container md:mx-auto w-full max-w-10xl my-4">

                {/* Title Section */}
                <Card className="p-4 shadow-md">
                    <CardHeader>
                        <div className="text-center py-4">
                            <Input
                                size="lg"
                                variant="static"
                                placeholder="Enter Title"
                                style={{
                                    borderColor: 'transparent',
                                    textAlign: 'center',
                                    fontSize: '2.0rem',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    height: 50,
                                }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                color="blue-gray"
                                required
                            />
                        </div>
                    </CardHeader>

                    <CardBody>
                        {/* Date and Amount Section */}
                        <Card className="shadow-md p-6 bg-gray-100">
                            <Typography variant="h6" className="mb-4 text-blue-gray-700">
                                Treatment Details
                            </Typography>
                            <div className="grid grid-cols-3 gap-6">
                                <Input
                                    type="date"
                                    label="Start Date"
                                    size="lg"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <Input
                                    type="date"
                                    label="End Date"
                                    size="lg"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <Input
                                    label="Amount (֏)"
                                    type="number"
                                    size="lg"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </Card>

                        {/* Diagnosis and Treatment Plan Section */}
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="blue-gray" className="text-center mb-2">
                                    Diagnosis
                                </Typography>
                                <TextEditor contentText={treatment.diagnosis} setExternalContent={setDiagnosisContent}/>
                            </Card>
                            <Card className="p-4 shadow-md">
                                <Typography variant="h6" color="blue-gray" className="text-center mb-2">
                                    Treatment Plan
                                </Typography>
                                <TextEditor contentText={treatment.treatment_plan}
                                            setExternalContent={setTreatmentContent}/>
                            </Card>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-center mt-8">
                            <Button
                                color="blue"
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg px-8 py-3"
                                onClick={() => console.log("Submit clicked")}
                            >
                                Save Changes
                            </Button>
                        </div>

                        {/* X-Ray Images Section with Carousel */}
                        <Typography variant="h5" className="text-center mt-8 text-blue-gray-700">
                            X-Ray Images
                        </Typography>
                        <Slider {...sliderSettings} className="py-4">
                            {images.map((image, index) => (
                                <Card key={index} className="shadow-lg mx-2">
                                    <CardHeader className="text-center">
                                        <Typography variant="h6" color="blue-gray">
                                            Tooth {index + 1}
                                        </Typography>
                                    </CardHeader>
                                    <CardBody className="p-0">
                                        <img
                                            src={image}
                                            alt={`X-ray ${index + 1}`}
                                            className="w-full h-48 object-cover rounded"
                                        />
                                    </CardBody>
                                </Card>
                            ))}
                        </Slider>
                    </CardBody>

                </Card>
            </div>
</AuthenticatedLayout>
)
    ;
};

export default PatientIndex;
