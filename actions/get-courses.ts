import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getCourses = async () => {
  try {
    const session = await getServerSession();

    const courses = await db.course.findMany({
      where: { schoolId: session?.user?.School.id },
    });
    return courses;
  } catch (error) {
    console.error("[COURSE] Error fetching courses");
    return null;
  }
};
