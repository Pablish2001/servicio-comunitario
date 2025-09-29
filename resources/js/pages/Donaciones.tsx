// components/DonationForm.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, FilePlus, Pill, Plus, Trash2, Wrench } from 'lucide-react';
import React, { useState } from 'react';
import { ToastProvider, useToast } from '../components/toast';

interface ArticleMedicamento {
    id: string;
    name: string;
    description: string;
    presentacion: string;
    cantidad: number;
    unidad: string;
    estado: 'nuevo' | 'abierto' | 'usado';
    tipo: 'medicamento';
    expanded?: boolean;
}
interface ArticleHerramienta {
    id: string;
    name: string;
    description: string;
    categoria: string;
    cantidad: number;
    estado: 'nueva' | 'usada' | 'deteriorada';
    tipo: 'herramienta';
    expanded?: boolean;
}

type Props = {
    medicamentosSugeridos: any[];
    herramientasSugeridas: any[];
};
function DonationFormInner() {
    const [donor, setDonor] = useState('');
    const [articlesMedicamento, setArticlesMedicamento] = useState<ArticleMedicamento[]>([]);
    const [articlesHerramienta, setArticlesHerramienta] = useState<ArticleHerramienta[]>([]);
    const [newArticleM, setNewArticleM] = useState({
        name: '',
        description: '',
        tipo: 'medicamento',
        presentacion: '',
        cantidad: 0,
        unidad: '',
        estado: 'nuevo',
    });
    const [newArticleH, setNewArticleH] = useState({
        name: '',
        description: '',
        tipo: 'herramienta',
        categoria: '',
        cantidad: 0,
        estado: 'nueva',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState('medicamentos');

    const { medicamentosSugeridos = [], herramientasSugeridas = [] } = usePage<Props>().props;
    // segundo
    const addArticleFromFormH = () => {
        if (newArticleH.name.trim() && newArticleH.tipo) {
            const article: ArticleHerramienta = {
                id: Date.now().toString(),
                name: newArticleH.name.trim(),
                description: newArticleH.description.trim(),
                tipo: newArticleH.tipo as 'herramienta',
                expanded: false,
                categoria: newArticleH.categoria,
                cantidad: newArticleH.cantidad,
                estado: newArticleH.estado as 'nueva' | 'usada' | 'deteriorada',
            };
            setArticlesHerramienta([...articlesHerramienta, article]);
            setNewArticleH({ name: '', description: '', tipo: 'herramienta', categoria: '', cantidad: 0, estado: 'nueva' });
        }
    };

    const addArticleFromFormM = () => {
        if (newArticleM.name.trim() && newArticleM.tipo) {
            const article: ArticleMedicamento = {
                id: Date.now().toString(),
                name: newArticleM.name.trim(),
                description: newArticleM.description.trim(),
                tipo: newArticleM.tipo as 'medicamento',
                expanded: false,
                presentacion: newArticleM.presentacion,
                cantidad: newArticleM.cantidad,
                estado: newArticleM.estado as 'nuevo' | 'usado' | 'abierto',
                unidad: newArticleM.unidad,
            };
            setArticlesMedicamento([...articlesMedicamento, article]);
            setNewArticleM({ name: '', description: '', tipo: 'medicamento', presentacion: '', cantidad: 0, estado: 'nuevo', unidad: '' });
        }
    };

    const removeArticle = (id: string) => {
        setArticlesMedicamento(articlesMedicamento.filter((a) => a.id !== id));
        setArticlesHerramienta(articlesHerramienta.filter((a) => a.id !== id));
    };

    const toggleExpand = (id: string) => {
        setArticlesMedicamento(articlesMedicamento.map((a) => (a.id === id ? { ...a, expanded: !a.expanded } : a)));
        setArticlesHerramienta(articlesHerramienta.map((a) => (a.id === id ? { ...a, expanded: !a.expanded } : a)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validArticlesM = articlesMedicamento.filter((a) => a.name && a.tipo);
        const validArticlesH = articlesHerramienta.filter((a) => a.name && a.tipo);
        if (!donor || (validArticlesM.length === 0 && validArticlesH.length === 0)) return;

        setIsSubmitting(true);

        router.post(
            '/donaciones',
            {
                donor,
                articlesMedicamento: validArticlesM.map(({ name, description, tipo, cantidad, unidad, presentacion, estado }) => ({
                    name,
                    description,
                    tipo,
                    cantidad,
                    unidad,
                    presentacion,
                    estado,
                })),
                articlesHerramienta: validArticlesH.map(({ name, description, tipo, categoria, cantidad, estado }) => ({
                    name,
                    description,
                    tipo,
                    categoria,
                    cantidad,
                    estado,
                })),
            },
            {
                onSuccess: () => {
                    showToast('Donación registrada correctamente', 'success');
                    setDonor('');
                    setArticlesMedicamento([]);
                    setArticlesHerramienta([]);
                },
                onError: () => {
                    showToast('Verifica los datos ingresados', 'error');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Donaciones" />
            <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-xl space-y-4 rounded bg-white p-6 text-blue-800 shadow">
                {/* Formulario de donación */}
                <div className="mx-auto max-w-4xl space-y-6 p-6">
                    <div className="space-y-2 text-center">
                        <h2 className="flex w-full items-center gap-2 text-xl font-bold">
                            <FilePlus className="ml-30 h-6" /> Registrar Donación
                        </h2>
                        <p className="text-muted-foreground">Sistema de registro para donaciones médicas</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-2 grid w-full grid-cols-2 bg-white dark:bg-white">
                            <TabsTrigger
                                value="medicamentos"
                                className="flex items-center gap-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:data-[state=active]:bg-blue-700"
                            >
                                <Pill className="h-4 w-4" />
                                Medicamentos
                            </TabsTrigger>
                            <TabsTrigger
                                value="herramientas"
                                className="flex items-center gap-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:data-[state=active]:bg-blue-700"
                            >
                                <Wrench className="h-4 w-4" />
                                Herramientas Médicas
                            </TabsTrigger>
                        </TabsList>
                        <div className="mb-2">
                            <Label className="block font-medium">Nombre del donante</Label>
                            <Input
                                type="text"
                                value={donor}
                                onChange={(e) => setDonor(e.target.value)}
                                required
                                className="w-full rounded border border-blue-300 px-3 py-2"
                            />
                        </div>

                        <TabsContent value="medicamentos" className="space-y-6">
                            <Card className="text-blue border border-blue-300 bg-white dark:bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pill className="h-5 w-5" />
                                        Registro de Medicamentos
                                    </CardTitle>
                                    <CardDescription>Ingresa los datos del medicamento donado</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="block font-medium" htmlFor="med-nombre">
                                                Nombre del Medicamento *
                                            </Label>
                                            <Input
                                                id="med-nombre"
                                                placeholder="Ej: Paracetamol"
                                                value={newArticleM.name}
                                                onChange={(e) => setNewArticleM({ ...newArticleM, name: e.target.value })}
                                                list="medicamentos-sugeridos"
                                                className="w-full rounded border border-blue-300 px-3 py-2"
                                            />
                                            <datalist id="medicamentos-sugeridos">
                                                {medicamentosSugeridos.map((med: string, index: number) => (
                                                    <option key={index} value={med} />
                                                ))}
                                            </datalist>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="block font-medium" htmlFor="med-nombre">
                                                Descripcion
                                            </Label>
                                            <textarea
                                                placeholder="Descripción"
                                                value={newArticleM.description}
                                                onChange={(e) => setNewArticleM({ ...newArticleM, description: e.target.value })}
                                                className="w-full rounded border border-blue-300 px-3 py-2"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="med-presentacion">Presentación</Label>
                                            <div className="w-full rounded border border-blue-300 px-0 py-0">
                                                <Select
                                                    value={newArticleM.presentacion}
                                                    onValueChange={(value) => setNewArticleM({ ...newArticleM, presentacion: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder="Seleccionar presentación"
                                                            className="w-full rounded border border-blue-300 px-3 py-2"
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Suspension">Suspensión</SelectItem>
                                                        <SelectItem value="Tabletas">Tabletas</SelectItem>
                                                        <SelectItem value="Solucion">Solución</SelectItem>
                                                        <SelectItem value="Jarabe">Jarabe</SelectItem>
                                                        <SelectItem value="Crema">Crema</SelectItem>
                                                        <SelectItem value="Gotas">Gotas</SelectItem>
                                                        <SelectItem value="Inyectable">Inyectable</SelectItem>
                                                        <SelectItem value="Otro">Otro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="med-cantidad">Cantidad *</Label>
                                            <Input
                                                className="w-full rounded border border-blue-300 px-3 py-2"
                                                id="med-cantidad"
                                                type="number"
                                                placeholder="Ej: 20"
                                                value={newArticleM.cantidad}
                                                onChange={(e) => setNewArticleM({ ...newArticleM, cantidad: e.target.valueAsNumber })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="med-unidad">Unidad</Label>
                                            <div className="w-full rounded border border-blue-300 px-0 py-0">
                                                <Select
                                                    value={newArticleM.unidad}
                                                    onValueChange={(value) => setNewArticleM({ ...newArticleM, unidad: value })}
                                                >
                                                    <SelectTrigger className="w-full rounded px-3 py-2 focus:outline-none">
                                                        <SelectValue placeholder="Unidad de medida" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Unidades">Unidades</SelectItem>
                                                        <SelectItem value="Cajas">Cajas</SelectItem>
                                                        <SelectItem value="Tabletas">Tabletas</SelectItem>
                                                        <SelectItem value="Frascos">Frascos</SelectItem>
                                                        <SelectItem value="Mililitros">Mililitros (ml)</SelectItem>
                                                        <SelectItem value="Miligramos">Miligramos (mg)</SelectItem>
                                                        <SelectItem value="Gramos">Gramos (g)</SelectItem>
                                                        <SelectItem value="Otro">Otro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="med-estado">Estado</Label>
                                            <div className="w-full rounded border border-blue-300 px-0 py-0">
                                                <Select
                                                    value={newArticleM.estado}
                                                    onValueChange={(value) => setNewArticleM({ ...newArticleM, estado: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="nuevo">Nuevo/Sellado</SelectItem>
                                                        <SelectItem value="abierto">Abierto</SelectItem>
                                                        <SelectItem value="usado">Parcialmente usado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="button" onClick={addArticleFromFormM} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar articulo
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="herramientas" className="space-y-6">
                            <Card className="text-blue border border-blue-300 bg-white dark:bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wrench className="h-5 w-5" />
                                        Registro de Herramientas Médicas
                                    </CardTitle>
                                    <CardDescription>Ingresa los datos de la herramienta o suministro médico</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="her-nombre">Nombre del Artículo *</Label>
                                            <Input
                                                id="her-nombre"
                                                placeholder="Ej: Guantes desechables"
                                                value={newArticleH.name}
                                                onChange={(e) => setNewArticleH({ ...newArticleH, name: e.target.value })}
                                                list="herramientas-sugeridas"
                                                className="border border-blue-300"
                                            />
                                            <datalist id="herramientas-sugeridas">
                                                {herramientasSugeridas.map((her: string, index: number) => (
                                                    <option key={index} value={her} />
                                                ))}
                                            </datalist>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="her-categoria">Categoría</Label>
                                            <div className="w-full rounded border border-blue-300 px-0 py-0">
                                                <Select
                                                    value={newArticleH.categoria}
                                                    onValueChange={(value) => setNewArticleH({ ...newArticleH, categoria: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar categoría" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="quirurgica">Instrumental Quirúrgico</SelectItem>
                                                        <SelectItem value="diagnostico">Instrumental de Diagnóstico</SelectItem>
                                                        <SelectItem value="proteccion">Equipo de Protección</SelectItem>
                                                        <SelectItem value="curacion">Material de Curación</SelectItem>
                                                        <SelectItem value="otro">Otro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="her-cantidad">Cantidad *</Label>
                                            <Input
                                                className="border border-blue-300"
                                                id="her-cantidad"
                                                type="number"
                                                placeholder="Ej: 100"
                                                value={newArticleH.cantidad}
                                                onChange={(e) => setNewArticleH({ ...newArticleH, cantidad: e.target.valueAsNumber })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="her-estado">Estado</Label>
                                            <div className="w-full rounded border border-blue-300 px-0 py-0">
                                                <Select
                                                    value={newArticleH.estado}
                                                    onValueChange={(value) =>
                                                        setNewArticleH({ ...newArticleH, estado: value as 'nueva' | 'usada' | 'deteriorada' })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="nueva">Nuevo</SelectItem>
                                                        <SelectItem value="usada">Usado - Buen Estado</SelectItem>
                                                        <SelectItem value="deteriorada">Necesita Reparación</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="her-descripcion">Descripción/Observaciones</Label>
                                            <Textarea
                                                id="her-descripcion"
                                                placeholder="Detalles adicionales, marca, modelo, condiciones especiales..."
                                                value={newArticleH.description}
                                                onChange={(e) => setNewArticleH({ ...newArticleH, description: e.target.value })}
                                                rows={3}
                                                className="border border-blue-300 bg-white dark:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <Button type="button" onClick={addArticleFromFormH} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar articulo
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
                {articlesHerramienta.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto rounded border border-blue-200 p-3">
                        <h4 className="mb-2 font-semibold">Artículos de herramienta agregados</h4>
                        <ul className="space-y-2">
                            {articlesHerramienta.map((a) => (
                                <li key={a.id} className="rounded bg-blue-50 p-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {a.name} ({a.tipo})
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => toggleExpand(a.id)} className="text-blue-700 hover:underline">
                                                {a.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </button>
                                            <button type="button" onClick={() => removeArticle(a.id)} className="text-red-600 hover:underline">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {a.expanded && (
                                        <div className="mt-2 text-sm text-blue-900">
                                            <div>
                                                <strong>Categoría:</strong> {a.categoria || 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Cantidad:</strong> {a.cantidad}
                                            </div>
                                            <div>
                                                <strong>Estado:</strong> {a.estado}
                                            </div>
                                            <div>
                                                <strong>Descripción:</strong> {a.description || 'Sin descripción'}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {articlesMedicamento.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto rounded border border-blue-200 p-3">
                        <h4 className="mb-2 font-semibold">Artículos de medicamentos agregados</h4>
                        <ul className="space-y-2">
                            {articlesMedicamento.map((a) => (
                                <li key={a.id} className="rounded bg-blue-50 p-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {a.name} ({a.tipo})
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => toggleExpand(a.id)} className="text-blue-700 hover:underline">
                                                {a.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </button>
                                            <button type="button" onClick={() => removeArticle(a.id)} className="text-red-600 hover:underline">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {a.expanded && (
                                        <div className="mt-2 text-sm text-blue-900">
                                            <div>
                                                <strong>Presentacion:</strong> {a.presentacion || 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Unidad:</strong> {a.unidad || 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Cantidad:</strong> {a.cantidad}
                                            </div>
                                            <div>
                                                <strong>Estado:</strong> {a.estado}
                                            </div>
                                            <div>
                                                <strong>Descripción:</strong> {a.description || 'Sin descripción'}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Formulario de donación */}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Guardar Donación'}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

export default function DonationForm() {
    return (
        <ToastProvider>
            <DonationFormInner />
        </ToastProvider>
    );
}
