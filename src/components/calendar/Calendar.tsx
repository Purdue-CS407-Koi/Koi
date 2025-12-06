import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useCalendarStore from "@/stores/useCalendarStore";
import type { CalendarEvent } from "@/pages/Calendar";

interface DateEvent {
  date: Date;
  dateStr: string;
}

interface SelectEvent {
  start: Date;
  end: Date;
}

const Calendar = ({ events }: { events: CalendarEvent[] }) => {
  const { setCurrentDate, setIsMultiDaySelected } = useCalendarStore();

  const dateClicked = (event: DateEvent) => {
    setCurrentDate(event.date);
    setIsMultiDaySelected(false);
  };

  const selected = (event: SelectEvent) => {
    // If selection is longer than one day
    if (event.end.getTime() - event.start.getTime() > 86400000) {
      setIsMultiDaySelected(true);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable={true}
      dateClick={dateClicked}
      select={selected}
      events={events}
    />
  );
};

export default Calendar;
