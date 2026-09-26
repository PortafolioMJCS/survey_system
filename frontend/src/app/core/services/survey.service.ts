import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey, AnswerPayloadItem, SurveyStatsResponse } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/surveys';

  // Obtener encuestas filtradas por empresa (por defecto company_id = 1)
  getSurveys(companyId: number = 1): Observable<Survey[]> {
    const params = new HttpParams().set('company_id', companyId.toString());
    return this.http.get<Survey[]>(this.apiUrl, { params });
  }

  getStats(companyId: number = 1, userId?: number): Observable<SurveyStatsResponse> {
    let params = new HttpParams().set('company_id', companyId.toString());

    if (userId) {
      params = params.set('user_id', userId.toString());
    }

    return this.http.get<SurveyStatsResponse>(`${this.apiUrl}/stats`, { params });
  }

  // Guardar una nueva encuesta en Laravel
  createSurvey(surveyData: Survey): Observable<{ message: string; data: Survey }> {
    return this.http.post<{ message: string; data: Survey }>(this.apiUrl, surveyData);
  }

  getSurveyWithQuestions(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${this.apiUrl}/${id}/questions`);
  }

  submitAnswers(surveyId: number, answers: AnswerPayloadItem[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${surveyId}/answers`, { answers });
  }
}