import Template, { Content, Sidebar } from "@/templates/template";
import CalendarComponent from "@/components/calendar/Calendar";
import List from "@/components/calendar/List";

const Calendar = () => {
  return (
    <Template>
      <Content>
        <div className="m-8">
          <CalendarComponent />
        </div>
      </Content>
      <Sidebar>
        <h3 className="text-lg font-semibold mb-4 text-sidebar-title">
          Events
        </h3>
        <List />
      </Sidebar>
    </Template>
  );
};

export default Calendar;
