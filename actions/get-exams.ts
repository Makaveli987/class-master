import { db } from "@/lib/db";
// import getCurrentUser from "./get-current-user";

export const getExams = async (enrollmentId: string, studentId: string) => {
  try {
    // const currentUser = await getCurrentUser();
    const exams = await db.exam.findMany({
      where: { enrollmentId, studentId },
    });
    return exams;
  } catch (error) {
    console.error("[EXAMS] Error fetching exams");
    return null;
  }
};
