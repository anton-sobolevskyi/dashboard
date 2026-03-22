import type { UsePopoverReturn } from "@/hooks/usePopover";
import type { CalendarEvent } from "@/types";
import { useEventStore } from "@/store/eventStore";
import { FloatingArrow, FloatingPortal } from "@floating-ui/react";
import moment from "moment";
import { useState } from "react";
import { z } from "zod";
import Icon from "./Icon";

const today = moment().format("YYYY-MM-DD");
const now = moment().format("HH:mm");

const eventSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(30, "Title must be 30 characters or less"),
    date: z
      .string()
      .min(1, "Date is required")
      .refine((val) => val >= today, "Date cannot be in the past"),
    time: z.string().min(1, "Time is required"),
    color: z.string().min(1, "Color is required"),
  })
  .refine(
    (data) => {
      if (data.date === today) return data.time >= now;
      return true;
    },
    { message: "Time cannot be in the past", path: ["time"] },
  );

type EventFormData = z.infer<typeof eventSchema>;
type FormErrors = Partial<Record<keyof EventFormData, string>>;

type PopoverProps = {
  popover: UsePopoverReturn<CalendarEvent>;
};

export default function Popover({ popover }: PopoverProps) {
  const { close, getFloatingProps, arrowRef, context, popoverProps } = popover;
  const { addEvent, updateEvent, removeEvent } = useEventStore();

  const isEditing = !!popover.data?.id;

  const [formData, setFormData] = useState<EventFormData>({
    title: popover.data?.title ?? "",
    date: moment(popover.data?.start).format("YYYY-MM-DD"),
    time: moment(popover.data?.start).format("HH:mm"),
    color: popover.data?.color ?? "#000000",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = () => {
    const result = eventSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof EventFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const start = moment(
      `${formData.date} ${formData.time}`,
      "YYYY-MM-DD HH:mm",
    ).toDate();

    const end = moment(start).add(1, "hour").toDate();

    if (isEditing) {
      updateEvent(popover.data.id!, {
        title: formData.title,
        color: formData.color,
        start: start.toISOString(),
        end: end.toISOString(),
      });
    } else {
      addEvent({
        title: formData.title,
        color: formData.color,
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }

    close();
  };

  const handleDelete = () => {
    if (popover.data?.id) {
      removeEvent(popover.data.id);
      close();
    }
  };

  return (
    <FloatingPortal>
      <div
        className="bg-white w-[200px] border border-border-light rounded-sm shadow-primary p-4"
        {...popoverProps}
        {...getFloatingProps()}
      >
        <FloatingArrow
          ref={arrowRef}
          context={context}
          className="fill-border-light"
        />
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={close}
            className="translate-x-1/2 -translate-y-1/2 text-border"
          >
            <Icon icon="close" size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-gray-50 text-[13px] leading-5">Title:</span>
            <textarea
              className="border-b border-border-light text-sm resize-none p-1"
              rows={2}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            ></textarea>
            {errors.title && (
              <span className="text-red-400 text-[11px] mt-1">
                {errors.title}
              </span>
            )}
          </label>

          <label className="flex flex-col">
            <span className="text-gray-50 text-[13px] leading-5">Date:</span>
            <input
              type="date"
              min={today}
              className="border-b border-border-light text-sm p-1"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            {errors.date && (
              <span className="text-red-400 text-[11px] mt-1">
                {errors.date}
              </span>
            )}
          </label>

          <label className="flex flex-col">
            <span className="text-gray-50 text-[13px] leading-5">Time:</span>
            <input
              type="time"
              min={formData.date === today ? now : undefined}
              className="border-b border-border-light text-sm p-1"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
            {errors.time && (
              <span className="text-red-400 text-[11px] mt-1">
                {errors.time}
              </span>
            )}
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-50 text-[13px] leading-5">Color:</span>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
            />
            {errors.color && (
              <span className="text-red-400 text-[11px] mt-1">
                {errors.color}
              </span>
            )}
          </label>

          <div className="flex items-center justify-around mt-4">
            {isEditing ? (
              <button
                type="button"
                className="text-red-400 text-[12px] leading-5"
                onClick={handleDelete}
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                className="text-red-400 text-[12px] leading-5"
                onClick={close}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className="text-[#6A6996] text-[12px] leading-5"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
}
