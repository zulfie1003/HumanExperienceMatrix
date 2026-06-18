export type Perspective =
  | "history"
  | "psychology"
  | "philosophy"
  | "entrepreneurship"
  | "science"
  | "spirituality"
  | "all";

export interface BookRecommendation {
  title: string;
  author: string;
  relevance: string;
}

export interface HistoricalParallel {
  figure: string;
  era: string;
  situation: string;
  lesson: string;
}

export interface PerspectiveInsight {
  perspective: string;
  insight: string;
  keyThinkers: string[];
}

export interface AIResponse {
  situationSummary: string;
  underlyingPattern: string;
  historicalParallels: HistoricalParallel[];
  perspectiveInsights: PerspectiveInsight[];
  repeatingPatterns: string[];
  practicalLessons: string[];
  bookRecommendations: BookRecommendation[];
}

export interface ConversationWithParsedResponse {
  id: string;
  userId: string;
  userQuestion: string;
  selectedPerspectives: string[];
  aiResponse: AIResponse;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  question: string;
  perspectives: Perspective[];
}

export interface ChatResponse {
  conversationId: string;
  response: AIResponse;
}

export interface ApiError {
  error: string;
  details?: string;
}
