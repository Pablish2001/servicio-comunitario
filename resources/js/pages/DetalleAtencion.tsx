import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, User, FileText, Heart, Thermometer, Activity, Droplets, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import type { DetalleAtencion } from '@/types';

export default function DetalleAtencion() {
    const props = usePage().props as any;
    const atencion: DetalleAtencion = props.atencion;

    const handleVolver = () => {
        router.visit('/historial-pacientes');
    };

    return (
        <AppLayout>
            <Head title="Detalles de la Atención" />
            
            <div className="min-h-screen flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-4xl">
                    {/* Tarjeta principal */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
                        {/* Header con título centrado y botón cerrar */}
                        <div className="flex justify-between items-center mb-8">
                            <div></div> {/* Espaciador */}
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
                                Detalles de la Visita
                            </h2>
                            <button 
                                onClick={handleVolver}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl cursor-pointer transition-colors duration-200"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Información de la visita - Barra azul clara */}
                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
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
                            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                                Datos del Paciente
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre completo</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cédula de identidad</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">C.I {atencion.paciente.cedula}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Género</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.genero}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fecha de nacimiento</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.fecha_nacimiento}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Facultad/Departamento</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.paciente.facultad}</p>
                                </div>
                            </div>
                        </div>

                        {/* Signos Vitales */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                                Signos Vitales
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Presión Arterial</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.presion_arterial}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temperatura</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.temperatura}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ritmo cardíaco</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.ritmo_cardiaco}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Frec. respiratoria</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.frecuencia_respiratoria}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saturación O₂</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{atencion.signos_vitales.saturacion_o2}</p>
                                </div>
                            </div>
                        </div>

                        {/* Detalles de la Consulta */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                                Detalles de la Consulta
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Síntomas</p>
                                    <p className="text-gray-800 dark:text-gray-200">{atencion.consulta.sintomas}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Diagnóstico</p>
                                    <p className="text-gray-800 dark:text-gray-200">{atencion.consulta.diagnostico}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Tratamiento</p>
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
