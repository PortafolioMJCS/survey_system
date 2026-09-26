import { Component, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../core/services/survey.service';
import { Survey, Question, AnswerPayloadItem } from '../../core/models/survey.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-form.html',
  styleUrl: './question-form.scss'
})
export class QuestionFormComponent implements OnInit {
  private surveyService = inject(SurveyService);

  // Evento para notificar al componente padre que debe cerrar el formulario
  @Output() formClosed = new EventEmitter<void>();

  survey = signal<Survey | null>(null);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);

  // Diccionario reactivo para guardar las respuestas: { [question_id]: valor }
  answers = signal<{ [key: number]: any }>({});

  ngOnInit() {
    this.loadSurvey(1); // Encuesta ID 1 por defecto
  }

  loadSurvey(id: number) {
    this.isLoading.set(true);
    this.surveyService.getSurveyWithQuestions(id).subscribe({
      next: (data) => {
        this.survey.set(data);
        this.initAnswers(data.questions);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la encuesta:', err);
        this.isLoading.set(false);
        Swal.fire('Error', 'No se pudo cargar la encuesta.', 'error').then(() => {
          // Avisa al padre que ocurrió un error para que oculte/cierre el formulario
          this.formClosed.emit();
        });
      }
    });
  }

  // Inicializa la estructura del mapa de respuestas
  private initAnswers(questions: Question[]) {
    const initialMap: { [key: number]: any } = {};
    questions.forEach((q) => {
      // Si es tipo 3 o 4 (múltiple), se inicializa como Array, de lo contrario String vacío
      initialMap[q.id] = [3, 4].includes(q.question_type_id) ? [] : '';
    });
    this.answers.set(initialMap);
  }

  // Manejador para opciones múltiples (Checkboxes)
  onCheckboxChange(questionId: number, option: string, isChecked: boolean) {
    const currentMap = { ...this.answers() };
    let currentList: string[] = Array.isArray(currentMap[questionId]) ? [...currentMap[questionId]] : [];

    if (isChecked) {
      if (!currentList.includes(option)) currentList.push(option);
    } else {
      currentList = currentList.filter((item) => item !== option);
    }

    currentMap[questionId] = currentList;
    this.answers.set(currentMap);
  }

  // Manejador para Select Múltiple (Tipo 4)
  onMultipleSelectChange(questionId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValues = Array.from(select.selectedOptions).map((option) => option.value);
    
    const currentMap = { ...this.answers() };
    currentMap[questionId] = selectedValues;
    this.answers.set(currentMap);
  }

  // Actualizar respuesta de texto o selección única
  updateSingleAnswer(questionId: number, value: any) {
    const currentMap = { ...this.answers() };
    currentMap[questionId] = value;
    this.answers.set(currentMap);
  }

  submitSurvey() {
    const currentSurvey = this.survey();
    if (!currentSurvey) return;

    // Formatear payload para Laravel
    const payload: AnswerPayloadItem[] = [];
    const answersMap = this.answers();

    for (const q of currentSurvey.questions) {
      const val = answersMap[q.id];

      // Validar si es obligatoria
      if (q.is_required && (!val || (Array.isArray(val) && val.length === 0))) {
        Swal.fire('Campo requerido', `Por favor responde la pregunta: "${q.title}"`, 'warning');
        return;
      }

      if (val !== null && val !== '' && !(Array.isArray(val) && val.length === 0)) {
        payload.push({
          question_id: q.id,
          answer_value: val
        });
      }
    }

    this.isSubmitting.set(true);
    this.surveyService.submitAnswers(currentSurvey.id, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        Swal.fire({
          title: '¡Respuestas enviadas!',
          text: 'Gracias por completar la encuesta.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          // En lugar de volver a cargar la encuesta, cerramos el formulario y notificamos al padre
          this.formClosed.emit(); 
          // Si necesitas actualizar el contador o métricas en el dashboard padre:
          // this.questionSubmitted.emit(response);
        });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error al guardar respuestas:', err);
        Swal.fire('Error', 'Ocurrió un problema al guardar las respuestas.', 'error');
      }
    });
  }
}