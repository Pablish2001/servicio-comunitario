<?php

namespace App\Http\Controllers;

use App\Models\Donacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Medicamento;
use App\Models\Herramienta;

class DonacionController extends Controller
{
    public function index()
    {
        $medicamentosSugeridos = Item::where('tipo', 'medicamento')->pluck('nombre');
        $herramientasSugeridas = Item::where('tipo', 'herramienta')->pluck('nombre');

        return Inertia::render('Donaciones', [
            'medicamentosSugeridos' => $medicamentosSugeridos,
            'herramientasSugeridas' => $herramientasSugeridas,
        ]);
    }

    public function store(Request $request)
    {
        $sedeId = session('sede.id');

        if (! $sedeId) {
            return redirect()->back()->with('error', 'No se ha seleccionado una sede válida.');
        }
        $request->validate([
            'donor' => 'required|string|max:255',
            'articlesMedicamento' => 'array',
            'articlesMedicamento.*.name' => 'required|string|max:255',
            'articlesMedicamento.*.description' => 'nullable|string',
            'articlesMedicamento.*.tipo' => 'required|in:medicamento',
            'articlesMedicamento.*.cantidad' => 'required|integer|min:1',
            'articlesMedicamento.*.unidad' => 'required|string|max:255',
            'articlesMedicamento.*.presentacion' => 'required|string|max:255',
            'articlesHerramienta' => 'array',
            'articlesHerramienta.*.name' => 'required|string|max:255',
            'articlesHerramienta.*.description' => 'nullable|string',
            'articlesHerramienta.*.tipo' => 'required|in:herramienta',
            'articlesHerramienta.*.cantidad' => 'required|integer|min:1',
            'articlesHerramienta.*.categoria' => 'required|string|max:255',
            'articlesHerramienta.*.estado' => 'required|in:nueva,usada,deteriorada',
        ]);
        if (
            (! $request->articlesMedicamento || count($request->articlesMedicamento) === 0) &&
            (! $request->articlesHerramienta || count($request->articlesHerramienta) === 0)
        ) {
            return redirect()->back()->with('error', 'Debe agregar al menos un medicamento o una herramienta.');
        }

        foreach ($request->articlesMedicamento as $article) {
            Donacion::create([
                'nombre' => $request->donor,
                'data' => now(),
                'nombre_articulo' => $article['name'],
                'descripcion' => $article['description'] ?? null,
                'tipo' => $article['tipo'],
                'sede_id' => $sedeId,
            ]);
            $nombre = strtolower($article['name']);
            $item = Item::where('nombre', $nombre)
            ->where('tipo', 'medicamento')
            ->first();

            if (! $item) {
                $item = Item::create([
                    'nombre' => $nombre,
                    'tipo' => 'medicamento',
                    'descripcion' => $article['description'] ?? null,
                ]);
            }
            $medicamentoExistente = Medicamento::where('item_id', $item->id)
                ->where('sede_id', $sedeId)
                ->where('tipo_unidad', $article['unidad'])
                ->where('presentacion', $article['presentacion'])
                ->where('estado', $article['estado'])
                ->first();

            if ($medicamentoExistente) {
                // Sumar la cantidad si existe
                $medicamentoExistente->increment('cantidad', $article['cantidad']);
            } else {
                // Si no existe, crear uno nuevo
                Medicamento::create([
                    'item_id' => $item->id,
                    'sede_id' => $sedeId,
                    'cantidad' => $article['cantidad'],
                    'tipo_unidad' => $article['unidad'],
                    'presentacion' => $article['presentacion'],
                    'estado' => $article['estado'],
                ]);
            }
        }

        foreach ($request->articlesHerramienta as $article) {
            Donacion::create([
                'nombre' => $request->donor,
                'data' => now(),
                'nombre_articulo' => $article['name'],
                'descripcion' => $article['description'] ?? null,
                'tipo' => $article['tipo'],
                'sede_id' => $sedeId,
            ]);
            $nombre = strtolower($article['name']);
            $item = Item::where('nombre', $nombre)
            ->where('tipo', 'herramienta')
            ->first();

            if (! $item) {
                $item = Item::create([
                    'nombre' => $nombre,
                    'tipo' => 'herramienta',
                    'descripcion' => $article['description'] ?? null,
                ]);
            }
            $herramientaExistente = Herramienta::where('item_id', $item->id)
                ->where('sede_id', $sedeId)
                ->where('categoria', $article['categoria'])
                ->where('estado', $article['estado'])
                ->first();

            if ($herramientaExistente) {
                // Sumar la cantidad si existe
                $herramientaExistente->increment('cantidad', $article['cantidad']);
            } else {
                // Si no existe, crear uno nuevo
                Herramienta::create([
                    'item_id' => $item->id,
                    'sede_id' => $sedeId,
                    'cantidad' => $article['cantidad'],
                    'categoria' => $article['categoria'],
                    'estado' => $article['estado'],
                ]);
            }
        }

        return redirect()->route('donaciones.index')->with('success', 'Donación registrada correctamente.');
    }
}
