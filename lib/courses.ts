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
    id: "gst220",
    name: "Origins and Science",
    code: "GST 220",
    department: "General Studies",
    banks: [
      {
        id: "practice_bank",
        name: "Practice bank",
        file: "./question-bank/gst220/practice_bank.json",
        vendor: "quro",
        questionCount: 110,
      },
    ]
  },
  {
    id: "gst212",
    name: "Philosophy, Logic and Human Existence",
    code: "GST 212",
    department: "General Studies",
    banks: [
      {
        id: "bank13",
        name: "Midsemester",
        file: "./question-bank/gst212/bank13.json",
        vendor: "quro",
        questionCount: 80,
      },
    ],
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
        file: "./question-bank/gst200/french_main.json",
        vendor: "quro",
        questionCount: 100,
      },
      {
        id: "french_bank2",
        name: "Question Bank 2 for French",
        file: "./question-bank/gst200/french_bank2.json",
        vendor: "quro",
        questionCount: 100,
      },
    ]
  },
  {
    id: "mth202",
    name: "Elementary Differential Equations",
    code: "MTH 202",
    department: "Mathematics",
    banks: [
      {
        id: "25_26_midsemester",
        name: "25/26 Midsemester",
        file: "./question-bank/mth202/25_26_midsemester.json",
        vendor: "quro",
        questionCount: 15,
      },
      {
        id: "24_25_midsemester",
        name: "24/25 Midsemester",
        file: "./question-bank/mth202/24_25_midsemester.json",
        vendor: "quro",
        questionCount: 10,
      },
    ]
  },
  {
    id: "ift212",
    name: "Computer Architecture and Organisation",
    code: "IFT 212",
    department: "Computer Science",
    banks: [
      {
        id: "25_26_exam_a",
        name: "25/26 Final Exam A",
        file: "./question-bank/ift212/25_26_exam_a.json",
        vendor: "quro",
        questionCount: 30,
      },
      {
        id: "25_26_exam_b",
        name: "25/26 Final Exam B",
        file: "./question-bank/ift212/25_26_exam_b.json",
        vendor: "quro",
        questionCount: 40,
      }
    ]
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
