import React, { useEffect, useMemo, useState } from 'react';
import styles from './toothSelect.module.css';
import {Spinner, Switch, Typography} from "@material-tailwind/react"; // Keep this if you have custom styles

const ToothSelect = ({isOwner, setToothNumber, toothNumber, errors}) => {
    const [selectedTooths, setSelectedTooths] = useState([]);
    const [toothImages, setToothImages] = useState([]);
    const [forChild, setForChild] = useState(false);
    const [selectedToothNumber, setSelectedToothNumberLocal] = useState(false); // Local state instead of Redux
    const [isLoading, setIsLoading ] = useState(false);

    useEffect(()=>{
        if(toothNumber){
            debugger
            if(!toothImages.includes(toothNumber)){
                setForChild(!forChild);
            }
            setSelectedToothNumberLocal(toothNumber);
        }
    },[toothNumber])

    useEffect(() => {
        if (forChild) {
            setToothImages([
                55, 54, 53, 52, 51, 61, 62, 63, 64, 65,
                85, 84, 83, 82, 81, 71, 72, 73, 74, 75
            ]);
        } else {
            setToothImages([
                18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
                48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
            ]);
        }
        setIsLoading(false);
    }, [forChild]);

    useEffect(()=>{
        debugger
        setToothNumber(+selectedToothNumber);
    }, [selectedToothNumber])


    const baseUrl = `${import.meta.env.VITE_APP_URL}storage/tooths/`;

    const allToothImages = useMemo(() => {
        const images = {};
        toothImages.forEach(toothNumber => {
            images[toothNumber] = `${baseUrl}${toothNumber}.png`; // Construct the image URL
        });
        return images;
    }, [toothImages]);

    return (
        <div className={`${styles.toothContainer} p-4`}>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
                    <Spinner className="h-16 w-16 text-gray-900/50" />
                </div>
            )}
            <div className="flex items-center mb-4">
                <Switch
                    label={
                        <div className='flex text-center flex-col'>
                            <Typography color="gray" className="font-medium">
                                {forChild ? "Երեխա" : "Մեծահասակ"}
                            </Typography>
                            <Typography variant="small" color="gray" style={{fontSize: 11}} className="font-normal">
                                Փոխել կատեգորիան
                            </Typography>
                        </div>
                    }
                    color="gray"
                    defaultChecked={forChild}
                    onChange={(e) => {
                        setIsLoading(true);
                        setForChild(e.target.checked)
                        setIsLoading(false);
                    }}
                    checked={forChild}
                />
            </div>
            <div
                className={`grid gap-1 ${forChild ? 'grid-cols-10' : 'grid-cols-16'} relative`}
                // style={{width: forChild ? '480px' : '768px'}}
            >
                {
                    toothImages.map((toothNumber) => {
                        const itemClasses = `${!errors.tooth_number ? styles.tooth :  styles.errorTooth} ${selectedToothNumber === toothNumber ? styles.toothSelected : ''}`;
                        return (
                            <div key={toothNumber} className={`${styles.toothItem}`}>
                                <div
                                    className={itemClasses}
                                    style={{
                                        backgroundImage: `url(${allToothImages[toothNumber]})`,
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                    title={`Tooth number ${toothNumber}`}
                                    onClick={(e) => {
                                        e.preventDefault();

                                        isOwner && setSelectedToothNumberLocal(toothNumber);
                                        errors.tooth_number = '';
                                    }}
                                >
                                    <strong
                                        className={`${styles.toothText} ${selectedToothNumber === toothNumber ? styles.selectedToothText : ''}`}>
                                        {toothNumber}
                                    </strong>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            {errors.tooth_number && <p className="error-message">{errors.title}</p>}
            {/*<MultiImageUploader defaultImages={xRayImages}/> */}
        </div>
    );
}

export default ToothSelect;
