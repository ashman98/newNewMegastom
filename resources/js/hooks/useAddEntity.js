import { useState } from 'react';
import axios from 'axios';
import appConfig from '../config/appConfig.js';

const useEntity = (entityUrl) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [responseData, setResponseData] = useState([]);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const handleResponse = (response) => {
        console.log('Response data:', response.data);
        return response.data;
    };

    const handleError = (err) => {
        if (err.response && err.response.status === 422) {
            // Handle Laravel validation errors
            const errors = err.response.data.errors;

            // Преобразование объекта ошибок в массив объектов с ключами и сообщениями
            const validationErrorsArray = Object.entries(errors).flatMap(([key, messages]) =>
                messages.map(message => ({ key, message }))
            );
            setValidationErrors(validationErrorsArray); // Установка в состояние
        } else {
            setError(err);
            console.error('Error:', err);
        }
        throw err; // Re-throw the error for further handling
    };

    const addEntity = async (entityData) => {
        setIsLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            if (!csrfToken) {
                throw new Error('CSRF token not found in meta tags.');
            }

            const response = await axios.post(import.meta.env.VITE_APP_URL + entityUrl, entityData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Content-Type': 'multipart/form-data',
                },
            });

            return handleResponse(response);
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateEntity = async (entityData) => {
        const formData = new FormData();
        Object.keys(entityData).forEach((key) => {
            formData.append(key, entityData[key]);
        });

        setIsLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            if (!csrfToken) {
                throw new Error('CSRF token not found in meta tags.');
            }

            const response = await axios.put(import.meta.env.VITE_APP_URL + entityUrl, entityData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            return handleResponse(response);
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const patchEntity = async (entityData) => {
        setIsLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            if (!csrfToken) {
                throw new Error('CSRF token not found in meta tags.');
            }

            const response = await axios.patch(import.meta.env.VITE_APP_URL + entityUrl, entityData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            return handleResponse(response);
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteEntity = async () => {
        setIsLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            if (!csrfToken) {
                throw new Error('CSRF token not found in meta tags.');
            }

            const response = await axios.delete(import.meta.env.VITE_APP_URL + entityUrl, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            return handleResponse(response);
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEntity = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(import.meta.env.VITE_APP_URL + entityUrl, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            return handleResponse(response);
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { addEntity, updateEntity, patchEntity, deleteEntity, fetchEntity, isLoading, error, validationErrors };
};

export default useEntity;
