import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PageProps } from '@inertiajs/core';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PersonalLabel from './personal-label';

type RegisterForm = {
    cedula: string;
    password: string;
    remember?: boolean;
    general?: string;
};

type PersonaForLabel = {
    nombre: string;
    apellido: string;
    email?: string;
    contacto?: string;
    genero?: string;
    id?: number;
    created_at?: string;
    updated_at?: string;
};

type JornadaParticipant = {
    id: number;
    cedula: string;
    persona: PersonaForLabel | null;
};

interface MyPageProps extends PageProps {
    auth: {
        user: {
            id: number;
            cedula: string;
            status: string;
            is_admin: boolean;
            created_at: string;
            updated_at: string;
            persona_id: number;
            persona: PersonaForLabel | null;
        } | null;
    };
}

// --- Main Component ---

export default function PersonalRegister() {
    const { auth } = usePage<MyPageProps>().props;

    const {
        data: formData,
        setData: setFormData,
        errors: verificationErrors,
        reset: resetVerificationForm,
        setError,
        clearErrors,
    } = useForm<RegisterForm>({
        cedula: '',
        password: '',
        general: '',
    });

    const [verifyingUser, setVerifyingUser] = useState(false);
    const [creatingJornada, setCreatingJornada] = useState(false);
    const [jornadaParticipants, setJornadaParticipants] = useState<JornadaParticipant[]>([]);
    const [jornadaMessage, setJornadaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (auth.user) {
            const loggedInUser: JornadaParticipant = {
                id: auth.user.id,
                cedula: auth.user.cedula,
                persona: auth.user.persona
                    ? {
                          nombre: auth.user.persona.nombre,
                          apellido: auth.user.persona.apellido,
                      }
                    : null,
            };

            setJornadaParticipants((prev) => {
                if (!prev.some((p) => p.id === loggedInUser.id)) {
                    return [...prev, loggedInUser];
                }
                return prev;
            });
        }
    }, [auth.user]);

    const handleVerifyUser = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setJornadaMessage(null);

        if (!formData.cedula || !formData.password) {
            setError('cedula', 'Cédula y contraseña son requeridos.');
            return;
        }

        try {
            setVerifyingUser(true);
            const response = await fetch('/api/auth/verify-jornada-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    cedula: formData.cedula,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const isAlreadyAdded = jornadaParticipants.some((participant) => participant.cedula === formData.cedula);

                if (isAlreadyAdded) {
                    setError('cedula', 'Este usuario ya ha sido añadido para la jornada.');
                } else {
                    const newUser: JornadaParticipant = {
                        id: data.data.id,
                        cedula: data.data.cedula,
                        persona: data.data.persona
                            ? {
                                  nombre: data.data.persona.nombre,
                                  apellido: data.data.persona.apellido,
                              }
                            : null,
                    };

                    setJornadaParticipants((prevParticipants) => [...prevParticipants, newUser]);
                    resetVerificationForm();
                    setJornadaMessage({ type: 'success', text: 'Usuario verificado y añadido.' });
                }
            } else {
                if (response.status === 422 && data.errors) {
                    setError(data.errors);
                } else {
                    setError('general', data.message || 'Error al verificar usuario.');
                }
            }
        } catch (error) {
            setError('general', 'Error de red o servidor al intentar verificar el usuario.');
            console.error('Error verifying user:', error);
        } finally {
            setVerifyingUser(false);
        }
    };

    const handleInitiateJornada = async () => {
        setJornadaMessage(null);

        if (jornadaParticipants.length === 0) {
            setJornadaMessage({ type: 'error', text: 'Debe añadir al menos un participante para iniciar la jornada.' });
            return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const jornadaDate = `${year}-${month}-${day}`;
        const sedeId = 1; // OJO SEDE 1 = VILLA ASIA PERO ESTA POR DEFECTO

        const asignaciones = jornadaParticipants.map((participant) => ({
            user_cedula: participant.cedula,
            status: 'presente',
        }));

        try {
            setCreatingJornada(true);
            const response = await fetch('/api/jornadas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    fecha: jornadaDate,
                    sede_id: sedeId,
                    asignaciones: asignaciones,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setJornadaMessage({ type: 'success', text: 'Jornada iniciada exitosamente y participantes asignados.' });
                setJornadaParticipants([]);
                resetVerificationForm();
            } else {
                if (response.status === 422 && data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join('; ');
                    setJornadaMessage({ type: 'error', text: `Errores al iniciar jornada: ${errorMessages}` });
                } else {
                    setJornadaMessage({ type: 'error', text: data.message || 'Error desconocido al iniciar la jornada.' });
                }
            }
        } catch (error) {
            setJornadaMessage({ type: 'error', text: 'Error de red o servidor al iniciar jornada. Intente de nuevo.' });
            console.error('Error initiating jornada:', error);
        } finally {
            setCreatingJornada(false);
        }
    };

    return (
        <div className="flex h-100 w-200 flex-col justify-between gap-4 rounded-md bg-[#EDF9FF] p-4 text-black">
            {jornadaMessage && (
                <div
                    className={`rounded-md p-2 text-center ${jornadaMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                    {jornadaMessage.text}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <div>
                        <img src="/person-icon-blue.png" alt="person icon blue" className="w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0E469A]">Registro de personal de Salud</h2>
                </div>
                <form onSubmit={handleVerifyUser} className="grid w-full grid-cols-[1fr_1fr_auto] gap-4">
                    <div className="relative">
                        <img src="/search-grey.png" alt="search icon grey" className="absolute translate-x-2 translate-y-1.5" />
                        <Input
                            id="cedula"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="off"
                            value={formData.cedula}
                            onChange={(e) => setFormData('cedula', e.target.value)}
                            placeholder="Cedula"
                            className="w-full rounded-md bg-white pl-10 shadow-md"
                        />
                        {verificationErrors.cedula && <div className="mt-1 text-sm text-red-500">{verificationErrors.cedula}</div>}
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={(e) => setFormData('password', e.target.value)}
                            placeholder="Contraseña"
                            className="w-full rounded-md bg-white pl-10 shadow-md"
                        />
                        <img src="/password-icon-grey.png" alt="password icon grey" className="absolute top-1.5 left-2" />
                        {verificationErrors.password && <div className="mt-1 text-sm text-red-500">{verificationErrors.password}</div>}
                    </div>
                    <Button type="submit" variant="default" className="h-10 w-10 shrink-0" disabled={verifyingUser}>
                        <span className="text-xl">{verifyingUser ? '...' : '+'}</span>
                    </Button>
                    {verificationErrors.general && (
                        <div className="col-span-3 mt-1 text-center text-sm text-red-500">{verificationErrors.general}</div>
                    )}
                </form>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <div>
                        <img src="/person-icon-blue.png" alt="person icon blue" className="w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0E469A]">Personal Registrado</h2>
                </div>
                <div className="flex max-h-60 flex-col gap-4 overflow-y-auto rounded-md border border-gray-200 p-2">
                    {jornadaParticipants.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {jornadaParticipants.map((participant) => (
                                <PersonalLabel key={participant.id} cedula={participant.cedula} persona={participant.persona} />
                            ))}
                        </ul>
                    ) : (
                        <p className="py-4 text-center text-sm text-gray-500 italic">Ningún personal ha sido añadido aún.</p>
                    )}
                </div>
                <Button
                    variant="default"
                    className="mt-4 self-center font-bold"
                    onClick={handleInitiateJornada}
                    disabled={creatingJornada || jornadaParticipants.length === 0}
                >
                    {creatingJornada ? 'Iniciando Jornada...' : 'INICIAR JORNADA'}
                </Button>
            </div>
        </div>
    );
}
