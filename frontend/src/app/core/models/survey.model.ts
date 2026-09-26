/*export interface Survey {
  id?: number;
  company_id?: number;
  title: string;
  department: string;
  satisfaction_level: number;
  comments?: string;
  created_at?: string;
  updated_at?: string;
}*/

export interface QuestionType {
  idtipo: number;
  strtipo: string;
}

export interface Question {
  id: number;
  survey_id: number;
  question_type_id: number;
  title: string;
  options: string[] | null;
  is_required: boolean;
  order_index: number;
  type?: QuestionType;
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface AnswerPayloadItem {
  question_id: number;
  answer_value: string | string[];
}

export interface SurveyStatsResponse {
  company_id: number | null;
  user_id: number | null;
  total_completed_surveys: number;
}