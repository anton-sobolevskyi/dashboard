import EventCalendar from "@/components/EventCalendar";

export default function Calendar() {
  return (
    <div className="flex flex-col gap-8 py-8 px-18.75 h-full">
      <h1 className="text-[28px] leading-10">Calendar</h1>

      <EventCalendar />
    </div>
  );
}
