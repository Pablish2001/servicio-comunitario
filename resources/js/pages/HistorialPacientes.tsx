import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
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
            <div className="min-h-screen w-full bg-[#BEE5FA] px-4 pt-24 pb-10 sm:px-6 md:px-10 lg:px-16">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* ------- TARJETA PRINCIPAL DE BUSQUEDA ------- */}
                    <div className="w-full rounded-xl bg-white p-6 shadow-lg">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-center text-lg font-bold text-gray-800 sm:text-left">Historial de Pacientes</h2>

                            <div className="flex w-full items-center gap-3 sm:w-auto">
                                <Input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="w-full cursor-pointer rounded border-gray-300 py-2 focus:ring-blue-500 dark:text-black"
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
                                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="my-4 border-b"></div>

                        {/* Cedula */}
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="number"
                                placeholder="Ingrese la cédula"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                className="w-full rounded-lg py-3 pl-12 shadow-sm focus:ring-2 focus:ring-blue-500 dark:text-black"
                                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                            />
                        </div>

                        <Button
                            onClick={handleBuscar}
                            disabled={loading}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold text-white shadow-md"
                            style={{ backgroundColor: '#00D100' }}
                        >
                            <Search className="h-5 w-5" /> {loading ? 'Buscando...' : 'BUSCAR'}
                        </Button>
                    </div>

                    {/* ------- PACIENTES RECIENTES ------- */}
                    {!loading && pacientesRecientes?.length > 0 && !atenciones.length && !error && !busquedaPorFecha && (
                        <div className="w-full rounded-xl bg-white p-6 shadow-lg">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-700">
                                <Clock className="h-5 w-5" />
                                Últimos pacientes atendidos
                            </h3>

                            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
                                {pacientesRecientes.map((paciente: any) => (
                                    <div key={paciente.id} className="rounded border bg-gray-50 p-4">
                                        <div className="flex flex-col justify-between gap-4 lg:flex-row">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">
                                                    {paciente.paciente_nombre}
                                                    <span className="ml-2 text-sm text-gray-500">C.I: {paciente.cedula}</span>
                                                </h4>

                                                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" /> {paciente.fecha}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-400" /> {paciente.hora}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" /> {paciente.atendido_por}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-gray-400" /> {paciente.diagnostico}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => router.visit(`/detalle-atencion/${paciente.id}`)}
                                                className="flex cursor-pointer items-center gap-2 font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye className="h-4 w-4" /> Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ------- MENSAJES DE ERROR / EMPTY ------- */}
                    {error && <div className="rounded-lg border bg-red-50 p-4 text-center text-red-600">{error}</div>}

                    {loading && <div className="rounded-lg border bg-yellow-50 p-4 text-center text-yellow-600">Cargando...</div>}

                    {/* ------- LISTA DE ATENCIONES ------- */}
                    {!loading && atenciones.length > 0 && (
                        <div className="w-full rounded-xl bg-white p-6 shadow-lg">
                            {/* Header */}
                            <div className="mb-6 border-b pb-4">
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
                                    {busquedaPorFecha ? `${atenciones.length} paciente(s)` : `${atenciones.length} atención(es)`}
                                </p>
                            </div>

                            <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-2">
                                {atenciones.map((atencion) => (
                                    <div key={atencion.id} className="rounded border bg-gray-50 p-4">
                                        <div className="flex flex-col justify-between gap-4 lg:flex-row">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">
                                                    {atencion.paciente_nombre}
                                                    <span className="ml-2 text-sm text-gray-500">C.I: {atencion.cedula}</span>
                                                </h4>

                                                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" /> {atencion.fecha}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-400" /> {atencion.hora}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" /> {atencion.atendido_por}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-gray-400" /> {atencion.diagnostico}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => router.visit(`/detalle-atencion/${atencion.id}`)}
                                                className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye className="h-4 w-4" /> Ver detalles
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
