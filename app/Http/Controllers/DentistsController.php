<?php

namespace App\Http\Controllers;

use App\DataTables\UsersDataTable;
use App\Http\Requests\StoreDentistRequest;
use App\Models\Patient;
use App\Models\User;
use http\Exception\RuntimeException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DentistsController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $dentists= User::query()->paginate(10);

        return Inertia::render('Dentists/Index', [
            'dentists' => $dentists->items(),
        ]);
    }

    public function store(StoreDentistRequest $request): \Illuminate\Http\JsonResponse
    {
        DB::beginTransaction();
        try {
            // Создание пациента
            $dentist = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'surname' => $request->surname,
                'phone'  => $request->phone,
                'city'  => $request->city,
                'address'  => $request->address,
                'region'  => $request->region,
                'gender' => $request->gender
            ]);

            $dentist->assignRole('dentist');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Пациент успешно добавлен!',
                'patient_id' => $dentist->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Получить лечения для указанного пациента.
     */
    public function getDentists(Request $request)
    {
        // Define filters with the default operator set to 'like'
        $filters = [
            'name' => 'like',
            'surname' => 'like',
            'phone' => 'like',
            'city' => 'like',
            'address' => 'like',
            'gender' => '='
        ];

        // Initialize the query for patients
        $query = User::query();

        // Apply filters based on exact match settings
        foreach ($filters as $field => $defaultOperator) {
            $value = $request->input($field);
            $exactMatch = $request->input("exact_$field", false);  // Check if exact match is requested for the field

            if ($value) {
                $operator = $exactMatch ? '=' : $defaultOperator;
                $query->where($field, $operator, $operator === 'like' ? "%$value%" : $value);
            }
        }

        // Apply birthday range filter if both start and end dates are provided
        $birthdayFrom = $request->input('birthday_from');
        $birthdayTo = $request->input('birthday_to');
        if ($birthdayFrom && $birthdayTo) {
            $query->whereBetween('birthday', [$birthdayFrom, $birthdayTo]);
        } elseif ($birthdayFrom) {
            $query->where('birthday', '>=', $birthdayFrom);
        } elseif ($birthdayTo) {
            $query->where('birthday', '<=', $birthdayTo);
        }

        // Set default page size if not specified
        $pageSize = (int) $request->input('pageSize', 10);

        // Paginate the filtered query
        $dentists = $query->orderBy('id', 'desc')->paginate($pageSize);

        $dentists->getCollection()->transform(function ($dentist) {
            if ($dentist->gender === 'male') {
                $dentist->setAttribute('gender', "Արական");
            }elseif ($dentist->gender === 'female') {
                $dentist->setAttribute('gender', 'Իգական');
            }
            return $dentist;
        });

        // Structure response with pagination details
        return response()->json([
            'dentists' => $dentists->items(),
            'pagination' => [
                'current_page' => $dentists->currentPage(),
                'last_page' => $dentists->lastPage(),
                'total' => $dentists->total(),
                'per_page' => $dentists->perPage()
            ]
        ]);
    }

}
