"use client";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import {
  BasicInfoIcon,
  BasicInfoItem,
  BasicInfoLabel,
} from "@/components/user/basic-info-item";
import useCourseDialog from "@/hooks/use-course-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatPrice } from "@/lib/utils";
import { Course } from "@prisma/client";
import {
  BadgeEuroIcon,
  BookTextIcon,
  CoinsIcon,
  EditIcon,
  EuroIcon,
} from "lucide-react";

interface CourseDetailsProps {
  course?: Course;
  courseStats?: { totalEnrollments: number; activeEnrollments: number };
}

export default function CourseDetails({ course }: CourseDetailsProps) {
  const courseDialog = useCourseDialog();

  return (
    <div className="max-w-4xl pt-4 pb-6 px-6">
      <div className="flex gap-16 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">Description</h3>
          <p className="text-sm text-muted-foreground">
            {course?.description ? course.description : "-"}
          </p>
        </div>
        <Button
          onClick={() => {
            courseDialog.open({
              data: course,
              action: DialogAction.EDIT,
            });
          }}
          variant="outline"
        >
          <EditIcon className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-5 mt-8 w-full">
        <BasicInfoItem>
          <BasicInfoIcon>
            <EuroIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Default Price">
            {formatPrice(course?.defaultPrice as number)}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <BookTextIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Default Total Classes">
            {course?.defaultTotalClasses}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <BadgeEuroIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Default Group Price">
            {formatPrice(course?.defaultGroupPrice as number)}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <CoinsIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Default Price Per Student">
            {formatPrice(course?.defaultPricePerStudent as number)}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem className="mt-2">
          <BasicInfoLabel
            labelClassName="font-semibold text-base text-card-foreground"
            label="Status"
          >
            <StatusBadge className="mt-1" active={course?.active || false} />
          </BasicInfoLabel>
        </BasicInfoItem>
      </div>
    </div>
  );
}
