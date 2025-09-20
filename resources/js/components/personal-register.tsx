import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import PersonalLabel from './personal-label';
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// ...otros imports

type RegisterForm = {
    cedula: string;
    password: string;
};

type PersonalItem = {
    cedula: number;
    persona: {
        nombre: string;
        apellido: string;
    };
};

type Jornada = {
    id: number;
    fecha_inicio: string | null;
};

export default function PersonalRegister() {
    const form = useForm<RegisterForm>({
        cedula: '',
        password: '',
    });

    const [generalError, setGeneralError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Oculta el error automáticamente después de 3 segundos
    React.useEffect(() => {
        if (generalError) {
            const timer = setTimeout(() => setGeneralError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [generalError]);

    const { auth } = usePage().props as any;
    const [personal, setPersonal] = useState<any[]>(() => {
        // Al cargar, agrega automáticamente al usuario autenticado si no está
        return auth && auth.user ? [{
            id: auth.user.id,
            cedula: auth.user.cedula,
            persona: auth.user.persona
        }] : [];
    });
    // Agregar usuario por cédula y contraseña (simula validación local, o puedes hacer petición al backend para validar)
    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setGeneralError('');
        if (personal.find(p => p.cedula === form.data.cedula)) {
            setGeneralError('Usuario ya está en la lista');
            return;
        }
        // Validar contra el backend y obtener datos reales
        const { validarCredenciales } = await import('../utils/api');
        const result = await validarCredenciales(form.data.cedula, form.data.password);
        if (result.success) {
            setPersonal([...personal, {
                id: result.user.id,
                cedula: result.user.cedula,
                persona: {
                    nombre: result.user.persona.nombre,
                    apellido: result.user.persona.apellido
                }
            }]);
            form.reset();
        } else {
            setGeneralError(result.message || 'Credenciales inválidas');
        }
    };

    // Eliminar usuario de la lista temporal
    const eliminarPersonal = (cedula: number) => {
        setPersonal(personal.filter(p => p.cedula !== cedula));
    };

    // Iniciar jornada: envía la lista al backend
    const iniciarJornada = () => {
        const ids = personal.map(p => p.id);
        router.post(route('jornada.iniciar'), {
            user_ids: ids
        }, {
            onSuccess: (page) => {
                setShowToast(true);
                // El toast se ocultará automáticamente después de 3 segundos por el useEffect
                // Redirigir inmediatamente usando Inertia
                router.visit('/atencions/create');
            },
            onError: (errors) => {
                // Extraer el primer error más relevante
                let errorMessage = 'No se pudo iniciar la jornada.';
                
                if (errors.jornada) {
                    errorMessage = errors.jornada;
                } else if (errors.sede) {
                    errorMessage = 'No hay sede seleccionada.';
                } else if (errors.user_ids) {
                    errorMessage = 'Debe seleccionar al menos un miembro del personal.';
                } else if (errors.message) {
                    errorMessage = errors.message;
                }
                
                setGeneralError(errorMessage);
                console.error('Errores backend:', errors);
            }
        });
    };

    const mostrarPersonal = personal;


    return (
        <div className="flex h-100 w-200 flex-col justify-between gap-4 rounded-md bg-[#EDF9FF] p-4 text-black">
            {/* Toast de éxito */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg animate-fade-in">
                    Jornada creada exitosamente
                </div>
            )}
            {/* Banner de error */}
            {generalError && (
                <div className="mb-4 rounded-md bg-red-100 border border-red-400 px-4 py-2 text-red-800 font-semibold">
                    {generalError}
                </div>
            )}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <img src="/person-icon-blue.png" alt="person icon blue" className="w-8" />
                    <h2 className="text-xl font-bold text-[#0E469A]">Registro de personal de Salud</h2>
                </div>

                <form onSubmit={submit} className="grid w-full grid-cols-[1fr_1fr_auto] gap-4">
                    <div className="relative">
                        <img src="/search-grey.png" alt="search icon grey" className="absolute translate-x-2 translate-y-1.5" />
                        <Input
                            id="cedula"
                            type="text"
                            required
                            autoFocus
                            autoComplete="cedula"
                            value={form.data.cedula}
                            onChange={(e) => form.setData('cedula', e.target.value)}
                            placeholder="Cédula"
                            className="w-full rounded-md bg-white pl-10 shadow-md"
                        />
                    </div>

                    <div className="relative">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                            className="w-full rounded-md bg-white pl-10 shadow-md"
                        />
                        <img src="/password-icon-grey.png" alt="password icon grey" className="absolute top-1.5 left-2" />
                    </div>

                    <Button variant="default" type="submit" className="h-10 w-10 shrink-0">
                        <span className="text-xl">+</span>
                    </Button>
                    {form.errors.password && <p className="mt-1 text-sm text-red-600">{form.errors.password}</p>}
                </form>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <img src="/person-icon-blue.png" alt="person icon blue" className="w-8" />
                    <h2 className="text-xl font-bold text-[#0E469A]">Personal Registrado</h2>
                </div>

                <form className="flex flex-col gap-4">
                    <ul className="flex flex-col gap-4">
                        {mostrarPersonal.map((p: any) => (
                            <PersonalLabel
                                key={p.cedula}
                                name={`${p.persona.nombre} ${p.persona.apellido}`}
                                userId={p.cedula}
                                onRemove={eliminarPersonal}
                            />
                        ))}
                    </ul>
                </form>

                {mostrarPersonal.length > 0 && (
                     <Button onClick={() => setDialogOpen(true)}>INICIAR JORNADA</Button>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Iniciar la jornada?</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 text-gray-600">
                        Se registrará el personal añadido y se dará comienzo a la jornada de atención.
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => {
                                iniciarJornada();
                                setDialogOpen(false);
                            }}
                        >
                            Iniciar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
