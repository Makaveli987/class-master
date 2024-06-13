import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useClassStatisticsDialog } from "@/hooks/use-class-statistics-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  MonthlyClassStatistics,
  getClassCountsByTeacherForMonth,
} from "@/actions/classes/get-monthly-class-statistic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export default function ClassStatisticsDialog() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const classStatisticsDialog = useClassStatisticsDialog();

  if (isDesktop) {
    return (
      <Dialog
        open={classStatisticsDialog.isOpen}
        onOpenChange={(open) => {
          classStatisticsDialog.setIsOpen(open);
        }}
      >
        <DialogContent className="max-w-[450px] p-0">
          <ProfileForm
            teacherId={classStatisticsDialog.data?.teacherId || ""}
            date={classStatisticsDialog.data?.date || ""}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={classStatisticsDialog.isOpen}
      onOpenChange={(open) => {
        classStatisticsDialog.setIsOpen(open);
      }}
    >
      <DrawerContent>
        <ProfileForm
          teacherId={classStatisticsDialog.data?.teacherId || ""}
          date={classStatisticsDialog.data?.date || ""}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface ClassStatisticsContentProps {
  teacherId: string;
  date: string;
}

function ProfileForm({ teacherId, date }: ClassStatisticsContentProps) {
  const classStatisticsDialog = useClassStatisticsDialog();

  const [classesData, setClassesData] = useState<MonthlyClassStatistics>(
    {} as MonthlyClassStatistics
  );
  const [isLoading, setIsLoading] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (classStatisticsDialog.isOpen) {
      setIsLoading(true);
      const [monthStr, yearStr] = date
        .split(/\s+/)
        .filter((part) => part.trim() !== "");

      const monthNumber = months.indexOf(monthStr);
      const yearNumber = parseInt(yearStr);

      getClassCountsByTeacherForMonth(teacherId, yearNumber, monthNumber)
        .then((result) => setClassesData(result.data))
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [teacherId, date, classStatisticsDialog.isOpen]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {classStatisticsDialog.data?.date}
          </CardTitle>
          <CardDescription>Monthly class statistics</CardDescription>
        </div>
      </CardHeader>
      {isLoading ? (
        <div className="h-[310px]">
          <Loader />
        </div>
      ) : (
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <ul className="grid">
              <li className="flex items-center justify-between rounded-md p-1.5 hover:bg-accent">
                <span className="text-muted-foreground">Individual</span>
                <span>{classesData?.individualClasses}</span>
              </li>
              <li className="flex items-center justify-between rounded-md p-1.5 hover:bg-accent">
                <span className="text-muted-foreground">Group</span>
                <span>{classesData?.groupClasses}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="font-semibold">Classes Per Course</div>
            <ul className="grid">
              {classesData?.perCourse &&
                Object.entries(classesData?.perCourse).map(([key, value]) => (
                  <li
                    key={key}
                    className="flex items-center justify-between rounded-md p-1.5 hover:bg-accent"
                  >
                    <span className="text-muted-foreground">{key}</span>
                    <span>{value as string}</span>
                  </li>
                ))}
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between font-semibold rounded-md p-1.5 hover:bg-accent">
            <span>Total</span>
            <span>{classesData.totalClasses}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
