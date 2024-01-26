"use client";
import { createRef, LegacyRef, useEffect, useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.scss";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CalendarHeadbar from "./calendar-headbar";
import {
  DropdownSelect,
  DropdownSelectOptions,
} from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import { useClassDialog } from "@/hooks/use-class-dialog";
import ClassDialog from "@/components/dialogs/class-dialog/class-dialog";
import { useSession } from "next-auth/react";

import { Badge } from "@/components/ui/badge";
import ClassDetailsDialog from "@/components/dialogs/class-details-dialog/class-details-dialog";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import { RoleType } from "@/lib/models/role";

interface CalendarProps {
  classrooms: DropdownSelectOptions[];
  teachers: DropdownSelectOptions[];
}

const ClassCalendar = ({ classrooms, teachers }: CalendarProps) => {
  const classDialog = useClassDialog();
  const classDetailsDialog = useClassDetailsDialog();

  const session = useSession();

  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  const [selectedTeacher, setSelectedTeacher] = useState<string>(
    session.data?.user.role === RoleType.TEACHER ? session.data?.user.id : ""
  );

  /** Selected event data */
  let [eventData, setEventData] = useState({});

  const [weekendsVisible, setWeekendsVisible] = useState<boolean>(false);

  const [currentDate, setCurrentDate] = useState<string>("");

  /** Added events (classes) */
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([
    {
      start: "2024-01-22T11:00:00+01:00",
      end: "2024-01-22T12:00:00+01:00",
      overlap: true,
      rendering: "background",
      color: "#257e4a",
    },
    {
      start: "2024-01-22T11:00:00+01:00",
      end: "2024-01-22T12:00:00+01:00",
      overlap: true,
      rendering: "background",
      color: "#257e4a",
    },
    {
      start: "2024-01-22T11:00:00+01:00",
      end: "2024-01-22T12:00:00+01:00",
      overlap: true,
      rendering: "background",
      color: "#257e4a",
    },
    {
      start: "2024-01-22T12:15:00+01:00",
      end: "2024-01-22T13:00:00+01:00",
      overlap: true,
      rendering: "background",
      color: "#257e4a",
    },
    {
      start: "2024-01-22T12:15:00+01:00",
      end: "2024-01-22T13:00:00+01:00",
      overlap: true,
      rendering: "background",
      // color: "#257e4a",
    },
    {
      start: "2024-01-22T11:30:00+01:00",
      end: "2024-01-22T12:30:00+01:00",
      overlap: true,
      rendering: "background",
      color: "#0d9488",
    },
    {
      start: "2024-01-22T11:30:00+01:00",
      end: "2024-01-22T12:30:00+01:00",
      overlap: true,
      rendering: "background",
      color: "#0d9488",
    },
    {
      start: "2024-01-22T11:30:00+01:00",
      end: "2024-01-22T12:30:00+01:00",
      overlap: true,
      rendering: "background",
      // color: "#0d9488",
    },
    {
      start: "2024-01-22T15:30:00+01:00",
      end: "2024-01-22T16:30:00+01:00",
      overlap: true,
      rendering: "background",
      // color: "#0d9488",
    },
  ]);

  const calendarRef = createRef() as LegacyRef<FullCalendar>;

  /**
   * Called when time/date is selected
   * Set event data and open modal
   * @param {DateSelectArg} selectInfo selected time and date
   */
  const handleDateSelect = (selectInfo: DateSelectArg): void => {
    console.log("selectedInfo", selectInfo);
    setEventData(selectInfo);

    classDialog.open({
      startDate: selectInfo.start,
      classroom:
        selectedClassroom && selectedClassroom !== "all"
          ? selectedClassroom
          : "",
    });
  };

  /**
   * Called when event is clicked
   * Extract event data that is needed for event modal
   * Open event modal
   * @param {EventClickArg} clickInfo event info
   */
  const handleEventClick = (clickInfo: EventClickArg): void => {
    const eventInfo = (({ id, title, startStr, endStr, extendedProps }) => ({
      id,
      title,
      startStr,
      endStr,
      extendedProps,
    }))(clickInfo.event);

    console.log("eventInfo :>> ", eventInfo);
    setEventData(eventInfo);
    // open class details dialog
    classDetailsDialog.open();
    // classDialog.open();
  };

  /** Get classes */
  const getClasses = async () => {
    // @ts-ignore
    const calendarApi = calendarRef?.current.getApi();
    const startTimestamp = new Date(calendarApi.view.currentStart).getTime();
    const endTimestamp = new Date(calendarApi.view.currentEnd).getTime();

    // setCurrentEvents(events);
  };

  /**
   * Event content that will be displayed in Calendar
   * @param {EventContentArg} eventContent
   * @returns {JSX.Element}
   */
  const renderEventContent = (eventContent: EventContentArg): JSX.Element => {
    return (
      <div className="flex flex-col gap-0 p-1 truncate overflow-hidden">
        <div className="flex text-xs">
          <b>Konstantin Vidic</b>
          <span className="mx-1"> |</span>
          <b>{eventContent.timeText}</b>
        </div>

        <div>
          <span className="bg-rose-600 rounded-sm text-xs px-1 font-medium">
            Canceled
          </span>
        </div>
      </div>
    );
  };

  useEffect((): void => {
    getClasses();
    // @ts-ignore0
    const calendarApi = calendarRef?.current.getApi();
    const date = calendarApi.currentData.viewTitle;
    setCurrentDate(date);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-5 xl:flex-row">
        <ClassDialog
          teachers={teachers.slice(1)}
          classrooms={classrooms.slice(1)}
        />

        <ClassDetailsDialog />

        <Card className="mt-1 flex-1">
          <CardHeader className="mb-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-60 flex flex-col gap-2">
                  <Label>Classroom</Label>
                  <DropdownSelect
                    placeholder="Select classroom"
                    options={classrooms}
                    value={selectedClassroom}
                    onChange={(value) => {
                      setSelectedClassroom(value);
                    }}
                  />
                </div>
                <div className="w-full md:w-60  flex flex-col gap-2">
                  <Label>Teacher</Label>
                  <DropdownSelect
                    placeholder="Select teacher"
                    options={teachers}
                    value={selectedTeacher}
                    onChange={(value) => {
                      setSelectedTeacher(value);
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  const params = {
                    classroom:
                      selectedClassroom && selectedClassroom !== "all"
                        ? selectedClassroom
                        : "",
                  };
                  classDialog.open(params);
                }}
              >
                <div className="flex items-center gap-1.5">
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  <span>Add Class</span>
                </div>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarHeadbar
              calendarRef={calendarRef}
              setCurrentDate={setCurrentDate}
              getClasses={getClasses}
              currentDateRange={currentDate}
            />
            <div className="w-[280px] sm:w-full overflow-auto">
              <div className="min-w-[500px]">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                  ]}
                  headerToolbar={false}
                  buttonText={{
                    today: "Today",
                    week: "Week",
                    month: "Month",
                    day: "Day",
                  }}
                  allDaySlot={false}
                  contentHeight={10}
                  initialView={"timeGridWeek"}
                  // eventColor={"#0d9488"}
                  firstDay={1}
                  height={"auto"}
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  editable={true}
                  slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  slotMinTime={"08:00:00"}
                  slotMaxTime={"22:00:00"}
                  slotDuration={"00:30:00"}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  // weekends={weekendsVisible}
                  events={currentEvents} // alternatively, use the `events` setting to fetch from a feed
                  select={handleDateSelect}
                  eventContent={renderEventContent} // custom render function
                  eventClick={handleEventClick}
                  // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                  /* you can update a remote database when these fire:
                eventAdd={function(){}}
                eventChange={function(){}}
                eventRemove={function(){}}
                */
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassCalendar;
