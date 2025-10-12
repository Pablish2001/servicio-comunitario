import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, Eye, FileText, Search, User, X } from 'lucide-react';
import { useState } from 'react';
interface Atencion {
    id: number;
    paciente_nombre: string;
    cedula: string; // Opcional, solo cuando se busca por fecha
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

    return (
        <AppLayout>
            <Head title="Historial de Pacientes" />

            <div className="fixed inset-0 flex bg-[#BEE5FA] p-6" style={{ marginTop: '80px' }}>
                <div className="flex h-full w-full justify-center overflow-y-auto">
                    {/* Tarjeta principal */}
                    <div className="relative mr-4 max-h-60 max-w-100 rounded-lg bg-white p-6 shadow-lg">
                        {/* Header con título, campo de fecha y botón cerrar */}
                        <div className="mb-4 flex items-center gap-3">
                            <h2 className="flex-shrink-0 text-lg font-bold text-gray-800">Historial de Pacientes</h2>

                            {/* Campo de fecha en el header */}
                            <div className="flex items-center gap-1">
                                {/* <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" /> */}
                                <Input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="w-full min-w-0 justify-end rounded border-gray-300 px-3 py-1 focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:text-black"
                                    onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                                />

                                <button
                                    onClick={() => {
                                        setCedula('');
                                        setFecha('');
                                        setAtenciones([]);
                                        setPaciente(null);
                                        setError('');
                                        setExpandedAtenciones(new Set());
                                        setBusquedaPorFecha(false);
                                    }}
                                    className="mr-4 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-800"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Línea separadora */}
                        <div className="mb-6 border-b border-gray-200"></div>

                        {/* Campo de búsqueda por cédula */}
                        <div className="relative mx-10 mb-6">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                type="number"
                                placeholder="Ingrese la cédula"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                className="rounded-lg border-0 bg-white py-3 pr-4 pl-10 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:text-black"
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

                    {!loading && pacientesRecientes && pacientesRecientes.length > 0 && !atenciones.length && !error && !busquedaPorFecha && (
                        <div className="flex max-h-105 flex-col rounded-lg bg-white p-6 shadow-lg">
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock className="h-4 w-4" />
                                Últimos pacientes atendidos
                            </h3>
                            <div className="space-y-2 overflow-auto">
                                {pacientesRecientes.map((paciente: any, index: number) => (
                                    <div
                                        key={paciente.id}
                                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                        style={{ maxHeight: '20vh', overflow: 'hidden' }}
                                    >
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="mb-3 font-semibold text-gray-800">
                                                        {paciente.paciente_nombre}
                                                        <span className="ml-2 text-sm font-normal text-gray-500">C.I: {paciente.cedula}</span>
                                                    </h4>

                                                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span>{paciente.fecha}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-gray-400" />
                                                            <span>{paciente.hora}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <span>Atendido por: {paciente.atendido_por}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-gray-400" />
                                                            <span>Diagnóstico: {paciente.diagnostico}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => router.visit(`/detalle-atencion/${paciente.id}`)}
                                                    className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resultados de la búsqueda */}
                    {error && (
                        <div className="max-h-15 rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="text-center text-red-600">{error}</p>
                        </div>
                    )}
                    {loading && (
                        <div className="max-h-15 w-120 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <p className="text-center text-yellow-600"> Cargando... </p>
                        </div>
                    )}

                    {!loading && atenciones.length === 0 && busquedaPorFecha && (
                        <div className="max-h-15 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <p className="text-center text-yellow-600">No se encontraron atenciones para esta fecha.</p>
                        </div>
                    )}

                    {!loading && !error && !busquedaPorFecha && pacientesRecientes.length === 0 && (
                        <div className="max-h-15 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <p className="text-center text-yellow-600">No existen registros por ahora.</p>
                        </div>
                    )}

                    {!loading && atenciones.length > 0 && (
                        <div className="flex max-h-100 flex-col rounded-lg bg-white p-6 shadow-lg">
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
                            <div className="space-y-4 overflow-auto">
                                {atenciones.map((atencion, index) => (
                                    <div key={atencion.id} className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="mb-3 font-semibold text-gray-800">
                                                    {atencion.paciente_nombre}
                                                    <span className="ml-2 text-sm font-normal text-gray-500">C.I: {atencion.cedula}</span>
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
                </div>
            </div>
        </AppLayout>
    );
}
