import DangerButton from '@/components/DangerButton';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import TextInput from '@/components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Ջնջել ակաունտը
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ձեր ակաունտը ջնջելուց հետո նրա բոլոր ռեսուրսներն ու տվյալները անշրջելիորեն կջնջվեն:
                    Նախքան ձեր ակաունտը ջնջելը, խնդրում ենք ներբեռնել բոլոր այն տվյալները կամ տեղեկատվությունը, որոնք ցանկանում եք պահել։
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Ջնջել ակաունտը
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Վստա՞հ եք, որ ցանկանում եք ջնջել ձեր հաշիվը։
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Ձեր ակաունտը ջնջելուց հետո նրա բոլոր ռեսուրսներն ու տվյալները անշրջելիորեն կջնջվեն:
                        Նախքան ձեր ակաունտը ջնջելը, խնդրում ենք ներբեռնել բոլոր այն տվյալները կամ տեղեկատվությունը, որոնք ցանկանում եք պահել։
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Գաղտնաբառ"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Չեղարկել
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Ջնջել ակաունտը
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
