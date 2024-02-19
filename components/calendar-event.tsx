import { cn, getTimeFromDate } from "@/lib/utils";
import { EventContentArg } from "@fullcalendar/core";
import { ClassStatus } from "@prisma/client";
import { VariantProps, cva } from "class-variance-authority";
import { addMinutes } from "date-fns";
import { CalendarCheck2Icon, CheckIcon, ClockIcon, XIcon } from "lucide-react";
import React from "react";

const calendarEventVariants = cva(
  "relative text-slate-50 flex flex-col p-1 pl-1.5 truncate rounded-sm h-full px-1 w-full overflow-auto border border-white dark:border-slate-400",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        red: "bg-red-200 text-red-900 dark:text-red-50 dark:bg-red-800",
        orange:
          "bg-orange-200 text-orange-900 dark:text-orange-50 dark:bg-orange-800",
        amber:
          "bg-amber-200 text-amber-900 dark:text-amber-50 dark:bg-amber-800",
        yellow:
          "bg-yellow-200 text-yellow-900 dark:text-yellow-50 dark:bg-yellow-800",
        lime: "bg-lime-200 text-lime-900 dark:text-lime-50 dark:bg-lime-800",
        green:
          "bg-green-200 text-green-900 dark:text-green-50 dark:bg-green-800",
        emerald:
          "bg-emerald-200 text-emerald-900 dark:text-emerald-50 dark:bg-emerald-800",
        teal: "bg-teal-200 text-teal-900 dark:text-teal-50 dark:bg-teal-800",
        cyan: "bg-cyan-200 text-cyan-900 dark:text-cyan-50 dark:bg-cyan-800",
        sky: "bg-sky-200 text-sky-900 dark:text-sky-50 dark:bg-sky-800",
        blue: "bg-blue-200 text-blue-900 dark:text-blue-50 dark:bg-blue-800",
        indigo:
          "bg-indigo-200 text-indigo-900 dark:text-indigo-50 dark:bg-indigo-800",
        violet:
          "bg-violet-200 text-violet-900 dark:text-violet-50 dark:bg-violet-800",
        purple:
          "bg-purple-200 text-purple-900 dark:text-purple-50 dark:bg-purple-800",
        fuchsia:
          "bg-fuchsia-200 text-fuchsia-900 dark:text-fuchsia-50 dark:bg-fuchsia-800",
        pink: "bg-pink-200 text-pink-900 dark:text-pink-50 dark:bg-pink-800",
        rose: "bg-rose-200 text-rose-900 dark:text-rose-50 dark:bg-rose-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CalendarEventProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof calendarEventVariants> {
  asChild?: boolean;
  eventContent: EventContentArg;
}

const CalendarEvent = React.forwardRef<HTMLButtonElement, CalendarEventProps>(
  ({ eventContent, className, variant, asChild = false, ...props }, ref) => {
    return (
      <div className={cn(calendarEventVariants({ variant, className }))}>
        <div className="flex text-xs">
          {eventContent.event.extendedProps.schoolClassStatus ===
            ClassStatus.SCHEDULED && (
            <div className="bg-blue-500 text-white rounded-md p-0.5 mr-2 flex items-center justify-center">
              <CalendarCheck2Icon className="w-3 h-3" />
            </div>
          )}
          {eventContent.event.extendedProps.schoolClassStatus ===
            ClassStatus.HELD && (
            <div className="bg-emerald-500 text-white rounded-md p-0.5 mr-2 flex items-center justify-center">
              <CheckIcon className="w-3 h-3" />
            </div>
          )}
          {eventContent.event.extendedProps.schoolClassStatus ===
            ClassStatus.CANCELED && (
            <div className="bg-red-500 text-white rounded-md p-0.5 mr-2 flex items-center justify-center">
              <XIcon className="w-3 h-3" />
            </div>
          )}
          {eventContent.event.extendedProps?.studentId ? (
            <b className="min-w-[90px] mr-2">
              {eventContent.event.extendedProps?.student?.firstName}{" "}
              {eventContent.event.extendedProps?.student?.lastName}
            </b>
          ) : (
            <b className="min-w-[90px] mr-2">
              {eventContent.event.extendedProps?.group?.name}
            </b>
          )}
        </div>
        <div className="flex items-center justify-start ml-0.5 min-w-min">
          <ClockIcon className="w-3 h-3 mr-2" strokeWidth={2} />
          {/* <b className="font-normal text-xs">{eventContent.timeText}</b> */}
          <span className="font-normal text-xs">
            {getTimeFromDate(eventContent.event.start!)} -{" "}
            {getTimeFromDate(addMinutes(eventContent.event.end!, 1))}
          </span>
        </div>
      </div>
    );
  }
);

CalendarEvent.displayName = "CalendarEvent";

export { CalendarEvent, calendarEventVariants };
