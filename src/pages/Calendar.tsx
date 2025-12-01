import Template, { Content, Sidebar } from "@/templates/template";
import CalendarComponent from "@/components/calendar/Calendar";

const Calendar = () => {
  return (
    <Template>
      <Content>
        <div className="m-8">
          <CalendarComponent />
        </div>
      </Content>
      <Sidebar></Sidebar>
    </Template>
  );
};

export default Calendar;
