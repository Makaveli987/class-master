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
      where: {
        schoolId: currentUser?.schoolId,
        groupId: null,
        archived: false,
      },
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
      where: {
        schoolId: currentUser?.schoolId,
        studentId: null,
        archived: false,
      },
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
      where: { studentId, archived: false },
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
      where: { groupId, archived: false },
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
      where: { id: enrollmentId, archived: false },
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

export const getGroupEnrollmentsByStudentId = async (studentId: string) => {
  try {
    const groups = await db.studentToGroup.findMany({
      where: {
        studentId,
      },
      select: {
        groupId: true,
      },
    });

    const groupIds = groups.map((group) => group.groupId); // Replace with your actual group IDs

    const enrollmentsForGroups = await db.enrollment.findMany({
      where: {
        groupId: {
          in: groupIds,
        },
        archived: false,
      },
      include: {
        teacher: true,
        course: true,
        student: true,
        group: true,
      },
    });

    return enrollmentsForGroups as EnrollmentResponse[];
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching enrollments");
    return null;
  }
};
