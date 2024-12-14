import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {useEffect} from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            city: user.city,
            address: user.address
        });

    useEffect(() => {
        console.log(errors)
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                   Անձնական տվյալներ
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                   Կարող եք խմբագրել ձեր անձնական տվյալնները
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Անուն"/>

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name}/>
                </div>
                <div>
                    <InputLabel htmlFor="surname" value="Ազգանուն"/>

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.surname}
                        onChange={(e) => setData('surname', e.target.value)}
                        required
                        isFocused
                        autoComplete="surname"
                    />

                    <InputError className="mt-2" message={errors.surname}/>
                </div>
                <div>
                    <InputLabel htmlFor="surname" value="Հեռախոսահամար"/>

                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                        isFocused
                        autoComplete="phone"
                    />

                    <InputError className="mt-2" message={errors.phone}/>
                </div>
                <div>
                    <InputLabel htmlFor="address" value="Հասցե"/>

                    <TextInput
                        id="address"
                        className="mt-1 block w-full"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        required
                        isFocused
                        autoComplete="address"
                    />

                    <InputError className="mt-2" message={errors.address}/>
                </div>
                <div>
                <InputLabel htmlFor="city" value="Քաղաք"/>

                    <TextInput
                        id="city"
                        className="mt-1 block w-full"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        required
                        isFocused
                        autoComplete="city"
                    />

                    <InputError className="mt-2" message={errors.city}/>
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Էլ․ հասցե"/>

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email}/>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Պահպանել</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Հաջողվեց։
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
