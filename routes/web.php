<?php

use App\Http\Controllers\DentistsController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ToothController;
use App\Http\Controllers\TreatmentController;
use App\Http\Middleware\HaseAdminRole;
use App\Http\Middleware\HaseAnyRole;
use App\Http\Middleware\HaseSuperAdminRole;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
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

Route::middleware('auth')->group(function () {
    Route::get('/diseases', [\App\Http\Controllers\DiseaseController::class, 'index'])->middleware(['auth', 'verified'])->name('diseases.index');
    Route::get('/diseases/data', [DiseaseController::class, 'getDiseases'])->middleware(['auth', 'verified'])->name('diseases.data');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dentists', [DentistsController::class, 'index'])
        ->middleware([HaseAdminRole::class])
        ->name('dentists.index');
    Route::post('/dentists', [DentistsController::class, 'store'])
        ->middleware([HaseAdminRole::class,'throttle:10,1'])
        ->name('dentists.store');
  Route::get('/dentists/data', [DentistsController::class, 'getDentists'])
      ->middleware([HaseAnyRole::class ])
      ->name('dentists.data');

    Route::get('/patients', [PatientController::class, 'index'])
        ->middleware([HaseAnyRole::class])
        ->name('patients.index');
    Route::put('/patients/{patient}', [PatientController::class, 'update'])
        ->middleware(['throttle:10,1',HaseAnyRole::class])
        ->name('patients.update');
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])
        ->middleware(['throttle:10,1',HaseAnyRole::class])
        ->name('patients.delete');
    Route::get('/patients/data', [PatientController::class, 'getPatients'])
        ->middleware([HaseAnyRole::class ])
        ->name('patients.data');
    Route::get('/patients/{patient}', [PatientController::class, 'show'])
        ->middleware([HaseAnyRole::class])
        ->name('patients.show');
    Route::post('/patients', [PatientController::class, 'store'])
        ->middleware([HaseAnyRole::class,'throttle:10,1'])
        ->name('patients.store');


    Route::get('/patients/{patient}/treatments', [PatientController::class, 'getTreatments'])
        ->middleware([HaseAnyRole::class])
        ->name('patient.treatments');
    Route::get('/treatments/{treatment}', [TreatmentController::class, 'show'])
        ->middleware([HaseAnyRole::class])
        ->name('treatments.show');
    Route::post('/treatments', [TreatmentController::class, 'store'])
        ->name('treatments.store')
        ->middleware([HaseAnyRole::class,'throttle:10,1']);
    Route::put('/treatments/{treatment}', [TreatmentController::class, 'update'])
        ->middleware([HaseAnyRole::class,'throttle:10,1'])
        ->name('treatments.update');
    Route::delete('/treatments/{treatment}', [TreatmentController::class, 'destroy'])
        ->middleware([HaseAnyRole::class,'throttle:10,1'])
        ->name('treatments.delete');

    Route::post('/teeth', [ToothController::class, 'store'])
        ->middleware([HaseAnyRole::class,'throttle:10,1'])
        ->name('teeth.store');
    Route::post('/teeth/{tooth}', [ToothController::class, 'update'])
        ->middleware([HaseAnyRole::class,'throttle:10,1'])
        ->name('teeth.update');
    Route::delete('/teeth/{tooth}', [ToothController::class, 'destroy'])
        ->middleware([HaseAnyRole::class,'throttle:10,1'])
        ->name('tooth.delete');
    Route::get('/teeth/{tooth}/edit', [ToothController::class, 'edit'])
        ->middleware([HaseAnyRole::class])
        ->name('teeth.edit');

    Route::get('/xrays/base64', function (Request $request) {
        $filenames = $request->query('filenames'); // Ожидаем массив имен файлов

        if (!is_array($filenames) || empty($filenames)) {
            return response()->json(['error' => 'Файлы не указаны'], 400);
        }

        $images = [];

        foreach ($filenames as $filename) {
            $path = storage_path("app/private/{$filename}");

            if (file_exists($path)) {
                $fileContent = file_get_contents($path);
                $mimeType = mime_content_type($path);
                $images[] = [
                    'filename' => $filename,
                    'data' => 'data:' . $mimeType . ';base64,' . base64_encode($fileContent)
                ];
            } else {
                $images[] = [
                    'filename' => $filename,
                    'error' => 'Файл не найден'
                ];
            }
        }

        return response()->json($images);
    });


    Route::get('/free-space-check', function (){
        $disk = Storage::disk('public'); // Используем 'public' или любой другой диск
        $path = $disk->path('');         // Получаем путь к корневой директории диска

        // Общее пространство на диске
        $totalSpace = disk_total_space($path);

        // Свободное пространство на диске
        $freeSpace = disk_free_space($path);

        // Вычисляем занятное пространство
        $usedSpace = $totalSpace - $freeSpace;

        // Переводим в гигабайты
        $totalSpaceInGB = round($totalSpace / (1024 * 1024 * 1024), 2);
        $freeSpaceInGB = round($freeSpace / (1024 * 1024 * 1024), 2);
        $usedSpaceInGB = round($usedSpace / (1024 * 1024 * 1024), 2);

//        return "Общее место на диске '{$path}': {$totalSpaceInGB} ГБ
//            Свободное место: {$freeSpaceInGB} ГБ
//            Занятое место: {$usedSpaceInGB} ГБ";
        return response()->json([
            "totalSpaceInGB" => $totalSpaceInGB,
            "freeSpaceInGB" => $freeSpaceInGB,
            "usedSpaceInGB" => $usedSpaceInGB,
            "path" => $path,
        ]);
    });
});

require __DIR__.'/auth.php';
