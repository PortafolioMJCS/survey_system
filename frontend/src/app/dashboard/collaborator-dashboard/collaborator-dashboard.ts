import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Collaborator } from '../../core/models/collaborator.model';

import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey.model';
import { QuestionFormComponent } from '../question-form/question-form';

@Component({
  selector: 'app-collaborator-dashboard',
  standalone: true,
  imports: [CommonModule, QuestionFormComponent],
  templateUrl: './collaborator-dashboard.html',
  styleUrl: './collaborator-dashboard.scss',
})
export class CollaboratorDashboard implements OnInit {

  collaborator: Collaborator = { name: 'Usuario Demo', email: 'demo@test.com', active: true };
  showForm: boolean = false;

  // 👈 Transformamos surveys en un Signal
  surveys = signal<Survey[]>([]);

  // 👈 totalSurveys se calcula automáticamente cuando surveys cambia
  totalSurveys = computed(() => this.surveys().length);

  totalCollabSurveys = signal<number>(0);

  private authService = inject(AuthService);
  private router = inject(Router);
  private surveyService = inject(SurveyService);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.collaborator.email = user.email;
    }
    this.loadSurveys();
    this.getStats(user?.id);
  }

  getStats(currentUserId?: number){
    if (!currentUserId) return;
    // const currentUserId = this.authService.currentUser().id; // ID del usuario autenticado

    this.surveyService.getStats(1, currentUserId).subscribe({
      next: (stats) => {
        console.log('Total encuestas realizadas por el colaborador:', stats.total_completed_surveys);
        this.totalCollabSurveys.set(stats.total_completed_surveys);
      }
    });
  }

  loadSurveys() {
    this.surveyService.getSurveys(1).subscribe({
      next: (data) => {
        // 👈 Actualizamos la señal
        this.surveys.set(data);
      },
      error: (err) => {
        console.error('Error al obtener encuestas:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSurveyCreated(newSurvey: Survey) {
    // 👈 Insertamos la nueva encuesta al inicio del Signal
    this.surveys.update(current => [newSurvey, ...current]);
    this.showForm = false;
  }

  getCompletedSurveys(): number {
    console.log(this.surveys().length);
    return this.surveys().length;
  }

  onQuestionCreated(newQuestion: any) {
    // Lógica tras guardar la pregunta
    this.surveys.update(current => [newQuestion, ...current]);
    this.toggleForm();
    // Refrescar listado de preguntas o SweetAlert
  }
}