export type QuestionBank = {
  id: string;
  name: string;
  file: string;
  vendor: "ad-astra" | "quro";
  /** Baked in at build time; avoids parsing large JSON just for counts. */
  questionCount: number;
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
        questionCount: 424,
      },
      {
        id: "philosophy_2",
        name: "Chapter 2",
        file: "./question-bank/philosophy_2.json",
        vendor: "quro",
        questionCount: 82,
      },
      {
        id: "philosophy_3",
        name: "Chapter 3",
        file: "./question-bank/philosophy_3.json",
        vendor: "quro",
        questionCount: 606,
      },
      {
        id: "bank1",
        name: "Comprehensive Test on Propositions, Arguments, and Reasoning",
        file: "./question-bank/bank1.json",
        vendor: "ad-astra",
        questionCount: 84,
      },
      {
        id: "bank2",
        name: "QUESTIONS ON CATEGORICAL PROPOSITIONS",
        file: "./question-bank/bank2.json",
        vendor: "ad-astra",
        questionCount: 65,
      },
      {
        id: "bank3",
        name: "CHAPTER 3 - MAJOR BRANCHES OF PHILOSOPHY",
        file: "./question-bank/bank3.json",
        vendor: "ad-astra",
        questionCount: 26,
      },
      {
        id: "bank4",
        name: "CHAPTER 6 - LOGIC AND ITS RELEVANCE",
        file: "./question-bank/bank4.json",
        vendor: "ad-astra",
        questionCount: 49,
      },
      {
        id: "bank5",
        name: "THEROTICAL UNDERSTANDING OF CATEGORICAL PREPOSITION",
        file: "./question-bank/bank5.json",
        vendor: "ad-astra",
        questionCount: 25,
      },
      {
        id: "bank6",
        name: "Chapter 1",
        file: "./question-bank/bank6.json",
        vendor: "ad-astra",
        questionCount: 32,
      },
      {
        id: "bank7",
        name: "Chapter 2",
        file: "./question-bank/bank7.json",
        vendor: "ad-astra",
        questionCount: 12,
      },
      {
        id: "bank8",
        name: "Chapter 3",
        file: "./question-bank/bank8.json",
        vendor: "ad-astra",
        questionCount: 26,
      },
      {
        id: "bank9",
        name: "Chapter 4",
        file: "./question-bank/bank9.json",
        vendor: "ad-astra",
        questionCount: 15,
      },
      {
        id: "bank10",
        name: "Chapter 5",
        file: "./question-bank/bank10.json",
        vendor: "ad-astra",
        questionCount: 15,
      },
      {
        id: "bank11",
        name: "Chapter 6&7",
        file: "./question-bank/bank11.json",
        vendor: "ad-astra",
        questionCount: 59,
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
        questionCount: 100,
      },
    ]
  },
  {
    id: "gst200",
    name: "Communication in French",
    code: "GST 200",
    department: "General Studies",
    banks: [
      {
        id: "french_main",
        name: "Question Bank for French",
        file: "./question-bank/french_main.json",
        vendor: "quro",
        questionCount: 100,
      },
    ]
  },
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
        questionCount: 389,
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
