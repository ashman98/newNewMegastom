<?php

namespace App\Http\Controllers;

use App\DataTables\PatientsDataTable;
use App\DataTables\UsersDataTable;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Disease;
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
        $patients = Patient::query()->paginate(10);
        $diseases = Disease::where('del_status', '=', 0)->get();// Properly paginate the query results
//        throw new \RuntimeException(json_encode($diseases->toArray()));

        return Inertia::render('Patients/Index', [
            'patients' => $patients->items(),
            'diseases' => $diseases->toArray(),
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


        // Transform the diseases collection
        $patient->diseases->transform(function ($disease) {
            $disease->setAttribute('value', $disease->name);
            $disease->setAttribute('label', $disease->title);
            return $disease;
        });

        $diseases = Disease::where('del_status', '=', 0)->get();

        return Inertia::render('Patients/Show', [
            'patient_data' => $patient,
            'treatments' => $treatments->items(),
            'diseases' => $diseases->toArray(),
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

        // Filter by own patients
        if ($request->input('isOwnPatient') === 'true') {
            $query->whereHas('treatments', function ($query) {
                $query->where('dentist_id', auth()->id());
            });
        }

        // Filter by patient diseases
        $patientDiseases = $request->input('patient_diseases');
        if (!empty($patientDiseases) && is_array($patientDiseases)) {
            foreach ($patientDiseases as $disease) {
                $diseaseName = $disease['value'];
                $query->whereHas('diseases', function ($query) use ($diseaseName) {
                    $query->where('name', '=', $diseaseName);
                });
            }
        }

        // Determine whether to use get() or paginate()
        $useGet = $request->input('useGet', false); // Example condition, can be adjusted as needed

        if ($useGet) {
            $patients = $query->get();
        } else {
            // Set default page size if not specified
            $pageSize = (int) $request->input('pageSize', 10);
            $patients = $query->orderBy('id', 'desc')->paginate($pageSize);
        }

        // Transform gender attribute
        $patients->transform(function ($patient) {
            if ($patient->gender === 'male') {
                $patient->setAttribute('gender', 'Արական');
            } elseif ($patient->gender === 'female') {
                $patient->setAttribute('gender', 'Իգական');
            }
            return $patient;
        });

        // Structure response with pagination details
        if ($useGet) {
            return response()->json([
                'patients' => $patients
            ]);
        } else {
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
        DB::beginTransaction();
        try {
            // Создание пациента
            $patient = Patient::create($request->validated());

            // Обработка заболеваний
            if ($request->has('patient_diseases')) {
                $diseaseValues = collect($request->input('patient_diseases'))
                    ->pluck('value') // Извлекаем только значения (name)
                    ->toArray();

                // Получаем болезни по значениям из БД
                $diseases = Disease::whereIn('name', $diseaseValues)->get();

                // Привязываем болезни к пациенту
                $patient->diseases()->attach($diseases->pluck('id'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Пациент успешно добавлен!',
                'patient_id' => $patient->id,
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
        DB::beginTransaction();
        try {
            if ($patient->active == 1) {
                // Redirect to the patients list page if the patient is inactive
                return redirect()->route('patients.index')->with('error', 'Patient is inactive.');
            }
            // Обновляем данные пациента
            $patient->update($request->validated());

            // Обработка заболеваний (если они переданы в запросе)
            if ($request->has('patient_diseases')) {
                $diseaseValues = collect($request->input('patient_diseases'))
                    ->pluck('value') // Извлекаем только значения (name)
                    ->toArray();

                // Получаем болезни по значениям из БД
                $diseases = Disease::whereIn('name', $diseaseValues)->get();

                // Обновляем привязку болезней к пациенту
                $patient->diseases()->sync($diseases->pluck('id')); // Используем sync для обновления связи
            }

            DB::commit();
            $patient->refresh();
            $patient->load('diseases');
            return response()->json([
                'success' => true,
                'message' => 'Пациент успешно обновлен!',
                'patient' => $patient,
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
