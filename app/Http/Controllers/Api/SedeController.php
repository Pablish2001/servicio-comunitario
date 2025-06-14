<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sede;
use App\Http\Resources\SedeResource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SedeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SedeResource::collection(Sede::paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nombre' => 'required|string|max:255|unique:sedes,nombre',
                'direccion' => 'nullable|string',
            ]);
            $sede = Sede::create($validatedData);
            return new SedeResource($sede);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear la sede', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sede $sede)
    {
        return new SedeResource($sede);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sede $sede)
    {
        try {
            $validatedData = $request->validate([
                'nombre' => 'sometimes|required|string|max:255|unique:sedes,nombre,' . $sede->id,
                'direccion' => 'nullable|string',
            ]);
            $sede->update($validatedData);
            return new SedeResource($sede);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar la sede', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sede $sede)
    {
        $sede->delete();
        return response()->json(null, 204);
    }
}