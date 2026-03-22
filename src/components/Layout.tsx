import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="grid grid-cols-[64px_1fr] lg:grid-cols-[260px_1fr] grid-rows-[70px_1fr] h-dvh">
      <Header className="col-span-2" />
      <Sidebar />
      <main className="bg-gray-200 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
