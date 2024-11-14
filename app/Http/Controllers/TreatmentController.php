<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Treatment;
use App\Http\Requests\StoreTreatmentRequest;
use App\Http\Requests\UpdateTreatmentRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TreatmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTreatmentRequest $request)
    {
        DB::beginTransaction();
        $user = Auth::user();

        try{
            $treatment = Treatment::create(array_merge(
                $request->validated(),
                ['dentist_id' => $user->id]
            ));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Treatment add success!',
                'treatment' => $treatment,
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
     * Display the specified resource.
     */
    public function show(Treatment $treatment)
    {
        if ($treatment->del_status == 1) {
            return redirect()->route('patients.index')->with('error', 'Patient is inactive.');
        }

        $authUser = Auth::user();

        $treatment->load('user');
        $treatment->load('patient');

        $treatment->load(['teeth' => function ($query) {
            $query->where('del_status', 0) // Only load teeth where del status is 0
            ->with('xRayImages');
        }]);
        $treatment->isOwner = $treatment->user->id === $authUser->id;
        if (!$treatment->isOwner){
            $treatment->setAttribute('amount', '00.00');//hide amount if is not owner user
        }

        return Inertia::render('Treatments/Index', [
            'treatment' => $treatment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Treatment $treatment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTreatmentRequest $request, Treatment $treatment)
    {
        DB::beginTransaction();
        try {
            if ($treatment->del_status === 1){
                throw new \Error('Treatment deleted!', 404);
            }

            $authUser = Auth::user();

            $treatment->load('user');

            if ($treatment->user->id !== $authUser->id){
                throw new \Error('You dont have permission to this treatment!', 403);
            }

            $treatment->update($request->validated());
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Treatment updated successfully!',
                'treatment' => $treatment,
            ]);
        }catch (\Exception $e){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Treatment $treatment)
    {
        DB::beginTransaction();
        try {
                if ($treatment->del_status === 1){
                    throw new \Error('Treatment deleted!', 404);
                }

                $teeth = $treatment->teeth;
                foreach ($teeth as $tooth){
                    $xRayImages = $tooth->xRayImages;
                    foreach ($xRayImages as $xRayImage){
                        $xRayImage->update(['del_status' => 1]);
                    }
                    $tooth->update(['del_status' => 1]);
                }
            $treatment->update(['del_status' => 1]);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Пациент успешно Delted!',
                'patient_id' => $treatment->id,
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
