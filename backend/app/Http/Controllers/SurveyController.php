<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SurveyController extends Controller
{
    // GET /api/surveys - Obtener encuestas (filtradas por company_id opcionalmente)
    public function index(Request $request)
    {
        $companyId = $request->query('company_id', 1);

        $surveys = Survey::where('company_id', $companyId)
            ->latest()
            ->get();

        return response()->json($surveys, 200);
    }

    // POST /api/surveys - Guardar nueva encuesta
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'nullable|integer',
            'title' => 'required|string|min:4',
            'department' => 'required|string',
            'satisfaction_level' => 'required|integer|min:1|max:10',
            'comments' => 'nullable|string'
        ]);

        // Si no se envía company_id, asigna 1 por defecto
        $validated['company_id'] = $validated['company_id'] ?? 1;

        $survey = Survey::create($validated);

        return response()->json([
            'message' => 'Encuesta guardada con éxito',
            'data' => $survey
        ], 201);
    }

    public function getDashboardStats()
    {
        // Datos simulados (mock) estructurados listos para Chart.js
        $monthlyStats = [
            'labels' => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
            'datasets' => [
                [
                    'label' => 'Encuestas Completadas',
                    'data' => [12, 19, 15, 25, 22, 30, 45, 38, 52],
                    'backgroundColor' => 'rgba(37, 99, 235, 0.2)', // Azul primario suave
                    'borderColor' => '#2563eb', // Azul primario
                    'borderWidth' => 2,
                    'fill' => true,
                    'tension' => 0.4 // Curva suave para la línea
                ]
            ]
        ];

        return response()->json([
            'total_surveys' => 248,
            'total_collaborators' => 12,
            'chart_data' => $monthlyStats
        ]);
    }

    /**
     * Obtener una encuesta por ID con todas sus preguntas y tipos de pregunta ordenados
     */
    public function getSurveyWithQuestions($id)
    {
        $survey = Survey::with(['questions' => function ($query) {
            $query->orderBy('order_index', 'asc')->with('type');
        }])->find($id);

        if (!$survey) {
            return response()->json(['message' => 'Encuesta no encontrada.'], 404);
        }

        return response()->json($survey, 200);
    }

    /**
     * Guardar el conjunto de respuestas de un colaborador
     */
    public function storeAnswers(Request $request, $surveyId)
    {
        // Validar la estructura del payload que enviará Angular
        $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.answer_value' => 'required', // Puede ser String o Array
        ]);

        $user = $request->user(); // Usuario autenticado mediante Sanctum

        DB::beginTransaction();
        try {
            foreach ($request->answers as $item) {
                // Guardar cada respuesta vinculada a la encuesta, pregunta y colaborador
                Answer::create([
                    'survey_id' => $surveyId,
                    'question_id' => $item['question_id'],
                    'user_id' => $user->id,
                    'answer_value' => $item['answer_value'], // Eloquent lo convierte a JSON automáticamente gracias al $casts
                    'answered_at' => now(),
                    'ip_address' => $request->ip()
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Respuestas guardadas exitosamente.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al guardar las respuestas.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener el total de encuestas completadas por empresa y opcionalmente por colaborador.
     * GET /api/surveys/stats?company_id=1&user_id=5
     */
    public function getStats(Request $request)
    {
        $companyId = $request->query('company_id');
        $userId = $request->query('user_id');

        // Construir la consulta agrupando por envío (answered_at + ip_address)
        $query = Answer::query()
            ->join('surveys', 'answers.survey_id', '=', 'surveys.id');

        // Filtrar por empresa (si se proporciona)
        if ($companyId) {
            $query->where('surveys.company_id', $companyId);
        }

        // Filtrar por colaborador (si se proporciona)
        if ($userId) {
            $query->where('answers.user_id', $userId);
        }

        // Contar el número de envíos únicos
        $totalCompletedSurveys = $query->select(
            DB::raw('COUNT(DISTINCT CONCAT(answers.answered_at, "-", COALESCE(answers.ip_address, ""))) as total')
        )->value('total') ?? 0;

        return response()->json([
            'company_id' => $companyId ? (int)$companyId : null,
            'user_id' => $userId ? (int)$userId : null,
            'total_completed_surveys' => (int)$totalCompletedSurveys
        ], 200);
    }
}