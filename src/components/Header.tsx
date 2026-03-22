import { cn } from "@/utils";
import type { ClassValue } from "clsx";
import Icon from "./Icon";
import { base } from "@/constants";

export default function Header({ className }: { className?: ClassValue }) {
  return (
    <header
      className={cn(
        "grid grid-cols-[min-content_1fr] lg:grid-cols-[260px_1fr] shadow-primary",
        className,
      )}
    >
      <span className="px-5 flex items-center text-[15px] leading-5.25 tracking-[3px] font-bold text-white bg-midnight-500">
        IMPEKABLE
      </span>

      <div className="flex items-center gap-7.5 px-5">
        <div className="flex relative items-center grow">
          <Icon
            icon="search"
            size={16}
            className="absolute left-2.5 text-midnight-300"
          />
          <input
            type="text"
            className="mr-auto ps-8 py-2 placeholder:text-[13px] placeholder:leading-5 placeholder:text-current grow"
            placeholder="Search transactions, invoices or help"
          />
        </div>

        <ul className="flex items-center gap-7.5 text-midnight-300">
          <li>
            <Icon icon="help" size={16} />
          </li>
          <li>
            <Icon icon="messages" size={16} />
          </li>
          <li>
            <span className="relative flex items-center justify-center text-[13px] leading-5 mr-1">
              <span className="absolute w-2 h-2 rounded-2xl bg-accent -top-0.5 -right-0.5 outline outline-white"></span>
              <Icon icon="notification" size={16} />
            </span>
          </li>
        </ul>

        <a href="#" className="flex items-center gap-2.5">
          <span className="text-[13px] leading-5 mr-1">John Doe</span>

          <Icon icon="chevron" size={16} />

          <img
            src="/Avatar.png"
            srcSet={`${base}/Avatar.png 1x, ${base}/Avatar@2x.png 2x`}
            alt="Опис фото"
            width={38}
            height={38}
            className="h-9.5 w-9.5 rounded-4xl object-cover"
          />
        </a>
      </div>
    </header>
  );
}
