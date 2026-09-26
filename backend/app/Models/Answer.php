<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = [
        'survey_id', 
        'question_id', 
        'user_id', 
        'answer_value', 
        'answered_at', 
        'ip_address'
    ];

    // Garantiza que textos simples o arrays de selección múltiple se casteen desde/hacia JSON
    protected $casts = [
        'answer_value' => 'array',
        'answered_at' => 'datetime',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
