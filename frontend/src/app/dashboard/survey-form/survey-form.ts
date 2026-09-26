import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey.model';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})
export class SurveyForm {

  @Output() surveySubmitted = new EventEmitter<Survey>();
  @Output() formClosed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private surveyService = inject(SurveyService);

  isSubmitting = false;

  surveyForm: FormGroup = this.fb.group({
    company_id: [1],
    title: ['', [Validators.required, Validators.minLength(4)]],
    department: ['', [Validators.required]],
    satisfaction_level: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    comments: ['']
  });

  get title() { return this.surveyForm.get('title'); }
  get department() { return this.surveyForm.get('department'); }
  get satisfaction_level() { return this.surveyForm.get('satisfaction_level'); }

  submitSurvey() {
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.surveyService.createSurvey(this.surveyForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // response.data contiene directamente el objeto { id, company_id, title, ... }
        this.surveySubmitted.emit(response.data); 
        this.surveyForm.reset({ company_id: 1, satisfaction_level: 5 });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error al guardar la encuesta en Laravel:', err);
      }
    });
  }

  cancel() {
    this.formClosed.emit();
  }
}