<?php

namespace App\Http\Controllers;

use App\DataTables\PatientsDataTable;
use App\DataTables\UsersDataTable;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Models\Treatment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, PatientsDataTable $dataTable): \Inertia\Response
    {
        $patients = Patient::query()->paginate(10); // Properly paginate the query results
        return Inertia::render('Patients/Index', [
            'patients' => $patients->items(),
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Patient $patient, Request $request)
    {
        if ($patient->active == 1) {
            // Redirect to the patients list page if the patient is inactive
            return redirect()->route('patients.index')->with('error', 'Patient is inactive.');
        }

        $authUser = Auth::user();

        // Base query for treatments with eager loading of user and nested relationships
        $treatmentsQuery = $patient->treatments()->orderBy('id', 'asc')->with('user');
        // Apply filters based on request inputs
        if ($request->filled('title')) {
            $treatmentsQuery->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->filled('start_date')) {
            $treatmentsQuery->where('treatment_plan_start_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $treatmentsQuery->where('treatment_plan_end_date', '<=', $request->end_date);
        }

        // Paginate the filtered treatments
        $treatments = $treatmentsQuery->paginate(6);

        // Hide 'amount' for treatments not owned by the authenticated user
        $treatments->getCollection()->transform(function ($treatment) use ($authUser) {
            if ($treatment->user->id !== $authUser->id) {
                $treatment->setAttribute('amount', "00.00");
            }
            return $treatment;
        });

        return Inertia::render('Patients/Show', [
            'patient' => $patient,
            'treatments' => $treatments->items(),
            'pagination' => [
                'current_page' => $treatments->currentPage(),
                'last_page' => $treatments->lastPage(),
            ],
        ]);
    }


    /**
     * Получить лечения для указанного пациента.
     */
    public function getTreatments(Patient $patient, Request $request)
    {
        if ($patient->active == 1) {
            // Redirect to the patients list page if the patient is inactive
            return redirect()->route('patients.index')->with('error', 'Patient is inactive.');
        }

        $authUser = Auth::user();

        // Base query for treatments with eager loading of user and nested relationships
        $treatmentsQuery = $patient->treatments()->orderBy('id', 'desc')->with('user');
        $treatmentsQuery->where('del_status', '=', 0);
        // Apply filters based on request inputs
        if ($request->filled('title')) {
            $treatmentsQuery->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->filled('start_date')) {
            $treatmentsQuery->where('treatment_plan_start_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $treatmentsQuery->where('treatment_plan_end_date', '<=', $request->end_date);
        }

        // Paginate the filtered treatments
        $treatments = $treatmentsQuery->paginate(6);

        // Hide 'amount' for treatments not owned by the authenticated user
        $treatments->getCollection()->transform(function ($treatment) use ($authUser) {
            if ($treatment->user->id !== $authUser->id) {
                $treatment->setAttribute('amount', "00.00");
            }
            return $treatment;
        });

        return response()->json([
            'patient' => $patient,
            'treatments' => $treatments->items(),
            'pagination' => [
                'current_page' => $treatments->currentPage(),
                'last_page' => $treatments->lastPage(),
            ],
        ]);
    }

    /**
     * Получить лечения для указанного пациента.
     */
    public function getPatients(Request $request)
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
        $query = Patient::query();
        $query->where('active', '=', 0);

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
        $patients = $query->orderBy('id', 'desc')->paginate($pageSize);


        // Structure response with pagination details
        return response()->json([
            'patients' => $patients->items(),
            'pagination' => [
                'current_page' => $patients->currentPage(),
                'last_page' => $patients->lastPage(),
                'total' => $patients->total(),
                'per_page' => $patients->perPage()
            ]
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function store(StorePatientRequest $request)
    {
        // Данные уже валидированы, так что можем просто создать пациента
        DB::beginTransaction();
    try{
        $patient = Patient::create(
            $request->validated()
        );
        DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Пациент успешно добавлен!',
                'patient_id' => $patient->id,
            ]);

    }catch (\Exception $e){
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ]);
    }

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        DB::beginTransaction();
        try {
            $treatments = $patient->treatments;
            foreach ($treatments as $treatment){
                $teeth = $treatment->teeth;
                foreach ($teeth as $tooth){
                    $xRayImages = $tooth->xRayImages;
                    foreach ($xRayImages as $xRayImage){
                        $xRayImage->update(['del_status' => 1]);
                    }
                    $tooth->update(['del_status' => 1]);
                }
                $treatment->update(['del_status' => 1]);
            }
            $patient->update(['active' => 1]);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Пациент успешно Delted!',
                'patient_id' => $patient->id,
            ]);
        }catch (\Exception $e){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
