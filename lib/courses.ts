export type QuestionBank = {
  id: string;
  name: string;
  file: string;
  questionCount?: number;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  department: string;
  banks: QuestionBank[];
};

export const COURSES: Course[] = [
  {
    id: "cos209",
    name: "Innovations in Web Design and Development",
    code: "BU COS 209",
    department: "Computer Science",
    banks: [
      {
        id: "main",
        name: "Main Practice Set",
        file: "./question-bank/practice_questions.json",
      },
    ],
  },
  {
    id: "gst212",
    name: "Philosophy, Logic and Human Existence",
    code: "GST 212",
    department: "General Studies",
    banks: [
      {
        id: "bank1",
        name: "AD ASTRA'S Comprehensive Test on Propositions, Arguments, and Reasoning",
        file: "./question-bank/bank1.json",
      },
      {
        id: "bank2",
        name: "AD ASTRA'S QUESTIONS ON CATEGORICAL PROPOSITIONS",
        file: "./question-bank/bank2.json",
      },
      {
        id: "bank3",
        name: "MULTI CHOICE QUESTIONS ON CHAPTER 3- MAJOR BRANCHES OF PHILOSOPHY -",
        file: "./question-bank/bank3.json",
      },
      {
        id: "bank4",
        name: "MULTI CHOICE QUESTIONS ON CHAPTER 6- LOGIC AND ITS RELEVANCE",
        file: "./question-bank/bank4.json",
      },
      {
        id: "bank5",
        name: "THEROTICAL UNDERSTANDING OF CATEGORICAL PREPOSITION",
        file: "./question-bank/bank5.json",
      },
      {
        id: "bank6",
        name: "Philosophy chapter 1",
        file: "./question-bank/bank6.json",
      },
      {
        id: "bank7",
        name: "Philosophy chapter 2",
        file: "./question-bank/bank7.json",
      },
      {
        id: "bank8",
        name: "Philosophy chapter 3",
        file: "./question-bank/bank8.json",
      },
      {
        id: "bank9",
        name: "Philosophy chapter 4",
        file: "./question-bank/bank9.json",
      },
    ],
  },
];

export function courseBanksPath(courseId: string): string {
  return `/courses/${courseId}`;
}

export function quizSessionPath(courseId: string, bankId: string): string {
  return `/courses/${courseId}/${bankId}`;
}

export function getCourseById(courseId: string): Course | undefined {
  return COURSES.find((c) => c.id === courseId);
}

export function getCourseAndBank(
  courseId: string,
  bankId: string,
): { course: Course; bank: QuestionBank } | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  const bank = course.banks.find((b) => b.id === bankId);
  if (!bank) return undefined;
  return { course, bank };
}
