import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collaborator } from '../models/collaborator.model';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/collaborators';

  private collaborators: Collaborator[] = [
    {
      id: 1,
      name: 'Juan Perez',
      email: 'juan@test.com',
      active: true,
      surveysCompleted: 12
    },
    {
      id: 2,
      name: 'Ana Lopez',
      email: 'ana@test.com',
      active: true,
      surveysCompleted: 7
    }
  ];

  // TODO: reemplazar por API Laravel
  getAll(): Collaborator[] {
    return this.collaborators;
  }

  create(collaborator: Collaborator): void {

    collaborator.id = Date.now();

    this.collaborators.push(collaborator);

  }

  deactivate(id: number): void {

    const collaborator = this.collaborators.find(
      c => c.id === id
    );

    if (collaborator) {
      collaborator.active = false;
    }

  }

  getCollaborators(companyId: number = 1): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(`${this.apiUrl}?company_id=${companyId}`);
  }

  // Método para registrar colaborador en BD
  createCollaborator(data: { name: string; email: string; password?: string; company_id?: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Método real de desactivación
  deactivateCollaborator(id: number): Observable<any> {
    let baseUrl = this.apiUrl.replace('/collaborators', '');
    return this.http.patch(`${baseUrl}/users/${id}/deactivate`, {});
  }

  getDashboardStats(): Observable<any> {
    let baseUrl = this.apiUrl.replace('/collaborators', '');
    return this.http.get(`${baseUrl}/dashboard/stats`);
  }

}