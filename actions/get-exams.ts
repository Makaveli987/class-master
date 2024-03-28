import { db } from "@/lib/db";
import { Exam } from "@prisma/client";

export interface Exams extends Exam {
  enrollment?: {
    course: {
      id: string;
      name: string;
    };
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export type ExamResponse = {
  data: Exams[];
  error?: string;
};

export const getEnrollemntExams = async (
  enrollmentId: string
): Promise<ExamResponse> => {
  try {
    // const currentUser = await getCurrentUser();
    const exams: Exams[] = await db.exam.findMany({
      where: { enrollmentId },
      include: {
        enrollment: {
          select: {
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return { data: exams };
  } catch (error) {
    return { error: "Failed to fetch exams. Please try again.", data: [] };
  }
};

export const getStudentExams = async (
  studentId: string
): Promise<ExamResponse> => {
  try {
    const exams = await db.exam.findMany({
      where: { studentId },
      include: {
        enrollment: {
          select: {
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return { data: exams };
  } catch (error) {
    return { error: "Failed to fetch exams. Please try again.", data: [] };
  }
};
