<?php

namespace App\Http\Controllers;

use App\Models\Donacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonacionController extends Controller
{
    public function index()
    {
        $donaciones = Donacion::all();

        return Inertia::render('Donaciones');
    }

    public function store(Request $request)
    {
        $sedeId = session('sede.id');

        if (! $sedeId) {
            return redirect()->back()->with('error', 'No se ha seleccionado una sede válida.');
        }
        $request->validate([
            'donor' => 'required|string|max:255',
            'date' => 'required|date',
            'articles' => 'required|array|min:1',
            'articles.*.name' => 'required|string|max:255',
            'articles.*.description' => 'nullable|string',
            'articles.*.tipo' => 'required|in:medicamento,herramienta',
        ]);

        foreach ($request->articles as $article) {
            Donacion::create([
                'nombre' => $request->donor,
                'data' => $request->date,
                'nombre_articulo' => $article['name'],
                'descripcion' => $article['description'] ?? null,
                'tipo' => $article['tipo'],
                'sede_id' => $sedeId,
            ]);
        }

        return redirect()->route('donaciones.index')->with('success', 'Donación registrada correctamente.');
    }
}
