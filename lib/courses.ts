export type QuestionBank = {
  id: string;
  name: string;
  description: string;
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
        description:
          "Curated multiple-choice questions covering web design and development fundamentals.",
        file: "practice_questions.json",
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
        id: "main",
        name: "Main Practice Set",
        description:
          "Propositions, arguments, and logical reasoning — practice and reinforce core ideas.",
        file: "propositions_arguments_reasoning.json",
      },
    ],
  },
];

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
