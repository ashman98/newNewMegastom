import React, { useState } from 'react';
import useAddEntity from '../../hooks/useAddEntity.js'; // Specify the correct path to the hook
// import './AddPatinetForm.css';

import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography, Spinner,
} from "@material-tailwind/react";
import alertify from 'alertifyjs';
import ToothSelect from "@/components/ToothSelect/ToothSelect.jsx";
import {ImageModal} from "@/components/ImageModal.jsx"; // Make sure to install alertifyjs

export default function AddToothForm({toggleModal}) {
    alertify.set('notifier', 'position', 'top-right');

    const [images, setImages] = useState([null, null, null]);

    const [imageModalSrc, setImageModalSrc] = useState('');

    const [open, setOpen] = useState(false);

    const toggleImageModal = (src) => {
        setImageModalSrc(src);
        setOpen((cur) => !cur)
    };

    const [image, setImage] = useState(null); // State for storing the selected image file
    const [previewUrl, setPreviewUrl] = useState(''); // State for image preview URL
    const [uploadMessage, setUploadMessage] = useState(''); // State to display success/error message
    const [loading, setLoading] = useState(false); // Loading state for button

    // Function to handle image file selection
    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const updatedImages = [...images];

            // Set the file at the specified index
            updatedImages[index] = URL.createObjectURL(file);

            setImages(updatedImages);
            setPreviewUrl(URL.createObjectURL(file)); // Set preview URL for the selected image
        } else {
            setPreviewUrl(''); // Reset preview if no file is selected
        }
    };


    const [formData, setFormData] = useState({
        tooth_number: '',
        title: '',
        image: '',
    });

    const getFormData = () => {
        return formData;
    }

    const setData = (formData) => {
        setFormData(formData);
    }

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [errors, setErrors] = useState({
        title: false,
        tooth_number: false,
        image: false,
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDeleteImage = (index) => {
        const updatedImages = [...images];

        updatedImages[index] = null; // Remove image at specified index

        setImages(updatedImages);
    };

    const handleCheckboxChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };

    const validateForm = () => {
        const newErrors = {
            title: !formData.name,
            tooth_number: !formData.surname,
            image: !formData.phone,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(x => !x);
    };

    const {addEntity, isLoading, validationErrors} = useAddEntity('patients');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEntity(formData);
            alertify.success('Patient added successfully.');
            setFormData({
                tooth_number: '',
                title: '',
                image: '',
            });
            toggleModal();
        } catch (err) {
            console.error('Submission failed:', err);
        } finally {
        }
    };

    return (
        <div className='w-full'>
            <div className="items-center w-full">
                <form className="mb-2 w-full" onSubmit={handleSubmit}>
                    <div className="mb-1 flex flex-col gap-6">
                        <Input
                            label="Title"
                            size="lg"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                </form>
            </div>

            <div className='w-full'>
                <ToothSelect />
            </div>


            <div className='w-full flex justify-start gap-3 max-w overflow-auto'>
                {images.map((image, index) => (
                    <div key={index} className="flex justify-center mt-8 w-full md:w-1/3">
                        <div className="rounded-lg shadow-xl bg-gray-50 w-full max-w-xs">
                            <div className="m-4">
                                <div className="flex items-center justify-center w-full">
                                    {!image ? (
                                    <label
                                        className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                        <div className="flex flex-col items-center justify-center pt-7">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                      stroke-width="2"
                                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                            </svg>
                                            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                                Attach a file</p>
                                        </div>
                                        <input type="file"
                                               accept="image/*"
                                               onChange={(e) => handleImageChange(e, index)}
                                               className="cursor-pointer border border-gray-300 p-2 rounded opacity-0"/>
                                    </label>): (
                                        <div className="relative w-full h-32 overflow-hidden">
                                            <img
                                                src={image}
                                                alt={`Preview ${index}`}
                                                className="absolute top-0 left-0 w-full h-full object-cover rounded"
                                                onClick={(e) => toggleImageModal(image)}
                                            />
                                            <button
                                                onClick={() => handleDeleteImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button type="submit" className="mt-6" fullWidth loading={isLoading}>
                Save
            </Button>

            <ImageModal src={imageModalSrc} open={open} onClose={toggleImageModal} />
        </div>


    );
}
