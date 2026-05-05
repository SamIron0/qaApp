export type QuestionBank = {
  id: string;
  name: string;
  file: string;
  vendor: "ad-astra" | "quro";
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
        vendor: "quro",
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
        id: "bank12",
        name: "Chapter 1",
        file: "./question-bank/bank12.json",
        vendor: "quro",
      },
      {
        id: "bank1",
        name: "Comprehensive Test on Propositions, Arguments, and Reasoning",
        file: "./question-bank/bank1.json",
        vendor: "ad-astra",
      },
      {
        id: "bank2",
        name: "QUESTIONS ON CATEGORICAL PROPOSITIONS",
        file: "./question-bank/bank2.json",
        vendor: "ad-astra",
      },
      {
        id: "bank3",
        name: "CHAPTER 3 - MAJOR BRANCHES OF PHILOSOPHY",
        file: "./question-bank/bank3.json",
        vendor: "ad-astra",
      },
      {
        id: "bank4",
        name: "CHAPTER 6 - LOGIC AND ITS RELEVANCE",
        file: "./question-bank/bank4.json",
        vendor: "ad-astra",
      },
      {
        id: "bank5",
        name: "THEROTICAL UNDERSTANDING OF CATEGORICAL PREPOSITION",
        file: "./question-bank/bank5.json",
        vendor: "ad-astra",
      },
      {
        id: "bank6",
        name: "Chapter 1",
        file: "./question-bank/bank6.json",
        vendor: "ad-astra",
      },
      {
        id: "bank7",
        name: "Chapter 2",
        file: "./question-bank/bank7.json",
        vendor: "ad-astra",
      },
      {
        id: "bank8",
        name: "Chapter 3",
        file: "./question-bank/bank8.json",
        vendor: "ad-astra",
      },
      {
        id: "bank9",
        name: "Chapter 4",
        file: "./question-bank/bank9.json",
        vendor: "ad-astra",
      },
      {
        id: "bank10",
        name: "Chapter 5",
        file: "./question-bank/bank10.json",
        vendor: "ad-astra",
      },
      {
        id: "bank11",
        name: "Chapter 6&7",
        file: "./question-bank/bank11.json",
        vendor: "ad-astra",
      },
    ],
  },
  {
    id: "gst220",
    name: "Origins and Science",
    code: "GST 220",
    department: "General Studies",
    banks: [
      {
        id: "bank13",
        name: "Question Bank for Origins and Science",
        file: "./question-bank/bank13.json",
        vendor: "ad-astra",
      },
    ]
  }
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
