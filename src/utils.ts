import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStartOfDay = (date: Date | string): Date =>
  moment(date).startOf("day").toDate();

export const getEndOfDay = (date: Date | string): Date =>
  moment(date).add(1, "day").startOf("day").toDate();
