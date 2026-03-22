import {
  Barcode,
  Bell,
  CalendarDays,
  Camera,
  ChartNoAxesColumn,
  ChevronDown,
  CircleX,
  House,
  LifeBuoy,
  Mail,
  MessagesSquare,
  ReceiptText,
  Search,
  Settings,
  UserRound,
  type LucideProps,
} from "lucide-react";

const icons = {
  camera: Camera,
  house: House,
  dashboard: ChartNoAxesColumn,
  mail: Mail,
  barcode: Barcode,
  receipt: ReceiptText,
  user: UserRound,
  messages: MessagesSquare,
  calendar: CalendarDays,
  help: LifeBuoy,
  settings: Settings,
  notification: Bell,
  chevron: ChevronDown,
  search: Search,
  close: CircleX,
} as const;

export type IconName = keyof typeof icons;

export default function Icon({
  icon,
  ...rest
}: {
  icon: IconName;
} & LucideProps) {
  const Component = icons[icon];

  return <Component {...rest} />;
}
