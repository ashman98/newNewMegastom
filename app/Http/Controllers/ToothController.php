<?php

namespace App\Http\Controllers;

use App\Models\Tooth;
use App\Http\Requests\StoreToothRequest;
use App\Http\Requests\UpdateToothRequest;

class ToothController extends Controller
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
    public function store(StoreToothRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Tooth $tooth)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tooth $tooth)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateToothRequest $request, Tooth $tooth)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tooth $tooth)
    {
        //
    }
}
