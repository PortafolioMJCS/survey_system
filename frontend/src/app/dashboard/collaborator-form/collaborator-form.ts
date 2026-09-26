import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollaboratorService } from '../../core/services/collaborator.service';
import { Collaborator } from '../../core/models/collaborator.model';

@Component({
  selector: 'app-collaborator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collaborator-form.html',
  styleUrl: './collaborator-form.scss',
})
export class CollaboratorForm {

  @Output() collaboratorCreated = new EventEmitter<Collaborator>();
  @Output() formClosed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private collaboratorService = inject(CollaboratorService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Señal para controlar la visibilidad del password
  showPassword = signal<boolean>(false);

  collaboratorForm: FormGroup = this.fb.group({
    company_id: [1],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get name() { return this.collaboratorForm.get('name'); }
  get email() { return this.collaboratorForm.get('email'); }
  get password() { return this.collaboratorForm.get('password'); }

  togglePasswordVisibility() {
    this.showPassword.update(prev => !prev);
  }

  submitCollaborator() {
    if (this.collaboratorForm.invalid) {
      this.collaboratorForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formData = {
      name: this.collaboratorForm.value.name!,
      email: this.collaboratorForm.value.email!,
      password: this.collaboratorForm.value.password!,
      company_id: this.collaboratorForm.value.company_id || 1,
    };

    this.collaboratorService.createCollaborator(formData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        // Notificamos al dashboard pasándole el colaborador que retornó Laravel
        this.collaboratorCreated.emit(response.collaborator); 
        this.collaboratorForm.reset({ company_id: 1 });
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al guardar el colaborador en Laravel:', err);

        if (err.status === 422 && err.error?.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.errorMessage.set(err.error.errors[firstErrorKey][0]);
        } else {
          this.errorMessage.set(err.error?.message || 'Error al guardar el colaborador.');
        }
      }
    });
  }

  cancel() {
    this.formClosed.emit();
  }
}