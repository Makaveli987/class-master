import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";
import { Course, Enrollment, Group, Student, User } from "@prisma/client";

export interface EnrollmentResponse extends Enrollment {
  teacher?: User;
  course?: Course;
  student?: Student;
  group?: Group;
}

export const getStudentsEnrollments = async () => {
  try {
    const currentUser = await getCurrentUser();
    const enrollments = await db.enrollment.findMany({
      where: { schoolId: currentUser?.schoolId, groupId: null },
      include: {
        teacher: true,
        course: true,
        student: true,
      },
    });
    return enrollments as EnrollmentResponse[];
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching student enrollments");
    return null;
  }
};

export const getGroupsEnrollments = async () => {
  try {
    const currentUser = await getCurrentUser();
    const enrollments = await db.enrollment.findMany({
      where: { schoolId: currentUser?.schoolId, studentId: null },
      include: {
        teacher: true,
        course: true,
        group: true,
      },
    });
    return enrollments as EnrollmentResponse[];
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching group enrollments");
    return null;
  }
};

export const getEnrollmentsByStudentId = async (studentId: string) => {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      include: {
        teacher: true,
        course: true,
      },
    });
    return enrollments as EnrollmentResponse[];
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching enrollments by student id");
    return null;
  }
};

export const getEnrollmentsByGroupId = async (groupId: string) => {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { groupId },
      include: {
        teacher: true,
        course: true,
      },
    });
    return enrollments as EnrollmentResponse[];
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching enrollments by group id");
    return null;
  }
};

export const getEnrollment = async (enrollmentId: string) => {
  try {
    const enrollments = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        teacher: true,
        course: true,
        student: true,
        group: true,
      },
    });
    return enrollments as EnrollmentResponse;
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching enrollments");
    return null;
  }
};
