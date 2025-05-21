<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;


class ProfileController extends Controller
{
     /**
     * Створення профілю, якщо не існує
     */
    public function create()
    {
        $user = Auth::user();

        if ($user->role?->name === 'parent' && !$user->parentProfile) {
            $user->parentProfile()->create([
                'photo' => config('files.default_parent_photo'),
            ]);
            return response()->json(['message' => 'Профіль батька створено']);
        }

        if ($user->role?->name === 'nanny' && !$user->nannyProfile) {
            $user->nannyProfile()->create([
                'photo' => config('files.default_nanny_photo'),
            ]);
            return response()->json(['message' => 'Профіль няні створено']);
        }

        return response()->json(['message' => 'Профіль вже існує або роль невідома']);
    }
   
    /**
     * Оновлення або збереження профілю батька
     */
    public function storeParentProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => '❌ User not authenticated'], 401);
        }

        // Спочатку валідація
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',          
            // 'city' => 'required|string|max:100',
            'addresses' => 'nullable|array',
                'addresses.*.type' => 'required|string|max:50',
                'addresses.*.city' => 'required|string|max:100',
                'addresses.*.district' => 'nullable|string|max:100',
                'addresses.*.address' => 'nullable|string|max:255',
                'addresses.*.floor' => 'nullable|integer|min:0',
                'addresses.*.apartment' => 'nullable|string|max:10',
                    
            'phone' => 'required|string|min:10|max:15|unique:parent_profiles,phone,' . $user->id . ',user_id',
            'birth_date' => 'required|date|before:today',
            'children' => 'nullable|array',
                'children.*.name' => 'sometimes|required|string|max:255',
                'children.*.birth_date' => 'sometimes|required|date|before:today',
            'photo' => 'nullable|file|image|max:5120',
        ]);

        // Автоматично копіюємо місто з першої адреси, якщо не передано напряму
        if (!isset($validated['city']) && !empty($validated['addresses'][0]['city'])) {
            $validated['city'] = $validated['addresses'][0]['city'];
        }       
      
        if (isset($validated['birth_date'])) {
            // Примусово встановлюємо час на полудень, щоб уникнути зміщення
            $validated['birth_date'] = \Carbon\Carbon::parse($validated['birth_date'])->setTime(12, 0, 0);
        }

         // Якщо профіль ще не створений — створюємо з validated
         if (!$user->parentProfile) {
            $profile = $user->parentProfile()->create($validated);
        } else {
            $profile = $user->parentProfile;
            $profile->update($validated);
        }

       $photoFile = $request->file('photo');

        if ($photoFile) {
           if ($profile->photo) {
                \Storage::disk('s3')->delete($profile->photo);
            }

            $firstName = $validated['first_name'] ?? $user->first_name ?? 'parent';
            $lastName = $validated['last_name'] ?? $user->last_name ?? '';
            $extension = $photoFile->getClientOriginalExtension();

            $filename = Str::slug($firstName . '_' . $lastName . '_parent_avatar_' . uniqid()) . '.' . $extension;
            $path = $photoFile->storeAs('photos/parents', $filename, 's3');

            $profile->photo = $path;
            $profile->save();
        }

        // Якщо не передано нове фото і ще немає — встановлюємо дефолтне
        if (!$profile->photo) {
           $profile->photo = config('files.default_parent_photo');
            $profile->save();
        }

       
        if (isset($validated['addresses'])) {
            $profile->addresses()->delete(); // Очистити старі
            $profile->addresses()->createMany($validated['addresses']); // Зберегти нові
        }      
       
        // Оновлення дітей (якщо є)
        if (isset($validated['children'])) {
            $profile->children()->delete();
            $profile->children()->createMany($validated['children']);
        }

        \Log::info('Отримані дані профілю:', $request->all());

       return response()->json([
        'message' => 'Профіль батька збережено',
       'profile' => tap($profile->load(['children', 'addresses']), function ($profile) {
            $profile->photo = \Storage::disk('s3')->url($profile->photo ?? config('files.default_parent_photo'));
    }),
    ]);

    }
    
     /**
     * Оновлення або збереження профілю няні
     */
    public function storeNannyProfile(Request $request)
    {
        try {

        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => '❌ User not authenticated'], 401);
        }

        // Валідація вхідних даних
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|nullable|string|max:255',
            'photo' => 'sometimes|nullable|file|image|max:5120',
            'city' => 'sometimes|required|string|max:100',
            'district' => 'sometimes|required|string|max:100',
            'phone' => 'sometimes|required|string|min:10|max:15|unique:nanny_profiles,phone,' . $user->id . ',user_id',
            'birth_date' => 'sometimes|required|date|before:today',
            'gender' => 'sometimes|required|in:male,female,other',
            'specialization' => 'sometimes|required|array',
                'specialization.*' => 'string',
            'work_schedule' => 'sometimes|required|array',
                'work_schedule.*' => 'string|max:255',
            'education' => 'sometimes|required|array|min:1',
                'education.*.institution' => 'sometimes|required|string|max:255',
                'education.*.specialty' => 'sometimes|required|string|max:255',
                'education.*.years' => 'sometimes|required|string|max:50',
                'education.*.diploma_image' => 'sometimes|nullable|file|image|max:5120',
            'languages' => 'sometimes|required|array',
            'additional_skills' => 'sometimes|required|array',
            'experience_years' => 'sometimes|required|numeric|min:0|max:50',
            'hourly_rate' => 'sometimes|required|numeric|min:0|max:500',
            'availability' => 'nullable|array',
            'video' => 'nullable|file|mimetypes:video/mp4,video/quicktime|max:51200', // до 50MB
            'gallery' => 'nullable|array',
            'gallery.*' => 'nullable|file|image|max:5120', // кожне фото до 5MB
            'goat' => 'nullable|string',
            'about_me' => 'nullable|string',
        ]);
        
        if (isset($validated['birth_date'])) {
            // Примусово встановлюємо час на полудень, щоб уникнути зміщення
        $validated['birth_date'] = \Carbon\Carbon::parse($validated['birth_date'])->setTime(12, 0, 0);
        }

           // Створюємо або оновлюємо профіль
        if (!$user->nannyProfile) {
            $profile = $user->nannyProfile()->create($validated);
        } else {
            $profile = $user->nannyProfile;
            $profile->update($validated);
        }

       $photoFile = $request->file('photo');

       if ($photoFile) {
            $firstName = $validated['first_name'] ?? $profile->first_name ?? $user->first_name ?? 'nanny';
            $lastName = $validated['last_name'] ?? $profile->last_name ?? $user->last_name ?? '';
            $extension = $photoFile->getClientOriginalExtension();

            $filename = Str::slug($firstName . '_' . $lastName . '_nanny_avatar_' . uniqid()) . '.' . $extension;

            $path = Storage::disk('s3')->putFileAs(
                'photos/nannies',
                $photoFile,
                $filename               
            );

            if (!$path) {
                throw new \Exception("❌ Не вдалося зберегти фото в S3");
            }

            $profile->photo = $path;
            $profile->save();
        }


        // Якщо нічого не завантажено і фото ще немає — встановити дефолтне
        if (empty($profile->photo) || $profile->photo === 'default-avatar.jpg') {
            $profile->photo = config('files.default_nanny_photo');
            $profile->save();
        }
             
        // Оновлення спеціалізацій
        if (isset($validated['specialization'])) {
            $profile->specialization = $validated['specialization'];
        }

        // Оновлення графіка роботи
        if (isset($validated['work_schedule'])) {
            $profile->work_schedule = $validated['work_schedule'];
        }

        // Оновлення мови
        if (isset($validated['languages'])) {
            $profile->languages = $validated['languages'];
        }

        // Оновлення додаткових навичок
        if (isset($validated['additional_skills'])) {
            $profile->additional_skills = $validated['additional_skills'];
        }

        // Оновлення освіти       
        if (isset($validated['education'])) {
            foreach ($validated['education'] as $index => $eduData) {
            try {
                $existing = $profile->educations()->where('institution', $eduData['institution'])->first();

                $file = $request->file("education.$index.diploma_image");
                $diplomaPath = $existing?->diploma_image;

               if ($file && $file->isValid()) {
                    // Видалення попереднього диплома, якщо він існує
                    if ($diplomaPath && Storage::disk('s3')->exists($diplomaPath)) {
                        Storage::disk('s3')->delete($diplomaPath);
                    }

                    $firstName = $validated['first_name'] ?? $profile->first_name ?? 'nanny';
                    $lastName = $validated['last_name'] ?? $profile->last_name ?? '';

                    $filename = Str::slug($firstName . '_' . $lastName . '_' . $eduData['institution'] . '_diploma_' . uniqid()) . '.' . $file->getClientOriginalExtension();
                    $diplomaPath = $file->storeAs('diplomas', $filename, 's3');
                }

                if (empty($eduData['institution']) || empty($eduData['specialty']) || empty($eduData['years'])) {
                    throw new \Exception("❌ Відсутні поля institution/specialty/years у записі №$index");
                }

                if ($existing) {
                    $existing->update([
                        'specialty' => $eduData['specialty'],
                        'years' => $eduData['years'],
                        'diploma_image' => $diplomaPath,
                    ]);
                } else {
                    $profile->educations()->create([
                        'institution' => $eduData['institution'],
                        'specialty' => $eduData['specialty'],
                        'years' => $eduData['years'],
                        'diploma_image' => $diplomaPath,
                    ]);
                }
            } catch (\Throwable $e) {
            \Log::error("❌ Помилка в освіті #$index", ['message' => $e->getMessage()]);
            return response()->json([
                'error' => '❌ Помилка при збереженні освіти',
                'details' => $e->getMessage()
            ], 500);
            }
          }
    } 
       
      // Оновлення відео
       if ($request->hasFile('video')) {
    try {
        $videoFile = $request->file('video');

        if (!$videoFile->isValid()) {
            return response()->json([
                'error' => '❌ Відео некоректне',
                'reason' => $videoFile->getErrorMessage() ?? 'невідома помилка'
            ], 400);
        }

        $firstName = $validated['first_name'] ?? $profile->first_name ?? $user->first_name ?? 'nanny';
        $lastName = $validated['last_name'] ?? $profile->last_name ?? $user->last_name ?? '';
        $videoFilename = Str::slug($firstName . '-' . $lastName)
            . '-nanny-video-' . uniqid() . '.' . $videoFile->getClientOriginalExtension();

        $path = Storage::disk('s3')->putFileAs(
            'videos/nannies',
            $videoFile,
            $videoFilename,
           
        );

        if (!$path) {
            return response()->json([
                'error' => '❌ Не вдалося зберегти відео через putFileAs()',
                'mime_type' => $videoFile->getMimeType(),
                'size' => $videoFile->getSize(),
            ], 500);
        }

        $profile->video = $path;
        $profile->save();

    } catch (\Throwable $e) {
        // 🐞 створюємо лог помилки і зберігаємо в існуючу папку test/
        $logFilename = 'test/video_upload_log_' . Str::random(6) . '.json';

        $logData = [
            'message' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
            'mime' => $videoFile?->getMimeType() ?? null,
            'size' => $videoFile?->getSize() ?? null,
            'filename' => $videoFilename ?? null,
            'time' => now()->toDateTimeString(),
            'trace' => $e->getTraceAsString(),
        ];

        $stored = Storage::disk('s3')->put($logFilename, json_encode($logData, JSON_PRETTY_PRINT), [
         
        ]);

        return response()->json([
            'error' => '❌ Внутрішня помилка сервера (лог збережено в S3)',
            'log_url' => $stored ? Storage::disk('s3')->url($logFilename) : null,
        ], 500);
    }
}

      
        // Оновлення галереї фото
        $existingGalleryRaw = $request->input('existing_gallery', []);
        $existingGallery = array_filter(is_array($existingGalleryRaw) ? $existingGalleryRaw : []);

        if (!$request->hasFile('gallery') && empty($existingGallery)) {
            // якщо нічого не передано, не чіпаємо галерею
            $existingGallery = $profile->gallery ?? [];
        }

        $oldGallery = is_array($profile->gallery)
            ? $profile->gallery
            : json_decode($profile->gallery ?? '[]', true);

        $oldGallery = array_filter($oldGallery); // видалити пусті значення

        // Знаходимо фото, які потрібно видалити
        $toDelete = array_diff($oldGallery, $existingGallery);
        foreach ($toDelete as $path) {
            if (!empty($path)) {
                \Storage::disk('s3')->delete($path);
            }
        }

        // Завантаження нових фото
        $galleryPaths = [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $index => $image) {
                if ($image && $image->isValid()) {
                    $firstName = $validated['first_name'] ?? ($profile->first_name ?? $user->first_name ?? 'nanny');
                    $lastName = $validated['last_name'] ?? ($profile->last_name ?? $user->last_name ?? '');
                    $filename = Str::slug($firstName . '_' . $lastName . '_gallery_' . $index . '_' . uniqid()) . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('gallery/nannies', $filename, 's3');
                    $galleryPaths[] = $path;
                }
            }
        }

        // Зберігаємо масив галереї       
        $mergedGallery = array_merge($existingGallery, $galleryPaths);
        $profile->gallery = array_values(array_filter($mergedGallery));
        $profile->save();
             
               $profile->load('educations');

               $profile->educations->transform(function ($edu) {
                    $edu->diploma_image = $edu->diploma_image
                        ? Storage::disk('s3')->url($edu->diploma_image)
                        : null;
                    return $edu;
                });

                // Примусово застосовуємо getPhotoUrl, щоб гарантовано повернути повний шлях
                $profile->photo = $profile->getPhotoUrl();
                $profile->video = $profile->getVideoUrl();
                $profile->gallery = $profile->getGalleryUrls();

                return response()->json([
                    'message' => 'Профіль няні оновлено',                 
                    'profile' => $profile,
                ]);
        } catch (\Throwable $e) {
            \Log::error('Помилка при збереженні профілю няні', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => '❌ Внутрішня помилка сервера',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }     

    }

    /**
     * Видалення профілю батька або няні
     */
    public function destroy()
    {
        $user = Auth::user();
        $deleted = false;

        if ($user->nannyProfile) {
            $user->nannyProfile->delete();
            $user->nannyProfile->educations()?->delete();
            $deleted = true;
        }

        if ($user->parentProfile) {
            $user->parentProfile->nannyPreference()?->delete();
            $user->parentProfile->children()?->delete();
            $user->parentProfile->addresses()?->delete();
            $user->parentProfile->delete();
            $deleted = true;
        }

        if ($deleted) {
            return response()->json(['message' => 'Профіль успішно видалено']);
        }

        return response()->json(['error' => 'Профіль не знайдено'], 404);
    }
   
    public function getParentProfile()
    {
        $user = Auth::user();

        if (!$user || !$user->parentProfile) {
            return response()->json(['error' => 'Профіль батька не знайдено'], 404);
        }

       return response()->json([
            'profile' => tap($user->parentProfile->load(['children', 'addresses', 'reviewsFromNannies']), function ($profile) {
                $profile->photo = \Storage::disk('s3')->url($profile->photo ?? config('files.default_parent_photo'));
            }),
        ]);
        
    }

    public function storeAdditionalAddress(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->parentProfile) {
            return response()->json(['error' => 'Профіль батька не знайдено'], 404);
        }

        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'city' => 'required|string|max:100',
            'district' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'floor' => 'nullable|integer|min:0',
            'apartment' => 'nullable|string|max:10',
        ]);

        $address = $user->parentProfile->addresses()->create($validated);

        return response()->json([
            'message' => 'Адресу збережено',
            'address' => $address
        ]);
    }

    public function updateAddress(Request $request, $id)
    {
        $user = Auth::user();
        $address = $user->parentProfile->addresses()->where('id', $id)->first();

        if (!$address) {
            return response()->json(['error' => 'Адреса не знайдена'], 404);
        }

        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'city' => 'required|string|max:100',
            'district' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'floor' => 'nullable|integer|min:0',
            'apartment' => 'nullable|string|max:10',
        ]);

        $address->update($validated);

        return response()->json(['message' => 'Адреса оновлена', 'address' => $address]);
    }

    public function deleteAddress($id)
    {
        $user = Auth::user();

        if (!$user || !$user->parentProfile) {
            return response()->json(['error' => 'Профіль не знайдено'], 404);
        }

        $address = $user->parentProfile->addresses()->where('id', $id)->first();

        if (!$address) {
            return response()->json(['error' => 'Адреса не знайдена'], 404);
        }

        $address->delete();

        return response()->json(['message' => 'Адресу видалено успішно']);
    }

}
