import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, Eye, FileText, Search, User } from 'lucide-react';
import { useState } from 'react';

interface Atencion {
    id: number;
    paciente_nombre: string;
    cedula?: string; // Opcional, solo cuando se busca por fecha
    fecha: string;
    hora: string;
    atendido_por: string;
    diagnostico: string;
    sintomas: string;
    tratamiento: string;
}

interface Paciente {
    id: number;
    nombre: string;
    cedula: string;
    fecha_nacimiento: string;
    edad: number | null;
    genero: string;
    telefono: string;
    direccion: string;
    email: string;
}

export default function HistorialPacientes() {
    const { ziggy, csrf_token, pacientesRecientes } = usePage().props as any;
    const [cedula, setCedula] = useState('');
    const [fecha, setFecha] = useState('');
    const [atenciones, setAtenciones] = useState<Atencion[]>([]);
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedAtenciones, setExpandedAtenciones] = useState<Set<number>>(new Set());
    const [busquedaPorFecha, setBusquedaPorFecha] = useState(false);

    const handleBuscar = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/historial-pacientes/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    cedula: cedula.trim(),
                    fecha: fecha,
                }),
            });

            if (!response.ok) {
                if (response.status === 419) {
                    throw new Error('Token CSRF expirado. Por favor, recarga la página.');
                }
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setAtenciones(data.atenciones);
                setPaciente(data.paciente);
                setBusquedaPorFecha(data.busqueda_por_fecha || false);
            } else {
                setError(data.message || 'Error al buscar paciente');
                setAtenciones([]);
                setPaciente(null);
            }
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            setError(error instanceof Error ? error.message : 'Error de conexión');
            setAtenciones([]);
            setPaciente(null);
            setBusquedaPorFecha(false);
        } finally {
            setLoading(false);
        }
    };

    const toggleAtencionExpansion = (atencionId: number) => {
        const newExpanded = new Set(expandedAtenciones);
        if (newExpanded.has(atencionId)) {
            newExpanded.delete(atencionId);
        } else {
            newExpanded.add(atencionId);
        }
        setExpandedAtenciones(newExpanded);
    };

    const handleClickPacienteReciente = async (cedulaPaciente: string) => {
        setCedula(cedulaPaciente);
        setFecha('');

        // Realizar la búsqueda automáticamente
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/historial-pacientes/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    cedula: cedulaPaciente.trim(),
                    fecha: '',
                }),
            });

            if (!response.ok) {
                if (response.status === 419) {
                    throw new Error('Token CSRF expirado. Por favor, recarga la página.');
                }
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setAtenciones(data.atenciones);
                setPaciente(data.paciente);
                setBusquedaPorFecha(data.busqueda_por_fecha || false);
            } else {
                setError(data.message || 'Error al buscar paciente');
                setAtenciones([]);
                setPaciente(null);
            }
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            setError(error instanceof Error ? error.message : 'Error de conexión');
            setAtenciones([]);
            setPaciente(null);
            setBusquedaPorFecha(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Historial de Pacientes" />

            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#BEE5FA] p-6" style={{ marginTop: '80px' }}>
                <div className="w-full max-w-lg">
                    {/* Tarjeta principal */}
                    <div className="relative rounded-lg bg-white p-6 shadow-lg">
                        {/* Header con título, campo de fecha y botón cerrar */}
                        <div className="mb-4 flex items-center gap-3">
                            <h2 className="flex-shrink-0 text-lg font-bold text-gray-800">Historial de Pacientes</h2>

                            {/* Campo de fecha en el header */}
                            <div className="flex flex-1 items-center gap-1">
                                <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                <Input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="min-w-0 rounded border-gray-300 px-2 py-1 text-xs focus:border-transparent focus:ring-1 focus:ring-blue-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                                />
                            </div>

                            {/*                             <button 
                                onClick={() => {
                                    setCedula('');
                                    setFecha('');
                                    setAtenciones([]);
                                    setPaciente(null);
                                    setError('');
                                    setExpandedAtenciones(new Set());
                                    setBusquedaPorFecha(false);
                                }}
                                className="text-gray-600 hover:text-gray-800 flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </button> */}
                        </div>

                        {/* Línea separadora */}
                        <div className="mb-6 border-b border-gray-200"></div>

                        {/* Campo de búsqueda por cédula */}
                        <div className="relative mb-6">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Ingrese la cédula de identidad del paciente"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                className="rounded-lg border-0 bg-white py-3 pr-4 pl-10 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                            />
                        </div>

                        {/* Botón de búsqueda */}
                        <Button
                            onClick={handleBuscar}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                            style={{
                                backgroundColor: '#00D100',
                            }}
                        >
                            <Search className="h-4 w-4" />
                            {loading ? 'Buscando...' : 'BUSCAR'}
                        </Button>
                    </div>

                    {/* Pacientes recientes */}
                    {pacientesRecientes && pacientesRecientes.length > 0 && !atenciones.length && !error && (
                        <div className="mt-6 rounded-lg bg-white p-4 shadow-lg">
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock className="h-4 w-4" />
                                Últimos pacientes atendidos
                            </h3>
                            <div className="space-y-2">
                                {pacientesRecientes.map((paciente: any, index: number) => (
                                    <div
                                        key={paciente.id}
                                        onClick={() => handleClickPacienteReciente(paciente.cedula)}
                                        className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-blue-50"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{paciente.paciente_nombre}</p>
                                            <p className="text-xs text-gray-500">C.I: {paciente.cedula}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600">{paciente.fecha}</p>
                                            <p className="text-xs text-gray-500">{paciente.hora}</p>
                                        </div>
                                        <div className="ml-3">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resultados de la búsqueda */}
                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="text-center text-red-600">{error}</p>
                        </div>
                    )}

                    {atenciones.length > 0 && (
                        <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
                            {/* Título dinámico según el tipo de búsqueda */}
                            <div className="mb-6 border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {busquedaPorFecha
                                        ? `Atenciones del ${new Date(fecha).toLocaleDateString('es-ES', {
                                              weekday: 'long',
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })}`
                                        : `Historial de ${paciente?.nombre}`}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {busquedaPorFecha
                                        ? `${atenciones.length} paciente${atenciones.length !== 1 ? 's' : ''} atendido${atenciones.length !== 1 ? 's' : ''}`
                                        : `${atenciones.length} atención${atenciones.length !== 1 ? 'es' : ''} registrada${atenciones.length !== 1 ? 's' : ''}`}
                                </p>
                            </div>

                            {/* Historial de atenciones */}
                            <div className="space-y-4">
                                {atenciones.map((atencion, index) => (
                                    <div key={atencion.id} className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="mb-3 font-semibold text-gray-800">
                                                    {atencion.paciente_nombre}
                                                    {busquedaPorFecha && atencion.cedula && (
                                                        <span className="ml-2 text-sm font-normal text-gray-500">(C.I: {atencion.cedula})</span>
                                                    )}
                                                </h4>

                                                <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span>{atencion.fecha}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <span>{atencion.hora}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        <span>Atendido por: {atencion.atendido_por}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-gray-400" />
                                                        <span>Diagnóstico: {atencion.diagnostico}</span>
                                                    </div>
                                                </div>

                                                {/* Información expandida */}
                                                {expandedAtenciones.has(atencion.id) && (
                                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                                        <h6 className="mb-2 font-semibold text-gray-700">Detalles adicionales:</h6>
                                                        <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Síntomas:</strong> {atencion.sintomas}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Tratamiento:</strong> {atencion.tratamiento}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Fecha y hora:</strong> {atencion.fecha} a las {atencion.hora}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Profesional:</strong> {atencion.atendido_por}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => router.visit(`/detalle-atencion/${atencion.id}`)}
                                                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {paciente && atenciones.length === 0 && (
                        <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
                            <div className="mb-6 border-b border-gray-200 pb-4">
                                <h3 className="mb-3 text-lg font-bold text-gray-800">{paciente.nombre}</h3>
                                <p className="text-sm text-gray-600">Cédula: {paciente.cedula}</p>
                            </div>

                            <div className="py-8 text-center">
                                <p className="text-lg text-gray-500">Este paciente no tiene atenciones registradas</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
