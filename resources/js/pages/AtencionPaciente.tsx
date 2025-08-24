import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('atencions.store'), {
      onSuccess: () => reset(),
    });
  };
  //console.log('professionals:', professionals);
  return (
    <AppLayout>
      <Head title="Atención a Pacientes" />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-[#D3EBFF]">
        <form onSubmit={submit} className="w-full max-w-5xl rounded-xl bg-white p-10 shadow-lg border border-[#D6EFFF]">
          {/* Datos personales */}
          <h2 className="text-2xl font-bold text-[#0E469A] mb-4 border-b border-[#D6EFFF] pb-2">Datos Personales</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Nombres */}
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">
                Nombres <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.nombres}
                onChange={(e) => setData('nombres', e.target.value)}
                placeholder="Nombres del paciente"
              />
              {errors.nombres && <p className="text-red-600 text-sm">{errors.nombres}</p>}
            </div>
            {/* Apellidos */}
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.apellidos}
                onChange={(e) => setData('apellidos', e.target.value)}
                placeholder="Apellidos del paciente"
              />
              {errors.apellidos && <p className="text-red-600 text-sm">{errors.apellidos}</p>}
            </div>
            {/* Cedula */}
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">
                Cédula de Identidad <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.cedula}
                onChange={onCedulaChange}
                onBlur={() => lookupByCedula(data.cedula)}
                placeholder="Cédula del paciente"
              />
              {errors.cedula && <p className="text-red-600 text-sm">{errors.cedula}</p>}
            </div>
            {/* Género */}
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">
                Género <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.genero}
                onChange={(e) => setData('genero', e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
              {errors.genero && <p className="text-red-600 text-sm">{errors.genero}</p>}
            </div>
            {/* Fecha nacimiento */}
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">Fecha de nacimiento</label>
              <input
                type="date"
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.fecha_nacimiento}
                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
              />
              {errors.fecha_nacimiento && <p className="text-red-600 text-sm">{errors.fecha_nacimiento}</p>}
            </div>
            {/* Contacto */}
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">
                Número de teléfono <span className="text-gray-400">(Opcional)</span>
              </label>
              <input
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.contacto}
                onChange={(e) => setData('contacto', e.target.value)}
                placeholder="Número de teléfono"
              />
              {errors.contacto && <p className="text-red-600 text-sm">{errors.contacto}</p>}
            </div>
            {/* Email */}
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">
                Correo electrónico <span className="text-gray-400">(Opcional)</span>
              </label>
              <input
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Correo electrónico"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>
          </div>
  
          {/* Estudiante */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              className="mr-2 w-5 h-5 accent-[#0368FE]"
              checked={data.is_student}
              onChange={(e) => setData('is_student', e.target.checked)}
            />
            <span className="text-[#0E469A]">Es estudiante de la universidad</span>
          </div>
  
          {data.is_student && (
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[#0E469A] font-semibold mb-2">Carrera</label>
                <select
                  className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
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
                {errors.carrera_id && <p className="text-red-600 text-sm">{errors.carrera_id}</p>}
              </div>
              <div>
                <label className="block text-[#0E469A] font-semibold mb-2">Semestre</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                  value={data.semestre}
                  onChange={(e) => setData('semestre', e.target.value)}
                  placeholder="Semestre"
                />
                {errors.semestre && <p className="text-red-600 text-sm">{errors.semestre}</p>}
              </div>
            </div>
          )}
  
          {/* Signos vitales */}
          <h2 className="text-2xl font-bold text-[#0E469A] mb-4 border-b border-[#D6EFFF] pb-2">Signos Vitales</h2>
          <div className="grid grid-cols-5 gap-6 mb-6">
            {([
              { label: 'Presión arterial', field: 'presion_arterial', placeholder: '120/80 mmHg' },
              { label: 'Temperatura', field: 'temperatura', placeholder: '36.5 ºC' },
              { label: 'Ritmo cardíaco', field: 'frecuencia_cardiaca', placeholder: '80 lpm' },
              { label: 'Frec. respiratoria', field: 'frecuencia_respiratoria', placeholder: '16 rpm' },
              { label: 'Saturación O₂', field: 'saturacion', placeholder: '98%' },
            ] as {label: string; field: keyof CreateFormData; placeholder: string}[]).map((item) => (
              <div key={item.field}>
                <label className="block text-[#0E469A] font-semibold mb-2">{item.label}</label>
                <input
                  className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                  value={data[item.field] as string}
                  onChange={e => setData(item.field, e.target.value)}
                  placeholder={item.placeholder}
                />
                {errors[item.field] && (
                  <p className="text-red-600 text-sm">{errors[item.field]}</p>
                )}
              </div>
            ))}
          </div>
  
          {/* Información de la consulta */}
          <h2 className="text-2xl font-bold text-[#0E469A] mb-4 border-b border-[#D6EFFF] pb-2">Información de la Consulta</h2>
          <div className="mb-6">
            <label className="block text-[#0E469A] font-semibold mb-2">
              Síntomas <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full min-h-[48px] px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
              value={data.sintomas}
              onChange={(e) => setData('sintomas', e.target.value)}
              placeholder="Descripción de los síntomas"
            />
            {errors.sintomas && <p className="text-red-600 text-sm">{errors.sintomas}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-[#0E469A] font-semibold mb-2">Diagnóstico</label>
            <textarea
              className="w-full min-h-[48px] px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
              value={data.diagnostico}
              onChange={(e) => setData('diagnostico', e.target.value)}
              placeholder="Diagnóstico del paciente"
            />
            {errors.diagnostico && <p className="text-red-600 text-sm">{errors.diagnostico}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-[#0E469A] font-semibold mb-2">Tratamiento</label>
            <textarea
              className="w-full min-h-[48px] px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
              value={data.tratamiento}
              onChange={(e) => setData('tratamiento', e.target.value)}
              placeholder="Tratamiento prescrito"
            />
            {errors.tratamiento && <p className="text-red-600 text-sm">{errors.tratamiento}</p>}
          </div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">
                Atendido por <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
                value={data.profesional_id}
                onChange={(e) => setData('profesional_id', e.target.value)}
              >
                <option value="">Seleccionar profesional</option>
                {professionals.map((p: {id: number|string, nombre: string}) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              {errors.profesional_id && <p className="text-red-600 text-sm">{errors.profesional_id}</p>}
            </div>
            <div>
              <label className="block text-[#0E469A] font-semibold mb-2">Fecha de atención</label>
              <input
                type="datetime-local"
                value={fechaAtencion}
                readOnly
                className="w-full h-12 px-4 py-3 border border-[#D6EFFF] rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0368FE]"
              />
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold border border-[#0E469A] bg-[#EDF9FF] text-[#0E469A] text-base hover:bg-[#D6EFFF] transition"
            >
              Imprimir
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-8 py-3 rounded-lg font-bold bg-gray-300 text-gray-700 text-base hover:bg-gray-400 transition"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-8 py-3 rounded-lg font-bold bg-green-500 text-white text-base hover:bg-green-600 transition"
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
