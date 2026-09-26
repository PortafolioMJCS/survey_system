export interface Collaborator {
  id?: number;
  name: string;
  email: string;
  active: boolean;
  completed_surveys_count?: number;
  surveysCompleted?: number;
  createdAt?: string;
}