import { getCourses } from "@/actions/get-courses";
import { getEnrollment } from "@/actions/get-enrolments";
import EnrollForm, {
  EnrollFormCourse,
} from "@/components/enrolled-courses/enroll-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { EnrollUserType } from "@/hooks/useEnrollDialog";
import { EnrollmentData } from "@/lib/models/enrollment-data";
import React from "react";

export default async function EnrollmentId({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const enrollment = (await getEnrollment(
    params.enrollmentId
  )) as EnrollmentData;

  const courses = (await getCourses()) as EnrollFormCourse[];

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Enrollment</h3>
      <div className="grid grid-cols-5 gap-6">
        <Card className="col-span-2">
          <CardHeader className="mb-3">
            <CardTitle>Enrollment</CardTitle>
            <CardDescription>
              This is how others will see this enrollment on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollForm
              userId={
                enrollment.groupId ? enrollment.groupId : enrollment.studentId
              }
              userType={
                enrollment.groupId
                  ? EnrollUserType.GROUP
                  : EnrollUserType.STUDENT
              }
              // @ts-ignore
              enrollData={enrollment}
              courses={courses || []}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="mb-3">
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Teacher notes for this course enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <p className="text-sm">There are no notes for this course.</p> */}

            <ScrollArea type="always" className="h-[400px] max-w-[630px] pr-8">
              <div className="space-y-2">
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer ">
                  <p className="text-sm text-muted-foreground font-medium">
                    12.01.2024
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Natasa Blagojevic</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quo repudiandae cumque sunt eligendi adipisci, minus
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent>
          <CardHeader className="mb-3">
            <CardTitle>Classes</CardTitle>
            <CardDescription>
              All classes for this course enrollment
            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
    </div>
  );
}
