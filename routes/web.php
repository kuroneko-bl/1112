<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Главная страница
Route::get('/', function () {
    return view('layout');
});

Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/dashboard', [\App\Http\Controllers\BookingController::class, 'index'])
    ->middleware('auth')
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/bookings/create', [\App\Http\Controllers\BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings', [\App\Http\Controllers\BookingController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/{booking}/review', [\App\Http\Controllers\BookingController::class, 'storeReview'])->name('bookings.review');
});