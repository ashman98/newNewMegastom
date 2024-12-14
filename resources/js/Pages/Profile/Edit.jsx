import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import {useUserRoles} from "@/hooks/useUserRole.js";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { debounce } from 'lodash';
import { Progress, Typography } from "@material-tailwind/react";


export default function Edit({ mustVerifyEmail, status }) {

    const [freeSpace, setFreeSpace] = useState({});

    const debouncedFetchFreeSpace = useCallback(
        debounce(async () => {
            // setLoading(true);
            try {
                const response = await axios.get(`/free-space-check`);
                setFreeSpace(response.data);
            } catch (error) {
                console.error("Error fetching treatments:", error);
            } finally {
                // setLoading(false);
            }
        }, 500),
        [] // Dependencies: empty array, so it only re-creates the function on mount
    );

    // Fetch treatments when filters change, debounced
    useEffect(() => {
        debouncedFetchFreeSpace();
    }, []);

    useEffect(() => {
        console.log(freeSpace)
    }, [freeSpace]);


    return (
        <AuthenticatedLayout
            // header={
            //     <h2 className="text-xl font-semibold leading-tight text-gray-800">
            //         Անձնական էջ
            //     </h2>
            //
            // }
        >
            <Head title="Անձնական էջ" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl"/>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl"/>
                    </div>

                    {freeSpace.usedPercentage && (
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <div className="flex items-center justify-between">
                                <Typography color="blue-gray" variant="h6">
                                    Ազատ տարածքը
                                </Typography>
                                <Typography color="blue-gray" variant="h6">
                                    {freeSpace.freeSpaceInGB} Գբ․
                                </Typography>
                            </div>
                            <div className="flex items-center justify-between">
                                <Typography color="blue-gray" variant="h6">
                                    Օգտագործվածը
                                </Typography>
                                <Typography color="blue-gray" variant="h6">
                                    {freeSpace.usedSpaceInGB} Գբ․
                                </Typography>
                            </div>
                            <div className="flex items-center justify-between">
                                <Typography color="blue-gray" variant="h6">
                                    Ընդհանուր տարածքը
                                </Typography>
                                <Typography color="blue-gray" variant="h6">
                                    {freeSpace.totalSpaceInGB} Գբ․
                                </Typography>
                            </div>
                            <div className="mt-2">
                                <div className="mb-2 flex items-center justify-between gap-4">
                                    <Typography color="blue-gray" variant="h6">
                                        Օգտագործված
                                    </Typography>
                                    <Typography color="blue-gray" variant="h6">
                                        {freeSpace.usedPercentage} %
                                    </Typography>
                                </div>
                                <Progress value={freeSpace.usedPercentage} size="lg"
                                          color={freeSpace.usedPercentage > 90 ? 'red' : freeSpace.usedPercentage > 60 ? 'orange' : 'black'}
                                          label={freeSpace.usedPercentage > 9 ? "Օգտագործված" : " "}/>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
