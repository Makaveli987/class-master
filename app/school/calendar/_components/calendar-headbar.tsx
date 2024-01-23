import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";

type CalendarHeadbarProps = {
  calendarRef: any;
  setCurrentDate: (date: string) => void;
  getClasses: () => void;
  currentDateRange: string;
};

const CalendarHeadbar = ({
  calendarRef,
  setCurrentDate,
  getClasses,
  currentDateRange,
}: CalendarHeadbarProps) => {
  const [activeViewIndex, setActiveViewIndex] = useState<number>(1);

  return (
    <div className="flex flex-col gap-3 md:flex-row items-center justify-between mb-4">
      <div className="flex">
        <Button
          size="sm"
          onClick={() => {
            // @ts-ignore
            const calendarApi = calendarRef?.current.getApi();
            calendarApi.prev();
            const date = calendarApi?.currentData?.viewTitle;
            setCurrentDate(date);
            getClasses();
          }}
          variant="outline"
          className="rounded-r-none"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            // @ts-ignore
            const calendarApi = calendarRef?.current.getApi();
            calendarApi.next();
            const date = calendarApi?.currentData?.viewTitle;
            setCurrentDate(date);
            getClasses();
          }}
          variant="outline"
          className="rounded-l-none border-l-0"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          onClick={() => {
            // @ts-ignore
            const calendarApi = calendarRef?.current.getApi();
            calendarApi.today();
            const date = calendarRef?.currentData?.viewTitle;
            // fix date not being shown
            setCurrentDate(date);
            getClasses();
          }}
          variant="outline"
          className="ml-4 text-sm"
        >
          Today
        </Button>
      </div>

      <span className="text-xl font-semibold">{currentDateRange}</span>

      <div className="flex">
        <Button
          size="sm"
          className="rounded-r-none border-r-0 text-sm"
          variant={activeViewIndex === 0 ? "default" : "outline"}
          onClick={() => {
            // @ts-ignore
            const calendarApi = calendarRef?.current.getApi();
            calendarApi.changeView("dayGridMonth");
            const date = calendarApi?.currentData?.viewTitle;
            setCurrentDate(date);
            getClasses();
            setActiveViewIndex(0);
          }}
        >
          Month
        </Button>

        <Button
          size="sm"
          className="rounded-none border-r-0 text-sm"
          variant={activeViewIndex === 1 ? "default" : "outline"}
          onClick={() => {
            // @ts-ignore
            const calendarApi = calendarRef?.current.getApi();
            calendarApi.changeView("timeGridWeek");
            const date = calendarApi?.currentData?.viewTitle;
            setCurrentDate(date);
            getClasses();
            setActiveViewIndex(1);
          }}
        >
          Week
        </Button>

        <Button
          size="sm"
          className="rounded-l-none text-sm"
          variant={activeViewIndex === 2 ? "default" : "outline"}
          onClick={() => {
            // @ts-ignore
            const calendarApi = calendarRef?.current.getApi();
            calendarApi.changeView("timeGridDay");
            const date = calendarApi?.currentData?.viewTitle;
            setCurrentDate(date);
            getClasses();
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
  );
};

export default CalendarHeadbar;
