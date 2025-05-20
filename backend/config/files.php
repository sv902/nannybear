<?php

return [

    // Фото за замовчуванням (для няні)
    'default_nanny_photo' => env('DEFAULT_NANNY_PHOTO', 'photos/nannies/default-avatar.jpg'),
    'default_parent_photo' => env('DEFAULT_PARENT_PHOTO', 'photos/parents/default-avatar.jpg'),
    // Відео за замовчуванням (опціонально)
    'default_nanny_video' => env('DEFAULT_NANNY_VIDEO', null),
];
