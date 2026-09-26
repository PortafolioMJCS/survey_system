<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SurveyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Ruta pública de Login
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/collaborators', [UserController::class, 'getCollaborators']);
    Route::post('/collaborators', [UserController::class, 'store']);
    Route::patch('/users/{id}/deactivate', [UserController::class, 'deactivate']);
    Route::get('/dashboard/stats', [SurveyController::class, 'getDashboardStats']);
    Route::get('/surveys/stats', [SurveyController::class, 'getStats']);
    
    Route::get('/surveys', [SurveyController::class, 'index']);
    Route::post('/surveys', [SurveyController::class, 'store']);

    // Rutas para encuestas y respuestas
    Route::get('/surveys/{id}/questions', [SurveyController::class, 'getSurveyWithQuestions']);
    Route::post('/surveys/{id}/answers', [SurveyController::class, 'storeAnswers']);
    
    // Aquí irán las rutas protegidas de encuestas y colaboradores
});
