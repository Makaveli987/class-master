import { Course, Enrollment, Student, User } from "@prisma/client";

export interface EnrollmentData extends Enrollment {
  teacher: User;
  course: Course;
  student: Student;
}
