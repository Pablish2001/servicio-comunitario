<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PacienteLookupController extends Controller
{
    public function show($cedula)
    {
        $paciente = Paciente::with(['persona'])
            ->where('cedula', $cedula)
            ->first();

        return response()->json($paciente);
    }
}
