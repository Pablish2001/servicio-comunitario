import { useToast } from '@/components/toast';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

interface Career {
    id: number;
    nombre: string;
}

interface Professional {
    id: number | string;
    nombre: string;
}

interface CreateProps {
    careers: Career[];
    professionals: Professional[];
    jornadaId: number | string;
}

interface CreateFormData {
    cedula: string;
    nombres: string;
    apellidos: string;
    genero: string;
    fecha_nacimiento: string;
    contacto: string;
    email: string;
    is_student: boolean;
    carrera_id: string;
    semestre: string;

    // atención
    sintomas: string;
    diagnostico: string;
    tratamiento: string;
    presion_arterial: string;
    temperatura: string;
    frecuencia_cardiaca: string;
    frecuencia_respiratoria: string;
    peso: string;
    saturacion: string;
    profesional_id: string;
    jornada_id: number | string;

    [key: string]: string | boolean | number;
}

export default function Create({ careers, professionals, jornadaId }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateFormData>({
        cedula: '',
        nombres: '',
        apellidos: '',
        genero: '',
        fecha_nacimiento: '',
        contacto: '',
        email: '',
        is_student: false,
        carrera_id: '',
        semestre: '',

        // atención
        sintomas: '',
        diagnostico: '',
        tratamiento: '',
        presion_arterial: '',
        temperatura: '',
        frecuencia_cardiaca: '',
        frecuencia_respiratoria: '',
        peso: '',
        saturacion: '',
        profesional_id: '',
        jornada_id: jornadaId,
    });

    const [fechaAtencion, setFechaAtencion] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        setFechaAtencion(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
    }, []);

    const lookupByCedula = async (cedula: string) => {
        if (!cedula) return;
        try {
            const res = await fetch(route('pacientes.lookup', cedula));
            const paciente = await res.json();
            if (paciente) {
                setData((prev) => ({
                    ...prev,
                    nombres: paciente.persona?.nombres ?? '',
                    apellidos: paciente.persona?.apellidos ?? '',
                    genero: paciente.persona?.genero ?? '',
                    fecha_nacimiento: paciente.fecha_nacimiento ?? '',
                    contacto: paciente.contacto ?? '',
                    email: paciente.persona?.email ?? '',
                    is_student: Boolean(paciente.carrera_id),
                    carrera_id: paciente.carrera_id ?? '',
                }));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('cedula', value);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => lookupByCedula(value), 500);
    };

    // Obtén la función showToast del contexto
    const { showToast } = useToast();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('atencions.store'), {
            onSuccess: () => {
                reset();

                showToast('¡Atención registrada correctamente!', 'success');
            },
        });
    };
    //console.log('professionals:', professionals);
    return (
        <AppLayout>
            <Head title="Atención a Pacientes" />
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#D3EBFF] p-4">
                <form onSubmit={submit} className="w-full max-w-5xl rounded-xl border border-[#D6EFFF] bg-white p-10 shadow-lg">
                    {/* Datos personales */}
                    <h2 className="mb-4 border-b border-[#D6EFFF] pb-2 text-2xl font-bold text-[#0E469A]">Datos Personales</h2>
                    <div className="mb-6 grid grid-cols-2 gap-6">
                        {/* Nombres */}
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">
                                Nombres <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.nombres}
                                onChange={(e) => setData('nombres', e.target.value)}
                                placeholder="Nombres del paciente"
                            />
                            {errors.nombres && <p className="text-sm text-red-600">{errors.nombres}</p>}
                        </div>
                        {/* Apellidos */}
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">
                                Apellidos <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.apellidos}
                                onChange={(e) => setData('apellidos', e.target.value)}
                                placeholder="Apellidos del paciente"
                            />
                            {errors.apellidos && <p className="text-sm text-red-600">{errors.apellidos}</p>}
                        </div>
                        {/* Cedula */}
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">
                                Cédula de Identidad <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.cedula}
                                onChange={onCedulaChange}
                                onBlur={() => lookupByCedula(data.cedula)}
                                placeholder="Cédula del paciente"
                            />
                            {errors.cedula && <p className="text-sm text-red-600">{errors.cedula}</p>}
                        </div>
                        {/* Género */}
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">
                                Género <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.genero}
                                onChange={(e) => setData('genero', e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                            {errors.genero && <p className="text-sm text-red-600">{errors.genero}</p>}
                        </div>
                        {/* Fecha nacimiento */}
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">Fecha de nacimiento</label>
                            <input
                                type="date"
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.fecha_nacimiento}
                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                            />
                            {errors.fecha_nacimiento && <p className="text-sm text-red-600">{errors.fecha_nacimiento}</p>}
                        </div>
                        {/* Contacto */}
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">
                                Número de teléfono <span className="text-gray-400">(Opcional)</span>
                            </label>
                            <input
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.contacto}
                                onChange={(e) => setData('contacto', e.target.value)}
                                placeholder="Número de teléfono"
                            />
                            {errors.contacto && <p className="text-sm text-red-600">{errors.contacto}</p>}
                        </div>
                        {/* Email */}
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">
                                Correo electrónico <span className="text-gray-400">(Opcional)</span>
                            </label>
                            <input
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Correo electrónico"
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Estudiante */}
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 h-5 w-5 accent-[#0368FE]"
                            checked={data.is_student}
                            onChange={(e) => setData('is_student', e.target.checked)}
                        />
                        <span className="text-[#0E469A]">Es estudiante de la universidad</span>
                    </div>

                    {data.is_student && (
                        <div className="mb-6 grid grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 block font-semibold text-[#0E469A]">Carrera</label>
                                <select
                                    className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                    value={data.carrera_id}
                                    onChange={(e) => setData('carrera_id', e.target.value)}
                                >
                                    <option value="">Seleccionar carrera</option>
                                    {careers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.carrera_id && <p className="text-sm text-red-600">{errors.carrera_id}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block font-semibold text-[#0E469A]">Semestre</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="9"
                                    className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                    value={data.semestre}
                                    onChange={(e) => setData('semestre', e.target.value)}
                                    placeholder="Semestre"
                                />
                                {errors.semestre && <p className="text-sm text-red-600">{errors.semestre}</p>}
                            </div>
                        </div>
                    )}

                    {/* Signos vitales */}
                    <h2 className="mb-4 border-b border-[#D6EFFF] pb-2 text-2xl font-bold text-[#0E469A]">Signos Vitales</h2>
                    <div className="mb-6 grid grid-cols-5 gap-6">
                        {(
                            [
                                { label: 'Presión arterial', field: 'presion_arterial', placeholder: '120/80 mmHg' },
                                { label: 'Temperatura', field: 'temperatura', placeholder: '36.5 ºC' },
                                { label: 'Ritmo cardíaco', field: 'frecuencia_cardiaca', placeholder: '80 lpm' },
                                { label: 'Frec. respiratoria', field: 'frecuencia_respiratoria', placeholder: '16 rpm' },
                                { label: 'Saturación O₂', field: 'saturacion', placeholder: '98%' },
                            ] as { label: string; field: keyof CreateFormData; placeholder: string }[]
                        ).map((item) => (
                            <div key={item.field}>
                                <label className="mb-2 block font-semibold text-[#0E469A]">{item.label}</label>
                                <input
                                    className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                    value={data[item.field] as string}
                                    onChange={(e) => setData(item.field, e.target.value)}
                                    placeholder={item.placeholder}
                                />
                                {errors[item.field] && <p className="text-sm text-red-600">{errors[item.field]}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Información de la consulta */}
                    <h2 className="mb-4 border-b border-[#D6EFFF] pb-2 text-2xl font-bold text-[#0E469A]">Información de la Consulta</h2>
                    <div className="mb-6">
                        <label className="mb-2 block font-semibold text-[#0E469A]">
                            Síntomas <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="min-h-[48px] w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                            value={data.sintomas}
                            onChange={(e) => setData('sintomas', e.target.value)}
                            placeholder="Descripción de los síntomas"
                        />
                        {errors.sintomas && <p className="text-sm text-red-600">{errors.sintomas}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block font-semibold text-[#0E469A]">Diagnóstico</label>
                        <textarea
                            className="min-h-[48px] w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                            value={data.diagnostico}
                            onChange={(e) => setData('diagnostico', e.target.value)}
                            placeholder="Diagnóstico del paciente"
                        />
                        {errors.diagnostico && <p className="text-sm text-red-600">{errors.diagnostico}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block font-semibold text-[#0E469A]">Tratamiento</label>
                        <textarea
                            className="min-h-[48px] w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                            value={data.tratamiento}
                            onChange={(e) => setData('tratamiento', e.target.value)}
                            placeholder="Tratamiento prescrito"
                        />
                        {errors.tratamiento && <p className="text-sm text-red-600">{errors.tratamiento}</p>}
                    </div>
                    <div className="mb-8 grid grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">
                                Atendido por <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                                value={data.profesional_id}
                                onChange={(e) => setData('profesional_id', e.target.value)}
                            >
                                <option value="">Seleccionar profesional</option>
                                {professionals.map((p: { id: number | string; nombre: string }) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.profesional_id && <p className="text-sm text-red-600">{errors.profesional_id}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block font-semibold text-[#0E469A]">Fecha de atención</label>
                            <input
                                type="datetime-local"
                                value={fechaAtencion}
                                readOnly
                                className="h-12 w-full rounded-lg border border-[#D6EFFF] bg-white px-4 py-3 text-base focus:ring-2 focus:ring-[#0368FE] focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-between gap-4">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg border border-[#0E469A] bg-[#EDF9FF] px-8 py-3 text-base font-bold text-[#0E469A] transition hover:bg-[#D6EFFF]"
                        >
                            Imprimir
                        </button>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                className="rounded-lg bg-gray-300 px-8 py-3 text-base font-bold text-gray-700 transition hover:bg-gray-400"
                            >
                                CANCELAR
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-green-500 px-8 py-3 text-base font-bold text-white transition hover:bg-green-600"
                            >
                                GUARDAR
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
Create.layout = (page: React.ReactNode) => <AppLayout children={page} />;
