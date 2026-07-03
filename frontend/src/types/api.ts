export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface ApiMessage {
  success: boolean;
  message: string;
  data: unknown;
}

export interface FileRecord {
  id: number;
  filename: string;
  filepath: string;
  file_type: string;
  uploaded_at: string;
  user_id: number;
}

export type GenerationType = "summary" | "title" | "keywords" | "social";

export interface SummaryResult {
  summary: string;
}

export interface TitleResult {
  titles: string[];
}

export interface KeywordResult {
  keywords: string[];
}

export interface SocialResult {
  linkedin: string;
  instagram: string;
  twitter: string;
}

export type GenerationResult = SummaryResult | TitleResult | KeywordResult | SocialResult;

export interface GenerationResponse {
  id: number;
  prompt: string;
  result: string;
  generation_type: GenerationType;
  created_at: string;
  user_id: number;
}
