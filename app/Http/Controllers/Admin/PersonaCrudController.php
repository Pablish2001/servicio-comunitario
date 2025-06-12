<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\PersonaRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use App\Models\Persona;
use App\Models\User;
use App\Models\Paciente;

// Importación de traits correctamente
use Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
use Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
use Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;
use Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation as BackpackCreateOperation;
use Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation as BackpackUpdateOperation;

class PersonaCrudController extends CrudController
{
    use ListOperation;
    use DeleteOperation;
    use ShowOperation;

    // Importar los métodos con alias para sobreescribir
    use BackpackCreateOperation {
        BackpackCreateOperation::store as traitStore;
    }

    use BackpackUpdateOperation {
        BackpackUpdateOperation::update as traitUpdate;
    }

    public function setup()
    {
        CRUD::setModel(Persona::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/persona');
        CRUD::setEntityNameStrings('persona', 'personas');
    }

    protected function setupListOperation()
    {
        CRUD::column('nombre');
        CRUD::column('apellido');
        CRUD::column('email');
    }

    protected function setupCreateOperation()
    {
        CRUD::setValidation(PersonaRequest::class);

        // Campos de persona
        CRUD::addField([
            'name' => 'nombre',
            'label' => 'Nombre',
            'type' => 'text',
        ]);

        CRUD::addField([
            'name' => 'apellido',
            'label' => 'Apellido',
            'type' => 'text',
        ]);

        CRUD::addField([
            'name' => 'email',
            'label' => 'Correo',
            'type' => 'email',
        ]);

        CRUD::addField([
            'name' => 'contacto',
            'label' => 'Contacto',
            'type' => 'text',
        ]);

        CRUD::addField([
            'name' => 'genero',
            'label' => 'Género',
            'type' => 'select_from_array',
            'options' => [
                'masculino' => 'Masculino',
                'femenino' => 'Femenino',
            ],
            'default' => 'femenino',
            'allows_null' => false,
        ]);

        CRUD::addField([
            'name' => 'tipo_persona',
            'label' => 'Tipo de persona',
            'type' => 'select_from_array',
            'options' => [
                'ninguno' => 'Solo Persona',
                'user' => 'Usuario',
                'paciente' => 'Paciente',
            ],
            'default' => 'ninguno',
        ]);

        // Campos para usuario
        CRUD::addField([
            'name' => 'user_cedula',
            'label' => 'Cédula (Usuario)',
            'type' => 'text',
            'wrapperAttributes' => ['class' => 'form-group user-fields d-none'],
        ]);

        CRUD::addField([
            'name' => 'user_password',
            'label' => 'Contraseña',
            'type' => 'password',
            'wrapperAttributes' => ['class' => 'form-group user-fields d-none'],
        ]);

        CRUD::addField([
            'name' => 'user_status',
            'label' => 'Estado',
            'type' => 'select_from_array',
            'options' => [
                'activo' => 'Activo',
                'inactivo' => 'Inactivo',
            ],
            'allows_null' => false,
            'default' => 'activo',
            'wrapperAttributes' => ['class' => 'form-group user-fields d-none'],
        ]);

        CRUD::addField([
            'name' => 'isAdmind',
            'label' => '¿Es administrador?',
            'type' => 'checkbox',
            'wrapperAttributes' => ['class' => 'form-group user-fields d-none'],
        ]);

        // Campos para paciente
        CRUD::addField([
            'name' => 'paciente_cedula',
            'label' => 'Cédula (Paciente)',
            'type' => 'text',
            'wrapperAttributes' => ['class' => 'form-group paciente-fields d-none'],
        ]);

        CRUD::addField([
            'name' => 'fecha_nacimiento',
            'label' => 'Fecha de nacimiento',
            'type' => 'date',
            'wrapperAttributes' => ['class' => 'form-group paciente-fields d-none'],
        ]);

        CRUD::addField([
            'name' => 'carrera',
            'label' => 'Carrera',
            'type' => 'text',
            'wrapperAttributes' => ['class' => 'form-group paciente-fields d-none'],
        ]);

        CRUD::addField([
            'name' => 'semestre',
            'label' => 'Semestre',
            'type' => 'text',
            'wrapperAttributes' => ['class' => 'form-group paciente-fields d-none'],
        ]);

        // Script para ocultar/mostrar campos condicionales
        CRUD::addField([
            'name' => 'script_tipo_persona',
            'type' => 'custom_html',
            'value' => '<script>
                function toggleFields() {
                    const tipo = document.querySelector("[name=tipo_persona]").value;
                    document.querySelectorAll(".user-fields").forEach(el => el.classList.toggle("d-none", tipo !== "user"));
                    document.querySelectorAll(".paciente-fields").forEach(el => el.classList.toggle("d-none", tipo !== "paciente"));
                }
                document.addEventListener("DOMContentLoaded", () => {
                    toggleFields();
                    document.querySelector("[name=tipo_persona]").addEventListener("change", toggleFields);
                });
            </script>',
        ]);
    }

    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }

    public function store()
    {
        $response = $this->traitStore(); // Guarda la persona
        $persona = $this->crud->entry;

        if (request('tipo_persona') === 'user') {
            User::create([
                'cedula' => request('user_cedula'),
                'password' => bcrypt(request('user_password')),
                'status' => request('user_status'),
                'isAdmind' => request()->has('isAdmind'),
                'persona_id' => $persona->id,
            ]);
        }

        if (request('tipo_persona') === 'paciente') {
            Paciente::create([
                'cedula' => request('paciente_cedula'),
                'fecha_nacimiento' => request('fecha_nacimiento'),
                'contacto' => request('contacto'),
                'carrera' => request('carrera'),
                'semestre' => request('semestre'),
                'persona_id' => $persona->id,
            ]);
        }

        return $response;
    }

    public function update()
    {
        $response = $this->traitUpdate(); // Actualiza persona
        $persona = $this->crud->entry;

        // Opcional: actualizar o sincronizar User o Paciente si ya existen.

        return $response;
    }
}
