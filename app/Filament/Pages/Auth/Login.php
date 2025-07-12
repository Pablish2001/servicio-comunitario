<?php

namespace App\Filament\Pages\Auth;

use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Component;
use Filament\Pages\Auth\Login as BaseAuth;
 
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

}