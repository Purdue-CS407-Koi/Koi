import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

const List = () => {
  return (
    <FullCalendar
      plugins={[listPlugin]}
      initialView="listDay"
      headerToolbar={false}
    />
  );
};

export default List;
