import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CalendarEvent } from "@/types";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

interface EventStore {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<Omit<CalendarEvent, "id">>) => void;
  removeEvent: (id: string) => void;
  moveEvent: (id: string, start: string, end: string) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    immer((set) => ({
      events: [
        {
          id: uuidv4(),
          start: moment().set({ hour: 10, minute: 0, second: 0 }).toISOString(),
          end: moment().set({ hour: 17, minute: 0, second: 0 }).toISOString(),
          title: "Test Event",
        },
      ],

      addEvent: (event) =>
        set((state) => {
          state.events.push({ ...event, id: uuidv4() });
        }),

      updateEvent: (id, event) =>
        set((state) => {
          const found = state.events.find((e) => e.id === id);
          if (found) Object.assign(found, event);
        }),

      removeEvent: (id) =>
        set((state) => {
          state.events = state.events.filter((e) => e.id !== id);
        }),

      moveEvent: (id, start, end) =>
        set((state) => {
          const event = state.events.find((e) => e.id === id);
          if (!event) return;

          const startMoment = moment(start);
          const endMoment = moment(end);

          const isLessThanHour = endMoment.diff(startMoment, "minutes") < 60;

          event.start = startMoment.toISOString();
          event.end = isLessThanHour
            ? startMoment.clone().add(1, "hour").toISOString()
            : endMoment.toISOString();
        }),
    })),
    {
      name: "calendar-events",
    },
  ),
);
