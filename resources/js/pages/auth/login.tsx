import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    cedula: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        cedula: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Sistema de gestion de datos para la enfermeria" description="Ingrese sus credenciales">
            <Head title="Log in" />

            <form className="flex flex-col gap-6 text-black" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Input
                            id="cedula"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="cedula"
                            value={data.cedula}
                            onChange={(e) => setData('cedula', e.target.value)}
                            placeholder="Cedula"
                            className="relative border border-gray-300 px-10 py-6"
                        />
                        <img src="/person-icon.png" alt="Person icon" className="absolute translate-x-1 translate-y-3 px-2" />
                        <InputError message={errors.cedula} />
                    </div>

                    <div className="grid gap-2">
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Contraseña"
                            className="relative border border-gray-300 px-10 py-6"
                        />
                        <img src="/password-icon.png" alt="Person icon" className="absolute translate-x-1 translate-y-3 px-2" />
                        <InputError message={errors.password} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full cursor-pointer bg-[#0368FE] font-bold text-white hover:bg-[#0368FE]/90"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Entrar
                    </Button>
                </div>
            </form>
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
