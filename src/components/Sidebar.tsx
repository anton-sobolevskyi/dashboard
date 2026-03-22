import { navItems } from "@/routes";
import { cn } from "@/utils";
import type { ClassValue } from "clsx";
import { NavLink } from "react-router";
import Icon from "./Icon";

export default function Sidebar({ className }: { className?: ClassValue }) {
  return (
    <div className={cn("bg-midnight overflow-y-auto", className)}>
      <nav>
        <ul>
          {navItems.map(({ path, label, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  cn(
                    "min-h-13.75 relative flex items-center gap-3 text-[15px] leading-4.75 py-4.5 px-6 group hover:bg-midnight-500",
                    { "bg-midnight-500 text-purple active": isActive },
                    className,
                  )
                }
              >
                <span className="bg-purple invisible absolute left-0 inset-y-0 w-1.25 group-[.active]:visible"></span>
                <Icon
                  icon={icon}
                  className="text-midnight-300 group-[.active]:text-purple"
                  size={16}
                />
                <span className="hidden lg:inline text-white">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
