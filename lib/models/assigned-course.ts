export interface AssignedCourse {
  id: string;
  course: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}
