"use client";
import ClassDialog from "@/components/dialogs/class-dialog/class-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownSelect,
  DropdownSelectOptions,
} from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import { useClassDialog } from "@/hooks/use-class-dialog";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./calendar.scss";

import { SchoolClassResponse } from "@/actions/get-classes";
import ClassDetailsDialog from "@/components/dialogs/class-details-dialog/class-details-dialog";
import LinearLoader from "@/components/ui/linear-loader";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import useFilteredClasses from "@/hooks/use-filter-classes";
import EventContent from "./event.content";
import { getCurrentWeekRange } from "@/lib/utils";

interface CalendarProps {
  classrooms: DropdownSelectOptions[];
  teachers: DropdownSelectOptions[];
}

interface DateChangeArgs {
  action?: "prev" | "next";
  startDate?: Date;
  endDate?: Date;
}

const ClassCalendar = ({ classrooms, teachers }: CalendarProps) => {
  const classDialog = useClassDialog();
  const classDetailsDialog = useClassDetailsDialog();

  const [activeViewIndex, setActiveViewIndex] = useState<number>(1);

  const {
    fetchClasses,
    filteredClasses,
    loading,
    updateDateRange,
    classroomId,
    updateClassroomId,
    teacherId,
    updateTeacherId,
  } = useFilteredClasses();

  const [weekendsVisible, setWeekendsVisible] = useState<boolean>(false);

  const [currentDate, setCurrentDate] = useState<string>("");

  const calendarRef = useRef(null);

  /**
   * Called when time/date is selected
   * Set event data and open modal
   * @param {DateSelectArg} selectInfo selected time and date
   */
  const handleDateSelect = (selectInfo: DateSelectArg): void => {
    console.log("selectedInfo", selectInfo);

    classDialog.open({
      startDate: selectInfo.start,
      refreshCalendar: refreshCalendar,
      classroom: classroomId && classroomId !== "all" ? classroomId : "",
    });
  };

  function refreshCalendar() {
    // @ts-ignore
    const calendarApi = calendarRef?.current.getApi();
    calendarApi.refetchEvents();
  }

  /**
   * Called when event is clicked
   * Extract event data that is needed for event modal
   * Open event modal
   * @param {EventClickArg} clickInfo event info
   */
  const handleEventClick = (clickInfo: EventClickArg): void => {
    console.log("clickInfo.event", clickInfo);

    // open class details dialog
    const classDetails = {
      ...clickInfo.event.extendedProps,
      id: clickInfo.event.id,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
    } as SchoolClassResponse;

    classDetailsDialog.open(classDetails, fetchClasses);
  };

  function handleDateChange(args: DateChangeArgs) {
    // @ts-ignore
    const calendarApi = calendarRef?.current.getApi();
    if (args.action === "prev") {
      calendarApi.prev();
    }

    if (args.action === "next") {
      calendarApi.next();
    }
    console.log("calendarApi?.currentData :>> ", calendarApi?.currentData);

    const date = calendarApi?.currentData?.viewTitle;
    const start = args.startDate
      ? args.startDate
      : calendarApi?.view.currentStart;
    const end = args.endDate ? args.endDate : calendarApi?.view.currentEnd;

    updateDateRange(start, end);
    setCurrentDate(date);
  }

  useEffect((): void => {
    // fetchClasses();
    // @ts-ignore0
    const calendarApi = calendarRef?.current.getApi();
    const date = calendarApi.currentData.viewTitle;
    setCurrentDate(date);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-5 xl:flex-row">
        <ClassDialog
          teachers={teachers?.slice(1) || []}
          classrooms={classrooms?.slice(1) || []}
        />

        <Card className="mt-1 flex-1">
          <CardHeader className="mb-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-60 flex flex-col gap-2">
                  <Label>Classroom</Label>
                  <DropdownSelect
                    disabled={loading}
                    placeholder="Select classroom"
                    options={classrooms}
                    value={classroomId || undefined}
                    onChange={(value) => {
                      updateClassroomId(value);
                    }}
                  />
                </div>
                <div className="w-full md:w-60  flex flex-col gap-2">
                  <Label>Teacher</Label>
                  <DropdownSelect
                    disabled={loading}
                    placeholder="Select teacher"
                    options={teachers}
                    value={teacherId || undefined}
                    onChange={(value) => {
                      updateTeacherId(value);
                    }}
                  />
                </div>
              </div>

              <Button
                disabled={loading}
                onClick={() => {
                  const params = {
                    refreshCalendar: refreshCalendar,
                    classroom:
                      classroomId && classroomId !== "all" ? classroomId : "",
                  };
                  classDialog.open(params);
                }}
              >
                <div className="flex items-center">
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  <span>Add Class</span>
                </div>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col gap-3 md:flex-row items-center justify-between mb-4">
              <div className="flex">
                <Button
                  disabled={loading}
                  size="sm"
                  onClick={() => handleDateChange({ action: "prev" })}
                  variant="outline"
                  className="rounded-r-none"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                  disabled={loading}
                  size="sm"
                  onClick={() => handleDateChange({ action: "next" })}
                  variant="outline"
                  className="rounded-l-none border-l-0"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  disabled={loading}
                  onClick={() => {
                    // @ts-ignore
                    const calendarApi = calendarRef?.current.getApi();
                    // @ts-ignore
                    // const date = calendarRef?.current?.currentData?.viewTitle;
                    // console.log("date :>> ", date);
                    // fix date not being shown
                    calendarApi.today();
                    const { currentDate, startOfWeekDate, endOfWeekDate } =
                      getCurrentWeekRange();

                    handleDateChange({
                      startDate: startOfWeekDate,
                      endDate: endOfWeekDate,
                    });
                  }}
                  variant="outline"
                  className="ml-4 text-sm"
                >
                  Today
                </Button>
              </div>

              <span className="text-xl font-semibold">{currentDate}</span>

              <div className="flex">
                <Button
                  disabled={loading}
                  size="sm"
                  className="rounded-r-none border-r-0 text-sm"
                  variant={activeViewIndex === 0 ? "default" : "outline"}
                  onClick={() => {
                    // @ts-ignore
                    const calendarApi = calendarRef?.current.getApi();
                    calendarApi.changeView("dayGridMonth");

                    handleDateChange({});
                    setActiveViewIndex(0);
                  }}
                >
                  Month
                </Button>

                <Button
                  disabled={loading}
                  size="sm"
                  className="rounded-none border-r-0 text-sm"
                  variant={activeViewIndex === 1 ? "default" : "outline"}
                  onClick={() => {
                    // @ts-ignore
                    const calendarApi = calendarRef?.current.getApi();
                    calendarApi.changeView("timeGridWeek");
                    handleDateChange({});
                    setActiveViewIndex(1);
                  }}
                >
                  Week
                </Button>

                <Button
                  disabled={loading}
                  size="sm"
                  className="rounded-l-none text-sm"
                  variant={activeViewIndex === 2 ? "default" : "outline"}
                  onClick={() => {
                    // @ts-ignore
                    const calendarApi = calendarRef?.current.getApi();
                    calendarApi.changeView("timeGridDay");
                    handleDateChange({});
                    setActiveViewIndex(2);
                  }}
                >
                  Day
                </Button>

                {/* <Button
                      size="sm"
                      className="rounded-l-none text-sm"
                      variant={activeViewIndex === 3 ? "default" : "outline"}
                      onClick={() => {
                        // @ts-ignore
                        const calendarApi = calendarRef?.current.getApi();
                        calendarApi.changeView("listWeek");
                        const date = calendarApi?.currentData?.viewTitle;
                        setCurrentDate(date);
                        getClasses();
                        setActiveViewIndex(3);
                      }}
                    >
                      List
        </Button> */}
              </div>
            </div>

            <div className="w-[280px] sm:w-full overflow-auto">
              <div className="h-1.5">
                {loading ? <LinearLoader /> : "not loading"}
              </div>

              <div className="min-w-[500px] flex flex-col relative">
                {loading && (
                  <div className=" absolute w-full h-full flex-1 bg-primary-foreground/70 z-50">
                    {/* <Loader /> */}
                  </div>
                )}
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
                  events={filteredClasses as any} // alternatively, use the `events` setting to fetch from a feed
                  select={handleDateSelect}
                  eventContent={EventContent} // custom render function
                  eventClick={handleEventClick}
                  eventClassNames={"shadow-none border-0 rounded-sm"}
                  nowIndicator
                  // dayCellContent={() => <span>1</span>}
                  // eventColor="#378006"
                  // eventBorderColor="#ff0000"
                  // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                  /* you can update a remote database when these fire:
                eventAdd={refreshCalendar}
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
