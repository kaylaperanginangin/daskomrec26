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

Route::get('/user/assistants', function () {
    return inertia('User/assistants');
});

Route::get('/user/shift', function () {
    return inertia('User/shift');
});

Route::get('/user/announcement', function () {
    return inertia('User/announcement');
});

Route::get('/user/cores', function () {
    return inertia('User/cores');
});

Route::get('/admin/login', function () {
    return inertia('Admin/login');
});

Route::get('/admin/home', function () {
    return inertia('Admin/home');
});