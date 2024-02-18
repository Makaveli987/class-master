import { CalendarEvent } from "@/components/calendar-event";
import { EventContentArg } from "@fullcalendar/core";

export default function EventContent(eventContent: EventContentArg) {
  return (
    <CalendarEvent
      variant={eventContent.event.extendedProps?.teacher?.color}
      eventContent={eventContent}
    />
  );
}
