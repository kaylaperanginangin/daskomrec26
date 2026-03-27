<?php

use App\Http\Controllers\PuzzleController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\PlottinganController;
use App\Http\Controllers\CaasStageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\PasswordController;
use App\Http\Controllers\User\ShiftController as UserShiftController;
use App\Http\Controllers\User\AnnouncementController;
use App\Http\Controllers\User\CoresController;
use Illuminate\Support\Facades\Route;
use inertia\inertia;

Route::get('/', function () {
    return inertia('welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])->name('login');

    //route store login
    Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store']);
});

Route::middleware('auth')->group(function (){
    //route logout
    Route::post('/logout', [\App\Http\Controllers\Auth\LoginController::class, 'destroy']);

    // === USER ROUTES ===
    Route::middleware('user')->group(function () {
        Route::get('/User/home', function () {
            return inertia('User/home');
        });

        Route::get('/user/profile', [ProfileController::class, 'index'])->name('Profile.index');
        Route::post('/user/profile', [ProfileController::class, 'update'])->name('Profile.update');

        Route::get('/user/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/user/password', [PasswordController::class, 'update'])->name('password.update');

        Route::get('/user/assistants', function () {
            return inertia('User/assistants');
        });

        Route::get('/user/oaline', function () {
            return inertia('User/oaline');
        });

        Route::middleware('config.check:isi_jadwal_on')->group(function () {
            Route::get('/user/shift', [UserShiftController::class, 'index'])->name('user.shift.index');
            Route::post('/user/shift', [UserShiftController::class, 'store'])->name('user.shift.store');
        });

        Route::get('/user/announcement', [AnnouncementController::class, 'index'])->name('user.announcement')->middleware('config.check:pengumuman_on');

        Route::middleware('config.check:puzzles_on')->group(function () {
            Route::get('/user/cores', [CoresController::class, 'index'])->name('user.cores.index');
            Route::post('/user/cores/unlock/{puzzle}', [PuzzleController::class, 'unlock'])->name('user.puzzle.unlock');
        });
    });

    // === ADMIN ROUTES ===
    Route::middleware('admin')->group(function () {
        Route::resource('shifts', ShiftController::class)->except(['index']);
        Route::resource('users', UserController::class)->except(['index']);

        Route::get('/admin/home', [HomeController::class, 'index']);
        Route::put('/admin/home/current-stage', [HomeController::class, 'setCurrentStage']);
        Route::put('/admin/home/configuration/{stage}', [HomeController::class, 'updateConfiguration']);
        Route::put('/admin/home/messages/{stage}', [HomeController::class, 'updateStageMessages']);
        Route::put('/admin/puzzle/{puzzle}', [PuzzleController::class, 'update']);

        Route::get('/admin/shift', [ShiftController::class, 'index']);

        Route::get('/admin/plottingan', [PlottinganController::class, 'index']);
        Route::get('/admin/plottingan/export', [PlottinganController::class, 'export'])->name('plottingan.export');
        Route::get('/admin/plottingan/shift/{shiftId}', [PlottinganController::class, 'shiftUsers']);




        Route::get('/admin/caas', [UserController::class, 'index']);
        Route::post('/admin/caas', [UserController::class, 'store']);
        Route::get('/admin/caas/export', [UserController::class, 'export'])->name('caas.export');
        Route::post('/admin/caas/import', [UserController::class, 'import'])->name('caas.import');

        Route::put('/admin/caas/{caasstage}/stage', [CaasstageController::class, 'updateStage']);
            Route::put('/admin/caas/{caasstage}/status', [CaasstageController::class, 'updateStatus']);

        Route::get('/admin/configuration', [StageController::class, 'index']);
        Route::put('/admin/configuration/{stage}', [StageController::class, 'update']);
    });
});

Route::fallback(function () {
    return inertia::render('404_NotFound');
});
