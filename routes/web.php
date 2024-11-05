<?php

use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TreatmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/patients', [PatientController::class, 'index'])->middleware(['auth', 'verified'])->name('patients.index');
Route::get('/patients/{patient}', [PatientController::class, 'show'])->name('patients.show');
Route::post('/patients', [PatientController::class, 'store'])->name('patients.store')->middleware('throttle:10,1');;
Route::get('/patients/{patient}/treatments', [PatientController::class, 'getTreatments'])
    ->name('patient.treatments');
Route::get('/treatments/{treatment}', [TreatmentController::class, 'show'])->name('treatments.show');
Route::post('/treatments', [TreatmentController::class, 'store'])->name('treatments.store');

Route::put('/treatments/{treatment}', [TreatmentController::class, 'update'])->name('treatments.update');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
