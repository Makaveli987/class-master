import { cn } from "@/lib/utils";
import { EventContentArg } from "@fullcalendar/core";
import { ClassStatus } from "@prisma/client";
import { ClockIcon, DoorOpenIcon } from "lucide-react";

export default function EventContent(eventContent: EventContentArg) {
  const color = eventContent.event.extendedProps?.teacher?.color;

  return (
    <div
      style={{
        backgroundColor: color,
        border: "1px solid",
        // borderColor: "green",
      }}
      className={cn(
        `relative text-slate-50 flex flex-col p-1 pl-1.5 truncate rounded-sm h-full px-1 w-full overflow-auto leading-[0]`
      )}
    >
      <div className="flex w-96 text-xs ">
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

        <div className="flex items-center">
          <ClockIcon className="w-3 h-3 mr-1.5" strokeWidth={2} />
          <b className="font-normal">{eventContent.timeText}</b>
        </div>
      </div>

      <div className="flex w-full items-center gap-2">
        {eventContent.event.extendedProps.schoolClassStatus ===
          ClassStatus.SCHEDULED && (
          <div className="min-w-[90px]">
            <span className="bg-blue-600 rounded-sm text-xs px-1">
              {eventContent.event.extendedProps.schoolClassStatus.toLowerCase()}
            </span>
          </div>
        )}
        {eventContent.event.extendedProps.schoolClassStatus ===
          ClassStatus.CANCELED && (
          <div className="min-w-[90px]">
            <span className="bg-rose-600 rounded-sm text-xs px-1">
              {eventContent.event.extendedProps.schoolClassStatus.toLowerCase()}
            </span>
          </div>
        )}
        {eventContent.event.extendedProps.schoolClassStatus ===
          ClassStatus.HELD && (
          <div className="min-w-[90px]">
            <span className="bg-emerald-300 border border-green-600 rounded-sm text-xs px-1">
              {eventContent.event.extendedProps.schoolClassStatus.toLowerCase()}
            </span>
          </div>
        )}

        <div className="flex items-center text-xs ">
          <DoorOpenIcon className="w-3 h-3 mr-1.5" strokeWidth={2} />
          <span className="font-normal truncate">
            {eventContent.event.extendedProps.classroom?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
