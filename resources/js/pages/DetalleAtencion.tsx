import AppLayout from '@/layouts/app-layout';
import type { DetalleAtencion } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, User } from 'lucide-react';

export default function DetalleAtencion() {
    const props = usePage().props as any;
    const atencion: DetalleAtencion = props.atencion;

    const handleVolver = () => {
        router.visit('/historial-pacientes');
    };

    return (
        <AppLayout>
            <Head title="Detalles de la Atención" />

            <div className="my-4 mt-6 flex min-h-screen flex-col items-center justify-center px-6">
                <div className="w-full max-w-4xl">
                    {/* Tarjeta principal */}
                    <div className="relative rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        {/* Header con título centrado y botón cerrar */}
                        <div className="mb-8 flex items-center justify-between">
                            <div></div> {/* Espaciador */}
                            <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">Detalles de la Visita</h2>
                            <button
                                onClick={handleVolver}
                                className="cursor-pointer text-2xl text-gray-600 transition-colors duration-200 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ×
                            </button>
                        </div>

                        {/* Información de la visita - Barra azul clara */}
                        <div className="mb-6 rounded-lg bg-blue-100 p-4 dark:bg-blue-900/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{atencion.fecha}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{atencion.hora}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">Atendido por: {atencion.atendido_por}</span>
                                </div>
                            </div>
                        </div>

                        {/* Datos del Paciente */}
                        <div className="mb-6">
                            <h3 className="mb-3 border-b border-gray-300 pb-2 text-xl font-bold text-blue-600 dark:border-gray-600 dark:text-blue-400">
                                Datos del Paciente
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Nombre completo</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.nombre}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Cédula de identidad</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">C.I {atencion.paciente.cedula}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Género</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.genero}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Fecha de nacimiento</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.fecha_nacimiento}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Facultad/Departamento</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.facultad}</p>
                                </div>
                            </div>
                        </div>

                        {/* Signos Vitales */}
                        <div className="mb-6">
                            <h3 className="mb-3 border-b border-gray-300 pb-2 text-xl font-bold text-blue-600 dark:border-gray-600 dark:text-blue-400">
                                Signos Vitales
                            </h3>
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Presión Arterial</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.presion_arterial}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Temperatura</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.temperatura}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Ritmo cardíaco</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.ritmo_cardiaco}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Frec. respiratoria</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                        {atencion.signos_vitales.frecuencia_respiratoria}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Saturación O₂</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.saturacion_o2}</p>
                                </div>
                            </div>
                        </div>

                        {/* Detalles de la Consulta */}
                        <div className="mb-6">
                            <h3 className="mb-3 border-b border-gray-300 pb-2 text-xl font-bold text-blue-600 dark:border-gray-600 dark:text-blue-400">
                                Detalles de la Consulta
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">Síntomas</p>
                                    <p className="text-gray-800 dark:text-gray-200">{atencion.consulta.sintomas}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">Diagnóstico</p>
                                    <p className="text-gray-800 dark:text-gray-200">{atencion.consulta.diagnostico}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">Tratamiento</p>
                                    <p className="text-gray-800 dark:text-gray-200">{atencion.consulta.tratamiento}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
