import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {Button, Card, CardBody, CardHeader, Input, Typography} from "@material-tailwind/react";
import TextEditor from "@/components/TextEditor.jsx";

const PatientIndex = ({ treatment }) => {

    useEffect(() => {
        console.log(treatment);
    }, [treatment]);

    const images = [
        "/path/to/xray1.jpg",
        "/path/to/xray2.jpg",
        "/path/to/xray3.jpg",
        "/path/to/xray1.jpg",
        "/path/to/xray2.jpg",
        "/path/to/xray3.jpg",
        "/path/to/xray1.jpg",
        "/path/to/xray2.jpg",
        "/path/to/xray3.jpg",
        "/path/to/xray1.jpg",
        "/path/to/xray2.jpg",
        "/path/to/xray3.jpg",
        // Add more image paths as needed
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Patients" />

            <div className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-4">
                <Typography variant="h5" color="blue-gray" className="text-center">
                    X-Ray Images
                </Typography>



                {/* Horizontal scrollable container */}
                <div className="flex overflow-x-auto space-x-4 w-full">
                    {images.map((image, index) => (
                        <Card key={index} className="min-w-[250px] shadow-lg flex-shrink-0">
                            <CardHeader className="text-center">
                                <Typography variant="h5" color="blue-gray">
                                    Tooth {index + 1}
                                </Typography>
                            </CardHeader>
                            <CardBody className="p-0">
                                <img
                                    src={image}
                                    alt={`X-ray ${index + 1}`}
                                    className="w-full h-auto object-cover"
                                />
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            <TextEditor />
        </AuthenticatedLayout>
    );
};

export default PatientIndex;
