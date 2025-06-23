import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

// Icono de impresora SVG
const PrinterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V4a1 1 0 011-1h10a1 1 0 011 1v5m-12 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2zm2 7h8m-8 0v2a1 1 0 001 1h6a1 1 0 001-1v-2m-8 0h8" />
  </svg>
);

export default function AtencionPaciente() {
    const [isStudent, setIsStudent] = useState(false);
    const [fechaAtencion, setFechaAtencion] = useState('');

    useEffect(() => {
        // Obtener fecha y hora actual en formato YYYY-MM-DDTHH:MM para input type="datetime-local"
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        setFechaAtencion(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
    }, []);

    return (
        <AppLayout>
            <Head title="Atención a Pacientes" />
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-[#D3EBFF]">
                <div className="w-full max-w-5xl rounded-xl bg-white p-10 shadow-lg border border-[#D6EFFF]">
                    {/* Datos personales */}
                    <h2 className="text-2xl font-bold text-[#0E469A] mb-4 border-b border-[#D6EFFF] pb-2">Datos Personales</h2>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Nombres <span className="text-red-500">*</span></label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Nombres del paciente" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Apellidos <span className="text-red-500">*</span></label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Apellidos del paciente" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Cédula de Identidad <span className="text-red-500">*</span></label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Cédula del paciente" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Género <span className="text-red-500">*</span></label>
                            <select className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]">
                                <option>Seleccionar</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Fecha de nacimiento</label>
                            <input type="date" className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Número de teléfono <span className="text-gray-400">(Opcional)</span></label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Número de teléfono" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Correo electrónico <span className="text-gray-400">(Opcional)</span></label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Correo electrónico" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Organización <span className="text-red-500">*</span></label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Organización" />
                        </div>
                    </div>
                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            className="mr-2 w-5 h-5 accent-[#0368FE]"
                            checked={isStudent}
                            onChange={e => setIsStudent(e.target.checked)}
                        />
                        <span className="text-[#0E469A]">Es estudiante de la universidad</span>
                    </div>
                    {isStudent && (
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-[#0E469A] font-semibold mb-2">Carrera</label>
                                <select className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]">
                                    <option>Seleccionar</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#0E469A] font-semibold mb-2">Semestre</label>
                                <select className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]">
                                    <option>Seleccionar</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {/* Signos vitales */}
                    <h2 className="text-2xl font-bold text-[#0E469A] mb-4 border-b border-[#D6EFFF] pb-2">Signos Vitales</h2>
                    <div className="grid grid-cols-5 gap-6 mb-6">
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Presión arterial</label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="120/80 mmHg" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Temperatura</label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="36.5 ºC" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Ritmo cardíaco</label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="80 lpm" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Frec. respiratoria</label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="16 rpm" />
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Saturación O₂</label>
                            <input className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="98%" />
                        </div>
                    </div>
                    {/* Información de la consulta */}
                    <h2 className="text-2xl font-bold text-[#0E469A] mb-4 border-b border-[#D6EFFF] pb-2">Información de la Consulta</h2>
                    <div className="mb-6">
                        <label className="block text-[#0E469A] font-semibold mb-2">Síntomas <span className="text-red-500">*</span></label>
                        <textarea className="w-full min-h-[48px] px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Descripción de los síntomas" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-[#0E469A] font-semibold mb-2">Diagnóstico <span className="text-red-500">*</span></label>
                        <textarea className="w-full min-h-[48px] px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Diagnóstico del paciente" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-[#0E469A] font-semibold mb-2">Tratamiento</label>
                        <textarea className="w-full min-h-[48px] px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" placeholder="Tratamiento prescrito" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Atendido por <span className="text-red-500">*</span></label>
                            <select className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]">
                                <option>Seleccionar profesional</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#0E469A] font-semibold mb-2">Fecha de atención</label>
                            <input type="datetime-local" value={fechaAtencion} readOnly className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]" />
                        </div>
                    </div>
                    <div className="flex justify-between gap-4 mt-8">
                        <button type="button" className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold border border-[#0E469A] bg-[#EDF9FF] text-[#0E469A] text-base hover:bg-[#D6EFFF] transition">
                            <PrinterIcon /> Imprimir
                        </button>
                        <div className="flex gap-4">
                            <button type="button" className="px-8 py-3 rounded-lg font-bold bg-gray-300 text-gray-700 text-base hover:bg-gray-400 transition">CANCELAR</button>
                            <button type="submit" className="px-8 py-3 rounded-lg font-bold bg-green-500 text-white text-base hover:bg-green-600 transition">GUARDAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

