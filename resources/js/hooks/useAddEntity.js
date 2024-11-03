import { useState } from 'react';
import axios from 'axios';
import appConfig from '../config/appConfig.js';

const useAddEntity = (entityUrl) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    const addEntity = async (entityData) => {
        setIsLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found in meta tags.');
            }

            const response = await axios.post(appConfig.appUrl + entityUrl, entityData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.data.patient_id) {
                window.location.href = `/patients/${response.data.patient_id}`;
            }
            console.log('Entity added:', response.data);
            return response.data;
        } catch (err) {
            debugger
            if (err.response && err.response.status === 422) {
                // Handle Laravel validation errors
                setValidationErrors(err.response.data.errors);
            } else {
                setError(err);
                console.error('Error adding entity:', err);
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { addEntity, isLoading, error, validationErrors };
};

export default useAddEntity;
