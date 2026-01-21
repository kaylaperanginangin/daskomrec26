<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('welcome');
});

Route::get('/login', function () {
    return inertia('User/login');
});

Route::get('/user/', function () {
    return inertia('User/home');
});

Route::get('/user/home', function () {
    return inertia('User/home');
});

Route::get('/user/profile', function () {
    return inertia('User/profile');
});

Route::get('/user/password', function () {
    return inertia('User/password');
});

Route::get('/user/assistans', function () {
    return inertia('User/assistans');
});

Route::get('/user/shift', function () {
    return inertia('User/shift');
});

Route::get('/user/cores', function () {
    return inertia('User/cores');
});