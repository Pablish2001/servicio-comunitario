import { router } from '@inertiajs/react';
import React, { useState } from "react";
import { ToastProvider, useToast } from "@/components/toast";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePage } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

function JornadasInner() {
  const { jornada, todosUsuarios } = usePage().props as any;
  const [busqueda, setBusqueda] = useState("");
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<any>(null);
  const { showToast } = useToast();

  // Si hay jornada activa, extrae personal y fecha
  type Personal = { nombre: string; status: string; hora: string; id?: number };
  // Presentes: usuarios que tengan al menos una acción de entrada sin una salida posterior
  const presentesFull = (jornada?.users || []).filter((u: any) => {
    if (!u.acciones || u.acciones.length === 0) return false;
    // Cuenta entradas y salidas
    const entradas = u.acciones.filter((a: any) => a.tipo === 'entrada').length;
    const ausentes = u.acciones.filter((a: any) => a.tipo === 'ausente').length;
    return entradas > ausentes;
  });
  const presentes: Personal[] = presentesFull.map((u: any): Personal => ({
    nombre: (u.persona?.nombre || "") + " " + (u.persona?.apellido || ""),
    status: 'presente',
    hora: u.acciones && u.acciones.length > 0 ? new Date(u.acciones.filter((a: any) => a.tipo === 'entrada').slice(-1)[0]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
    id: u.id
  })) || [];

  // IDs de usuarios presentes
  const presentesIds = new Set(presentes.map((u: any) => u.id));

  // Ausentes: todos los usuarios del sistema que NO estén presentes
  const ausentes: Personal[] = (todosUsuarios || []).filter((u: any) => !presentesIds.has(u.id)).map((u: any): Personal => ({
    nombre: (u.persona?.nombre || "") + " " + (u.persona?.apellido || ""),
    status: 'ausente',
    hora: '-' // No hay hora de entrada
  }));
  const fechaJornada = jornada?.fecha_inicio ? new Date(jornada.fecha_inicio).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;

  // Filtrado de presentes por búsqueda
  const presentesFiltrados = presentes.filter((p: Personal) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  // Filtrado de ausentes por búsqueda
  const ausentesFiltrados = ausentes.filter((p: Personal) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleFinalizarJornada = () => {
    router.post('/jornada/finalizar', {}, {
      onSuccess: () => {
        showToast('Jornada finalizada exitosamente.', 'success');
      },
      onError: (errors) => {
        showToast(errors.jornada || 'No se pudo finalizar la jornada.', 'error');
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Gestión de Jornada" />
      <div className="min-h-screen bg-[#BEE5FA] flex flex-col items-center justify-center p-6">
        {/* Dialog de confirmación para sacar personal */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Sacar a {userToRemove?.nombre} de la jornada?</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-600">Esta acción marcará al usuario como "salida" en la jornada actual.</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (!userToRemove) return;
                  router.post(
                    '/jornada/quitar-personal',
                    { user_id: userToRemove.id },
                    {
                      preserveScroll: true,
                      onSuccess: (page) => {
                        showToast(((page.props as any)?.flash?.success || 'Usuario marcado como salida.'), 'success');
                        setDialogOpen(false);
                        setUserToRemove(null);
                        router.reload({ only: ['jornada', 'todosUsuarios'] });
                      },
                      onError: (errors) => {
                        showToast(errors?.message || 'No se pudo sacar el usuario.', 'error');
                      },
                      onFinish: () => {},
                    }
                  );
                }}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex gap-8 w-full max-w-7xl">
          {/* Panel izquierdo: Presentes */}
          <div className="bg-[#F7F5F7] rounded-2xl p-6 flex flex-col gap-4 w-[400px] shadow-md">
            <div className="relative mb-2">
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              <Input
                placeholder="Buscar personal"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border border-gray-200 bg-white text-base px-10 py-3 rounded-lg pl-10"
              />
            </div>
            <div className="mb-2 font-bold text-[#0E469A]">Presentes</div>
            {presentesFiltrados.length === 0 && <div className="text-gray-400">Nadie presente</div>}
            {presentesFiltrados.map((p: Personal, idx: number) => (
              <div
                key={p.id || p.nombre + idx}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow border border-[#D6EFFF] mb-1"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-200 text-green-700 px-2 py-1 font-bold">🟢</span>
                  <span className="font-semibold text-[#0368FE]">{p.nombre}</span>
                  <span className="text-xs text-green-700 ml-2">{p.hora}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-red-100 text-red-500"
                  title="Sacar de la jornada"
                  onClick={() => {
                    setUserToRemove(p);
                    setDialogOpen(true);
                  }}
                >
                  <span role="img" aria-label="Sacar">↩️</span>
                </Button>
              </div>
            ))}
            <div className="mt-4 mb-2 font-bold text-[#0E469A]">Ausentes</div>
            {ausentesFiltrados.length === 0 && <div className="text-gray-400">No hay ausentes</div>}
            {ausentesFiltrados.map((p: Personal, idx: number) => (
              <div
                key={p.nombre + idx}
                className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 shadow border border-[#D6EFFF] mb-1"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-300 text-gray-500 px-2 py-1 font-bold">⚪</span>
                  <span className="font-semibold text-[#A0A0A0]">{p.nombre}</span>
                </div>
                <span className="text-xs text-gray-400">{p.status}</span>
              </div>
            ))}
          </div>

          {/* Panel derecho: Jornadas */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-md flex flex-col gap-6">
            {/* Jornadas actuales y pasadas */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="bg-[#36A2F7] text-white px-4 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                  <span role="img" aria-label="calendar">📅</span> {fechaJornada || 'No hay jornada activa'}
                </span>
                {jornada && (
                  <Button onClick={() => setFinalizarDialogOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold">Finalizar Jornada</Button>
                )}
              </div>
              {/* Historial de la jornada actual: solo última acción de cada usuario */}
               {jornada?.users?.map((u: any, i: number) => {
  const nombre = (u.persona?.nombre || "") + " " + (u.persona?.apellido || "");
  // Mostrar solo la última entrada y salida
  const entrada = u.acciones?.filter((a: any) => a.tipo === 'entrada').slice(-1)[0]?.timestamp;
  const salida = u.acciones?.filter((a: any) => a.tipo === 'ausente').slice(-1)[0]?.timestamp;
  return (
    <div key={u.id || nombre + i} className="bg-white border rounded-lg p-4 mb-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 shadow-sm">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-[#36A2F7] text-2xl">👤</span>
        <span className="font-bold text-black text-base">{nombre}</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
        <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">ENTRADA: {entrada ? new Date(entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded ${salida ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>SALIDA: {salida ? new Date(salida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
      </div>
    </div>
  );
})}
            </div>
          </div>
        </div>

        {/* Inputs para agregar personal */}
        <div className="flex justify-center mt-8 w-full max-w-4xl">
          <form
  onSubmit={async (e) => {
    e.preventDefault();
    await router.post(
      '/jornada/agregar-personal',
      { cedula, password },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          showToast(((page.props as any)?.flash?.success || 'Personal agregado a la jornada.'), 'success');
          setCedula('');
          setPassword('');
          setTimeout(() => router.reload({ only: ['jornada', 'todosUsuarios'], preserveUrl: true }), 250); // Forzar recarga
        },
        onError: (errors) => {
          showToast(errors?.cedula || errors?.password || 'No se pudo agregar el personal.', 'error');
        },
        onFinish: () => {},
      }
    );
  }}
  className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#E0EFFF] animate-fade-in"
>
  <h2 className="text-xl font-bold text-[#0368FE] mb-2 text-center">Agregar Personal a la Jornada</h2>
  <Input
    type="text"
    placeholder="Cédula del personal"
    value={cedula}
    onChange={(e) => setCedula(e.target.value)}
    className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base shadow-md focus:ring-2 focus:ring-[#0368FE] focus:border-[#0368FE] placeholder:text-gray-400"
    autoFocus
    required
  />
  <Input
    type="password"
    placeholder="Contraseña"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base shadow-md focus:ring-2 focus:ring-[#0368FE] focus:border-[#0368FE] placeholder:text-gray-400"
    required
  />
  <Button type="submit" className="bg-[#0368FE] text-white font-bold mt-2 transition-all hover:bg-[#0356d6] shadow">Agregar</Button>
</form>
        </div>

        {/* Dialog de confirmación para finalizar jornada */}
        <Dialog open={finalizarDialogOpen} onOpenChange={setFinalizarDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Finalizar la jornada?</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-600">Esta acción cerrará la jornada actual y no se podrá modificar.</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFinalizarDialogOpen(false)}>Cancelar</Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  handleFinalizarJornada();
                  setFinalizarDialogOpen(false);
                }}
              >
                Finalizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
}

export default function Jornadas() {
  return (
    <ToastProvider>
      <JornadasInner />
    </ToastProvider>
  );
}