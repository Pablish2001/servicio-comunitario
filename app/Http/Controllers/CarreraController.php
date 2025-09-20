<?php

namespace App\Http\Controllers;

use App\Models\Carrera;

class CarreraController extends Controller
{
    /**
     * Retorna todas las carreras en formato JSON.
     */
    public function index()
    {
        $carreras = Carrera::all();

        return response()->json($carreras);
    }
}
