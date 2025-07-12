<?php

namespace App\Filament\Pages\Auth;

use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Component;
use Filament\Pages\Auth\Login as BaseAuth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Validation\ValidationException;
use Filament\Facades\Filament;
use Filament\Http\Responses\Auth\Contracts\LoginResponse;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Filament\Notifications\Notification;
 
class Login extends BaseAuth
{
    public function form(Form $form): Form
    {
        return $form
            ->schema([ 
                $this->getLoginFormComponent(), 
                $this->getPasswordFormComponent(),
                $this->getRememberFormComponent(),
            ])
            ->statePath('data');
    }
 
    protected function getLoginFormComponent(): Component 
    {
        return TextInput::make('cedula')
            ->label('Cédula')
            ->required()
            ->autocomplete()
            ->autofocus()
            ->extraInputAttributes(['tabindex' => 1]);
    } 


    protected function getCredentialsFromFormData(array $data): array
    {
       // $login_type = filter_var($data['cedula'], FILTER_VALIDATE_EMAIL ) ? 'email' : 'cedula';

        return [
            'cedula' => $data['cedula'],
            'password'  => $data['password'],
        ];
    }

public function authenticate(): ?LoginResponse
{
    $data = $this->form->getState();

    $user = User::where('cedula', $data['cedula'])->first();


    if (! $user || ! Hash::check($data['password'], $user->password)) {
        Notification::make()
            ->title('Acceso denegado')
            ->body('Credenciales inválidas.')
            ->danger()
            ->persistent() // para que no se cierre solo
            ->send();

        return null; // cortar el login
    }

    if (! $user->canAccessFilament()) {
        Notification::make()
            ->title('Acceso denegado')
            ->body('No tienes permisos para acceder al panel.')
            ->danger()
            ->persistent() // para que no se cierre solo
            ->send();

        return null; // cortar el login
    }
       
    
    Auth::guard('web')->login($user, $data['remember'] ?? false); 
    session()->regenerate(); // Asegura login válido
    
    return app(LoginResponse::class); // Devuelve respuesta
}
}