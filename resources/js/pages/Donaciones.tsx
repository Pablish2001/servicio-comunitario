// components/DonationForm.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, FilePlus, PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ToastProvider, useToast } from '../components/toast';

interface Article {
    id: string;
    name: string;
    description: string;
    tipo: 'medicamento' | 'herramienta';
    expanded?: boolean;
}

function DonationFormInner() {
    const [donor, setDonor] = useState('');
    const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
    const [articles, setArticles] = useState<Article[]>([]);
    const [newArticle, setNewArticle] = useState({ name: '', description: '', tipo: 'medicamento' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const addArticleFromForm = () => {
        if (newArticle.name.trim() && newArticle.tipo) {
            const article: Article = {
                id: Date.now().toString(),
                name: newArticle.name.trim(),
                description: newArticle.description.trim(),
                tipo: newArticle.tipo as 'medicamento' | 'herramienta',
                expanded: false,
            };
            setArticles([...articles, article]);
            setNewArticle({ name: '', description: '', tipo: 'medicamento' });
        }
    };

    const removeArticle = (id: string) => {
        setArticles(articles.filter((a) => a.id !== id));
    };

    const toggleExpand = (id: string) => {
        setArticles(articles.map((a) => (a.id === id ? { ...a, expanded: !a.expanded } : a)));
    };

    const updateDescription = (id: string, value: string) => {
        setArticles(articles.map((a) => (a.id === id ? { ...a, description: value } : a)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validArticles = articles.filter((a) => a.name && a.tipo);
        if (!donor || validArticles.length === 0) return;

        setIsSubmitting(true);

        router.post(
            '/donaciones',
            {
                donor,
                date,
                articles: validArticles.map(({ name, description, tipo }) => ({ name, description, tipo })),
            },
            {
                onSuccess: () => {
                    showToast('Donación registrada correctamente', 'success');
                    setDonor('');
                    setArticles([]);
                    setNewArticle({ name: '', description: '', tipo: 'medicamento' });
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
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                    <FilePlus className="h-6 w-6" /> Registrar Donación
                </h2>

                <div>
                    <label className="block font-medium">Nombre del donante</label>
                    <input
                        type="text"
                        value={donor}
                        onChange={(e) => setDonor(e.target.value)}
                        required
                        className="w-full rounded border border-blue-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Fecha</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full rounded border border-blue-300 px-3 py-2"
                    />
                </div>

                <div className="border-t pt-4">
                    <h3 className="mb-2 font-semibold">Agregar Artículo</h3>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Nombre del artículo"
                            value={newArticle.name}
                            onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                            className="w-full rounded border border-blue-300 px-3 py-2"
                        />
                        <textarea
                            placeholder="Descripción"
                            value={newArticle.description}
                            onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                            className="w-full rounded border border-blue-300 px-3 py-2"
                        />
                        <select
                            value={newArticle.tipo}
                            onChange={(e) => setNewArticle({ ...newArticle, tipo: e.target.value as 'medicamento' | 'herramienta' })}
                            className="w-full rounded border border-blue-300 px-3 py-2"
                        >
                            <option value="medicamento">Medicamento</option>
                            <option value="herramienta">Herramienta</option>
                        </select>
                        <button
                            type="button"
                            onClick={addArticleFromForm}
                            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            <PlusCircle className="h-5 w-5" /> Agregar artículo
                        </button>
                    </div>
                </div>

                {articles.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto rounded border border-blue-200 p-3">
                        <h4 className="mb-2 font-semibold">Artículos agregados</h4>
                        <ul className="space-y-2">
                            {articles.map((a) => (
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
                                        <textarea
                                            value={a.description}
                                            onChange={(e) => updateDescription(a.id, e.target.value)}
                                            className="mt-2 w-full rounded border border-blue-300 px-2 py-1"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
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
