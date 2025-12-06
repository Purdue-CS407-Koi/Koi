import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import useCalendarStore from "@/stores/useCalendarStore";
import { createRef, useEffect } from "react";

const List = () => {
  const listRef = createRef<FullCalendar>();
  const { currentDate, isMultiDaySelected } = useCalendarStore();

  useEffect(() => {
    if (listRef.current) {
      const api = listRef.current.getApi();
      api.gotoDate(currentDate);
    }
  }, [listRef, currentDate]);

  if (isMultiDaySelected) {
    return (
      <div>
        <h3>Multiple days selected.</h3>
      </div>
    );
  }

  return (
    <FullCalendar
      ref={listRef}
      plugins={[listPlugin]}
      initialView="listDay"
      headerToolbar={false}
    />
  );
};

export default List;
