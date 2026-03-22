import {
  Calendar,
  momentLocalizer,
  Views,
  type SlotInfo,
  type View,
} from "react-big-calendar";
import withDragAndDrop, {
  type EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";

import "./EventCalendar.css";
import { useState } from "react";
import { useEventStore } from "@/store/eventStore";
import type { CalendarEvent } from "@/types";
import Popover from "./Popover";
import { usePopover } from "@/hooks/usePopover";
import { getEndOfDay, getStartOfDay } from "@/utils";

const localizer = momentLocalizer(moment);

const withDnD: typeof withDragAndDrop<CalendarEvent> =
  (withDragAndDrop as any).default ?? withDragAndDrop;
const DragAndDropCalendar = withDnD(Calendar);

export default function EventCalendar() {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState<Date>(new Date());
  const { events, moveEvent } = useEventStore();

  const popover = usePopover<CalendarEvent>({
    placement: "bottom",
  });

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (
      view !== "month" ||
      moment(slotInfo.start).isBefore(
        moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      )
    )
      return;

    const { clientX, clientY } = slotInfo.box ?? {};
    const elements = document.elementsFromPoint(clientX || 0, clientY || 0);
    const anchor = elements.find((el) => el.classList.contains("rbc-day-bg"));

    popover.open(anchor as HTMLElement, {
      start: slotInfo.start.toISOString(),
      end: slotInfo.end.toISOString(),
      title: "",
      color: "#3b86ff",
    });
  };

  const handleSelectEvent = (event: CalendarEvent, e: React.SyntheticEvent) => {
    const anchor = (e.target as HTMLElement).closest(
      ".rbc-event",
    ) as HTMLElement;
    popover.open(anchor ?? (e.target as HTMLElement), event);
  };

  const handleEventDrop = ({
    event,
    start,
    end,
    isAllDay,
  }: EventInteractionArgs<CalendarEvent>) => {
    popover.close();
    const startDate = new Date(start);
    if (startDate < new Date()) return;

    if (isAllDay) {
      moveEvent(
        event.id!,
        getStartOfDay(start).toISOString(),
        getEndOfDay(start).toISOString(),
      );
      return;
    }

    moveEvent(
      event.id!,
      start instanceof Date
        ? start.toISOString()
        : new Date(start).toISOString(),
      end instanceof Date ? end.toISOString() : new Date(end).toISOString(),
    );
  };

  const handleEventResize = ({
    event,
    start,
    end,
  }: EventInteractionArgs<CalendarEvent>) => {
    popover.close();
    const startDate = new Date(start);
    if (startDate < new Date()) return;

    moveEvent(
      event.id!,
      new Date(start).toISOString(),
      new Date(end).toISOString(),
    );
  };

  const safeEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <>
      <DragAndDropCalendar
        className="grow select-none"
        localizer={localizer}
        events={safeEvents}
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.color },
        })}
        view={view}
        date={date}
        step={60}
        timeslots={2}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        onNavigate={(newDate) => {
          popover.close();
          setDate(newDate);
        }}
        onView={(value) => {
          popover.close();
          setView(value);
        }}
        selectable
        onSelectEvent={handleSelectEvent}
        draggableAccessor={() => true}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onDragStart={() => popover.close()}
      />

      {popover.isOpen && <Popover popover={popover} />}
    </>
  );
}
