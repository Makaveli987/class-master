import { getStudent } from "@/actions/get-students";
import { getCourses } from "@/actions/get-courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentCourses from "../_components/student-courses";
import StudentForm from "../_components/student-form";
import { getEnrollmentsByStudentId } from "@/actions/get-enrolments";
import { Button } from "@/components/ui/button";
import {
  BookAIcon,
  CalendarCheck2Icon,
  CalendarIcon,
  Edit2Icon,
  EditIcon,
  GraduationCap,
  MailIcon,
  PhoneCallIcon,
  PhoneIcon,
  PlusCircleIcon,
  User2Icon,
  UserIcon,
} from "lucide-react";
import EnrollDialog from "@/components/enrolled-courses/enroll-dialog";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { EnrollFormCourse } from "@/components/enrolled-courses/enroll-form";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { SelectScrollDownButton } from "@/components/ui/select";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await getStudent(params.studentId);
  const courses = (await getCourses()) as EnrollFormCourse[];
  const enrollments = await getEnrollmentsByStudentId(params.studentId);

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Students</h3>
      <Card>
        <CardContent className="mt-6">
          {/* <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <CardHeader className="pl-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This is how others will see student on the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 max-w-3xl">
                <StudentForm data={student} action={DialogAction.EDIT} />
              </CardContent>
            </TabsContent>

            <TabsContent value="courses">
              <CardHeader className="pl-2">
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  Courses that student has attended
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 max-w-4xl">
                <StudentCourses
                  enrollments={enrollments || []}
                  studentId={params.studentId}
                />

                <div className="flex justify-end">
                  <EnrollDialog
                    courses={courses || []}
                    userId={params.studentId}
                    userType={EnrollUserType.STUDENT}
                  >
                    <Button className="mt-12 ml-auto">
                      <PlusCircleIcon className="w-4 h-4 mr-2" />
                      Add Course
                    </Button>
                  </EnrollDialog>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="classes">
              <CardHeader className="pl-2">
                <CardTitle>Classes</CardTitle>
                <CardDescription>
                  Classes that student has attended
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <DataTable
                  columns={[]}
                  data={[]}
                  filterPlaceholder="Search classes..."
                />
              </CardContent>
            </TabsContent>
          </Tabs> */}

          <div className="flex gap-6">
            <div className=" w-16 h-16 rounded-full flex justify-center items-center bg-muted">
              <User2Icon />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold tracking-tight">
                {student?.firstName + " " + student?.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                Created: {formatDate(student?.createdAt, false)}
              </p>
            </div>
          </div>
          <Separator className="mt-6 mb-2" />

          {/* <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Details</h3>
            </div>
          </div> */}

          {/* <Card className="max-w-4xl"> */}
          <div className="max-w-4xl">
            <CardHeader>
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Basic Details</h3>
                {/* <CardTitle>Basic Details</CardTitle> */}
                <Button variant="outline">
                  <EditIcon className="w-4 h-4 mr-2" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-5 mt-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
                    <CalendarIcon />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">
                      Date of Birth
                    </span>
                    <span className="font-medium">12.01.2024.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
                    <UserIcon />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground text-xs">
                      Gender
                    </span>
                    <span className="font-medium">Male</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
                    <MailIcon />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground text-xs">Email</span>
                    <span className="font-medium">{student?.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
                    <PhoneIcon />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Phone</span>
                    <span className="font-medium">{student?.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
          {/* </Card> */}

          <Separator className="my-6" />
          {/* <Card className="max-w-4xl mt-8"> */}
          <div className="max-w-4xl">
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>
                Courses that student has attended
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentCourses
                enrollments={[enrollments?.[0], enrollments?.[0]] || []}
                // enrollments={enrollments || []}
                studentId={params.studentId}
              />

              <div className="flex justify-end">
                <EnrollDialog
                  courses={courses || []}
                  userId={params.studentId}
                  userType={EnrollUserType.STUDENT}
                >
                  <Button className="mt-12 ml-auto">
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </EnrollDialog>
              </div>
            </CardContent>
          </div>
          {/* </Card> */}
        </CardContent>
      </Card>
    </div>
  );
}
