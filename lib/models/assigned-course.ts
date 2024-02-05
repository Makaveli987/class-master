import { Course, User } from "@prisma/client";

export interface AssignedCourse {
  id: string;
  course: Pick<Course, "id" | "name">;
  user: Pick<User, "id" | "firstName" | "lastName" | "email">;
}
