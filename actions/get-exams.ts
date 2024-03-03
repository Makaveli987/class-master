import { db } from "@/lib/db";
import { Exam } from "@prisma/client";

export interface ExamResponse extends Exam {
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

export const getEnrollemntExams = async (enrollmentId: string) => {
  try {
    // const currentUser = await getCurrentUser();
    const exams: ExamResponse[] = await db.exam.findMany({
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

    return exams;
  } catch (error) {
    console.error("[EXAMS] Error fetching exams");
    return null;
  }
};

export const getStudentExams = async (studentId: string) => {
  try {
    const exams: ExamResponse[] = await db.exam.findMany({
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

    return exams;
  } catch (error) {
    console.error("[EXAMS] Error fetching exams");
    return null;
  }
};
