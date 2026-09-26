<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'survey_id', 
        'question_type_id', 
        'title', 
        'options', 
        'is_required', 
        'order_index'
    ];

    // Convierte el campo JSON de MySQL a Array de PHP automáticamente
    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function type()
    {
        return $this->belongsTo(QuestionType::class, 'question_type_id', 'idtipo');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
