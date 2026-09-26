import { Component, OnInit, ElementRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SurveyService } from '../../core/services/survey.service';
import { CollaboratorService } from '../../core/services/collaborator.service';
import { Collaborator } from '../../core/models/collaborator.model';
import { Survey } from '../../core/models/survey.model';
import { CollaboratorForm } from '../collaborator-form/collaborator-form';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';

// Registrar componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CollaboratorForm],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  @ViewChild('statsChart') statsChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Signals para manejar el estado de las encuestas y colaboradores
  surveys = signal<Survey[]>([]);
  collaborators = signal<Collaborator[]>([]); // 👈 Inicia lista vacía
  totalCompanySurveys = signal<number>(0);
  showForm: boolean = false;

  chart: Chart | null = null;
  isLoadingStats = signal<boolean>(true)  

  // Valores calculados automáticamente (computed)
  getTotalSurveys = computed(() => this.surveys().length);
  getTotalCollaborators = computed(() => this.collaborators().length);

  private authService = inject(AuthService);
  private surveyService = inject(SurveyService);
  private collaboratorService = inject(CollaboratorService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadSurveys();
    this.loadCollaborators();
    this.getStats();//total de encuestas realizadas
    this.loadStats();
  }

  loadSurveys() {
    this.surveyService.getSurveys(1).subscribe({
      next: (data) => {
        this.surveys.set(data);
      },
      error: (err) => {
        console.error('Error al obtener encuestas en Admin:', err);
      }
    });
  }

  getStats(){
    this.surveyService.getStats(1).subscribe({
      next: (stats) => {
        console.log('Total encuestas de la empresa:', stats.total_completed_surveys);
        this.totalCompanySurveys.set(stats.total_completed_surveys);
      }
    });
  }

  loadCollaborators() {
    this.collaboratorService.getCollaborators(1).subscribe({
      next: (data) => this.collaborators.set(data),
      error: (err) => console.error('Error colaboradores:', err),
    });
  }

  createCollaborator() {
  const name = prompt('Ingresa el nombre del colaborador:');
  if (!name) return;

  const email = prompt('Ingresa el correo electrónico:');
  if (!email) return;

  const password = prompt('Ingresa la contraseña inicial:');
  if (!password) return;

  const newCollaboratorData = {
    name,
    email,
    password,
    company_id: 1,
  };

  this.collaboratorService.createCollaborator(newCollaboratorData).subscribe({
    next: (res) => {
      // Insertamos el nuevo usuario retornado por Laravel al inicio de la lista
      this.collaborators.update((current) => [res.collaborator, ...current]);
    },
    error: (err) => {
      console.error('Error al crear colaborador:', err);
      alert(err.error?.message || 'Error al registrar el colaborador.');
    },
  });
}

  // createCollaborator() {
  //   const newId = this.collaborators().length + 1;
  //   const newCollab: Collaborator = {
  //     id: newId,
  //     name: `Colaborador Demo ${newId}`,
  //     email: `demo${newId}@test.com`,
  //     active: true,
  //     surveysCompleted: 0
  //   };

  //   // Actualizamos el Signal insertando al nuevo colaborador
  //   this.collaborators.update(current => [newCollab, ...current]);
  // }

  // deactivateCollaborator(id: number) {
  //   // Cambiamos el estado active a false en la lista de colaboradores
  //   this.collaborators.update(current =>
  //     current.map(collab =>
  //       collab.id === id ? { ...collab, active: false } : collab
  //     )
  //   );
  // }

  async deactivateCollaborator(id: number) {
    const result = await Swal.fire({
      title: '¿Desactivar colaborador?',
      text: 'El usuario perderá el acceso a la plataforma.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return; // Si el usuario cancela, detenemos la ejecución
    }
    this.collaboratorService.deactivateCollaborator(id).subscribe({
      next: () => {
        // Actualizamos la señal local marcando active: false para refrescar la UI sin recargar
        this.collaborators.update(current =>
          current.map(collab =>
            collab.id === id ? { ...collab, active: false } : collab
          )
        );
        Swal.fire('¡Desactivado!', 'El colaborador ha sido desactivado.', 'success');
      },
      error: (err) => {
        console.error('Error al desactivar colaborador:', err);
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onCollaboratorCreated(newCollab: Collaborator) {
    // 👈 Insertamos la nueva encuesta al inicio del Signal
    this.collaborators.update(current => [newCollab, ...current]);
    this.showForm = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadStats() {
    this.collaboratorService.getDashboardStats().subscribe({
      next: (response) => {
        this.isLoadingStats.set(false);
        // Renderizamos la gráfica con un pequeño timeout para asegurar que el canvas existe en el DOM
        setTimeout(() => this.renderChart(response.chart_data), 50);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.isLoadingStats.set(false);
      }
    });
  }

  renderChart(chartData: any) {
    if (!this.statsChartCanvas) return;

    // Destruir gráfica previa si existe para re-renderizado limpio
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.statsChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line', // Puedes cambiar a 'bar' si prefieres barras
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}