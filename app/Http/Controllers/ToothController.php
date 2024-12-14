<?php

namespace App\Http\Controllers;

use App\Models\Tooth;
use App\Http\Requests\StoreToothRequest;
use App\Http\Requests\UpdateToothRequest;
use App\Models\XRayImage;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        DB::beginTransaction();

        try {
            $data = [
                'tooth_number' => $request->tooth_number,
                'title' => $request->title,
                'treatment_id' => $request->treatment_id,
            ];

            $tooth = Tooth::create($data);

            $imagesData = [];
            if ($request->has('images')) {
                foreach ($request->file('images') as $key => $image) {
                    $newImageName = $key . '.' . $image->getClientOriginalExtension();
                    $relativePath = XRayImage::getPathOfImage($request->treatment_id ,$tooth->id);
                    Storage::disk('local')->makeDirectory($relativePath);
                    $path = Storage::disk('local')->putFileAs($relativePath, $image, $newImageName);
                    $imagesData[] = [
                        'path' => $path,
                        'name' => $key.'-X-ray image',
                        'tooth_id' => $tooth->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                XRayImage::insert($imagesData);
            }

            DB::commit();
            $tooth->load(['xRayImages' => function ($query) {
                $query->orderBy('name', 'asc'); // Order by the 'name' field in ascending order
            }]);
            $tooth->xRayImages = $tooth->xRayImages->map(function ($image)
            {
                $existPath = storage_path("app/private/{$image->path}");
                $fileContent = file_get_contents($existPath);
                $mimeType = mime_content_type($existPath);

                $image->setAttribute('base64','data:' . $mimeType . ';base64,' . base64_encode($fileContent) );
                return $image;
            });
            return response()->json([
                'message' => 'Tooth record saved successfully',
                'tooth' => $tooth
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to save tooth record', 'details' => $e->getMessage()], 500);
        }
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

    public function update(UpdateToothRequest $request, Tooth $tooth)
    {
        DB::beginTransaction();

        try {
            if ($tooth->del_status === 1){
                throw new \Error('Tooth deleted!', 404);
            }

            $data = [
                'tooth_number' => $request->tooth_number,
                'title' => $request->title,
                'treatment_id' => $request->treatment_id,
            ];

//            $this->getImages();

//            $imagesToBase64 = [];
//            foreach ($request->file('images') as $file) {
//                $fileContent = file_get_contents($file);
////                $mimeType = mime_content_type($file->getMimeType());
//                $imagesToBase64[] = [
//                    'data:' . $file->getMimeType() . ';base64,' . base64_encode($fileContent)
//                ];
//            }
//
//            $e = $iamges[0]['data'] === $request->input('images')[0];



            // Update the main tooth data
            $tooth->update($data);

            // Retrieve existing images and filter based on incoming URLs
            $existingImages = $tooth->xRayImages;
            $baseUrl = Config::get('services.app.url')."storage/app/private";
            // Separate incoming images as files and URLs
            $fileImages = [];
            $urlImages = [];

            if ($request->has('images') && !empty($request->input('images'))) {
                foreach ($request->input('images') as $image) {
                    if (is_string($image)) {
                        // Strip base URL to get the relative path
                        $relativePath = Str::replaceFirst($baseUrl, '', $image);
                        $urlImages[] = $relativePath; // Add the relative path to URLs array
                    }
                }
            }

            // Delete only existing images that are not in the incoming URLs (by relative path)
            foreach ($existingImages as $existingImage) {
                if (!in_array($existingImage->path, $urlImages)) {
                    Storage::disk('local')->delete($existingImage->path);
                    $existingImage->delete();
                }
            }

            if ($request->has('images') && !empty($request->file('images'))) {
                $imagesData = [];
                foreach ($request->file('images') as $key => $file) {
                    $newImageName = $key . '.' . $file->getClientOriginalExtension();
                    $relativePath = XRayImage::getPathOfImage($request->treatment_id ,$tooth->id);
                    Storage::disk('local')->makeDirectory($relativePath);
                    $path = Storage::disk('local')->putFileAs($relativePath, $file, $newImageName);

//                    $path = Storage::disk('public')->put(XRayImage::getPathOfImage($data['treatment_id']), $file);

                    if (!$path) {
                        throw new \Exception('Failed to upload one of the images.');
                    }

                    $imagesData[] = [
                        'path' => $path,
                        'name' => $key.'-X-ray image',
                        'tooth_id' => $tooth->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                XRayImage::insert($imagesData);
            }

            DB::commit();
            $tooth->refresh();

            $tooth->load(['xRayImages' => function ($query) {
                $query->orderBy('name', 'asc'); // Order by the 'name' field in ascending order
            }]);

            $tooth->xRayImages = $tooth->xRayImages->map(function ($image)
            {
                $existPath = storage_path("app/private/{$image->path}");
                $fileContent = file_get_contents($existPath);
                $mimeType = mime_content_type($existPath);

                $image->setAttribute('base64','data:' . $mimeType . ';base64,' . base64_encode($fileContent) );
                return $image;
            });
            return response()->json([
                'message' => 'Tooth record updated successfully',
                'tooth' => $tooth
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Failed to update tooth record',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    private function getImages($filenames)
    {
        if (!is_array($filenames) || empty($filenames)) {
            return response()->json(['error' => 'Файлы не указаны'], 400);
        }

        $images = [];

        foreach ($filenames as $key => $filename) {

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

        return $images;
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tooth $tooth)
    {
        DB::beginTransaction();
        try {
                if ($tooth->del_status === 1){
                    throw new \Error('Tooth deleted!', 404);
                }

                $xRayImages = $tooth->xRayImages;
                foreach ($xRayImages as $xRayImage){
                    $xRayImage->update(['del_status' => 1]);
                }
                $tooth->update(['del_status' => 1]);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Пациент успешно Delted!',
                'tooth_id' => $tooth->id,
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
