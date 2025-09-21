import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, X, Calendar, Clock, User, FileText, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

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
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ 
                    cedula: cedula.trim(),
                    fecha: fecha
                })
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
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ 
                    cedula: cedulaPaciente.trim(),
                    fecha: ''
                })
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
            
            <div className="fixed inset-0 bg-[#BEE5FA] flex flex-col items-center justify-center p-6" style={{ marginTop: '80px' }}>
                <div className="w-full max-w-lg">
                    {/* Tarjeta principal */}
                    <div className="bg-white rounded-lg shadow-lg p-6 relative">
                        {/* Header con título, campo de fecha y botón cerrar */}
                        <div className="flex items-center mb-4 gap-3">
                            <h2 className="text-lg font-bold text-gray-800 flex-shrink-0">
                                Historial de Pacientes
                            </h2>
                            
                            {/* Campo de fecha en el header */}
                            <div className="flex items-center gap-1 flex-1">
                                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <Input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="text-xs px-2 py-1 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent min-w-0"
                                    onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                                />
                            </div>
                            
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
                                className="text-gray-600 hover:text-gray-800 flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        
                        {/* Línea separadora */}
                        <div className="border-b border-gray-200 mb-6"></div>
                        
                        {/* Campo de búsqueda por cédula */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Ingrese la cédula de identidad del paciente"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                className="pl-10 pr-4 py-3 border-0 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                            />
                        </div>
                        
                        {/* Botón de búsqueda */}
                        <Button 
                            onClick={handleBuscar}
                            disabled={loading}
                            className="w-full text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                            style={{
                                backgroundColor: '#00D100'
                            }}
                        >
                            <Search className="h-4 w-4" />
                            {loading ? 'Buscando...' : 'BUSCAR'}
                        </Button>
                    </div>

                    {/* Pacientes recientes */}
                    {pacientesRecientes && pacientesRecientes.length > 0 && !atenciones.length && !error && (
                        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Últimos pacientes atendidos
                            </h3>
                            <div className="space-y-2">
                                {pacientesRecientes.map((paciente: any, index: number) => (
                                    <div 
                                        key={paciente.id}
                                        onClick={() => handleClickPacienteReciente(paciente.cedula)}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 text-sm">{paciente.paciente_nombre}</p>
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
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    {atenciones.length > 0 && (
                        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                            {/* Título dinámico según el tipo de búsqueda */}
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {busquedaPorFecha ? 
                                        `Atenciones del ${new Date(fecha).toLocaleDateString('es-ES', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}` : 
                                        `Historial de ${paciente?.nombre}`
                                    }
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {busquedaPorFecha ? 
                                        `${atenciones.length} paciente${atenciones.length !== 1 ? 's' : ''} atendido${atenciones.length !== 1 ? 's' : ''}` :
                                        `${atenciones.length} atención${atenciones.length !== 1 ? 'es' : ''} registrada${atenciones.length !== 1 ? 's' : ''}`
                                    }
                                </p>
                            </div>
                            
                            {/* Historial de atenciones */}
                            <div className="space-y-4">
                                {atenciones.map((atencion, index) => (
                                    <div key={atencion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 mb-3">
                                                    {atencion.paciente_nombre}
                                                    {busquedaPorFecha && atencion.cedula && (
                                                        <span className="text-sm text-gray-500 font-normal ml-2">
                                                            (C.I: {atencion.cedula})
                                                        </span>
                                                    )}
                                                </h4>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
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
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <h6 className="font-semibold text-gray-700 mb-2">Detalles adicionales:</h6>
                                                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
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
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium cursor-pointer transition-colors duration-200"
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
                        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">
                                    {paciente.nombre}
                                </h3>
                                <p className="text-gray-600 text-sm">Cédula: {paciente.cedula}</p>
                            </div>
                            
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">Este paciente no tiene atenciones registradas</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
