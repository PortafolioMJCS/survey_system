<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'department',
        'satisfaction_level',
        'comments'
    ];

    // protected $fillable = [
    //     'title',
    //     'description',
    //     'active'
    // ];

    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Una encuesta tiene muchas preguntas
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Una encuesta tiene muchas respuestas
     */
    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
