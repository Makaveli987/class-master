import { getClassesByStudentId } from "@/actions/get-classes";
import { CourseResponse, getCourses } from "@/actions/get-courses";
import {
  getEnrollmentsByStudentId,
  getGroupEnrollmentsByStudentId,
} from "@/actions/get-enrolments";
import { getStudentExams } from "@/actions/get-exams";
import { getAllUserNotes } from "@/actions/get-notes";
import { getStudent, getStudentGroups } from "@/actions/get-students";
import SchoolClassesTable from "@/components/classes-table/classes-table";
import ExamsTable from "@/components/exams-table/exams-table";
import Notes from "@/components/notes/notes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import {
  BookAIcon,
  CalendarCheckIcon,
  FileIcon,
  FileImageIcon,
  MessageSquareTextIcon,
} from "lucide-react";
import StudentCourses from "../_components/student-courses";
import StudentDetails from "../_components/student-details-card";
import { StudentBreadcrumbs } from "../_components/student-breadcrumbs";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await getStudent(params.studentId);
  const courses = (await getCourses()) as CourseResponse[];
  const enrollments = await getEnrollmentsByStudentId(params.studentId);
  const groupEnrollments = await getGroupEnrollmentsByStudentId(
    params.studentId
  );
  const exams = await getStudentExams(params.studentId);
  const schoolClasses = await getClassesByStudentId(params.studentId);
  const studentGroups = await getStudentGroups(params.studentId);
  const notes = await getAllUserNotes(params.studentId, EnrollUserType.STUDENT);

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <StudentBreadcrumbs
        student={{ id: student?.id || "", name: student?.fullName || "" }}
      />
      <div className="w-full flex border rounded-md bg-card shadow-sm mt-6">
        {/* Side Info */}
        <StudentDetails
          student={student || undefined}
          studentGroups={studentGroups || undefined}
        />

        {/*  Main Content */}
        <div className="py-6 px-8 flex-1">
          <Tabs
            defaultValue="enrolledCourses"
            className="w-full overflow-auto flex flex-col"
          >
            <TabsList className="justify-start flex-1">
              <TabsTrigger className="min-w-28 px-4" value="enrolledCourses">
                <BookAIcon className="w-4 h-4 mr-1" />
                Enrolled Courses
              </TabsTrigger>
              <TabsTrigger className="min-w-28 px-4 " value="notes">
                <MessageSquareTextIcon className="w-4 h-4 mr-1" />
                Notes
              </TabsTrigger>
              <TabsTrigger className="min-w-28 px-4 " value="tests">
                <FileIcon className="w-4 h-4 mr-1" />
                Tests
              </TabsTrigger>
              <TabsTrigger className="min-w-28 px-4" value="classes">
                <CalendarCheckIcon className="w-4 h-4 mr-1" />
                Classes
              </TabsTrigger>
              <TabsTrigger className="min-w-28 px-4" value="reports">
                <FileImageIcon className="w-4 h-4 mr-1" />
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="enrolledCourses">
              <StudentCourses
                enrollments={enrollments || []}
                groupEnrollments={groupEnrollments || []}
                studentId={params.studentId}
                courses={courses || []}
                isStudentActive={student?.active}
              />
            </TabsContent>
            <TabsContent value="notes">
              <Notes
                userType={EnrollUserType.STUDENT}
                notes={notes || []}
                userId={params.studentId}
              />
            </TabsContent>
            <TabsContent value="tests">
              <ExamsTable
                exams={exams || []}
                enrollmentId={""}
                studentId={params.studentId}
              />
            </TabsContent>
            <TabsContent value="classes">
              <SchoolClassesTable schoolClasses={schoolClasses} />
            </TabsContent>
            <TabsContent value="reports">reports</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
