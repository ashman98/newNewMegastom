import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useAddEntity from '../../hooks/useAddEntity.js'; // Specify the correct path to the hook
// import './AddPatinetForm.css';

import {
    Input,
    Button, IconButton,CardHeader,Card
} from "@material-tailwind/react";
import alertify from 'alertifyjs';
import ToothSelect from "@/components/ToothSelect/ToothSelect.jsx";
import {ImageModal} from "@/components/ImageModal.jsx";
import useWindowSize from "@/hooks/useWindowSize.js";
import axios from "axios"; // Make sure to install alertifyjs
import { debounce } from 'lodash';
import {iconSetQuartzLight} from "ag-grid-community";


export default function AddToothForm({setSelectedToothData,bottomRef, isOwner, addNewToothData, updateToothData, toggleModal, treatmentID, selectedToothData, onLoading ,loading}) {
    alertify.set('notifier', 'position', 'top-right');

    const [images, setImages] = useState([null, null, null]);
    const [title, setTitle] = useState('');

    const [xRayImages, setXRayImages] = useState([null, null, null]);

    const [imageModalSrc, setImageModalSrc] = useState('');

    const [open, setOpen] = useState(false);
    const [toothNumber, setToothNumber] = useState(false);
    const {width, height} = useWindowSize();

    const formData={
        tooth_number: toothNumber,
        title: title,
        images: xRayImages,
        treatment_id: treatmentID,
    };

    useEffect(() => {
        console.log(xRayImages);
    }, [xRayImages]);

    // const [dd,setdd] = useState([]);
    // const debouncedFetchFreeSpace = useCallback(
    //     debounce(async (paths) => {
    //         onLoading(true);
    //         try {
    //             const response = await axios.get(`/xrays/base64`, {
    //                 params: {paths}
    //             });
    //             setdd(response.data);
    //         } catch (error) {
    //             console.error("Error fetching treatments:", error);
    //         } finally {
    //             onLoading(false);
    //         }
    //     }, 500),
    //     [] // Dependencies: empty array, so it only re-creates the function on mount
    // );
    //
    // useEffect(() => {
    //     if (dd.length > 0) {
    //         const updatedImages = [...images];
    //         const updatedXrayImages = [...xRayImages];
    //
    //         dd.forEach((iill, index)=>{
    //             debugger
    //             const path = iill.path;
    //             const fileName = path.split('/').pop(); // "1.png"
    //             const number = fileName.split('.').shift(); // "1"
    //             updatedImages[+number] = iill.data;
    //             updatedXrayImages[+number] = path;
    //         })
    //
    //         setImages(updatedImages);
    //         setXRayImages(updatedXrayImages);
    //     }
    //
    // },[dd])

    useEffect(() => {
        if (selectedToothData){
            setToothNumber(selectedToothData.tooth_number);
            setTitle(selectedToothData.title);
            if (selectedToothData.x_ray_images && selectedToothData.x_ray_images.length > 0){

                const updatedImages = [...images];
                const updatedXrayImages = [...xRayImages];
                selectedToothData.x_ray_images.forEach((img, index)=>{
                    const path = img.path;
                    const fileName = path.split('/').pop(); // "1.png"
                    const number = fileName.split('.').shift(); // "1"

                    updatedImages[+number] = img.base64 ;
                    updatedXrayImages[+number] = path;
                })

                // debouncedFetchFreeSpace(im);
                setImages(updatedImages);
                setXRayImages(updatedXrayImages);

                // selectedToothData.x_ray_images.forEach((img, index)=>{
                //     const updatedImages = [...images];
                //     const updatedXrayImages = [...xRayImages];
                //     debugger
                //     // const path = iill.path;
                //     // const fileName = path.split('/').pop(); // "1.png"
                //     // const number = fileName.split('.').shift(); // "1"
                //
                //     updatedImages[+number] = img.base64 ;
                //     updatedXrayImages[+number] = img.base64 ;
                //     setImages(updatedImages);
                //     setXRayImages(updatedXrayImages);
                // })
            }
        }
    }, [selectedToothData]);


    const toggleImageModal = (src) => {
        setImageModalSrc(src);
        setOpen((cur) => !cur)
    };


    // Function to handle image file selection
    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        const updatedImages = [...images];
        const updatedXrayImages = [...xRayImages];
        if (file) {
            updatedXrayImages[index] = file;
            updatedImages[index] = URL.createObjectURL(file);
        } else {
            updatedXrayImages[index] = null;
            updatedImages[index] =  null; // Reset preview if no file is selected
        }
        setXRayImages(updatedXrayImages);
        setImages(updatedImages);
    };

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

    const handleDeleteImage = (index) => {
        const updatedImages = [...images];
        const updatedXrayImages = [...xRayImages];


        updatedImages[index] = null; // Remove image at specified index
        updatedXrayImages[index] = null; // Remove image at specified index

        setImages(updatedImages);
        setXRayImages(updatedXrayImages);
    };

    const handleCheckboxChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!title) {
            newErrors.title = "Պարտադիր է։";
        } else if (title.length > 20) {
            newErrors.title = "Պետք է պարունակի առնվազն 20 տառ։";
        }

        if (!toothNumber) {
            newErrors.tooth_number = "Պարտադիր է։";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if there are no errors
    };

    const isValidUrl = (url) => {
        try {
            new URL(url); // Try to create a URL object, if it fails, it's not a valid URL
            return true;
        } catch (e) {
            return false;
        }
    };

    const {addEntity,isLoading, validationErrors} = useAddEntity(`teeth${selectedToothData.id ? '/'+selectedToothData.id: ''}`);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // If form validation fails, do not proceed
            console.warn("Validation failed, please check the form fields.");
            return;
        }
        const entityData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key !== 'images') {
                entityData.append(key, formData[key]);
            } else {
                formData.images.forEach((file, index) => {
                    // debugger
                    if (file !== null) {
                        if (typeof file === 'string') {
                            console.log('Appending URL:', file);
                            entityData.append('images[]', file);
                        } else if (file instanceof File) {
                            console.log('Appending File:', file);
                            entityData.append(`images[${index}]`, file);
                        }
                    }
                });
            }
        });

// Log form data before sending it
        for (let pair of entityData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        e.preventDefault();
        try {
            const t = await addEntity(entityData);
            selectedToothData.id ?  updateToothData(t.tooth) : addNewToothData(t.tooth);
            alertify.success('Ռետնգենը հաջողությամբ ավելացվեց։');

            // Reset form data
            setToothNumber(false);
            setTitle('');
            setXRayImages([]);

            // Scroll to the bottom of the page after submission

        } catch (err) {
            console.error('Submission failed:', err);
        } finally {
            toggleModal();
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); // This will scroll to the bottom
        }
    };

    return (
        <div className='w-full'>
            {/*{loading && (*/}
            {/*    <div className="loading-overlay">*/}
            {/*        <div className="spinner"></div>*/}
            {/*        /!*<span>Загрузка данных...</span>*!/*/}
            {/*    </div>*/}
            {/*)}*/}
            <div className="items-center w-full">
                <form className="mb-2 w-full" onSubmit={handleSubmit}>
                    <div>
                        {!isOwner && (
                            <label className={isOwner ? 'text-gray-400' : ''}
                                   htmlFor="title">
                                Վերնագիր
                            </label>
                        )}
                        <Input
                            id="title"
                            label="Վերնագիր"
                            size="lg"
                            name="title"
                            value={title || ""}
                            onChange={(e) => {
                                e.preventDefault();
                                setTitle(e.target.value);
                                errors.title = '';
                            }}
                            error={errors.title || false}
                            disabled={!isOwner}
                        />
                        {errors.title && <p className="error-message">{errors.title}</p>}
                    </div>
                </form>
            </div>

            <div className='w-full'>
                <ToothSelect isOwner={isOwner} errors={errors} toothNumber={toothNumber} setToothNumber={setToothNumber} />
            </div>


                <div
                className={`w-full flex justify-center items-center gap-3 max-w overflow-auto ${width < 720 ? "flex-col" : ""}`}>
                {images.map((image, index) => (
                    <div key={index} className="flex justify-center mt-8 w-full sm:w-1/2 md:w-1/3">
                        <div className="rounded-lg shadow-xl bg-gray-50 w-full max-w-xs">
                            <div className="m-4">
                                <div className={`flex items-center justify-center w-full `}>
                                    {!image ? (
                                        <label style={{cursor: 'pointer'}}
                                               className={`flex flex-col w-full h-32 ${!loading?"border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300":""}`}>
                                            <div className={`flex flex-col items-center justify-center pt-7 ${loading ?" animate-pulse": "" }`}>
                                                {!loading ? (
                                                    <div className="flex flex-col items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth="2"
                                                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                                        </svg>
                                                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                                            Վերբեռնել նկարը</p>
                                                    </div>
                                                ): (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="h-12 w-full text-gray-500"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <input type="file"
                                                   disabled={loading}
                                                   accept="image/*"
                                                   onChange={(e) => isOwner && handleImageChange(e, index)}
                                                   className="cursor-pointer border border-gray-300 p-2 rounded opacity-0"/>
                                        </label>) : (
                                        <div className="relative w-full h-32 overflow-hidden"
                                             style={{cursor: 'pointer'}}>
                                            <img
                                                src={image}
                                                alt={`Preview ${index}`}
                                                className="absolute top-0 left-0 w-full h-full object-cover rounded"
                                                onClick={(e) => toggleImageModal(image)}
                                            />
                                            {isOwner && (
                                                // <Button
                                                //     size='sm'
                                                //     color='red'
                                                //     variant="outlined"
                                                //     // className="rounded-full z-10"
                                                //     // style={{position: 'absolute', top: 8, right: 8}}
                                                //     className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                // >
                                                //     <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                //          viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                //          className="size-6">
                                                //         <path strokeLinecap="round" strokeLinejoin="round"
                                                //               d="M6 18 18 6M6 6l12 12"/>
                                                //     </svg>
                                                //
                                                // </Button>
                                                <button
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                    style={{width: '34px'}}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isOwner && (
                <Button onClick={(e) => handleSubmit(e)} type="submit" className="mt-6 w-full" loading={isLoading || loading}>
                    {selectedToothData.id ? 'Խմբագրել' : 'Ավելացնել'}
                </Button>
            )}


            <ImageModal src={imageModalSrc} open={open} onClose={toggleImageModal}/>
        </div>


    );
}
