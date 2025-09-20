<?php

namespace App\Http\Controllers;

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
