export type QuizQuestion = {
  id: number;
  question: string;
  options: Record<string, string>;
  answerKey: string[];
};
