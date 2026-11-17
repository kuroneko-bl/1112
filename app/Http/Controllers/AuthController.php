<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showRegisterForm()
    {
        return view ('auth.register');
    }
    public function register (Request $request)
    {
        $validated = $request->validate([
            'login' => ['required' , 'string' , 'min:6' , 'regex:/^[a-zA-Z0-9]+$/' , 'unique:users'],
            'password' => ['required' , 'string' , 'min:8'],
            'last_name'=> ['required' , 'string' , 'regex:/^[А-Яа-яЁё\s\-]+$/u'],
            'first_name'=> ['required' , 'string' , 'regex:/^[А-Яа-яЁё\s\-]+$/u'],
            'middle_name'=> ['required' , 'string' , 'regex:/^[А-Яа-яЁё\s\-]+$/u'],

            'phone'=> ['required' , 'string' , 'regex:/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/'],

             'email'=> ['required' , 'email' , 'unique:users'],
        ], [
            'login.regex' => 'Логин может содержать только латинские буквы и цифры',
             'login.min' => 'Логин не меньше 6 символов',
              'login.unique' => 'Пользователь с таким логином уже есть',
               'password.min' => 'Пароль не меньше 8 символов',
                'last_name.regex' => 'Только кириллица',
                 'first_name.regex' => 'Только кириллица',
                  'middle_name.regex' => 'Только кириллица',
                   'phone.regex' => 'Формат 8(ХХХ)ХХХ-ХХ-ХХ',
                    'email.email' => 'Введите нормальный email',
                     'email.unique' => 'Занятый почта',
        ]);

        User::create([
            'login' => $validated['login'],
            'last_name' =>$validated['last_name'],
            'first_name' =>$validated['first_name'],
            'middle_name' =>$validated['middle_name'],
            'email' =>$validated['email'],
            'phone' =>$validated['phone'],
            'password' => Hash::make ($validated['password']),

        ]);
        return redirect()->route('register')->with('success' , 'Вы зарегистрированы');
    }
    public function showLoginForm()
    {
        return view('auth.login');
    }
     public function login(Request $request)
    {
        // ИСПРАВЛЕНО: -> вместо =>
        $credentials = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'login.required' => 'Введите логин',
            'password.required' => 'Введите пароль',
        ]);

        if (Auth::attempt($credentials)) {
            // ИСПРАВЛЕНО: $ вместо #
            $request->session()->regenerate();
            return redirect()->route('dashboard')->with('success', 'Вы вошли');
        }

        return back()->withErrors([
            'login' => 'Неверный логин или пароль',
        ])->onlyInput('login');
    }
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}


