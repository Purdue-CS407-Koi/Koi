import Template, { Content, Sidebar } from "@/templates/template";
import CalendarComponent from "@/components/calendar/Calendar";
import List from "@/components/calendar/List";
import { getAllRecurringExpenses } from "@/api/expenses";
import { useEffect, useState } from "react";
import type { Tables } from "@/helpers/supabase.types";
import { getBucketMetadata } from "@/api/buckets";
import { RecurrencePeriodType } from "@/interfaces/Bucket";
import useUserChallenges from "@/hooks/useUserChallenges";

export interface CalendarEvent {
  title: string;
  date: Date;
  allDay?: boolean;
}

const Calendar = () => {
  const [aggregatedEvents, setAggregatedEvents] = useState<CalendarEvent[]>([]);
  const [recurringExpenseData, setRecurringExpenseData] = useState<
    Tables<"RecurringExpenses">[]
  >([]);
  const { activeChallengeData } = useUserChallenges();

  // Fetch recurring expenses
  useEffect(() => {
    (async () => {
      const recurringExpenses = await getAllRecurringExpenses();
      setRecurringExpenseData(recurringExpenses);
    })();
  }, []);

  // Aggregate events
  useEffect(() => {
    (async () => {
      const events = [];

      // Map recurring expenses
      const mappedRecurringExpenses = await Promise.all(
        recurringExpenseData.map(async (recurringExpense) => {
          // Get recurrence period of associated bucket
          const bucket = await getBucketMetadata(
            recurringExpense.bucket_metadata_id ?? "",
          );
          const recurrencePeriod =
            bucket.recurrence_period_type as RecurrencePeriodType;

          const nextDate = new Date(recurringExpense.created_at);

          // Find next recurrence billing period
          while (nextDate.getTime() < new Date().getTime()) {
            switch (recurrencePeriod) {
              case RecurrencePeriodType.Monthly: {
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
              }
              case RecurrencePeriodType.Weekly: {
                nextDate.setDate(nextDate.getDate() + 7);
                break;
              }
              case RecurrencePeriodType.Daily: {
                nextDate.setDate(nextDate.getDate() + 1);
                break;
              }
              case RecurrencePeriodType.Yearly: {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
              }
              case RecurrencePeriodType.Quarterly: {
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
              }
              case RecurrencePeriodType.SemiAnually: {
                nextDate.setMonth(nextDate.getMonth() + 6);
                break;
              }
            }
          }

          return {
            title: `Next ${recurringExpense.name} payment`,
            date: nextDate,
            allDay: true,
          };
        }),
      );
      events.push(...mappedRecurringExpenses);

      // Add active challenge start/end dates
      if (activeChallengeData) {
        events.push(
          ...activeChallengeData.flatMap((challenge) => {
            const startEvent = [
              {
                title: `Challenge ${challenge.name} starts`,
                date: new Date(challenge.start),
                allDay: true,
              },
            ];

            if (!challenge.end) return startEvent;

            return [
              ...startEvent,
              {
                title: `Challenge ${challenge.name} ends`,
                date: new Date(challenge.end),
                allDay: true,
              },
            ];
          }),
        );
      }
      setAggregatedEvents(events);
    })();
  }, [recurringExpenseData, activeChallengeData]);

  return (
    <Template>
      <Content>
        <div className="m-8">
          <CalendarComponent events={aggregatedEvents} />
        </div>
      </Content>
      <Sidebar>
        <h3 className="text-lg font-semibold mb-4 text-sidebar-title">
          Events
        </h3>
        <List events={aggregatedEvents} />
      </Sidebar>
    </Template>
  );
};

export default Calendar;
