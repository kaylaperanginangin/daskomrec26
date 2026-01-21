<?php

use App\Http\Controllers\StageController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// All route definitions
Route::resource('user', UserController::class);
Route::resource('stage', StageController::class);
