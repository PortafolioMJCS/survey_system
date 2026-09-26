<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // 👈 1. Importar Sanctum
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable; // 👈 2. Incluir HasApiTokens aquí
    

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'active',
        'company_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Carga automáticamente la propiedad al convertir el modelo a JSON
    protected $appends = ['completed_surveys_count'];

    /**
     * Accesor para obtener el total de encuestas completadas por el colaborador
     */
    public function getCompletedSurveysCountAttribute(): int
    {
        return Answer::where('user_id', $this->id)
            ->select(DB::raw('COUNT(DISTINCT CONCAT(answered_at, "-", COALESCE(ip_address, ""))) as total'))
            ->value('total') ?? 0;
    }
}
