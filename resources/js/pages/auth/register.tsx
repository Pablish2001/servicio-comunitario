import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    nombre: string;
    apellido: string;
    email: string;
    contacto: string;
    genero: string;
    cedula: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        nombre: '',
        apellido: '',
        email: '',
        contacto: '',
        genero: '',
        cedula: '',
        password: '',
        password_confirmation: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors) => {
                console.log('Registration errors:', errors);
            },
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        {/* Nombre */}
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            type="text"
                            required
                            tabIndex={1}
                            autoComplete="name"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            disabled={processing}
                            placeholder="Nombre"
                        />
                        <InputError message={errors.nombre} className="mt-2" />

                        {/* Apellido */}
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                            id="apellido"
                            type="text"
                            required
                            tabIndex={2}
                            autoComplete="family-name"
                            value={data.apellido}
                            onChange={(e) => setData('apellido', e.target.value)}
                            disabled={processing}
                            placeholder="Apellido"
                        />
                        <InputError message={errors.apellido} className="mt-2" />

                        {/* Cédula */}
                        <Label htmlFor="cedula">Cédula</Label>
                        <Input
                            id="cedula"
                            type="text"
                            required
                            tabIndex={3}
                            autoComplete="off"
                            value={data.cedula}
                            onChange={(e) => setData('cedula', e.target.value)}
                            disabled={processing}
                            placeholder="Cédula"
                        />
                        <InputError message={errors.cedula} className="mt-2" />

                        {/* Contacto */}
                        <Label htmlFor="contacto">Contacto</Label>
                        <Input
                            id="contacto"
                            type="text"
                            required
                            tabIndex={4}
                            autoComplete="tel"
                            value={data.contacto}
                            onChange={(e) => setData('contacto', e.target.value)}
                            disabled={processing}
                            placeholder="Número de contacto"
                        />
                        <InputError message={errors.contacto} className="mt-2" />

                        {/* Género con select */}
                        <Label htmlFor="genero">Género</Label>
                        <select
                            id="genero"
                            value={data.genero}
                            onChange={(e) => setData('genero', e.target.value)}
                            disabled={processing}
                            className="rounded border px-3 py-2 focus:outline-none"
                            tabIndex={5}
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                        </select>
                        <InputError message={errors.genero} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
