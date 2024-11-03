<?php

namespace App\Http\Controllers;

use App\Models\Treatment;
use App\Http\Requests\StoreTreatmentRequest;
use App\Http\Requests\UpdateTreatmentRequest;
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Treatment $treatment)
    {
        $treatment->load(['teeth' => function ($query) {
            $query->with('x_ray_images');
        }]);

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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Treatment $treatment)
    {
        //
    }
}
