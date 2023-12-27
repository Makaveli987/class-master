import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";
import { NextResponse } from "next/server";

export const getStudents = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const students = await db.student.findMany({
      where: { schoolId: currentUser?.schoolId },
    });
    return students;
  } catch (error) {
    console.error("[STUDENTS] Error fetching students");
    return null;
  }
};
