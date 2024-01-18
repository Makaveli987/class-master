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
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.scss";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CalendarHeadbar from "./calendar-headbar";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";

const Calendar = () => {
  let [modalOpen, setModalOpen] = useState<boolean>(false);

  /** Selected event data */
  let [eventData, setEventData] = useState({});

  const [weekendsVisible, setWeekendsVisible] = useState<boolean>(false);

  const [currentDate, setCurrentDate] = useState<string>("");

  /** Added events (classes) */
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([
    {
      start: "2024-01-18",
      end: "2024-01-19",
      overlap: true,
      rendering: "background",
      color: "#257e4a",
    },
    {
      start: "2024-01-19",
      end: "2024-01-21",
      overlap: true,
      rendering: "background",
      color: "#38bdf8",
    },
    {
      start: "2024-01-18",
      end: "2024-01-19",
      overlap: true,
      rendering: "background",
      color: "#257e4a",
    },
  ]);

  const calendarRef = createRef() as LegacyRef<FullCalendar>;

  /**
   * Called when time/date is selected
   * Set event data and open modal
   * @param {DateSelectArg} selectInfo selected time and date
   */
  const handleDateSelect = (selectInfo: DateSelectArg): void => {
    setEventData(selectInfo);
    setModalOpen(true);
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

    setEventData(eventInfo);
    setModalOpen(true);
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
      <div className="flex flex-col p-1">
        <b className="mr-2 text-xs">{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>

        {eventContent.event.extendedProps.canceled ? (
          <span className="mt-2 w-16 text-center bg-red-700 rounded-lg">
            canceled
          </span>
        ) : null}
      </div>
    );
  };

  useEffect((): void => {
    getClasses();
    // @ts-ignore
    const calendarApi = calendarRef?.current.getApi();
    const date = calendarApi.currentData.viewTitle;
    setCurrentDate(date);
  }, []);

  const options = [
    {
      value: "online",
      label: "Online",
    },
    {
      value: "online 2",
      label: "Yellow Classroom",
    },
    {
      value: "online 3",
      label: "Green Classroom",
    },
    {
      value: "online 4",
      label: "Red Classroom",
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="font-semibold mb-4 sm:mb-0 text-xl text-bluewood-700">
          Classes
        </h1>
      </div>

      <div className="flex flex-col gap-5 mt-5 xl:flex-row">
        <Card className="mt-1">
          <CardHeader className="mb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-60 flex flex-col gap-2">
                  <Label>Classroom</Label>
                  <DropdownSelect
                    options={options}
                    value={options[0].value}
                    onChange={() => {}}
                  />
                </div>
                <div className="w-full md:w-60  flex flex-col gap-2">
                  <Label>Teacher</Label>
                  <DropdownSelect
                    options={options}
                    value={options[0].value}
                    onChange={() => {}}
                  />
                </div>
              </div>

              <Button onClick={() => {}}>
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
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={false}
                  buttonText={{
                    today: "Today",
                    week: "Week",
                    month: "Month",
                    day: "Day",
                  }}
                  allDaySlot={false}
                  initialView={"timeGridWeek"}
                  eventColor={"#0d9488"}
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
                  slotDuration={"00:15:00"}
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

export default Calendar;
