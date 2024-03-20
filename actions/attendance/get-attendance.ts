import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { ClassStatus } from "@prisma/client";

export type StudentAttendance = {
  studentName: string;
  [key: string]: string | boolean;
};

export type AttendanceResponse = {
  studentsAttendance: StudentAttendance[];
  schoolClasses: string[];
};

export const getAttendance = async (enrollmentId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized.");
    }

    const currentEnrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    const schoolClasses = await db.schoolClass.findMany({
      where: {
        enrollmentId,
        schoolClassStatus: ClassStatus.HELD,
        archived: false,
      },
      select: {
        start: true,
      },
      orderBy: {
        start: "asc",
      },
    });

    const mappedClasses = schoolClasses.map((schoolClass) =>
      schoolClass.start.toISOString().slice(0, 10)
    );

    const students = await db.group.findUnique({
      where: { id: currentEnrollment?.groupId as string },
      select: {
        students: {
          select: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const studentIds = students?.students.map((student) => ({
      id: student.student.id,
      studentName: student.student.firstName + " " + student.student.lastName,
    }));

    const attendanceByStudents = [];

    for (const student of studentIds as any[]) {
      const attendanceRecords = await db.attendance.findMany({
        where: {
          studentId: student.id,
          enrollmentId,
          schoolClass: {
            schoolClassStatus: ClassStatus.HELD,
            archived: false,
          },
        },
        select: {
          attended: true,
          schoolClass: {
            select: {
              start: true,
            },
          },
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          schoolClass: {
            start: "asc",
          },
        },
      });

      const studentAttendance: StudentAttendance = {
        studentName:
          attendanceRecords[0]?.student?.firstName +
          " " +
          attendanceRecords[0]?.student?.lastName,
      };

      attendanceRecords.forEach((record) => {
        const formattedDate = record.schoolClass.start
          .toISOString()
          .slice(0, 10);
        studentAttendance[formattedDate] = record.attended;
      });

      attendanceByStudents.push(studentAttendance);
    }

    return {
      studentsAttendance: attendanceByStudents,
      schoolClasses: mappedClasses,
    } as AttendanceResponse;
  } catch (error) {
    console.error("[Attendance] Error fetching attendance");
    return null;
  }
};
