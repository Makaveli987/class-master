import { db } from "@/lib/db";
import { Enrollment, Exam } from "@prisma/client";
import { Pick } from "@prisma/client/runtime/library";
// import getCurrentUser from "./get-current-user";

export interface ExamResponse extends Exam {
  enrollment?: {
    course: {
      id: string;
      name: string;
    };
  };
}

export const getEnrollemntExams = async (
  enrollmentId: string,
  studentId: string
) => {
  try {
    // const currentUser = await getCurrentUser();
    const exams: ExamResponse[] = await db.exam.findMany({
      where: { enrollmentId, studentId },
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
