<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


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
                'photo' => 'default-avatar.jpg',
            ]);
            return response()->json(['message' => 'Профіль батька створено']);
        }

        if ($user->role?->name === 'nanny' && !$user->nannyProfile) {
            $user->nannyProfile()->create([
                'photo' => 'default-avatar.jpg',
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

        if ($request->hasFile('photo')) {
            // Видаляємо старе фото, якщо є
            if ($user->parentProfile && $user->parentProfile->photo) {
                \Storage::disk('public')->delete($user->parentProfile->photo);
            }
        
            $firstName = $validated['first_name'] ?? 'parent';
            $lastName = $validated['last_name'] ?? '';
            $extension = $request->file('photo')->getClientOriginalExtension();
        
            $filename = Str::slug($firstName . '_' . $lastName . '_parent_avatar') . '.' . $extension;
        
            // Зберігаємо фото з постійним іменем (без uniqid)
            $validated['photo'] = $request->file('photo')->storeAs('photos/parents', $filename, 'public');
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
            'profile' => $profile->load(['children', 'addresses']),
        ]);
    }
    
     /**
     * Оновлення або збереження профілю няні
     */
    public function storeNannyProfile(Request $request)
    {
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
                'education.*.diploma_image' => 'nullable|file|image|max:5120',
            'languages' => 'sometimes|required|array',
            'additional_skills' => 'sometimes|required|array',
            'experience_years' => 'sometimes|required|numeric|min:0|max:50',
            'hourly_rate' => 'sometimes|required|numeric|min:0|max:500',
            'availability' => 'nullable|array',
            'video' => 'nullable|file|mimetypes:video/mp4,video/quicktime|max:20480', // до 20MB
            'gallery' => 'nullable|array',
            'gallery.*' => 'nullable|file|image|max:5120', // кожне фото до 5MB
            'goat' => 'nullable|string',
            'about_me' => 'nullable|string',
        ]);

        if (isset($validated['birth_date'])) {
            // Примусово встановлюємо час на полудень, щоб уникнути зміщення
            $validated['birth_date'] = \Carbon\Carbon::parse($validated['birth_date'])->setTime(12, 0, 0);
        }
        
        // Якщо є нове фото, зберігаємо його
        if ($request->hasFile('photo')) {
            // Видаляємо старе фото, якщо є
            if ($user->nannyProfile && $user->nannyProfile->photo) {
                \Storage::disk('public')->delete($user->nannyProfile->photo);
            }
        
            $firstName = $validated['first_name'] ?? 'nanny';
            $lastName = $validated['last_name'] ?? '';
        
            $extension = $request->file('photo')->getClientOriginalExtension();
            $filename = Str::slug($firstName . '_' . $lastName . '_nanny_avatar_' . uniqid()) . '.' . $extension;

            $validated['photo'] = $request->file('photo')->storeAs('photos/nannies', $filename, 'public');
            // Якщо не надіслано нове фото і в базі немає фото
            if (empty($validated['photo']) && (!$profile->photo ?? true)) {
                $validated['photo'] = 'default-avatar.jpg';
            }
        }

        // Створюємо або оновлюємо профіль
        if (!$user->nannyProfile) {
            $profile = $user->nannyProfile()->create($validated);
        } else {
            $profile = $user->nannyProfile;
            $profile->update($validated);
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
                $existing = $profile->educations()->where('institution', $eduData['institution'])->first();
        
                $diplomaPath = null;
        
                if ($request->hasFile("education.$index.diploma_image")) {
                    $file = $request->file("education.$index.diploma_image");
        
                    $firstName = $validated['first_name']
                        ?? ($profile->first_name ?? $user->first_name)
                        ?? 'nanny';

                    $lastName = $validated['last_name']
                        ?? ($profile->last_name ?? $user->last_name)
                        ?? '';

                    $filename = Str::slug($firstName . '_' . $lastName . '_' . $eduData['institution'] . '_diploma_' . uniqid()) . '.' . $file->getClientOriginalExtension();
        
                    $diplomaPath = $file->storeAs('diplomas', $filename, 'public');
                } else {
                    // Якщо файл не передано, а існуючий запис є — зберігаємо старий шлях
                    $diplomaPath = $existing?->diploma_image;
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
            }
        }

        // Оновлення відео
        if ($request->hasFile('video')) {
            if ($profile->video) {
                \Storage::disk('public')->delete($profile->video);
            }
        
            $firstName = $validated['first_name']
                ?? ($profile->first_name ?? $user->first_name)
                ?? 'nanny';
        
            $lastName = $validated['last_name']
                ?? ($profile->last_name ?? $user->last_name)
                ?? '';
        
            $filename = Str::slug($firstName . '_' . $lastName . '_video_' . uniqid()) . '.' . $request->file('video')->getClientOriginalExtension();

            $validated['video'] = $request->file('video')->storeAs('videos/nannies', $filename, 'public');
        }
       
       
       // Оновлення галереї фото
     $existingGalleryRaw = $request->input('existing_gallery', []);
$existingGallery = array_filter(is_array($existingGalleryRaw) ? $existingGalleryRaw : []);

$oldGallery = is_array($profile->gallery)
    ? $profile->gallery
    : json_decode($profile->gallery ?? '[]', true);

$oldGallery = array_filter($oldGallery); // видалити пусті значення

// Знаходимо фото, які потрібно видалити
$toDelete = array_diff($oldGallery, $existingGallery);
foreach ($toDelete as $path) {
    if (!empty($path)) {
        \Storage::disk('public')->delete($path);
    }
}

// Завантаження нових фото
$galleryPaths = $existingGallery;
if ($request->hasFile('gallery')) {
    foreach ($request->file('gallery') as $index => $image) {
        if ($image && $image->isValid()) {
            $firstName = $validated['first_name'] ?? ($profile->first_name ?? $user->first_name ?? 'nanny');
            $lastName = $validated['last_name'] ?? ($profile->last_name ?? $user->last_name ?? '');
            $filename = Str::slug($firstName . '_' . $lastName . '_gallery_' . $index . '_' . uniqid()) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('gallery/nannies', $filename, 'public');
            $galleryPaths[] = $path;
        }
    }
}

// Зберігаємо масив галереї
$validated['gallery'] = array_slice($galleryPaths, 0, 8);


        // Оновлення профілю в базі даних
        $profile->update($validated);
        $profile->save();

        return response()->json([
            'message' => 'Профіль няні оновлено',
            'profile' => $user->nannyProfile()->with('educations')->first()
        ]);
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
            'profile' => $user->parentProfile->load(['children', 'addresses', 'reviewsFromNannies']),
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
