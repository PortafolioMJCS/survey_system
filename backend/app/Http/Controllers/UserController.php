<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getCollaborators(Request $request)
    {
        // Obtener company_id del parámetro o usar 1 por defecto
        $companyId = $request->query('company_id', 1);

        $collaborators = User::where('company_id', $companyId)
            ->where('role', 'collaborator')
            ->select('id', 'name', 'email', 'active', 'created_at')
            ->get();

        return response()->json($collaborators);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email',
            'password'   => 'required|string|min:6',
            'company_id' => 'nullable|integer',
        ],
        [
            'email.unique' => 'El correo electrónico ya se encuentra registrado.'
        ]
        );

        $collaborator = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => 'collaborator', // Rol fijo para este endpoint
            'company_id' => $request->company_id ?? 1,
            'active'     => true,
        ]);

        return response()->json([
            'message'      => 'Colaborador creado exitosamente.',
            'collaborator' => $collaborator,
        ], 201);
    }

    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        
        // Cambiar el estado a inactivo (0 / false)
        $user->active = false;
        $user->save();

        // Opcional: Revocar todos los tokens activos del usuario desactivado para cerrar su sesión de inmediato
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Colaborador desactivado correctamente.',
            'user' => $user
        ]);
    }
}
