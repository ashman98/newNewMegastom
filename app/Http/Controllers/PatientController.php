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
        $patients = Patient::all(); // Получаем данные из базы
        return Inertia::render('Patients/Index', [
            'patients' => $patients,
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Patient $patient, Request $request)
    {
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
                $treatment->setAttribute('amount', null);
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
                $treatment->setAttribute('amount', null);
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
        //
    }
}
