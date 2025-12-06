import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import useCalendarStore from "@/stores/useCalendarStore";
import { useState, createRef, useEffect } from "react";
import type { CalendarEvent } from "@/pages/Calendar";

const List = ({ events }: { events: CalendarEvent[] }) => {
  const listRef = createRef<FullCalendar>();
  const { currentDate, isMultiDaySelected } = useCalendarStore();
  const [totalExpenseAmount, setTotalExpenseAmount] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (listRef.current) {
      const api = listRef.current.getApi();
      api.gotoDate(currentDate);
    }
  }, [listRef, currentDate]);

  useEffect(() => {
    // For all the events, get the ones with the date set to today
    const todayEvents = events.filter(
      (event) =>
        event.date.getFullYear() === currentDate.getFullYear() &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getDate() === currentDate.getDate(),
    );
    // Get events that have expenseAmount only
    const expenseEvents = todayEvents.filter((event) => event.expenseAmount);

    if (expenseEvents.length === 0) {
      setTotalExpenseAmount(null);
      return;
    }

    const totalExpense = expenseEvents.reduce(
      (acc, event) => acc + event.expenseAmount!,
      0,
    );
    setTotalExpenseAmount(totalExpense);
  }, [events, currentDate]);

  if (isMultiDaySelected) {
    return (
      <div>
        <h3>Multiple days selected.</h3>
      </div>
    );
  }

  return (
    <>
      <FullCalendar
        ref={listRef}
        plugins={[listPlugin]}
        initialView="listDay"
        headerToolbar={false}
        events={events}
      />
      {totalExpenseAmount !== null && (
        <h4 className="text-center mt-4">
          Total Expenses: $ {totalExpenseAmount}
        </h4>
      )}
    </>
  );
};

export default List;
